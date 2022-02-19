import axios from "axios";
import encodeURIMnemonic from "utils/EncodeMnemonic";
import * as XLSX from "xlsx";
import {
	MIN_VOTER_BALANCE,
	TXN_FEE,
	MIN_ACCOUNT_BALANCE,
	SMART_CNTRACT_UINT,
} from "constants";

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
			const creatorAddr = resp.data.addr;
			const participantAddresses = Object.keys(voteInfo.participantData);
			const candidates = Object.keys(voteInfo.candidateData);
			const numParticipants = participantAddresses.length;
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
			const newAccountFunding =
				voteInfo.accountFundingType === "newAccounts"
					? (MIN_VOTER_BALANCE + 1000) *
					  Object.keys(voteInfo.privatePublicKeyPairs).length // calculation of funds needed for voters
					: 0; // calculation to fund new accounts

			const MIN_CREATOR_BALANCE =
				MIN_ACCOUNT_BALANCE + // 0.1 algos is minimum account balance
				MIN_ACCOUNT_BALANCE * numASAs + // 0.1 algos for each ASA
				MIN_ACCOUNT_BALANCE * numSmartContracts + // 0.1 algos for each smart contract
				SMART_CNTRACT_UINT * numGlobalUInts + // 0.0285 algos for each global uint in the smart contracts
				TXN_FEE * (2 + numParticipants) + // txn fees to create ASA & smart contract, and send out vote tokens
				newAccountFunding;

			console.log("VALS", creatorBalance.data, MIN_CREATOR_BALANCE); // Delete this after we get some testing done

			if (creatorBalance.data.accountBalance < MIN_CREATOR_BALANCE) {
				setVoteInfo({ ...voteInfo, voteSubmitted: false });
				return false;
			}

			// Create vote token
			setProgressBar(1);
			// Get Supply
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
			const prefundedAccounts = JSON.parse(
				JSON.stringify(voteInfo.participantData)
			); // deep copy of all accounts

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
			if (voteInfo.accountFundingType === "newAccounts") {
				// Logic that allows mixing of public and private addresses
				const newAccountAddresses = Object.keys(
					voteInfo.privatePublicKeyPairs
				);
				newAccountAddresses.forEach((accountAddr) => {
					delete prefundedAccounts[accountAddr];
				});

				const fundAccountPromises = [];
				const optInContractPromises = [];
				newParticipantAccounts = voteInfo.privatePublicKeyPairs;
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
				Object.values(newParticipantAccounts).forEach(
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
			if (Object.keys(prefundedAccounts).length > 0) {
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
				Object.keys(prefundedAccounts).forEach((receiver) => {
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
				XLSX.writeFile(wb, "VoteData.xlsx");
				setProgressBar(100);
				setVoteInfo({ ...voteInfo, voteCreated: true });
			}, 2000);

			return appId;
		} else {
			//failure
			return { error: resp.data };
		}
	} catch (err) {
		console.warn(err.message);
		return err.message;
	}
};

export default submitSecretKey;
