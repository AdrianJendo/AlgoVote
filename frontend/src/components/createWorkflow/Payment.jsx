import React, { useState, useContext } from "react";
import { Button, Typography, TextField } from "@mui/material";
import { VoteInfoContext } from "context/VoteInfoContext";
import ProgressBar from "components/createWorkflow/ProgressBar";
import { cancelVote } from "utils/CancelVote";
import submitSecretKey from "utils/SubmitSecretKey";

const Payment = () => {
	const [voteInfo, setVoteInfo] = useContext(VoteInfoContext);
	const voteName = useState("")[0];
	const [secretKey, setSecretKey] = useState("");
	const [progressBar, setProgressBar] = useState(null);

	const isMnemonicInvalid = (str) => {
		const mnemonicArr = str.split(" ");
		return mnemonicArr.length !== 25 || mnemonicArr[24] === ""; // check that number of words in mnemonic is 25
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
				onClick={() =>
					submitSecretKey({
						secretKey,
						voteInfo,
						setVoteInfo,
						setProgressBar,
						voteName,
					})
				}
				sx={{ mt: 1, mr: 1 }}
				disabled={isMnemonicInvalid(secretKey) || progressBar !== null}
			>
				Submit
			</Button>
			{progressBar !== null && (
				<div style={{ padding: "50px" }}>
					{progressBar < 100 ? (
						<ProgressBar value={progressBar} />
					) : (
						<div>
							<Typography
								sx={{ marginBottom: "20px" }}
								variant="h5"
							>
								Vote successfully created. Return to home
							</Typography>
							<Button
								variant="contained"
								onClick={() => cancelVote(setVoteInfo)}
							>
								Return to Home
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default Payment;
