import React from "react";
import { Button, Link } from "@mui/material";
import { styled } from "@mui/system";

const ButtonDiv = styled("div")({
	position: "absolute",
	left: "50%",
	top: "20%",
	transform: "translate(-50%, 0)",
	width: "100%",
	display: "flex",
	flexWrap: "wrap",
	justifyContent: "center"
});

const ChooseOption = () => {
	return (
		<ButtonDiv>
			<Link
				href="/createVote"
				color="inherit"
				sx={{ margin: "20px" }}
				underline="none"
			>
				<Button variant="contained">Create Vote</Button>
			</Link>
			<Link
				href="/participateVote"
				color="inherit"
				sx={{ margin: "20px" }}
				underline="none"
			>
				<Button variant="contained">Participate in Vote</Button>
			</Link>
			<Link
				href="/voteResults"
				color="inherit"
				sx={{ margin: "20px" }}
				underline="none"
			>
				<Button variant="contained">View Vote Results</Button>
			</Link>
			<Link
				href="/createCreatorAccount"
				color="inherit"
				sx={{ margin: "20px" }}
				underline="none"
			>
				<Button variant="contained">Create Testnet Account</Button>
			</Link>
		</ButtonDiv>
	);
};

export default ChooseOption;
