import algosdk from "algosdk";
import { algodClient } from "../server.js";
import { printAssetHolding, printCreatedAsset } from "../helpers/ASAs.js";
import { waitForConfirmation } from "../helpers/misc.js";
import decodeURIMnemonic from "../helpers/decodeMnemonic.js";

export const createVoteAsset = async (req, res) => {
	try {
		const creatorAccount = algosdk.mnemonicToSecretKey(
			decodeURIMnemonic(req.body.creatorMnemonic)
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
	} catch (err) {
		console.log(err);
		return res.status(500).send(err.message);
	}
};

export const checkAssetBalance = async (req, res) => {
	return res.send(
		await printAssetHolding(algodClient, req.query.addr, req.query.assetId)
	);
};

export const optInToAsset = async (req, res) => {
	try {
		let params = await algodClient.getTransactionParams().do();
		//comment out the next two lines to use suggested fee
		params.fee = 1000;
		params.flatFee = true;

		const senderAccount = algosdk.mnemonicToSecretKey(
			decodeURIMnemonic(req.body.senderMnemonic)
		);
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
	try {
		let params = await algodClient.getTransactionParams().do();
		//comment out the next two lines to use suggested fee
		params.fee = 1000;
		params.flatFee = true;

		const senderAccount = algosdk.mnemonicToSecretKey(
			decodeURIMnemonic(req.body.senderMnemonic)
		);
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

export const getAssetInfo = async (req, res) => {
	try {
		const assetId = req.query.assetId;
		const assetInfo = await algodClient.getAssetByID(assetId).do();

		return res.send(assetInfo);
	} catch (err) {
		return res.status(404).send(err);
	}
};
