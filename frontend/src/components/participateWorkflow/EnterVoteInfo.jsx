import React, { useContext } from "react";
import { TextField, Typography } from "@mui/material";
import { ParticipateContext } from "context/ParticipateContext";

const EnterVoteInfo = () => {
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
				Enter the application id and your secret key below
			</Typography>
			<div
				style={{
					position: "relative",
					alighItems: "center",
					padding: "20px",
				}}
			>
				<TextField
					label="Application Id"
					placeholder="Enter App Id"
					sx={{ width: "200px", margin: "20px" }}
					value={participateInfo.appId}
					onChange={(e) =>
						setParticipateInfo({
							...participateInfo,
							appId: e.target.value,
						})
					}
				/>
				<TextField
					label="Secret Key"
					placeholder="Paste Secret Key"
					multiline
					rows={4}
					sx={{ width: "400px", margin: "20px" }}
					value={participateInfo.sk}
					onChange={(e) =>
						setParticipateInfo({
							...participateInfo,
							sk: e.target.value,
						})
					}
				/>
			</div>
		</div>
	);
};

export default EnterVoteInfo;
