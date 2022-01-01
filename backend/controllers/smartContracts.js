import algosdk from "algosdk";
import path from "path";

import { algodClient, __dirname } from "../server.js";
import { printAssetHolding } from "../helpers/ASAs.js";
import { waitForConfirmation } from "../helpers/misc.js";
import { readTeal } from "../helpers/smartContracts.js";

const SECS_PER_BLOCK = 4.5;

// Read in teal file
export const createVoteSmartContract = async (req, res) => {
	const creatorAccount = algosdk.mnemonicToSecretKey(
		req.body.creatorMnemonic
	);
	const sender = creatorAccount.addr;
	const assetId = req.body.assetId;

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
	const today = new Date();
	const startVoteUTC = Date.UTC(
		today.getUTCFullYear(),
		today.getUTCMonth(),
		today.getUTCDate(),
		today.getUTCHours(),
		today.getUTCMinutes() + 2,
		today.getUTCSeconds(),
		today.getUTCMilliseconds()
	);
	const endVoteUTC = Date.UTC(
		today.getUTCFullYear(),
		today.getUTCMonth(),
		today.getUTCDate(),
		today.getUTCHours(),
		today.getUTCMinutes() + 10,
		today.getUTCSeconds(),
		today.getUTCMilliseconds()
	);

	// We can also try omitting all this code and using startVoteUTC and endVoteUTC directly... then either using 'global LatestTimestamp' or passing in the timestamp at which registration was attempted
	const startVoteSecs = Math.abs(Math.round((startVoteUTC - today) / 1000));
	const endVoteSecs = Math.abs(Math.round((endVoteUTC - today) / 1000));

	const blockchainStatus = await algodClient.status().do();
	const blockRound = blockchainStatus["last-round"];
	const startVotingBlock = Math.ceil(
		blockRound + startVoteSecs / SECS_PER_BLOCK
	);
	const endVotingBlock = Math.ceil(blockRound + endVoteSecs / SECS_PER_BLOCK);

	args.push(algosdk.encodeUint64(startVotingBlock));
	args.push(algosdk.encodeUint64(endVotingBlock));
	args.push(algosdk.encodeUint64(assetId));
	// const lsig = new algosdk.LogicSigAccount(vote_program, args);
	// console.log("lsig : " + lsig.address());

	const numCandidates = 2;

	// create unsigned transaction
	let txn = algosdk.makeApplicationCreateTxn(
		sender,
		params,
		onComplete,
		vote_program,
		opt_out_program,
		0, // local integers
		1, // local byteslices
		args.length + numCandidates, // global integers (startVotingBlock, endVotingBlock, assetId, numCandidates)
		1, // global byteslices (1 for creator address)
		args
	);
	let txId = txn.txID().toString();

	// Sign the transaction
	let signedTxn = txn.signTxn(creatorAccount.sk);
	console.log("Signed transaction with txID: %s", txId);

	// Submit the transaction
	try {
		await algodClient.sendRawTransaction(signedTxn).do();

		// Wait for confirmation
		await waitForConfirmation(algodClient, txId);
	} catch (err) {
		console.log(err);
	}

	// display results
	let transactionResponse = await algodClient
		.pendingTransactionInformation(txId)
		.do();

	console.log("txn response", transactionResponse);
	let appId = transactionResponse["application-index"];
	console.log("Created new app-id: ", appId);

	return res.send({
		appId,
		startVotingBlock,
		endVotingBlock,
		confirmedRound: transactionResponse["confirmed-round"],
	});
};

export const optInVoteSmartContract = async (req, res) => {
	// get accounts from mnemonic
	const userAccount = algosdk.mnemonicToSecretKey(req.body.userMnemonic);
	const sender = userAccount.addr;
	const appId = req.body.appId;

	// get node suggested parameters
	let params = await algodClient.getTransactionParams().do();
	// comment out the next two lines to use suggested fee
	params.fee = 1000;
	params.flatFee = true;

	const args = [];
	args.push(new Uint8Array(Buffer.from("register")));
	// args.push(new Uint8Array(...Buffer.from("register")));

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
		return err;
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
	// get accounts from mnemonic
	const userAccount = algosdk.mnemonicToSecretKey(req.body.userMnemonic);
	const sender = userAccount.addr;
	const appId = req.body.appId;
	const candidate = req.body.candidate;
	const assetId = req.body.assetId;
	const recipient = req.body.receiver;
	const amount = req.body.amount;

	// get node suggested parameters
	let params = await algodClient.getTransactionParams().do();
	// comment out the next two lines to use suggested fee
	params.fee = 1000;
	params.flatFee = true;

	const args = [];
	args.push(new Uint8Array(Buffer.from("vote")));
	args.push(new Uint8Array(Buffer.from(candidate)));

	// goal app call --app-id {APPID} --app-arg "str:vote" --app-arg "str:candidatea" --from {ACCOUNT}  --out=unsignedtransaction1.tx
	let txn1 = algosdk.makeApplicationNoOpTxn(sender, params, appId, args);

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
};

export const readVoteSmartContractState = async (req, res) => {
	// define sender as creator
	const creatorAddr = req.query.creatorAddr;
	const appId = req.query.appId;

	let accountInfoResponse = await algodClient
		.accountInformation(creatorAddr)
		.do();

	for (let i = 0; i < accountInfoResponse["created-apps"].length; i++) {
		if (accountInfoResponse["created-apps"][i].id == appId) {
			console.log("Application's global state:");
			for (
				let n = 0;
				n <
				accountInfoResponse["created-apps"][i]["params"]["global-state"]
					.length;
				n++
			) {
				console.log(
					accountInfoResponse["created-apps"][i]["params"][
						"global-state"
					][n]
				);
			}
			return res.send(
				accountInfoResponse["created-apps"][i]["params"]["global-state"]
			);
		}
	}

	return res.send(accountInfoResponse["created-apps"]);
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

export const didUserVote = async (req, res) => {
	// read local state of application from user account
	const userAddr = req.query.userAddr;
	const appId = req.query.appId;

	let accountInfoResponse = await algodClient
		.accountInformation(userAddr)
		.do();

	for (let i = 0; i < accountInfoResponse["apps-local-state"].length; i++) {
		if (accountInfoResponse["apps-local-state"][i].id == appId) {
			console.log("User's local state:");
			console.log(
				accountInfoResponse["apps-local-state"][i]["key-value"]
			);
			if (accountInfoResponse["apps-local-state"][i][`key-value`]) {
				return res.send({
					voted: accountInfoResponse["apps-local-state"][i][
						`key-value`
					][0],
				});
			} else {
				return res.send(
					"User opted in to this application, but did not vote"
				);
			}
		}
	}

	return res.send("User did not participate in this application");
};
