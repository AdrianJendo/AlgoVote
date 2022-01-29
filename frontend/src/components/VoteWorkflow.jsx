import React, { useContext } from "react";
import { Button, Paper } from "@mui/material";
import { styled } from "@mui/system";
import { VoteInfoContext } from "context/VoteInfoContext";
import { ParticipateContext } from "context/ParticipateContext";
import CreateVoteStepper from "components/CreateVoteStepper";
import ParticipateVoteStepper from "components/ParticipateVoteStepper";
import SelectParticipants from "components/SelectParticipants";
import SelectCandidates from "components/SelectCandidates";
import DatePicker from "components/DatePicker";
import ReviewDetails from "components/ReviewDetails";
import Payment from "components/Payment";

// Paricipate workflow
import ReviewAndPay from "components/participateWorkflow/ReviewAndPay";
import SelectVote from "components/participateWorkflow/SelectVote";
import SelectCandidate from "components/participateWorkflow/SelectCandidate";
import EnterPublicKey from "components/participateWorkflow/EnterPublicKey";
import RegisterOrVote from "components/participateWorkflow/RegisterOrVote";

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
							{voteInfo.activeStep === 0 && <RegisterOrVote />}
							{voteInfo.activeStep === 1 && <EnterPublicKey />}
							{voteInfo.activeStep === 2 && <SelectVote />}
							{voteInfo.activeStep === 3 && <SelectCandidate />}
							{voteInfo.activeStep === 4 && <ReviewAndPay />}
						</Paper>
					</PaperDiv>
				</div>
			)}
			{!voteInfo.voteStarted && !participateInfo.voteStarted && (
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
				</ButtonDiv>
			)}
		</StyledBackground>
	);
};

export default VoteWorkflow;
