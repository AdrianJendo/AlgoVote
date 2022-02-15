import React, { useContext } from "react";
import { Paper } from "@mui/material";
import { StepperDiv, PaperDiv } from "utils/Style/WorkflowDivs";

// Paricipate workflow
import { ParticipateContext } from "context/ParticipateContext";
import ParticipateVoteStepper from "components/participateWorkflow/ParticipateVoteStepper";
import ReviewAndPay from "components/participateWorkflow/ReviewAndPay";
import SelectCandidate from "components/participateWorkflow/SelectCandidate";
import EnterPublicKey from "components/participateWorkflow/EnterVoteInfo";
import RegisterOrVote from "components/participateWorkflow/RegisterOrVote";

const ParticipateWorkflow = () => {
	const participateInfo = useContext(ParticipateContext)[0];
	return (
		<div style={{ width: "100%", height: "100%" }}>
			<StepperDiv>
				<ParticipateVoteStepper />
			</StepperDiv>
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
					{participateInfo.activeStep === 0 && <RegisterOrVote />}
					{participateInfo.activeStep === 1 && <EnterPublicKey />}
					{participateInfo.activeStep === 2 &&
						participateInfo.RegisterOrVote === "vote" && (
							<SelectCandidate />
						)}
					{(participateInfo.activeStep === 3 ||
						(participateInfo.activeStep === 2 &&
							participateInfo.registerOrVote === "register")) && (
						<ReviewAndPay />
					)}
				</Paper>
			</PaperDiv>
		</div>
	);
};

export default ParticipateWorkflow;
