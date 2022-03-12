import React, { useEffect } from "react";
import { VoteInfoContext } from "context/VoteInfoContext";
import { cancelVote } from "utils/misc/CancelVote";
import { DateValueContext } from "context/DateValueContext";
import { MINUTES_DELAY, DELAY } from "constants";
import isSameDate from "utils/createWorkflow/IsSameDate";
import Stepper from "components/base/Stepper";
import { useNavigate } from "react-router-dom";
import getTxnCost from "utils/createWorkflow/GetTxnCost";

export default function VerticalLinearStepper() {
	const [voteInfo, setVoteInfo] = React.useContext(VoteInfoContext);
	const dateValue = React.useContext(DateValueContext)[0];
	const [readyToContinue, setReadyToContinue] = React.useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (
			(voteInfo.activeStep === 0 &&
				voteInfo.participantData &&
				Object.keys(voteInfo.participantData).length) ||
			(voteInfo.activeStep === 1 && voteInfo.candidateData) ||
			(voteInfo.activeStep === 2 && !dateValue.error) ||
			(voteInfo.activeStep === 3 && !dateValue.error) ||
			voteInfo.activeStep === 4 ||
			voteInfo.voteCreated
		) {
			setReadyToContinue(true);
		} else {
			setReadyToContinue(false);
		}
	}, [voteInfo, dateValue]);

	const steps = [
		{
			label: "Select Voting Participants",
			description: "Select who will be participating in your vote.",
		},
		{
			label: "Specify Vote Options",
			description: "Select the possible candidates for the vote.",
		},
		{
			label: "Specify Start Date",
			description: "Choose when your vote will start.",
		},
		{
			label: "Specify End Date",
			description: "Choose when your vote will end.",
		},
		{
			label: "Review Details",
			description:
				"Review the details of this transaction and click 'Continue'.",
		},
		{
			label: "Payment & Title",
			description: `A txn fee of ${
				getTxnCost(voteInfo.numParticipants, voteInfo.numNewAccounts) /
				1e6
			} Algos is required to create the vote. Add a title and make the payment to finalize this application.`,
		},
	];

	const handleNext = () => {
		if (voteInfo.activeStep === 2) {
			// Start date stuff
			if (
				!isSameDate(dateValue.value, new Date()) ||
				dateValue.timeValue - new Date(new Date().getTime() + DELAY) > 0
			) {
				setVoteInfo({
					...voteInfo,
					activeStep: voteInfo.activeStep + 1,
					startDate: dateValue.value,
					startTime: new Date(dateValue.timeValue.setSeconds(0)),
				});
			} else {
				alert(
					`Update start time or date to be ${MINUTES_DELAY} minutes after the current time`
				);
			}
		} else if (voteInfo.activeStep === 3) {
			// End date stuff
			if (
				(isSameDate(dateValue.value, new Date()) &&
					(dateValue.timeValue -
						new Date(new Date().getTime() + DELAY) <
						0 ||
						dateValue.timeValue -
							new Date(voteInfo.startTime.getTime() + DELAY) <
							0)) || // check if the date is today and we are choosing a time in the past or too early
				(isSameDate(dateValue.value, voteInfo.startDate) &&
					dateValue.timeValue -
						new Date(voteInfo.startTime.getTime() + DELAY) <
						0)
			) {
				alert(
					`Update end time or date to be ${MINUTES_DELAY} minutes after the start time`
				);
			} else {
				setVoteInfo({
					...voteInfo,
					activeStep: voteInfo.activeStep + 1,
					endDate: dateValue.value,
					endTime: new Date(dateValue.timeValue.setSeconds(0)),
				});
			}
		} else if (voteInfo.activeStep === 5) {
			cancelVote(setVoteInfo, navigate);
		} else {
			setVoteInfo({
				...voteInfo,
				activeStep: voteInfo.activeStep + 1,
			});
		}
	};

	const handleBack = () => {
		const activeStep = voteInfo.activeStep;
		if (activeStep === 0) {
			cancelVote(setVoteInfo, navigate);
		} else {
			setVoteInfo({ ...voteInfo, activeStep: activeStep - 1 });
		}
	};

	return (
		<Stepper
			steps={steps}
			stepInfo={voteInfo}
			setStepInfo={setVoteInfo}
			handleNext={handleNext}
			handleBack={handleBack}
			readyToContinue={readyToContinue}
		/>
	);
}
