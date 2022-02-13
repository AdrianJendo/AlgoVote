import React from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

const ButtonDiv = styled("div")({
	position: "absolute",
	left: "50%",
	top: "20%",
	transform: "translate(-50%, 0)",
});

const ChooseOption = () => {
	const navigate = useNavigate();

	const changeRoute = (route) => {
		navigate(route);
	};
	return (
		<ButtonDiv>
			<Button
				variant="contained"
				onClick={() => changeRoute("/createVote")}
				sx={{ margin: "5px" }}
			>
				Create Vote
			</Button>
			<Button
				variant="contained"
				onClick={() => changeRoute("/participateVote")}
				sx={{ margin: "5px" }}
			>
				Participate in Vote
			</Button>
			<Button
				variant="contained"
				onClick={() => changeRoute("/voteResults")}
				sx={{ margin: "5px" }}
			>
				View Vote Results
			</Button>
		</ButtonDiv>
	);
};

export default ChooseOption;
