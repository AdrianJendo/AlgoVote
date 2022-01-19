import React, { useState } from "react";
import { Button, Typography, TextField } from "@mui/material";
// import { VoteInfoContext } from "context/VoteInfoContext";
// import {  } from "utils/AlgoFunctions";
// import HelpIcon from "@mui/icons-material/Help";
// import HelperTooltip from "components/HelperTooltip";
import axios from "axios";
import CryptoJS from "crypto-js";

const Payment = () => {
	const [secretKey, setSecretKey] = useState("");

	const isMnemonicInvalid = (str) => {
		const mnemonicArr = str.split(" ");
		return mnemonicArr.length !== 25 || mnemonicArr[24] === ""; // check that number of words in mnemonic is 25
	};

	const submitSecretKey = async () => {
		// validate that secret key exists
		const encryptedMnemonic = encodeURIComponent(
			CryptoJS.AES.encrypt(
				secretKey,
				process.env.REACT_APP_ENCRYPTION_KEY
			).toString()
		);

		const resp = await axios.get("/api/algoAccount/getPublicKey", {
			params: { mnemonic: encryptedMnemonic },
		});

		if (resp.data.addr) {
			// success

			// If newAccounts, check that the creator has enough funds to cover all the voting accounts (use participantData.length)

			// Else, check that they have enough funds to distribute the tokens and create the smart contract (& vote token)

			// Create vote token (use participantData and numVotes to get supply - different participants might have different numVotes)

			// Create smart contract

			// ^^ Consider some sort of progress bar up to this point

			// If using newAccounts, give the creator the option to disperse funds & opt in to smart contract & opt in to vote tokens (need to disperse funds). Else, do nothing...
			// Done. Can't send out vote tokens or do anything else -> Now participants must opt in to smart contract & vote tokens

			// If using newAccounts, export the secret keys and public keys to excel or something

			return resp.data;
		} else {
			//failure
			return { error: resp.data };
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
		</div>
	);
};

export default Payment;
