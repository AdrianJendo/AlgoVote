import React, { useContext } from "react";
import { TextField, Typography } from "@mui/material";
import { ParticipateContext } from "context/ParticipateContext";

const EnterPublicKey = () => {
	const [participateInfo, setParticipateInfo] =
		useContext(ParticipateContext);

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
				Enter your public key below to see eligible votes
			</Typography>
			<div
				style={{
					position: "relative",
					alighItems: "center",
					padding: "20px",
				}}
			>
				<TextField
					label="Public Key"
					placeholder="Paste Public Key"
					sx={{ width: "700px" }}
					value={participateInfo.publicKey}
					onChange={(e) =>
						setParticipateInfo({
							...participateInfo,
							publicKey: e.target.value,
						})
					}
				/>
			</div>
		</div>
	);
};

export default EnterPublicKey;
