import algosdk from "algosdk";
import { algodClient } from "../server.js";
import { printAssetHolding, printCreatedAsset } from "../helpers/ASAs.js";
import { waitForConfirmation } from "../helpers/misc.js";

export const createVoteAsset = async (req, res) => {
	const creatorAccount = algosdk.mnemonicToSecretKey(
		req.body.creatorMnemonic
	);
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
	await waitForConfirmation(algodClient, tx.txId);
	// Get the new asset's information from the creator account
	let ptx = await algodClient.pendingTransactionInformation(tx.txId).do();
	const assetId = ptx["asset-index"];

	const assetData = JSON.parse(
		await printCreatedAsset(algodClient, creatorAccount.addr, assetId)
	);
	assetData.assetId = assetId;

	return res.send(assetData);
};

export const checkAssetBalance = async (req, res) => {
	return res.send(
		await printAssetHolding(algodClient, req.query.addr, req.query.assetId)
	);
};

export const optInToAsset = async (req, res) => {
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
	const assetId = req.body.assetId;
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
		assetId,
		params
	);
	try {
		// Must be signed by the account wishing to opt in to the asset
		const rawSignedTxn = opttxn.signTxn(senderAccount.sk);
		let opttx = await algodClient.sendRawTransaction(rawSignedTxn).do();
		console.log("Transaction : " + opttx.txId);
		// wait for transaction to be confirmed
		await waitForConfirmation(algodClient, opttx.txId);

		const assetHoldings = JSON.parse(
			await printAssetHolding(algodClient, senderAccount.addr, assetId)
		);
		assetHoldings.optedIn = senderAccount.addr;

		return res.send(assetHoldings);
	} catch (err) {
		console.log(err);
		return res.send(err);
	}
};

export const transferAsset = async (req, res) => {
	let params = await algodClient.getTransactionParams().do();
	//comment out the next two lines to use suggested fee
	params.fee = 1000;
	params.flatFee = true;

	const senderAccount = algosdk.mnemonicToSecretKey(req.body.senderMnemonic);
	const assetId = req.body.assetId;
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
		assetId,
		params
	);

	try {
		// Must be signed by the account sending the asset
		const rawSignedTxn = xtxn.signTxn(senderAccount.sk);
		let xtx = await algodClient.sendRawTransaction(rawSignedTxn).do();
		console.log("Transaction : " + xtx.txId);
		// wait for transaction to be confirmed
		await waitForConfirmation(algodClient, xtx.txId);

		const tokensWithCreator = JSON.parse(
			await printAssetHolding(algodClient, senderAccount.addr, assetId)
		);
		const tokensWithRecipient = JSON.parse(
			await printAssetHolding(algodClient, recipient, assetId)
		);

		return res.send({ tokensWithCreator, tokensWithRecipient });
	} catch (err) {
		console.log(err);
		return res.send(err);
	}
};

// export const deleteAsset = asnyc(req, res) => {}

// export const toggleFreeze = async (req, res) => {
// 	// The asset was created and configured to allow freezing an account
// 	// If the freeze address is set "", it will no longer be possible to do this.
// 	// In this example we will now freeze account3 from transacting with the
// 	// The newly created asset.
// 	// The freeze transaction is sent from the freeze acount
// 	// Which in this example is account2

// 	// First update changing transaction parameters
// 	// We will account for changing transaction parameters
// 	// before every transaction in this example
// 	// await getChangingParms(algodclient);
// 	let params = await algodClient.getTransactionParams().do();
// 	//comment out the next two lines to use suggested fee
// 	params.fee = 1000;
// 	params.flatFee = true;

// 	const freezeAccount = algosdk.mnemonicToSecretKey(req.body.freezeAccount);
// 	const assetId = req.body.assetId;
// 	const from = freezeAccount.addr;
// 	const freezeTarget = req.body.freezeTarget;
// 	const freezeState = req.body.freezeState;

// 	// The freeze transaction needs to be signed by the freeze account
// 	let ftxn = algosdk.makeAssetFreezeTxnWithSuggestedParams(
// 		from,
// 		undefined,
// 		assetId,
// 		freezeTarget,
// 		freezeState,
// 		params
// 	);

// 	// Must be signed by the freeze account
// 	const rawSignedTxn = ftxn.signTxn(freezeAccount.sk);
// 	let ftx = await algodClient.sendRawTransaction(rawSignedTxn).do();
// 	console.log("Transaction : " + ftx.txId);
// 	// wait for transaction to be confirmed
// 	await waitForConfirmation(algodClient, ftx.txId, 4);

// 	// You should now see the asset is frozen listed in the account information
// 	console.log("Account 3 = " + freezeTarget);
// 	return res.send(
// 		await printAssetHolding(algodClient, freezeTarget, assetId)
// 	);
// };

// export const revokeToken = async (req, res) => {
// 	// Revoke an Asset:
// 	// The asset was also created with the ability for it to be revoked by
// 	// the clawbackaddress. If the asset was created or configured by the manager
// 	// to not allow this by setting the clawbackaddress to "" then this would
// 	// not be possible.
// 	// We will now clawback the 10 assets in account3. account2
// 	// is the clawbackaccount and must sign the transaction
// 	// The sender will be be the clawback adress.
// 	// the recipient will also be be the creator in this case
// 	// that is account3
// 	// First update changing transaction parameters
// 	// We will account for changing transaction parameters
// 	// before every transaction in this example
// 	let params = await algodClient.getTransactionParams().do();
// 	//comment out the next two lines to use suggested fee
// 	params.fee = 1000;
// 	params.flatFee = true;

// 	const clawbackAccount = algosdk.mnemonicToSecretKey(
// 		req.body.clawbackAccount
// 	);
// 	const assetId = req.body.assetId;
// 	const sender = clawbackAccount.addr;
// 	const recipient = clawbackAccount.addr; // This address is where the clawed-back funds will be located
// 	const revocationTarget = req.body.clawbackTarget;
// 	const closeRemainderTo = undefined;
// 	const amount = 1;
// 	// signing and sending "txn" will send "amount" assets from "revocationTarget" to "recipient",
// 	// if and only if sender == clawback manager for this asset

// 	let rtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
// 		sender,
// 		recipient,
// 		closeRemainderTo,
// 		revocationTarget,
// 		amount,
// 		undefined,
// 		assetId,
// 		params
// 	);
// 	// Must be signed by the account that is the clawback address
// 	const rawSignedTxn = rtxn.signTxn(clawbackAccount.sk);
// 	let rtx = await algodClient.sendRawTransaction(rawSignedTxn).do();
// 	console.log("Transaction : " + rtx.txId);
// 	// wait for transaction to be confirmed
// 	await waitForConfirmation(algodClient, rtx.txId, 4);

// 	// You should now see 0 assets listed in the account information
// 	// for the third account
// 	console.log("Account 3 = " + revocationTarget);
// 	return res.send(
// 		await printAssetHolding(algodClient, revocationTarget, assetId)
// 	);
// };
