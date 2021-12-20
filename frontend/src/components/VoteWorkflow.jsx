import React, { useContext } from "react";
import { Button, Paper } from "@mui/material";
import { styled } from "@mui/system";
import { VoteInfoContext } from "context/VoteInfoContext";
import VerticalLinearStepper from "components/Stepper";
import SelectParticipants from "components/SelectParticipants";
import SelectCandidates from "components/SelectCandidates";
import DatePicker from "components/DatePicker";

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

	const earliestDate = new Date();

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
							/>
						)}
						{voteInfo.activeStep === 3 && (
							<DatePicker
								earliestDate={voteInfo.startDate}
								selectedDate={voteInfo.endDate}
								endDate={
									new Date(
										voteInfo.startDate.getFullYear() + 7,
										voteInfo.startDate.getMonth(),
										voteInfo.startDate.getDate()
									)
								}
								label="End Date"
							/>
						)}
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
