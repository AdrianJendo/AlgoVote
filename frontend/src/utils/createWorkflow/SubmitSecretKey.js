import axios from "axios";
import encodeURIMnemonic from "utils/misc/EncodeMnemonic";
import * as XLSX from "xlsx";
import {
	MIN_VOTER_BALANCE,
	MIN_ACCOUNT_BALANCE,
	SMART_CONTRACT_UINT,
} from "constants";
import getTxnCost from "utils/createWorkflow/GetTxnCost";
import { generateAlgorandAccounts } from "utils/createWorkflow/AlgoFunctions";

const submitSecretKey = async (props) => {
	const { secretKey, voteInfo, setVoteInfo, setProgressBar, voteName } =
		props;

	try {
		setVoteInfo({ ...voteInfo, voteSubmitted: true });

		// get start and end date
		const startVote = new Date(
			voteInfo.startDate.getFullYear(),
			voteInfo.startDate.getMonth(),
			voteInfo.startDate.getDate(),
			voteInfo.startTime.getHours(),
			voteInfo.startTime.getMinutes()
		);

		const endVote = new Date(
			voteInfo.endDate.getFullYear(),
			voteInfo.endDate.getMonth(),
			voteInfo.endDate.getDate(),
			voteInfo.endTime.getHours(),
			voteInfo.endTime.getMinutes()
		);

		// validate that secret key exists
		const encryptedMnemonic = encodeURIMnemonic(secretKey);

		const resp = await axios.get("/api/algoAccount/getPublicKey", {
			params: { mnemonic: encryptedMnemonic },
		});

		if (resp.data.addr) {
			setProgressBar(1);
			const creatorAddr = resp.data.addr;
			const candidates = Object.keys(voteInfo.candidateData);
			const numParticipants = voteInfo.numParticipants;
			const numCandidates = candidates.length;

			// MIN BALANCE CALCULATION
			const creatorBalance = await axios.get(
				"/api/algoAccount/checkAlgoBalance",
				{ params: { addr: creatorAddr } }
			);

			const creatorAssetsAndApps = await axios.get(
				"/api/algoAccount/getAssetsAndApps",
				{
					params: { addr: creatorAddr },
				}
			);

			const numGlobalUInts =
				4 + // AssetId, NumVoters, VoteBegin, and VoteEnd
				numCandidates + // each candidate is global int
				creatorAssetsAndApps.data.smartContractGlobalInts; // every other smart contract made by creator
			const numASAs = creatorAssetsAndApps.data.numASAs; // number of ASAs the creator holds
			const numSmartContracts =
				creatorAssetsAndApps.data.numSmartContracts; // number of smart contracts made by creator

			const MIN_CREATOR_BALANCE =
				MIN_ACCOUNT_BALANCE + // 0.1 algos is minimum account balance
				MIN_ACCOUNT_BALANCE * (1 + numASAs) + // 0.1 algos for each ASA
				MIN_ACCOUNT_BALANCE * (1 + numSmartContracts) + // 0.1 algos for each smart contract
				SMART_CONTRACT_UINT * numGlobalUInts + // 0.0285 algos for each global uint in the smart contracts
				getTxnCost(numParticipants, voteInfo.numNewAccounts);

			if (creatorBalance.data.accountBalance < MIN_CREATOR_BALANCE) {
				return {
					error: `Your balance (${
						creatorBalance.data.accountBalance / 10e6
					} Algos) is less than the minimum balance of ${
						MIN_CREATOR_BALANCE / 10e6
					} Algos`,
				};
			}

			// Create vote token
			let numVoteTokens = 0;
			Object.values(voteInfo.participantData).map((numVotes) => {
				numVoteTokens += numVotes;
				return 1;
			});

			const tokenResp = await axios.post("/api/asa/createVoteAsset", {
				creatorMnemonic: encryptedMnemonic,
				numIssued: numVoteTokens,
				assetName: voteName === "" ? `Algo Vote Token` : voteName,
			});
			const assetId = tokenResp.data.assetId;
			const preFundedAccounts =
				voteInfo.accountFundingType === "preFundedAccounts"
					? JSON.parse(JSON.stringify(voteInfo.participantData))
					: {}; // deep copy of all accounts

			// Create smart contract
			setProgressBar(20);
			const smartContractResp = await axios.post(
				"/api/smartContract/createVoteSmartContract",
				{
					creatorMnemonic: encryptedMnemonic,
					assetId,
					candidates: JSON.stringify(
						Object.keys(voteInfo.candidateData)
					),
					startVote: startVote.toString(),
					endVote: endVote.toString(),
					numVoters: numParticipants,
				}
			);
			const appId = smartContractResp.data.appId;
			let newParticipantAccounts;

			const sendTokenPromises = [];
			if (
				voteInfo.accountFundingType === "newAccounts" &&
				voteInfo.numNewAccounts > 0
			) {
				// Generate new accounts
				const { newParticipantData, privatePublicKeyPairs } =
					await generateAlgorandAccounts(
						voteInfo.numNewAccounts,
						voteInfo.participantData
					);

				voteInfo.participantData = newParticipantData;
				const newAccountAddresses = Object.keys(privatePublicKeyPairs);

				// Logic that allows mixing of public and private addresses
				Object.keys(voteInfo.participantData).forEach((accountAddr) => {
					if (!privatePublicKeyPairs[accountAddr]) {
						preFundedAccounts[accountAddr] =
							voteInfo.participantData[accountAddr];
					}
				});

				const fundAccountPromises = [];
				const optInContractPromises = [];
				newParticipantAccounts = privatePublicKeyPairs;
				// fund new account with minimum balance
				setProgressBar(40);
				newAccountAddresses.forEach((accountAddr) => {
					fundAccountPromises.push(
						axios.post("/api/algoAccount/sendAlgo", {
							senderMnemonic: encryptedMnemonic,
							receiver: accountAddr,
							amount: MIN_VOTER_BALANCE,
							message: "",
						})
					);
				});
				await Promise.all(fundAccountPromises);

				// opt in to vote token and voting contract (atomically grouped)
				setProgressBar(60);
				Object.values(privatePublicKeyPairs).forEach(
					(accountMnemonic) => {
						optInContractPromises.push(
							axios.post("/api/smartContract/registerForVote", {
								userMnemonic:
									encodeURIMnemonic(accountMnemonic),
								appId,
							})
						);
					}
				);

				await Promise.all(optInContractPromises);

				// send out vote tokens from creator
				setProgressBar(80);
				newAccountAddresses.forEach((receiver) => {
					const amount = voteInfo.participantData[receiver];
					const senderMnemonic = encryptedMnemonic;
					sendTokenPromises.push(
						axios.post("/api/asa/transferAsset", {
							senderMnemonic,
							receiver,
							assetId,
							amount,
						})
					);
				});
				await Promise.all(sendTokenPromises);
			} else {
				setProgressBar(80);
			}
			if (Object.keys(preFundedAccounts).length > 0) {
				// Create asset transfer txns but send it in the future when the vote starts
				const today = new Date();
				const startVoteUTC = Date.UTC(
					startVote.getUTCFullYear(),
					startVote.getUTCMonth(),
					startVote.getUTCDate(),
					startVote.getUTCHours(),
					startVote.getUTCMinutes(),
					startVote.getUTCSeconds()
				);
				const startVoteSecs = Math.round((startVoteUTC - today) / 1000);

				// send out vote tokens from creator
				const amounts = [];
				const receivers = [];
				const senderMnemonic = encryptedMnemonic;
				Object.keys(preFundedAccounts).forEach((receiver) => {
					amounts.push(voteInfo.participantData[receiver]);
					receivers.push(receiver);
				});
				await axios.post("/api/asa/delayedTransferAsset", {
					senderMnemonic,
					assetId,
					receivers: JSON.stringify(receivers),
					amounts: JSON.stringify(amounts),
					secsToTxn: startVoteSecs,
				});
			}

			// export to excel
			setProgressBar(99);
			const wb = XLSX.utils.book_new();
			const ws_name = "Vote Data";

			/* make worksheet */
			// columns
			const ws_data = [
				[
					"Application ID",
					"Token ID",
					"Candidates",
					"Vote Start",
					"Vote End",
					"Participant Address",
					"Number of Votes",
				],
			];

			if (newParticipantAccounts) {
				ws_data[0].push("Secret Key");
			}

			const participantAddresses = Object.keys(voteInfo.participantData);
			for (let i = 0; i < Math.max(numParticipants, numCandidates); ++i) {
				const row = ["", "", "", "", ""];

				if (i === 0) {
					row[0] = appId;
					row[1] = assetId;
					row[3] = startVote.toString();
					row[4] = endVote.toString();
				}

				if (i < numCandidates) {
					row[2] = candidates[i];
				}

				if (i < numParticipants) {
					row[5] = participantAddresses[i];
					row[6] = voteInfo.participantData[participantAddresses[i]];
					if (newParticipantAccounts) {
						row[7] =
							newParticipantAccounts[participantAddresses[i]] ||
							"";
					}
				}

				ws_data.push(row);
			}
			var ws = XLSX.utils.aoa_to_sheet(ws_data);
			/* Add the worksheet to the workbook */
			XLSX.utils.book_append_sheet(wb, ws, ws_name);

			setTimeout(() => {
				const today = new Date();
				XLSX.writeFile(
					wb,
					`VoteData-${today.getFullYear()}-${today.getMonth()}-${today.getDate()}.xlsx`
				);
				setProgressBar(100);
				setVoteInfo({ ...voteInfo, voteCreated: true });
			}, 2000);

			return appId;
		} else {
			return { error: resp.data };
		}
	} catch (err) {
		const error = err.response?.data?.message || err.message;
		console.warn(error);
		setVoteInfo({ ...voteInfo, voteSubmitted: false });
		return { error };
	}
};

export default submitSecretKey;
