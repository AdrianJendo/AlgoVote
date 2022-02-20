import algosdk from "algosdk";
import { algodClient, indexerClient, BACKEND_PORT } from "../server.js";
import { printAssetHolding, printCreatedAsset } from "../helpers/ASAs.js";
import { waitForConfirmation } from "../helpers/misc.js";
import decodeURIMnemonic from "../helpers/decodeMnemonic.js";
import axios from "axios";

export const createVoteAsset = async (req, res) => {
	try {
		const creatorAccount = algosdk.mnemonicToSecretKey(
			decodeURIMnemonic(req.body.creatorMnemonic)
		);
		const numIssued = req.body.numIssued;
		const assetName = req.body.assetName;
		const defaultFrozen = false;
		const unitName = "VOTE";
		const managerAddr = creatorAccount.addr;
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
		return res
			.status(400)
			.send(err.response?.text || { message: err.message });
	}
};

export const checkAssetBalance = async (req, res) => {
	try {
		return res.send(
			await printAssetHolding(
				algodClient,
				req.query.addr,
				req.query.assetId
			)
		);
	} catch (err) {
		return res
			.status(400)
			.send(err.response?.text || { message: err.message });
	}
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
		// wait for transaction to be confirmed
		await waitForConfirmation(algodClient, opttx.txId);

		const assetHoldings = JSON.parse(
			await printAssetHolding(algodClient, senderAccount.addr, assetId)
		);
		assetHoldings.optedIn = senderAccount.addr;

		return res.send(assetHoldings);
	} catch (err) {
		return res
			.status(400)
			.send(err.response?.text || { message: err.message });
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
		return res
			.status(400)
			.send(err.response?.text || { message: err.message });
	}
};

export const getAssetInfo = async (req, res) => {
	try {
		const assetId = req.query.assetId;
		const assetData = await algodClient.getAssetByID(assetId).do();
		const assetBalances = await indexerClient
			.lookupAssetBalances(assetId)
			.do();

		const txns = await indexerClient.lookupAssetTransactions(assetId).do();
		const creator = assetData.params.creator;
		const numVoted = txns.transactions.filter(
			(txn) =>
				txn["tx-type"] === "axfer" &&
				txn["asset-transfer-transaction"]["receiver"] === creator
		).length;

		return res.send({
			assetData,
			assetBalances: assetBalances.balances,
			numVoted,
		});
	} catch (err) {
		return res
			.status(400)
			.send(err.response?.text || { message: err.message });
	}
};

export const delayedTransferAsset = async (req, res) => {
	try {
		const senderMnemonic = req.body.senderMnemonic;
		const receivers = JSON.parse(req.body.receivers);
		const amounts = JSON.parse(req.body.amounts);
		const assetId = req.body.assetId;
		const secsToTxn = req.body.secsToTxn;

		setTimeout(async () => {
			try {
				const sendTokenPromises = [];
				for (let i = 0; i < receivers.length; i++) {
					const receiver = receivers[i];
					const amount = amounts[i];
					sendTokenPromises.push(
						axios.post(
							`http://127.0.0.1:${BACKEND_PORT}/asa/transferAsset`,
							{
								senderMnemonic,
								receiver,
								assetId,
								amount,
							}
						)
					);
				}

				await Promise.all(sendTokenPromises);
			} catch (err) {
				console.log(err);
			}
		}, secsToTxn * 1000);

		return res.send({ status: "queued" });
	} catch (err) {
		return res
			.status(400)
			.send(err.response?.text || { message: err.message });
	}
};

export const deleteASA = async (req, res) => {
	try {
		// define sender as creator
		const creatorAccount = algosdk.mnemonicToSecretKey(
			decodeURIMnemonic(req.body.creatorMnemonic)
		);
		const assetId = req.body.assetId;

		// get node suggested parameters
		let params = await algodClient.getTransactionParams().do();
		// comment out the next two lines to use suggested fee
		params.fee = 1000;
		params.flatFee = true;

		// create unsigned transaction
		let txn = algosdk.makeAssetDestroyTxnWithSuggestedParams(
			creatorAccount.addr,
			new Uint8Array(Buffer.from("")),
			assetId,
			params
		);
		let txId = txn.txID().toString();

		// Sign the transaction
		let signedTxn = txn.signTxn(creatorAccount.sk);

		// Submit the transaction
		await algodClient.sendRawTransaction(signedTxn).do();

		// Wait for confirmation
		await waitForConfirmation(algodClient, txId);

		// display results
		let transactionResponse = await algodClient
			.pendingTransactionInformation(txId)
			.do();

		return res.send(transactionResponse);
	} catch (err) {
		return res
			.status(400)
			.send(err.response?.text || { message: err.message });
	}
};
