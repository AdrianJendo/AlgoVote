import algosdk from "algosdk";
import path from "path";
import fs from "fs";
import { algodClient, __dirname } from "../server.js";

// Function used to print created asset for account and assetid
const printCreatedAsset = async function (algodclient, account, assetid) {
	// note: if you have an indexer instance available it is easier to just use this
	//     let accountInfo = await indexerClient.searchAccounts()
	//    .assetID(assetIndex).do();
	// and in the loop below use this to extract the asset for a particular account
	// accountInfo['accounts'][idx][account]);
	let accountInfo = await algodclient.accountInformation(account).do();
	for (let idx = 0; idx < accountInfo["created-assets"].length; idx++) {
		let scrutinizedAsset = accountInfo["created-assets"][idx];
		if (scrutinizedAsset["index"] == assetid) {
			console.log("AssetID = " + scrutinizedAsset["index"]);
			let myparms = JSON.stringify(
				scrutinizedAsset["params"],
				undefined,
				2
			);
			console.log("parms = " + myparms);
			break;
		}
	}
};
// Function used to print asset holding for account and assetid
const printAssetHolding = async function (algodclient, account, assetid) {
	// note: if you have an indexer instance available it is easier to just use this
	//     let accountInfo = await indexerClient.searchAccounts()
	//    .assetID(assetIndex).do();
	// and in the loop below use this to extract the asset for a particular account
	// accountInfo['accounts'][idx][account]);
	let accountInfo = await algodclient.accountInformation(account).do();
	for (let idx = 0; idx < accountInfo["assets"].length; idx++) {
		let scrutinizedAsset = accountInfo["assets"][idx];
		if (scrutinizedAsset["asset-id"] == assetid) {
			let myassetholding = JSON.stringify(scrutinizedAsset, undefined, 2);
			console.log("assetholdinginfo = " + myassetholding);
			return myassetholding;
		}
	}
};

export const createVoteToken = async (req, res) => {
	const creator_mnemonic = req.body.sk;
	const creatorAccount = algosdk.mnemonicToSecretKey(creator_mnemonic);
	const numIssued = req.body.numIssued;
	const assetName = req.body.assetName;
	const defaultFrozen = false;
	const unitName = "VOTE";
	const managerAddr = undefined;
	const reserveAddr = undefined;
	const freezeAddr = creatorAccount.addr;
	const clawbackAddr = creatorAccount.addr;
	const totalIssuance = numIssued; // Fungible tokens have totalIssuance greater than 1
	const decimals = 0; // Fungible tokens typically have decimals greater than 0
	let params = await algodClient.getTransactionParams().do();
	//comment out the next two lines to use suggested fee
	params.fee = 1000;
	params.flatFee = true;
	const note = undefined;
	const assetURL = undefined;
	let assetMetadataHash = "16efaa3924a6fd9d3a4824799a4ac65d";

	// signing and sending "txn" allows "addr" to create an asset
	let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
		creatorAccount.addr,
		note,
		totalIssuance,
		decimals,
		defaultFrozen,
		managerAddr,
		reserveAddr,
		freezeAddr,
		clawbackAddr,
		unitName,
		assetName,
		assetURL,
		assetMetadataHash,
		params
	);

	let rawSignedTxn = txn.signTxn(creatorAccount.sk);
	let tx = await algodClient.sendRawTransaction(rawSignedTxn).do();
	console.log("Transaction : " + tx.txId);
	// wait for transaction to be confirmed
	await waitForConfirmation(algodClient, tx.txId, 4);
	// Get the new asset's information from the creator account
	let ptx = await algodClient.pendingTransactionInformation(tx.txId).do();
	const assetID = ptx["asset-index"];

	return res.send({ assetID, creator: creatorAccount.addr });
};

export const checkTokenBalance = async (req, res) => {
	return res.send(
		await printAssetHolding(algodClient, req.query.addr, req.query.assetID)
	);
};

