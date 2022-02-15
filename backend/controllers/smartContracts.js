import algosdk from "algosdk";
import path from "path";

import { algodClient, __dirname, BACKEND_PORT } from "../server.js";
import { printAssetHolding } from "../helpers/ASAs.js";
import { waitForConfirmation } from "../helpers/misc.js";
import { readTeal } from "../helpers/smartContracts.js";
import decodeURIMnemonic from "../helpers/decodeMnemonic.js";
import axios from "axios";

const SECS_PER_BLOCK = process.env.REACT_APP_SECS_PER_BLOCK;

export const createVoteSmartContract = async (req, res) => {
	try {
		const creatorAccount = algosdk.mnemonicToSecretKey(
			decodeURIMnemonic(req.body.creatorMnemonic)
		);
		const sender = creatorAccount.addr;
		const assetId = req.body.assetId;
		const candidates = JSON.parse(req.body.candidates);

		// get node suggested parameters
		let params = await algodClient.getTransactionParams().do();
		// comment out the next two lines to use suggested fee
		params.fee = 1000;
		params.flatFee = true;

		// declare onComplete as NoOp
		const onComplete = algosdk.OnApplicationComplete.NoOpOC;

		const vote_opt_out = path.join(
			__dirname,
			"smart_contracts/p_vote_opt_out.teal"
		);
		const vote = path.join(__dirname, "smart_contracts/p_vote.teal");

		const vote_program = await readTeal(algodClient, vote);
		const opt_out_program = await readTeal(algodClient, vote_opt_out);

		// integer parameter
		const args = [];

		// date stuff
		const startVote = new Date(req.body.startVote);
		const endVote = new Date(req.body.endVote);

		const today = new Date();
		const startVoteUTC = Date.UTC(
			startVote.getUTCFullYear(),
			startVote.getUTCMonth(),
			startVote.getUTCDate(),
			startVote.getUTCHours(),
			startVote.getUTCMinutes(),
			startVote.getUTCSeconds(),
			startVote.getUTCMilliseconds()
		);
		const endVoteUTC = Date.UTC(
			endVote.getUTCFullYear(),
			endVote.getUTCMonth(),
			endVote.getUTCDate(),
			endVote.getUTCHours(),
			endVote.getUTCMinutes(),
			endVote.getUTCSeconds(),
			endVote.getUTCMilliseconds()
		);

		// We can also try omitting all this code and using startVoteUTC and endVoteUTC directly... then either using 'global LatestTimestamp' or passing in the timestamp at which registration was attempted
		const startVoteSecs = Math.round((startVoteUTC - today) / 1000);
		const endVoteSecs = Math.round((endVoteUTC - today) / 1000);

		const blockchainStatus = await algodClient.status().do();
		const blockRound = blockchainStatus["last-round"];
		const startVotingBlock = Math.ceil(
			blockRound + startVoteSecs / SECS_PER_BLOCK
		);
		const endVotingBlock = Math.ceil(
			blockRound + endVoteSecs / SECS_PER_BLOCK
		);

		args.push(algosdk.encodeUint64(startVotingBlock));
		args.push(algosdk.encodeUint64(endVotingBlock));
		args.push(algosdk.encodeUint64(assetId));
		candidates.map((candidate) => {
			args.push(new Uint8Array(Buffer.from(candidate)));
		});

		// const lsig = new algosdk.LogicSigAccount(vote_program, args);
		// console.log("lsig : " + lsig.address());

		// create unsigned transaction
		let txn = algosdk.makeApplicationCreateTxn(
			sender,
			params,
			onComplete,
			vote_program,
			opt_out_program,
			0, // local integers
			1, // local byteslices
			args.length, // global integers (startVotingBlock, endVotingBlock, assetId, candidates)
			1, // global byteslices (1 for creator address)
			args
		);
		let txId = txn.txID().toString();

		// Sign the transaction
		let signedTxn = txn.signTxn(creatorAccount.sk);
		console.log("Signed transaction with txID: %s", txId);

		// Submit the transaction
		await algodClient.sendRawTransaction(signedTxn).do();

		// Wait for confirmation
		await waitForConfirmation(algodClient, txId);

		// display results
		let transactionResponse = await algodClient
			.pendingTransactionInformation(txId)
			.do();

		// console.log("txn response", transactionResponse);
		let appId = transactionResponse["application-index"];
		console.log("Created new app-id: ", appId);

		return res.send({
			appId,
			startVotingBlock,
			endVotingBlock,
			confirmedRound: transactionResponse["confirmed-round"],
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send(err.message);
	}
};

export const optInVoteSmartContract = async (req, res) => {
	// get accounts from mnemonic
	const userAccount = algosdk.mnemonicToSecretKey(
		decodeURIMnemonic(req.body.userMnemonic)
	);
	const sender = userAccount.addr;
	const appId = req.body.appId;

	// get node suggested parameters
	let params = await algodClient.getTransactionParams().do();
	// comment out the next two lines to use suggested fee
	params.fee = 1000;
	params.flatFee = true;

	const args = [];
	args.push(new Uint8Array(Buffer.from("register")));

	// create unsigned transaction
	const txn = algosdk.makeApplicationOptInTxn(sender, params, appId, args);
	let txId = txn.txID().toString();

	// Sign the transaction
	let signedTxn = txn.signTxn(userAccount.sk);
	console.log("Signed transaction with txID: %s", txId);

	try {
		// Submit the transaction
		await algodClient.sendRawTransaction(signedTxn).do();

		// Wait for confirmation
		await waitForConfirmation(algodClient, txId);
	} catch (err) {
		console.log(err);
		return res.send(err);
	}

	// display results
	let transactionResponse = await algodClient
		.pendingTransactionInformation(txId)
		.do();
	console.log(
		"Opted-in to app-id:",
		transactionResponse["txn"]["txn"]["apid"]
	);

	return res.send({ transactionResponse, appId });
};

// voting via atomic transfer
export const submitVote = async (req, res) => {
	try {
		// get accounts from mnemonic
		const userAccount = algosdk.mnemonicToSecretKey(
			decodeURIMnemonic(req.body.userMnemonic)
		);
		const sender = userAccount.addr;
		const appId = req.body.appId;
		const candidate = req.body.candidate;

		const smartContractAttributes = await axios.get(
			`http://127.0.0.1:${BACKEND_PORT}/smartContract/readVoteSmartContractState`,
			{ params: { appId } }
		);

		const assetId = smartContractAttributes.data.AssetId;
		const recipient = smartContractAttributes.data.Creator; // recipient of vote token is the creator of the vote token

		const userBalance = await axios.get(
			`http://127.0.0.1:${BACKEND_PORT}/asa/checkAssetBalance`,
			{ params: { addr: sender, assetId } }
		); // token balance of the user
		const amount = userBalance.data.amount;

		// get node suggested parameters
		let params = await algodClient.getTransactionParams().do();
		// comment out the next two lines to use suggested fee
		params.fee = 1000;
		params.flatFee = true;

		const args = [];
		args.push(new Uint8Array(Buffer.from("vote")));
		args.push(new Uint8Array(Buffer.from(candidate)));

		// goal app call --app-id {APPID} --app-arg "str:vote" --app-arg "str:candidatea" --from {ACCOUNT}  --out=unsignedtransaction1.tx
		let txn1 = algosdk.makeApplicationNoOpTxnFromObject({
			from: sender,
			suggestedParams: params,
			appIndex: appId,
			appArgs: args,
			foreignAssets: [assetId],
		});

		//goal asset send --from={ACCOUNT} --to={CENTRAL_ACCOUNT} --creator {CENTRAL_ACCOUNT} --assetid {VOTE_TOKEN_ID} --fee=1000 --amount=1 --out=unsignedtransaction2.tx
		const revocationTarget = undefined;
		const closeRemainderTo = undefined;
		//Amount of the asset to transfer

		// signing and sending "txn" will send "amount" assets from "sender" to "recipient"
		let txn2 = algosdk.makeAssetTransferTxnWithSuggestedParams(
			sender,
			recipient,
			closeRemainderTo,
			revocationTarget,
			amount,
			undefined,
			assetId,
			params
		);

		// Combine transactions
		let txns = [txn1, txn2];

		// Group both transactions
		let txnGroup = algosdk.assignGroupID(txns);
		// console.log("txnGroup", txnGroup);

		let signedTxn1 = txn1.signTxn(userAccount.sk);
		let signedTxn2 = txn2.signTxn(userAccount.sk);

		// Combine the signed transactions
		const signed = [];
		signed.push(signedTxn1);
		signed.push(signedTxn2);

		let txn = await algodClient.sendRawTransaction(signed).do();
		console.log("Transaction : " + txn.txId);

		// Wait for transaction to be confirmed
		await waitForConfirmation(algodClient, txn.txId);

		const voterAssetHoldings = JSON.parse(
			await printAssetHolding(algodClient, sender, assetId)
		);
		const creatorAssetHoldings = JSON.parse(
			await printAssetHolding(algodClient, recipient, assetId)
		);

		return res.send({ voterAssetHoldings, creatorAssetHoldings });
	} catch (err) {
		console.log(err);
		return res.send(err);
	}
};

export const deleteVoteSmartContract = async (req, res) => {
	// define sender as creator
	const creatorAccount = algosdk.mnemonicToSecretKey(
		req.body.creatorMnemonic
	);
	const sender = creatorAccount.addr;
	const appId = req.body.appId;

	// get node suggested parameters
	let params = await algodClient.getTransactionParams().do();
	// comment out the next two lines to use suggested fee
	params.fee = 1000;
	params.flatFee = true;

	// create unsigned transaction
	let txn = algosdk.makeApplicationDeleteTxn(sender, params, appId);
	let txId = txn.txID().toString();

	// Sign the transaction
	let signedTxn = txn.signTxn(creatorAccount.sk);
	console.log("Signed transaction with txID: %s", txId);

	// Submit the transaction
	await algodClient.sendRawTransaction(signedTxn).do();

	// Wait for confirmation
	await waitForConfirmation(algodClient, txId);

	// display results
	let transactionResponse = await algodClient
		.pendingTransactionInformation(txId)
		.do();

	console.log("Deleted app-id: ", appId);
	return res.send(transactionResponse);
};

export const readVoteSmartContractState = async (req, res) => {
	try {
		const appId = req.query.appId;
		const application = await algodClient.getApplicationByID(appId).do();
		const globalState = application.params["global-state"];

		const decodedState = {};

		console.log("app", application);
		console.log("State", application.params["global-state"]);

		for (let i = 0; i < globalState.length; i++) {
			const state = globalState[i];
			// https://forum.algorand.org/t/how-i-can-convert-value-of-global-state-to-human-readable/3551/2
			decodedState[Buffer.from(state.key, "base64").toString()] =
				state.value.type === 1
					? application.params.creator // only the creator is a byteslice (type 1)
					: state.value.uint;
		}

		return res.send(decodedState);
	} catch (err) {
		return res.status(404).send(err);
	}
};

export const didUserVote = async (req, res) => {
	// read local state of application from user account
	const userAddr = req.query.userAddr;
	const appId = req.query.appId;

	let accountInfoResponse = await algodClient
		.accountInformation(userAddr)
		.do();

	for (let i = 0; i < accountInfoResponse["apps-local-state"].length; i++) {
		if (accountInfoResponse["apps-local-state"][i].id == appId) {
			if (accountInfoResponse["apps-local-state"][i][`key-value`]) {
				const decodedLocalState = {};
				const key =
					accountInfoResponse["apps-local-state"][i][`key-value`][0]
						.key;
				const value =
					accountInfoResponse["apps-local-state"][i][`key-value`][0]
						.value.bytes;

				decodedLocalState[Buffer.from(key, "base64").toString()] =
					Buffer.from(value, "base64").toString();

				return res.send({ ...decodedLocalState, status: true });
			} else {
				return res.send({
					voted: "Registered but did not vote",
					status: false,
				});
			}
		}
	}

	return res.send({
		voted: "Did not participate in application",
		status: false,
	});
};

// export const createRegisterSmartContract = async (req, res) => {
// 	try {
// 		// const appId = req.body.appId;
// 		const participantAddresses = JSON.parse(req.body.participants);
// 		const creatorAccount = algosdk.mnemonicToSecretKey(
// 			// decodeURIMnemonic(req.body.creatorMnemonic)
// 			req.body.creatorMnemonic
// 		);

// 		console.log("SWEATY");

// 		// get node suggested parameters
// 		let params = await algodClient.getTransactionParams().do();
// 		// comment out the next two lines to use suggested fee
// 		params.fee = 1000;
// 		params.flatFee = true;

// 		// declare onComplete as NoOp
// 		const onComplete = algosdk.OnApplicationComplete.NoOpOC;

// 		const clear_state_contract = path.join(
// 			__dirname,
// 			"smart_contracts/p_vote_opt_out.teal"
// 		);

// 		const register_contract = path.join(
// 			__dirname,
// 			"smart_contracts/vote_register.teal"
// 		);

// 		const register_progam = await readTeal(algodClient, register_contract);
// 		const clear_state_program = await readTeal(
// 			algodClient,
// 			clear_state_contract
// 		);

// 		const args = [];
// 		participantAddresses.map((p) => {
// 			args.push(new Uint8Array(Buffer.from(p)));
// 		});

// 		const lsig = new algosdk.LogicSigAccount(register_progam, args);
// 		console.log("lsig : " + lsig.address());

// 		// create unsigned transaction
// 		let txn = algosdk.makeApplicationCreateTxn(
// 			creatorAccount.addr,
// 			params,
// 			onComplete,
// 			register_progam,
// 			clear_state_program,
// 			0, // local integers
// 			0, // local byteslices
// 			participantAddresses.length, // global integers (0 if participant not registered, 1 if registered)
// 			0, // global byteslices
// 			args
// 		);
// 		let txId = txn.txID().toString();

// 		// Sign the transaction
// 		let signedTxn = txn.signTxn(creatorAccount.sk);

// 		// Submit the transaction
// 		await algodClient.sendRawTransaction(signedTxn).do();

// 		// Wait for confirmation
// 		await waitForConfirmation(algodClient, txId);

// 		// display results
// 		let transactionResponse = await algodClient
// 			.pendingTransactionInformation(txId)
// 			.do();

// 		// console.log("txn response", transactionResponse);
// 		const appId = transactionResponse["application-index"];
// 		console.log("Created new app-id: ", appId);

// 		return res.send({ appId, lsig });
// 	} catch (err) {
// 		console.log(err);
// 		return res.send(err);
// 	}
// };

export const registerForVote = async (req, res) => {
	try {
		const userAccount = algosdk.mnemonicToSecretKey(
			// decodeURIMnemonic(req.body.userMnemonic)
			req.body.userMnemonic
		);
		const appId = req.body.appId;
		const sender = userAccount.addr;

		const smartContractAttributes = await axios.get(
			`http://127.0.0.1:${BACKEND_PORT}/smartContract/readVoteSmartContractState`,
			{ params: { appId } }
		);

		const assetId = smartContractAttributes.data.AssetId;

		let params = await algodClient.getTransactionParams().do();
		//comment out the next two lines to use suggested fee
		params.fee = 1000;
		params.flatFee = true;

		// opt in to receive asset
		// signing and sending "txn" allows sender to begin accepting asset specified by creator and index
		const asaTxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
			sender,
			sender,
			undefined,
			undefined,
			0,
			undefined,
			assetId,
			params
		);

		// opt in to vote smart contract
		const args = [];
		args.push(new Uint8Array(Buffer.from("register")));

		// create unsigned transaction
		const smartContractTxn = algosdk.makeApplicationOptInTxn(
			sender,
			params,
			appId,
			args
		);

		// Combine transactions
		const txns = [asaTxn, smartContractTxn];

		// Group both transactions
		const txnGroup = algosdk.assignGroupID(txns);
		// console.log("txnGroup", txnGroup);

		const signedTxn1 = asaTxn.signTxn(userAccount.sk);
		const signedTxn2 = smartContractTxn.signTxn(userAccount.sk);

		// Combine the signed transactions
		const signed = [];
		signed.push(signedTxn1);
		signed.push(signedTxn2);

		let txn = await algodClient.sendRawTransaction(signed).do();
		console.log("Transaction : " + txn.txId);

		// Wait for transaction to be confirmed
		await waitForConfirmation(algodClient, txn.txId);

		return res.send({ txn });
	} catch (err) {
		console.log(err);
		return res.send(err);
	}
};
