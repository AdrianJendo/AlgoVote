import React, { useContext } from "react";
import { Paper } from "@mui/material";
import { styled } from "@mui/system";

import { VoteInfoContext } from "context/VoteInfoContext";
import CreateVoteStepper from "components/createWorkflow/CreateVoteStepper";
import SelectParticipants from "components/createWorkflow/SelectParticipants";
import SelectCandidates from "components/createWorkflow/SelectCandidates";
import DatePicker from "components/createWorkflow/DatePicker";
import ReviewDetails from "components/createWorkflow/ReviewDetails";
import Payment from "components/createWorkflow/Payment";

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

const CreateVoteWorkflow = () => {
	const voteInfo = useContext(VoteInfoContext)[0];

	const earliestStartDate = new Date(); // earliest start date is today
	return (
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
					{voteInfo.activeStep === 0 && <SelectParticipants />}
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
									voteInfo.startDate.getFullYear() + 7,
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
	);
};

export default CreateVoteWorkflow;