export const optInToVote = async (req, res) => {
	// Opting in to an Asset:
	// Opting in to transact with the new asset
	// Allow accounts that want recieve the new asset
	// Have to opt in. To do this they send an asset transfer
	// of the new asset to themseleves
	// In this example we are setting up the 3rd recovered account to
	// receive the new asset

	// First update changing transaction parameters
	// We will account for changing transaction parameters
	// before every transaction in this example
	let params = await algodClient.getTransactionParams().do();
	//comment out the next two lines to use suggested fee
	params.fee = 1000;
	params.flatFee = true;

	const senderAccount = algosdk.mnemonicToSecretKey(req.body.senderMnemonic);
	const assetID = req.body.assetID;
	let sender = senderAccount.addr;
	let recipient = sender;
	// We set revocationTarget to undefined as
	// This is not a clawback operation
	let revocationTarget = undefined;
	// CloseReaminerTo is set to undefined as
	// we are not closing out an asset
	let closeRemainderTo = undefined;
	// We are sending 0 assets
	const amount = 0;

	// signing and sending "txn" allows sender to begin accepting asset specified by creator and index
	let opttxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
		sender,
		recipient,
		closeRemainderTo,
		revocationTarget,
		amount,
		undefined,
		assetID,
		params
	);

	// Must be signed by the account wishing to opt in to the asset
	const rawSignedTxn = opttxn.signTxn(senderAccount.sk);
	let opttx = await algodClient.sendRawTransaction(rawSignedTxn).do();
	console.log("Transaction : " + opttx.txId);
	// wait for transaction to be confirmed
	await waitForConfirmation(algodClient, opttx.txId, 4);

	//You should now see the new asset listed in the account information
	console.log("Account 3 = " + senderAccount.addr);

	return res.send(
		await printAssetHolding(algodClient, senderAccount.addr, assetID)
	);
};

export const transferAsset = async (req, res) => {
	let params = await algodClient.getTransactionParams().do();
	//comment out the next two lines to use suggested fee
	params.fee = 1000;
	params.flatFee = true;

	const senderAccount = algosdk.mnemonicToSecretKey(req.body.senderMnemonic);
	const assetID = req.body.assetID;
	const sender = senderAccount.addr;
	const recipient = req.body.receiver;
	const revocationTarget = undefined;
	const closeRemainderTo = undefined;
	//Amount of the asset to transfer
	const amount = req.body.amount;

	// signing and sending "txn" will send "amount" assets from "sender" to "recipient"
	let xtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
		sender,
		recipient,
		closeRemainderTo,
		revocationTarget,
		amount,
		undefined,
		assetID,
		params
	);

	// Must be signed by the account sending the asset
	const rawSignedTxn = xtxn.signTxn(senderAccount.sk);
	let xtx = await algodClient.sendRawTransaction(rawSignedTxn).do();
	console.log("Transaction : " + xtx.txId);
	// wait for transaction to be confirmed
	await waitForConfirmation(algodClient, xtx.txId, 4);

	// You should now see the 10 assets listed in the account information
	console.log("Account 3 = " + senderAccount.addr);

	return res.send(
		await printAssetHolding(algodClient, senderAccount.addr, assetID)
	);
};

export const toggleFreeze = async (req, res) => {
	// The asset was created and configured to allow freezing an account
	// If the freeze address is set "", it will no longer be possible to do this.
	// In this example we will now freeze account3 from transacting with the
	// The newly created asset.
	// The freeze transaction is sent from the freeze acount
	// Which in this example is account2

	// First update changing transaction parameters
	// We will account for changing transaction parameters
	// before every transaction in this example
	// await getChangingParms(algodclient);
	let params = await algodClient.getTransactionParams().do();
	//comment out the next two lines to use suggested fee
	params.fee = 1000;
	params.flatFee = true;

	const freezeAccount = algosdk.mnemonicToSecretKey(req.body.freezeAccount);
	const assetID = req.body.assetID;
	const from = freezeAccount.addr;
	const freezeTarget = req.body.freezeTarget;
	const freezeState = req.body.freezeState;

	// The freeze transaction needs to be signed by the freeze account
	let ftxn = algosdk.makeAssetFreezeTxnWithSuggestedParams(
		from,
		undefined,
		assetID,
		freezeTarget,
		freezeState,
		params
	);

	// Must be signed by the freeze account
	const rawSignedTxn = ftxn.signTxn(freezeAccount.sk);
	let ftx = await algodClient.sendRawTransaction(rawSignedTxn).do();
	console.log("Transaction : " + ftx.txId);
	// wait for transaction to be confirmed
	await waitForConfirmation(algodClient, ftx.txId, 4);

	// You should now see the asset is frozen listed in the account information
	console.log("Account 3 = " + freezeTarget);
	return res.send(
		await printAssetHolding(algodClient, freezeTarget, assetID)
	);
};

