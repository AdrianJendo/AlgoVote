import React, { useContext } from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/system";
import { VoteInfoContext } from "context/VoteInfoContext";
import { ParticipateContext } from "context/ParticipateContext";
import { VoteResultsContext } from "context/VoteResultsContext";
import changeRoute from "utils/misc/ChangeRoute";
import { useNavigate } from "react-router-dom";

const ButtonDiv = styled("div")({
	position: "absolute",
	left: "50%",
	top: "20%",
	transform: "translate(-50%, 0)",
});

const ChooseOption = () => {
	const navigate = useNavigate();
	const setVoteInfo = useContext(VoteInfoContext)[1];
	const setParticipateInfo = useContext(ParticipateContext)[1];
	const setVoteResults = useContext(VoteResultsContext)[1];

	const nav = (route) => {
		changeRoute(
			navigate,
			route,
			setVoteInfo,
			setParticipateInfo,
			setVoteResults
		);
	};

	return (
		<ButtonDiv>
			<Button
				variant="contained"
				onClick={() => nav("/createVote")}
				sx={{ margin: "5px" }}
			>
				Create Vote
			</Button>
			<Button
				variant="contained"
				onClick={() => nav("/participateVote")}
				sx={{ margin: "5px" }}
			>
				Participate in Vote
			</Button>
			<Button
				variant="contained"
				onClick={() => nav("/voteResults")}
				sx={{ margin: "5px" }}
			>
				View Vote Results
			</Button>
		</ButtonDiv>
	);
};

export default ChooseOption;
