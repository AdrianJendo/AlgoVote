import React, { useContext } from "react";
import { Button, Paper } from "@mui/material";
import { styled } from "@mui/system";
import { VoteInfoContext } from "context/VoteInfoContext";
import VerticalLinearStepper from "components/Stepper";
import SelectParticipants from "components/SelectParticipants";
import SelectCandidates from "components/SelectCandidates";
import DatePicker from "components/DatePicker";
import ReviewDetails from "components/ReviewDetails";

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

const StyledBackground = styled("div")(
	({ theme }) => `
		height: 100%;
		background: ${theme.palette.background.paper};
	`
);

const VoteWorkflow = () => {
	const [voteInfo, setVoteInfo] = useContext(VoteInfoContext);

	const earliestDate = new Date();

	return (
		<StyledBackground>
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
						{voteInfo.activeStep === 2 && (
							<DatePicker
								earliestDate={earliestDate}
								selectedDate={voteInfo.startDate}
								endDate={
									new Date(
										earliestDate.getFullYear() + 7,
										earliestDate.getMonth(),
										earliestDate.getDate()
									)
								}
								label="Start Date"
								timeLabel="Start Time"
							/>
						)}
						{voteInfo.activeStep === 3 && (
							<DatePicker
								earliestDate={voteInfo.startDate}
								selectedDate={voteInfo.endDate}
								startTime={voteInfo.startTime}
								endDate={
									new Date(
										voteInfo.startDate.getFullYear() + 7,
										voteInfo.startDate.getMonth(),
										voteInfo.startDate.getDate()
									)
								}
								label="End Date"
								timeLabel="End Time"
							/>
						)}
						{voteInfo.activeStep === 4 && <ReviewDetails />}
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
		</StyledBackground>
	);
};

export default VoteWorkflow;