export const revokeToken = async (req, res) => {
	// Revoke an Asset:
	// The asset was also created with the ability for it to be revoked by
	// the clawbackaddress. If the asset was created or configured by the manager
	// to not allow this by setting the clawbackaddress to "" then this would
	// not be possible.
	// We will now clawback the 10 assets in account3. account2
	// is the clawbackaccount and must sign the transaction
	// The sender will be be the clawback adress.
	// the recipient will also be be the creator in this case
	// that is account3
	// First update changing transaction parameters
	// We will account for changing transaction parameters
	// before every transaction in this example
	let params = await algodClient.getTransactionParams().do();
	//comment out the next two lines to use suggested fee
	params.fee = 1000;
	params.flatFee = true;

	const clawbackAccount = algosdk.mnemonicToSecretKey(
		req.body.clawbackAccount
	);
	const assetID = req.body.assetID;
	const sender = clawbackAccount.addr;
	const recipient = clawbackAccount.addr; // This address is where the clawed-back funds will be located
	const revocationTarget = req.body.clawbackTarget;
	const closeRemainderTo = undefined;
	const amount = 1;
	// signing and sending "txn" will send "amount" assets from "revocationTarget" to "recipient",
	// if and only if sender == clawback manager for this asset

	let rtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
		sender,
		recipient,
		closeRemainderTo,
		revocationTarget,
		amount,
		undefined,
		assetID,
		params
	);
	// Must be signed by the account that is the clawback address
	const rawSignedTxn = rtxn.signTxn(clawbackAccount.sk);
	let rtx = await algodClient.sendRawTransaction(rawSignedTxn).do();
	console.log("Transaction : " + rtx.txId);
	// wait for transaction to be confirmed
	await waitForConfirmation(algodClient, rtx.txId, 4);

	// You should now see 0 assets listed in the account information
	// for the third account
	console.log("Account 3 = " + revocationTarget);
	return res.send(
		await printAssetHolding(algodClient, revocationTarget, assetID)
	);
};

export const createAccount = (req, res) => {
	try {
		const myaccount = algosdk.generateAccount();
		const accountAddr = myaccount.addr;
		const account_mnemonic = algosdk.secretKeyToMnemonic(myaccount.sk);
		console.log("Account Address = " + accountAddr);
		console.log("Account Mnemonic = " + account_mnemonic);
		console.log("Account created. Save off Mnemonic and address");
		console.log("Add funds to account using the TestNet Dispenser: ");
		console.log("https://dispenser.testnet.aws.algodev.network/ ");
		return res.send({ accountAddr, account_mnemonic });
	} catch (err) {
		console.log("err", err);
	}
};

const getBalance = async (accountAddr) => {
	//Check your balance
	let accountInfo = await algodClient.accountInformation(accountAddr).do();
	console.log("Account balance: %d microAlgos", accountInfo.amount);
	let accountBalance = accountInfo.amount;
	return accountBalance;
};

/**
 * Wait until the transaction is confirmed or rejected, or until 'timeout'
 * number of rounds have passed.
 * @param {algosdk.Algodv2} algodClient the Algod V2 client
 * @param {string} txId the transaction ID to wait for
 * @param {number} timeout maximum number of rounds to wait
 * @return {Promise<*>} pending transaction information
 * @throws Throws an error if the transaction is not confirmed or rejected in the next timeout rounds
 */
const waitForConfirmation = async function (algodClient, txId, timeout) {
	if (algodClient == null || txId == null || timeout < 0) {
		throw new Error("Bad arguments");
	}

	const status = await algodClient.status().do();
	if (status === undefined) {
		throw new Error("Unable to get node status");
	}

	const startround = status["last-round"] + 1;
	let currentround = startround;

	while (currentround < startround + timeout) {
		const pendingInfo = await algodClient
			.pendingTransactionInformation(txId)
			.do();
		if (pendingInfo !== undefined) {
			if (
				pendingInfo["confirmed-round"] !== null &&
				pendingInfo["confirmed-round"] > 0
			) {
				//Got the completed Transaction
				return pendingInfo;
			} else {
				if (
					pendingInfo["pool-error"] != null &&
					pendingInfo["pool-error"].length > 0
				) {
					// If there was a pool error, then the transaction has been rejected!
					throw new Error(
						"Transaction " +
							txId +
							" rejected - pool error: " +
							pendingInfo["pool-error"]
					);
				}
			}
		}
		await algodClient.statusAfterBlock(currentround).do();
		currentround++;
	}
	throw new Error(
		"Transaction " + txId + " not confirmed after " + timeout + " rounds!"
	);
};

