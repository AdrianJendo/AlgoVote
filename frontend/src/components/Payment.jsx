import React, { useState } from "react";
import { Button, Typography, TextField } from "@mui/material";
// import { VoteInfoContext } from "context/VoteInfoContext";
// import {  } from "utils/AlgoFunctions";
// import HelpIcon from "@mui/icons-material/Help";
// import HelperTooltip from "components/HelperTooltip";

const Payment = () => {
	const [secretKey, setSecretKey] = useState("");

	const isMnemonicValid = (str) => {
		console.log(str, str.split(" "), str.split(" ").length);
		return str.split(" ").length !== 25; // check that number of words in mnemonic is 25
	};

	const submitSecretKey = async () => {
		// validate that secret key exists

		return true;
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
				disabled={isMnemonicValid(secretKey)}
			>
				Submit
			</Button>
		</div>
	);
};

export default Payment;
