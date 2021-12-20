import React, { useContext } from "react";
import { Button, Paper } from "@mui/material";
import { styled } from "@mui/system";
import { VoteInfoContext } from "context/VoteInfoContext";
import VerticalLinearStepper from "components/Stepper";
import SelectParticipants from "components/SelectParticipants";
import SelectCandidates from "components/SelectCandidates";

const ButtonDiv = styled("div")(
	() => `
		position: absolute;
		left: 50%;
		top: 20%;
	`
);

const StepperDiv = styled("div")(
	() => `
		position:absolute;
		left: 2%;
		top: 80px;
	`
);

const PaperDiv = styled("div")(
	({ theme }) => `
		height: 100%;
		width: 100%;
		background: ${theme.palette.background.default};
	`
);

const VoteWorkflow = () => {
	const [voteInfo, setVoteInfo] = useContext(VoteInfoContext);

	return (
		<div style={{ height: "100%" }}>
			{voteInfo.voteStarted && (
				<StepperDiv>
					<VerticalLinearStepper />
				</StepperDiv>
			)}
			{voteInfo.voteStarted ? (
				<PaperDiv>
					<Paper
						sx={{
							position: "relative",
							height: "100%",
							width: "80%",
							left: "20%",
							textAlign: "center",
						}}
					>
						{voteInfo.activeStep === 0 && <SelectParticipants />}
						{voteInfo.activeStep === 1 && <SelectCandidates />}
					</Paper>
				</PaperDiv>
			) : (
				<ButtonDiv>
					<Button
						variant="contained"
						onClick={() =>
							setVoteInfo({ ...voteInfo, voteStarted: true })
						}
					>
						Create vote
					</Button>
				</ButtonDiv>
			)}
		</div>
	);
};

export default VoteWorkflow;
