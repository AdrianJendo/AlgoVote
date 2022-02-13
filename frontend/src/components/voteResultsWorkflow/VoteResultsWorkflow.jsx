import React, { useContext } from "react";
import { Paper } from "@mui/material";
import { styled } from "@mui/system";
import { VoteResultsContext } from "context/VoteResultsContext";

// Review vote workflow
import VoteResultsStepper from "components/voteResultsWorkflow/VoteResultsStepper";
import EnterAppId from "components/voteResultsWorkflow/EnterAppId";
import VoteResults from "components/voteResultsWorkflow/VoteResults";

const StepperDiv = styled("div")({
	position: "fixed",
	left: "2%",
	top: "80px",
});

const PaperDiv = styled("div")(
	({ theme }) => `
		height: 100%;
		width: 100%;
		background: ${theme.palette.background.default};
	`
);

const VoteResultsWorkflow = () => {
	const voteResults = useContext(VoteResultsContext)[0];

	return (
		<div style={{ width: "100%", height: "100%" }}>
			<StepperDiv>
				<VoteResultsStepper />
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
					{voteResults.activeStep === 0 && <EnterAppId />}
					{voteResults.activeStep === 1 && <VoteResults />}
				</Paper>
			</PaperDiv>
		</div>
	);
};

export default VoteResultsWorkflow;
