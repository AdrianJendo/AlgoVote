import algosdk from "algosdk";
import path from "path";
import { algodClient, __dirname } from "../server.js";
import { pollingDelay } from "../helpers/misc.js";
import axios from "axios";
import CryptoJS from "crypto-js";
import { readTeal } from "../helpers/smartContracts.js";
import { waitForConfirmation } from "../helpers/misc.js";

const NUM_VOTERS = 90;
const CANDIDATES = ["Billy", "Jean", "Christian", "Dior"];
const MIN_BALANCE = 100000 + 100000 + 100000 + 50000 + 10000; // micro algos -> 0.1 algo (min account balance) + 0.1 (to opt in and receive ASA) + 0.1 (to opt in to smart contract) + 0.05 (for 1 local byte slice)
// added an extra 10000 micro algos so that the account doesn't dip below the minimum during any transactions
// note that the creator has a higher minimum balance because it is responsible for the global varaibles
// the local byteslice variable is only responsible for keeping track on whether the account has voted or not

export const getRoute = (req, res) => {
	res.send([{ some: "jsondata", get: "this is get route" }]);
};

export const encryptMnemonic = (req, res) => {
	const encryptedMnemonic = CryptoJS.AES.encrypt(
		req.query.mnemonic,
		process.env.REACT_APP_ENCRYPTION_KEY
	).toString();

	res.send({ encryptedMnemonic: encodeURIComponent(encryptedMnemonic) });
};

export const votingWorkflow = async (req, res) => {
	// variables
	const creatorMnemonic = req.body.creatorMnemonic;
	const creatorAccount = algosdk.mnemonicToSecretKey(creatorMnemonic);
	const voteTokenName = req.body.voteTokenName;
	const voters = [];
	let assetId;
	let appId;
	let startBlock;

	// setup
	try {
		// create voting token
		const voteAsset = await axios.post(
			"http://localhost:5001/asa/createVoteAsset",
			{
				creatorMnemonic,
				numIssued: NUM_VOTERS,
				assetName: voteTokenName,
			}
		);
		assetId = voteAsset.data.assetId;

		// create smart contract
		const smartContract = await axios.post(
			"http://localhost:5001/smartContract/createVoteSmartContract",
			{
				creatorMnemonic,
				assetId,
				numCandidates: CANDIDATES.length,
			}
		);
		const smartContractData = smartContract.data;
		appId = smartContractData.appId;
		startBlock = smartContractData.startVotingBlock;
	} catch (err) {
		console.log(err);
		return res.send({ phase: 1, err });
	}

	// create voters
	try {
		// create new account
		const newAccountPromises = [];
		for (let i = 0; i < NUM_VOTERS; i++) {
			newAccountPromises.push(
				axios.post(
					"http://localhost:5001/algoAccount/createAlgoAccount"
				)
			);
		}

		const accounts = await Promise.all(newAccountPromises);

		// fund new account with minimum balance
		const fundAccountPromises = [];
		for (let i = 0; i < accounts.length; ++i) {
			const accountAddr = accounts[i].data.accountAddr;
			const accountMnemonic = accounts[i].data.accountMnemonic;

			fundAccountPromises.push(
				axios.post("http://localhost:5001/algoAccount/sendAlgo", {
					senderMnemonic: algosdk.secretKeyToMnemonic(
						creatorAccount.sk
					),
					receiver: accountAddr,
					amount: MIN_BALANCE,
					message: "",
				})
			);

			voters.push({ accountAddr, accountMnemonic });
		}

		await Promise.all(fundAccountPromises);

		// opt in to receive vote token
		const optInTokenPromises = [];
		for (let i = 0; i < NUM_VOTERS; ++i) {
			optInTokenPromises.push(
				axios.post("http://localhost:5001/asa/optInToAsset", {
					senderMnemonic: voters[i].accountMnemonic,
					assetId,
				})
			);
		}

		await Promise.all(optInTokenPromises);

		// receive vote token
		const receiveTokenPromises = [];
		for (let i = 0; i < NUM_VOTERS; ++i) {
			receiveTokenPromises.push(
				axios.post("http://localhost:5001/asa/transferAsset", {
					senderMnemonic: creatorMnemonic,
					receiver: voters[i].accountAddr,
					amount: 1,
					assetId,
				})
			);
		}

		await Promise.all(receiveTokenPromises);

		// opt in to voting contract
		const optInContractPromises = [];
		for (let i = 0; i < NUM_VOTERS; ++i) {
			optInContractPromises.push(
				axios.post(
					"http://localhost:5001/smartContract/optInVoteSmartContract",
					{
						userMnemonic: voters[i].accountMnemonic,
						appId,
					}
				)
			);
		}

		await Promise.all(optInContractPromises);
	} catch (err) {
		console.log(err);
		return res.send({ phase: 2, err });
	}

	// wait for vote to begin
	let curBlock;
	do {
		const blockchainStatus = await algodClient.status().do();
		curBlock = blockchainStatus["last-round"];
		console.log("current block: ", curBlock);
		await pollingDelay(5000);
	} while (curBlock < startBlock);

	// vote
	try {
		const votePromises = [];
		for (let i = 0; i < NUM_VOTERS - 15; i++) {
			// 15 voters don't vote
			const rando = Math.random();
			votePromises.push(
				axios.post("http://localhost:5001/smartContract/submitVote", {
					userMnemonic: voters[i].accountMnemonic,
					appId,
					candidate:
						rando < 0.25
							? CANDIDATES[0]
							: rando < 0.5
							? CANDIDATES[1]
							: rando < 0.75
							? CANDIDATES[2]
							: CANDIDATES[3],
					assetId,
					receiver: creatorAccount.addr,
					amount: 1,
				})
			);
		}
		await Promise.all(votePromises);
	} catch (err) {
		console.log(err);
		return res.send({ phase: 3, err });
	}

	// get the results
	try {
	} catch (err) {
		console.log(err);
		return res.send({ phase: 4, err });
	}

	// delete smart contract when vote ends
	try {
		// we don't want to do this because then the results are not seeable I think
		// await axios.post(
		// 	"http://localhost:5001/smartContract/deleteVoteSmartContract",
		// 	{
		// 		creatorMnemonic,
		// 		appId,
		// 	}
		// );
	} catch (err) {
		console.log(err);
		return res.send({ phase: 5, err });
	}

	const creatorAssetHoldings = await axios.get(
		"http://localhost:5001/asa/checkAssetBalance",
		{ params: { assetId, addr: creatorAccount.addr } }
	);

	return res.send({
		votesReceived: creatorAssetHoldings.data.amount,
		votingPercentage: `${
			(creatorAssetHoldings.data.amount / NUM_VOTERS) * 100
		}%`,
		assetId,
		appId,
		voters,
	});
};

