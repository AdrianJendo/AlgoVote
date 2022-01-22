import React, { useState, useContext } from "react";
import { Button, Typography, TextField } from "@mui/material";
import { VoteInfoContext } from "context/VoteInfoContext";
// import {  } from "utils/AlgoFunctions";
// import HelpIcon from "@mui/icons-material/Help";
// import HelperTooltip from "components/HelperTooltip";
import axios from "axios";
import encodeURIMnemonic from "utils/EncodeMnemonic";
import * as XLSX from "xlsx";

const MIN_VOTER_BALANCE = 100000 + 100000 + 100000 + 50000 + 10000; // micro algos -> 0.1 algo (min account balance) + 0.1 (to opt in and receive ASA) + 0.1 (to opt in to smart contract) + 0.05 (for 1 local byte slice)

const Payment = () => {
	const [voteInfo, setVoteInfo] = useContext(VoteInfoContext);
	const [voteName, setVoteName] = useState("");
	const [secretKey, setSecretKey] = useState("");

	const isMnemonicInvalid = (str) => {
		const mnemonicArr = str.split(" ");
		return mnemonicArr.length !== 25 || mnemonicArr[24] === ""; // check that number of words in mnemonic is 25
	};

	const submitSecretKey = async () => {
		try {
			// validate that secret key exists
			const encryptedMnemonic = encodeURIMnemonic(secretKey);

			const resp = await axios.get("/api/algoAccount/getPublicKey", {
				params: { mnemonic: encryptedMnemonic },
			});

			if (resp.data.addr) {
				// success

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
				const smartContractResp = await axios.post(
					"/api/smartContract/createVoteSmartContract",
					{
						creatorMnemonic: encryptedMnemonic,
						assetId,
						numCandidates: Object.keys(voteInfo.candidateData)
							.length,
					}
				);

				const appId = smartContractResp.data.appId;

				if (voteInfo.accountFundingType === "newAccounts") {
					const fundAccountPromises = [];
					const optInTokenPromises = [];
					const optInContractPromises = [];
					const participantAddresses = Object.keys(
						voteInfo.participantData
					);
					const participantAccounts = voteInfo.privatePublicKeyPairs;
					// fund new account with minimum balance
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

					// opt in to receive vote token
					for (const accountAddr of participantAddresses) {
						const accountMnemonic =
							participantAccounts[accountAddr];
						optInTokenPromises.push(
							axios.post("/api/asa/optInToAsset", {
								senderMnemonic:
									encodeURIMnemonic(accountMnemonic),
								assetId,
							})
						);
					}
					await Promise.all(optInTokenPromises);

					// opt in to voting contract
					for (const accountAddr of participantAddresses) {
						const accountMnemonic =
							participantAccounts[accountAddr];
						optInContractPromises.push(
							axios.post(
								"/api/smartContract/optInVoteSmartContract",
								{
									userMnemonic:
										encodeURIMnemonic(accountMnemonic),
									appId,
								}
							)
						);
					}
					await Promise.all(optInContractPromises);
					const wb = XLSX.utils.book_new();
					const ws_name = "Vote Data";

					/* make worksheet */
					const ws_data = [
						[
							"Address",
							"Secret Key",
							"Candidates",
							"Vote Start",
							"Vote End",
						],
					];

					const candidates = Object.keys(voteInfo.candidateData);

					for (
						let i = 0;
						i <
						Math.max(
							participantAddresses.length,
							candidates.length
						);
						++i
					) {
						const row = ["", "", "", "", ""];

						if (i < participantAddresses.length) {
							row[0] = participantAddresses[i];
							row[1] =
								participantAccounts[participantAddresses[i]];
						}

						if (i < candidates.length) {
							row[2] = candidates[i];
						}

						if (i === 0) {
							row[3] = voteInfo.startTime.toString();
							row[4] = voteInfo.endTime.toString();
						}
						ws_data.push(row);
					}
					var ws = XLSX.utils.aoa_to_sheet(ws_data);

					/* Add the worksheet to the workbook */
					XLSX.utils.book_append_sheet(wb, ws, ws_name);

					// export to excel
					XLSX.writeFile(wb, "VoteData.xlsx");
				}

				return resp.data;
			} else {
				//failure
				return { error: resp.data };
			}
		} catch (err) {
			console.warn(err.message);
			return err.message;
		}
	};

	return (
		<div
			style={{
				position: "relative",
				height: "100%",
				width: "80%",
				left: "10%",
			}}
		>
			<Typography
				variant="h6"
				component="div"
				sx={{ flexGrow: 1, padding: "10px" }}
			>
				Paste the secret key to the creator's wallet address to create
				the vote
			</Typography>
			<div
				style={{
					position: "relative",
					alighItems: "center",
					padding: "20px",
				}}
			>
				<TextField
					label="Secret Key"
					placeholder="Paste Secret Key"
					multiline
					rows={4}
					sx={{ width: "400px" }}
					value={secretKey}
					onChange={(e) => setSecretKey(e.target.value)}
				/>
			</div>
			<Button
				variant="contained"
				onClick={submitSecretKey}
				sx={{ mt: 1, mr: 1 }}
				disabled={isMnemonicInvalid(secretKey)}
			>
				Submit
			</Button>
			{/* {excelData !== null && (
				<CSVLink data={excelData.data} headers={excelData.headers}>
					Download me
				</CSVLink>
			)} */}
		</div>
	);
};

export default Payment;
