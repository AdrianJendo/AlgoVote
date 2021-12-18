import React from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/system";

const ButtonDiv = styled("div")(
	({ theme }) => `
		position: absolute;
		left: 50%;
		top: 20%;
	`
);

const StartVote = () => {
	return (
		<ButtonDiv>
			<Button variant="contained">Create vote</Button>
		</ButtonDiv>
	);
};

export default StartVote;
