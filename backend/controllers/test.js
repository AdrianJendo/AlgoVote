import algosdk from "algosdk";
import { algodClient, __dirname } from "../server.js";
import axios from "axios";
import { pollingDelay } from "../helpers/misc.js";

const NUM_VOTERS = 4;
const NUM_CANDIDATES = 2;
const MIN_BALANCE = 1000000 + 100000 + 100000 + 50000; // micro algos -> 0.1 algo (min account balance) + 0.1 (to opt in and receive ASA) + 0.1 (to opt in to smart contract) + 0.05 (for 1 local byte slice)
// note that the creator has a higher minimum balance because it is responsible for the global varaibles
// the local byteslice variable is only responsible for keeping track on whether the account has voted or not

export const getRoute = (req, res) => {
	res.send([{ some: "jsondata", get: "this is get route" }]);
};

export const votingWorkflow = async (req, res) => {
	// variables
	const creatorMnemonic = req.body.creatorMnemonic;
	const creatorAccount = algosdk.mnemonicToSecretKey(creatorMnemonic);
	const voteTokenName = req.body.voteTokenName;
	const voters = [];
	const candidates = ["candidatea", "candidateb"];
	let assetId;
	let appId;
	let startBlock;
	let voteResp;

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
		for (let i = 0; i < NUM_VOTERS; i++) {
			// create new account
			const newAccount = await axios.post(
				"http://localhost:5001/algoAccount/createAlgoAccount"
			);
			const accountAddr = newAccount.data.accountAddr;
			const accountMnemonic = newAccount.data.accountMnemonic;

			// fund new account with minimum balance
			await axios.post("http://localhost:5001/algoAccount/sendAlgo", {
				senderMnemonic: algosdk.secretKeyToMnemonic(creatorAccount.sk),
				receiver: accountAddr,
				amount: MIN_BALANCE,
				message: "",
			});

			// opt in to receive vote token
			await axios.post("http://localhost:5001/asa/optInToAsset", {
				senderMnemonic: accountMnemonic,
				assetId,
			});

			// receive vote token
			await axios.post("http://localhost:5001/asa/transferAsset", {
				senderMnemonic: creatorMnemonic,
				receiver: accountAddr,
				amount: 1,
				assetId,
			});

			// opt in to voting contract
			await axios.post(
				"http://localhost:5001/smartContract/optInVoteSmartContract",
				{
					userMnemonic: accountMnemonic,
					appId,
				}
			);

			voters.push({ accountAddr, accountMnemonic });
		}
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
		await pollingDelay();
	} while (curBlock < startBlock);

	// vote
	try {
		for (let i = 0; i < NUM_VOTERS; i++) {
			voteResp = await axios.post(
				"http://localhost:5001/smartContract/submitVote",
				{
					userMnemonic: voters[i].accountMnemonic,
					appId,
					candidate:
						Math.random() < 0.5 ? candidates[0] : candidates[1],
					assetId,
					receiver: creatorAccount.addr,
					amount: 1,
				}
			);
		}
	} catch (err) {
		console.log(err);
		return res.send({ phase: 3, err });
	}

	// delete smart contract when vote ends
	try {
		await axios.post(
			"http://localhost:5001/smartContract/deleteVoteSmartContract",
			{
				creatorMnemonic,
				appId,
			}
		);
	} catch (err) {
		console.log(err);
		return res.send({ phase: 4, err });
	}

	return res.send(voteResp);
};
