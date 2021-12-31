import algosdk from "algosdk";
import { algodClient } from "../server.js";
import { getAlgoBalance } from "../helpers/accounts.js";
import { waitForConfirmation } from "../helpers/misc.js";

export const createAlgoAccount = (req, res) => {
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

export const registerAlgoAccount = async (req, res) => {
	try {
		const senderAccount = algosdk.mnemonicToSecretKey(
			req.body.senderMnemonic
		);
		const receiverAddr = req.body.receiver;
		const amount = req.body.amount;

		let params = await algodClient.getTransactionParams().do();
		//comment out the next two lines to use suggested fee
		params.fee = 1000;
		params.flatFee = true;

		let txn = algosdk.makeKeyRegistrationTxnWithSuggestedParams(
			senderAccount.addr,
			"",
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
		let signedTxn = txn.signTxn(senderAccount.sk);
		let txId = txn.txID().toString();
		console.log("Signed transaction with txID: %s", txId);

		// Submit the transaction
		await algodClient.sendRawTransaction(signedTxn).do();

		// Wait for confirmation
		let confirmedTxn = await waitForConfirmation(algodClient, txId);
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
			.accountInformation(senderAccount.addr)
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

export const checkAlgoBalance = async (req, res) => {
	const accountAddr = req.query.addr;
	return res.send({
		accountBalance: await getAlgoBalance(algodClient, accountAddr),
	});
};

export const sendAlgo = async (req, res) => {
	try {
		const senderAccount = algosdk.mnemonicToSecretKey(
			req.body.senderMnemonic
		);
		const receiverAddr = req.body.receiver;
		const amount = req.body.amount;

		const startingAmount = await getAlgoBalance(
			algodClient,
			senderAccount.addr
		);

		let params = await algodClient.getTransactionParams().do();

		const enc = new TextEncoder();
		const note = enc.encode(req.body.message);
		const closeout = undefined; //closeRemainderTo

		let txn = algosdk.makePaymentTxnWithSuggestedParams(
			senderAccount.addr,
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
		let signedTxn = txn.signTxn(senderAccount.sk);
		let txId = txn.txID().toString();
		console.log("Signed transaction with txID: %s", txId);

		// Submit the transaction
		await algodClient.sendRawTransaction(signedTxn).do();

		// Wait for confirmation
		let confirmedTxn = await waitForConfirmation(algodClient, txId);
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
			.accountInformation(senderAccount.addr)
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