export const timestampTest = async (req, res) => {
	const creatorAccount = algosdk.mnemonicToSecretKey(
		req.body.creatorMnemonic
	);
	const sender = creatorAccount.addr;

	const timestampUTC = 1644980700; // GMT Wed Feb 16 2022 03:05:00 GMT+0000

	const timestamp = path.join(__dirname, "smart_contracts/timestamp.teal");
	const opt_out = path.join(__dirname, "smart_contracts/p_vote_opt_out.teal");

	const timestamp_program = await readTeal(algodClient, timestamp);
	const opt_out_program = await readTeal(algodClient, opt_out);

	// integer parameter
	const args = [];

	args.push(algosdk.encodeUint64(timestampUTC));

	// get node suggested parameters
	let params = await algodClient.getTransactionParams().do();
	// comment out the next two lines to use suggested fee
	params.fee = 1000;
	params.flatFee = true;

	// declare onComplete as NoOp
	const onComplete = algosdk.OnApplicationComplete.NoOpOC;

	// create unsigned transaction
	let txn = algosdk.makeApplicationCreateTxn(
		sender,
		params,
		onComplete,
		timestamp_program,
		opt_out_program,
		0, // local integers
		0, // local byteslices
		1, // global integers
		0, // global byteslices
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
	const appId = transactionResponse["application-index"];
	console.log("Created new app-id: ", appId);

	setTimeout(async () => {
		try {
			// goal app call --app-id {APPID} --app-arg "str:vote" --app-arg "str:candidatea" --from {ACCOUNT}  --out=unsignedtransaction1.tx
			let txn = algosdk.makeApplicationNoOpTxnFromObject({
				from: sender,
				suggestedParams: params,
				appIndex: appId,
			});

			let signedTxn = txn.signTxn(creatorAccount.sk);

			let sentTxn = await algodClient.sendRawTransaction(signedTxn).do();
			console.log("Transaction : " + sentTxn.txId);

			// Wait for transaction to be confirmed
			await waitForConfirmation(algodClient, sentTxn.txId);
		} catch (err) {
			console.log(err);
		}
	}, 15000);
	return res.send({
		appId,
	});
};
