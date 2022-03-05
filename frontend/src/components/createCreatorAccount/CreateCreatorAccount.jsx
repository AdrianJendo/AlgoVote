import React, { useState } from "react";
import { Button, Typography, Paper, Link } from "@mui/material";
import { styled } from "@mui/system";
import CopyTextBox from "components/base/CopyTextBox";
import * as XLSX from "xlsx";
import axios from "axios";
import decodeURIMnemonic from "utils/misc/DecodeMnemonic";

const ButtonDiv = styled("div")({
	position: "absolute",
	width: "100%",
	margin: "0 auto",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	flexDirection: "column",
});

const BUTTON_MARGIN = 40;

const CreateCreatorAccount = () => {
	const [accountAddr, setAccountAddr] = useState(null);
	const [accountMnemonic, setAccountMnemonic] = useState(null);

	const handleCreateAccount = async () => {
		if (
			accountAddr &&
			!window.confirm(
				"You have just created a new account, are you sure you want to continue?"
			)
		) {
		} else {
			try {
				const resp = await axios.post(
					"/api/algoAccount/createAlgoAccount"
				);
				setAccountAddr(resp.data.accountAddr);
				setAccountMnemonic(
					decodeURIMnemonic(resp.data.accountMnemonic)
				);
			} catch (err) {
				const error = err.response?.data?.message || err.message;
				console.warn(error);
			}
		}
	};

	const exportAccountInfo = () => {
		const wb = XLSX.utils.book_new();

		const ws = XLSX.utils.aoa_to_sheet([
			["Account Address:", ""],
			[accountAddr, ""],
			["", ""],
			["Account Mnemonic:", ""],
			[accountMnemonic, ""],
		]);

		XLSX.utils.book_append_sheet(wb, ws, "");
		XLSX.writeFile(wb, `${accountAddr}.txt`);
	};

	return (
		<Paper
			sx={{
				textAlign: "center",
			}}
		>
			<ButtonDiv>
				<div>
					<Button
						variant="contained"
						onClick={() => handleCreateAccount()}
						sx={{
							marginRight: `${BUTTON_MARGIN}px`,
							marginLeft: `${BUTTON_MARGIN}px`,
							marginTop: "100px",
							marginBottom: "50px",
						}}
					>
						Create New Account
					</Button>
					{accountAddr && accountMnemonic && (
						<Button
							variant="contained"
							onClick={() => exportAccountInfo()}
							sx={{
								marginRight: `${BUTTON_MARGIN}px`,
								marginLeft: `${BUTTON_MARGIN}px`,
								marginTop: "50px",
							}}
						>
							Export as .txt file
						</Button>
					)}
				</div>
				{accountAddr && accountMnemonic && (
					<div>
						<Typography variant="h6">
							Account creation successful! Click{" "}
							<Link
								href="https://bank.testnet.algorand.network/"
								target="_blank"
								underline="hover"
							>
								HERE
							</Link>{" "}
							to add funds.
						</Typography>
						<Typography sx={{ fontSize: 16, paddingTop: "30px" }}>
							<b>Account Address</b>
						</Typography>
						<CopyTextBox width={650} text={accountAddr} />
						<Typography sx={{ fontSize: 16, paddingTop: "30px" }}>
							<b>Secret Key</b>
						</Typography>
						<CopyTextBox width={650} text={accountMnemonic} />
					</div>
				)}
			</ButtonDiv>
		</Paper>
	);
};

export default CreateCreatorAccount;
