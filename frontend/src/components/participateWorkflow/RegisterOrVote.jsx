import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, ButtonGroup } from "@mui/material";
import { ParticipateContext } from "context/ParticipateContext";
import { FillDiv, buttonGroupSX } from "utils/Style/ParticipantsStyle";
import { typographySX } from "utils/Style/WorkflowStyle";
import { cancelParticipate } from "utils/misc/CancelVote";

const RegisterOrVote = () => {
	const [participateInfo, setParticipateInfo] =
		useContext(ParticipateContext);
	const navigate = useNavigate();

	return (
		<div style={{ position: "relative", height: "100%" }}>
			<Typography sx={typographySX(2)} variant="h5">
				Are you registering for a vote or voting?
			</Typography>

			<FillDiv>
				<Typography sx={typographySX(4)}>
					Select one of the options below
				</Typography>
				<ButtonGroup sx={buttonGroupSX(10)}>
					<Button
						sx={{
							width: 125,
						}}
						variant={
							participateInfo.registerOrVote === "register"
								? "contained"
								: "outlined"
						}
						onClick={() =>
							setParticipateInfo({
								...participateInfo,
								registerOrVote: "register",
							})
						}
					>
						Registering
					</Button>
					<Button
						sx={{
							width: 125,
						}}
						variant={
							participateInfo.registerOrVote === "vote"
								? "contained"
								: "outlined"
						}
						onClick={() =>
							setParticipateInfo({
								...participateInfo,
								registerOrVote: "vote",
							})
						}
					>
						Voting
					</Button>
				</ButtonGroup>
			</FillDiv>
			<ButtonGroup variant="contained" sx={buttonGroupSX(75)}>
				<Button
					onClick={() =>
						cancelParticipate(setParticipateInfo, navigate)
					}
				>
					Cancel
				</Button>
				{participateInfo.registerOrVote && (
					<Button
						onClick={() =>
							setParticipateInfo({
								...participateInfo,
								activeStep: participateInfo.activeStep + 1,
							})
						}
					>
						Next
					</Button>
				)}
			</ButtonGroup>
		</div>
	);
};

export default RegisterOrVote;
