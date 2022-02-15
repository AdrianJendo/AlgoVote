import axios from "axios";
import encodeURIMnemonic from "utils/EncodeMnemonic";
import * as XLSX from "xlsx";

const MIN_VOTER_BALANCE = 100000 + 100000 + 100000 + 50000 + 10000; // micro algos -> 0.1 algo (min account balance) + 0.1 (to opt in and receive ASA) + 0.1 (to opt in to smart contract) + 0.05 (for 1 local byte slice)

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
			// MIN BALANCE CALCULATION
			// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
			// const creatorAddr = resp.data.addr;
			// creator needs approx. 0.1 algo balance + 0.1 algo for ASA numAccounts * participantMinBalance +
			// 0.001 * numAccounts (send token txn fee) + 0.001 * 2 (create smart contract and ASA fee) +
			// 4 * int + 1 * global vars
			// Figure out these specifics later
			// let creatorMinBalance = 1000000 * (voteInfo.numAccounts + 10);

			// each participant needs 0.1 algo balance + 0.1 algo to opt in to ASA + 0.1 to opt in to smart contract + 0.05 for local byteslice + 0.004 (txn fee to opt in to ASA, send ASA, opt in to smart contract, do smart contract txn)
			// Figure out these specifics later

			// If newAccounts, add cost to fund accounts to creatorMinBalance(use participantData.length)
			// const creatorBalance = await axios.get("/api/algoAccount/checkAlgoBalance", {params:{addr:creatorAddr}})
			// if (voteInfo.accountFundingType === "newAccounts") {
			// console.log("balance", creatorBalance);

			// } else {
			// 	// Else, check that they have enough funds to distribute the tokens and create the smart contract (& vote token)
			// }
			// if(creatorBalance < creatorMinBalance) {
			// 	return false;
			// }

			// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

			// Create vote token
			setProgressBar(0);
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
				}
			);
			const appId = smartContractResp.data.appId;
			const participantAddresses = Object.keys(voteInfo.participantData);
			const candidates = Object.keys(voteInfo.candidateData);
			let participantAccounts;

			if (voteInfo.accountFundingType === "newAccounts") {
				const fundAccountPromises = [];
				const sendTokenPromises = [];
				const optInContractPromises = [];
				participantAccounts = voteInfo.privatePublicKeyPairs;
				// fund new account with minimum balance
				setProgressBar(40);
				for (const accountAddr of participantAddresses) {
					fundAccountPromises.push(
						axios.post("/api/algoAccount/sendAlgo", {
							senderMnemonic: encryptedMnemonic,
							receiver: accountAddr,
							amount: MIN_VOTER_BALANCE,
							message: "",
						})
					);
				}
				await Promise.all(fundAccountPromises);

				// opt in to vote token and voting contract (atomically grouped)
				setProgressBar(60);
				for (const accountAddr of participantAddresses) {
					const accountMnemonic = participantAccounts[accountAddr];
					if (accountMnemonic) {
						optInContractPromises.push(
							axios.post("/api/smartContract/registerForVote", {
								userMnemonic:
									encodeURIMnemonic(accountMnemonic),
								appId,
							})
						);
					}
				}
				await Promise.all(optInContractPromises);

				// send out vote tokens from creator
				setProgressBar(80);
				for (const receiver of participantAddresses) {
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
				}
				await Promise.all(sendTokenPromises);
			} else {
				// Create smart contract to handle registering and sending vote token from creator !!!!!
				// need to store the list of participants in global storage (public keys)
				// need to be able to send vote tokens from creator
				// participants interact with the smart contract to opt into vote token & vote contract (atomically grouped)
				// and then creator sends them a vote token upon success
				//
				//
				// if we can do the above ^, we don't need to change the logic for counting the number of registered voters
				// because the creator will send a vote token for each successful registrant
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
				],
			];

			if (participantAccounts) {
				ws_data[0].push("Secret Key");
			}

			for (
				let i = 0;
				i < Math.max(participantAddresses.length, candidates.length);
				++i
			) {
				const row = ["", "", "", "", ""];

				if (i === 0) {
					row[0] = appId;
					row[1] = assetId;
					row[3] = startVote.toString();
					row[4] = endVote.toString();
				}

				if (i < candidates.length) {
					row[2] = candidates[i];
				}

				if (i < participantAddresses.length) {
					row[5] = participantAddresses[i];
					if (participantAccounts) {
						row[6] = participantAccounts[participantAddresses[i]];
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