export const spendAlgo = async (req, res) => {
	try {
		const senderAddr = req.body.sender;
		const receiverAddr = req.body.receiver;
		const amount = req.body.amount;
		const sk_mnemonic = req.body.sk;
		const sk = algosdk.mnemonicToSecretKey(sk_mnemonic).sk;

		const startingAmount = await getBalance(senderAddr);

		let params = await algodClient.getTransactionParams().do();

		const enc = new TextEncoder();
		const note = enc.encode(req.body.message);
		const closeout = undefined; //closeRemainderTo

		let txn = algosdk.makePaymentTxnWithSuggestedParams(
			senderAddr,
			receiverAddr,
			amount,
			closeout,
			note,
			params
		);
		// WARNING! all remaining funds in the sender account above will be sent to the closeRemainderTo Account
		// In order to keep all remaning funds in the sender account after tx, set closeout parameter to undefined.
		// For more info see:
		// https://developer.algorand.org/docs/reference/transactions/#payment-transaction

		// Sign the transaction
		let signedTxn = txn.signTxn(sk);
		let txId = txn.txID().toString();
		console.log("Signed transaction with txID: %s", txId);

		// Submit the transaction
		await algodClient.sendRawTransaction(signedTxn).do();

		// Wait for confirmation
		let confirmedTxn = await waitForConfirmation(algodClient, txId, 4);
		//Get the completed Transaction
		console.log(
			"Transaction " +
				txId +
				" confirmed in round " +
				confirmedTxn["confirmed-round"]
		);
		// let mytxinfo = JSON.stringify(confirmedTxn.txn.txn, undefined, 2);
		// console.log("Transaction information: %o", mytxinfo);
		var string = new TextDecoder().decode(confirmedTxn.txn.txn.note);
		console.log("Note field: ", string);
		const accountInfo = await algodClient
			.accountInformation(senderAddr)
			.do();
		console.log(
			"Transaction Amount: %d microAlgos",
			confirmedTxn.txn.txn.amt
		);
		console.log("Transaction Fee: %d microAlgos", confirmedTxn.txn.txn.fee);
		let closeoutamt =
			startingAmount -
			confirmedTxn.txn.txn.amt -
			confirmedTxn.txn.txn.fee;
		console.log("Close To Amount: %d microAlgos", closeoutamt);
		console.log("Account balance: %d microAlgos", accountInfo.amount);

		return res.send({
			senderAmtFinal: accountInfo.amount,
			amountSent: confirmedTxn.txn.txn.amt,
			fee: confirmedTxn.txn.txn.fee,
		});
	} catch (err) {
		console.log("err", err);
	}
};

export const checkBalance = async (req, res) => {
	const accountAddr = req.query.addr;
	return res.send({ accountBalance: await getBalance(accountAddr) });
};
// export const fundAccount = (req, res) => {};

export const getRoute = (req, res) => {
	res.send([{ some: "jsondata", get: "this is get route" }]);
};

/*

Development environments/Set up your development environment
Tokenization/Create fungible token
Integration/Algos and assets ?
SDKs/Javascript

*/

const readTeal = async (filePath) => {
	const programBytes = fs.readFileSync(filePath);
	const compiledResponse = await algodClient.compile(programBytes).do();
	const compiledBytes = new Uint8Array(
		Buffer.from(compiledResponse.result, "base64")
	);
	return compiledBytes;
};

// Read in teal file
export const createSmartContract = async (req, res) => {
	const creatorAccount = algosdk.mnemonicToSecretKey(
		req.body.creatorMnemonic
	);
	const sender = creatorAccount.addr;

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

	const vote_program = await readTeal(vote);
	const opt_out_program = await readTeal(vote_opt_out);

	// integer parameter
	const args = [];
	const today = new Date();
	const startVoteUTC = Date.UTC(
		today.getUTCFullYear(),
		today.getUTCMonth(),
		today.getUTCDate(),
		today.getUTCHours(),
		today.getUTCMinutes() + 1,
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

	args.push(algosdk.encodeUint64(startVoteUTC));
	args.push(algosdk.encodeUint64(endVoteUTC));
	// const lsig = new algosdk.LogicSigAccount(vote_program, args);
	// console.log("lsig : " + lsig.address());

	// create unsigned transaction
	let txn = algosdk.makeApplicationCreateTxn(
		sender,
		params,
		onComplete,
		vote_program,
		opt_out_program,
		0,
		1,
		6,
		1,
		args
	);
	let txId = txn.txID().toString();

	// Sign the transaction
	let signedTxn = txn.signTxn(creatorAccount.sk);
	console.log("Signed transaction with txID: %s", txId);

	// Submit the transaction
	await algodClient.sendRawTransaction(signedTxn).do();

	// Wait for confirmation
	await waitForConfirmation(algodClient, txId, 4);

	// display results
	let transactionResponse = await algodClient
		.pendingTransactionInformation(txId)
		.do();
	let appId = transactionResponse["application-index"];
	console.log("Created new app-id: ", appId);

	return res.send({ appId });
};

export const registerForVote = async (req, res) => {
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

	// Submit the transaction
	await algodClient.sendRawTransaction(signedTxn).do();

	// Wait for confirmation
	await waitForConfirmation(algodClient, txId, 4);

	// display results
	let transactionResponse = await algodClient
		.pendingTransactionInformation(txId)
		.do();
	console.log(
		"Opted-in to app-id:",
		transactionResponse["txn"]["txn"]["apid"]
	);

	return res.send({ transactionResponse });
};
