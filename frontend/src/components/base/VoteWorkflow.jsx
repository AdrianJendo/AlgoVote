import React, { useContext } from "react";
import { Button, Paper } from "@mui/material";
import { styled } from "@mui/system";
import { VoteInfoContext } from "context/VoteInfoContext";
import { ParticipateContext } from "context/ParticipateContext";
import { VoteResultsContext } from "context/VoteResultsContext";

// Create workflow
import CreateVoteStepper from "components/createWorkflow/CreateVoteStepper";
import SelectParticipants from "components/createWorkflow/SelectParticipants";
import SelectCandidates from "components/createWorkflow/SelectCandidates";
import DatePicker from "components/createWorkflow/DatePicker";
import ReviewDetails from "components/createWorkflow/ReviewDetails";
import Payment from "components/createWorkflow/Payment";

// Paricipate workflow
import ParticipateVoteStepper from "components/participateWorkflow/ParticipateVoteStepper";
import ReviewAndPay from "components/participateWorkflow/ReviewAndPay";
import SelectCandidate from "components/participateWorkflow/SelectCandidate";
import EnterPublicKey from "components/participateWorkflow/EnterVoteInfo";
import RegisterOrVote from "components/participateWorkflow/RegisterOrVote";

// Review vote workflow
import VoteResultsStepper from "components/voteResultsWorkflow/VoteResultsStepper";
import EnterAppId from "components/voteResultsWorkflow/EnterAppId";
import VoteResults from "components/voteResultsWorkflow/VoteResults";

const ButtonDiv = styled("div")({
	position: "absolute",
	left: "50%",
	top: "20%",
	transform: "translate(-50%, 0)",
});

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

const StyledBackground = styled("div")(
	({ theme }) => `
		height: 100%;
		background: ${theme.palette.background.paper};
		overflow-y: hidden;
	`
);

const VoteWorkflow = () => {
	const [voteInfo, setVoteInfo] = useContext(VoteInfoContext);
	const [participateInfo, setParticipateInfo] =
		useContext(ParticipateContext);
	const [voteResults, setVoteResults] = useContext(VoteResultsContext);

	const earliestStartDate = new Date(); // earliest start date is today
	return (
		<StyledBackground>
			{voteInfo.voteStarted && (
				<div style={{ width: "100%", height: "100%" }}>
					<StepperDiv>
						<CreateVoteStepper />
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
							{voteInfo.activeStep === 0 && (
								<SelectParticipants />
							)}
							{voteInfo.activeStep === 1 && <SelectCandidates />}
							{voteInfo.activeStep === 2 && (
								<DatePicker
									earliestDate={earliestStartDate}
									selectedDate={voteInfo.startDate}
									selectedTime={voteInfo.startTime}
									endDate={
										new Date(
											new Date().getFullYear() + 7,
											new Date().getMonth(),
											new Date().getDate()
										)
									}
									label="Start"
								/>
							)}
							{voteInfo.activeStep === 3 && (
								<DatePicker
									earliestDate={voteInfo.startDate}
									earliestTime={voteInfo.startTime}
									selectedDate={voteInfo.endDate}
									selectedTime={voteInfo.endTime}
									endDate={
										new Date(
											voteInfo.startDate.getFullYear() +
												7,
											voteInfo.startDate.getMonth(),
											voteInfo.startDate.getDate()
										)
									}
									label="End"
								/>
							)}
							{voteInfo.activeStep === 4 && <ReviewDetails />}
							{voteInfo.activeStep === 5 && <Payment />}
						</Paper>
					</PaperDiv>
				</div>
			)}
			{participateInfo.voteStarted && (
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
							{participateInfo.activeStep === 0 && (
								<RegisterOrVote />
							)}
							{participateInfo.activeStep === 1 && (
								<EnterPublicKey />
							)}
							{participateInfo.activeStep === 2 && (
								<SelectCandidate />
							)}
							{participateInfo.activeStep === 3 && (
								<ReviewAndPay />
							)}
						</Paper>
					</PaperDiv>
				</div>
			)}
			{voteResults.workflowStarted && (
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
			)}
			{!voteInfo.voteStarted &&
				!participateInfo.voteStarted &&
				!voteResults.workflowStarted && (
					<ButtonDiv>
						<Button
							variant="contained"
							onClick={() =>
								setVoteInfo({ ...voteInfo, voteStarted: true })
							}
							sx={{ margin: "5px" }}
						>
							Create Vote
						</Button>
						<Button
							variant="contained"
							onClick={() =>
								setParticipateInfo({
									...participateInfo,
									voteStarted: true,
								})
							}
							sx={{ margin: "5px" }}
						>
							Participate in Vote
						</Button>
						<Button
							variant="contained"
							onClick={() =>
								setVoteResults({
									...voteResults,
									workflowStarted: true,
								})
							}
							sx={{ margin: "5px" }}
						>
							View Vote Results
						</Button>
					</ButtonDiv>
				)}
		</StyledBackground>
	);
};

export default VoteWorkflow;
