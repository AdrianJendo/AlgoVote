import algosdk from "algosdk";
import path from "path";
import fs from "fs";
import { algodClient, __dirname } from "../server.js";
import { printAssetHolding, printCreatedAsset } from "../helpers/ASAs.js";
import axios from "axios";
const GET_PARAMS_URL =
	"https://api.testnet.algoexplorer.io/v2/transactions/params";
const SECS_PER_BLOCK = 4.5;

const NUM_PARTICIPANTS = 10;
const NUM_CANDIDATES = 2;

export const getRoute = (req, res) => {
	res.send([{ some: "jsondata", get: "this is get route" }]);
};

export const votingWorkflow = async (req, res) => {
	const creatorMnemonic = req.body.creatorMnemonic;
	const creatorAccount = algosdk.mnemonicToSecretKey(creatorMnemonic);

	const newAccount = await axios.post(
		"http://localhost:5001/test/createAccount"
	);
	const newAccountAddr = newAccount.data.accountAddr;

	const resp = await axios.post("http://localhost:5001/test/spendAlgo", {
		senderMnemonic: creatorAccount.sk,
		receiver: newAccountAddr,
		amount: 10000,
		message: "",
	});

	const newAccountBalance = await axios.get(
		"http://localhost:5001/test/checkBalance",
		{ params: { addr: newAccountAddr } }
	);

	return res.send({
		newAccountAddr,
		newAccountBalance: newAccountBalance.data,
	});
};
