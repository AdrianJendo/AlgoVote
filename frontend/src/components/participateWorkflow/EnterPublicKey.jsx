import React, { useContext } from "react";
import { Typography } from "@mui/material";
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
				Header
			</Typography>
		</div>
	);
};

export default EnterPublicKey;
