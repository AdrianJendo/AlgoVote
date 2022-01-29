import * as React from "react";
import { ParticipateContext } from "context/ParticipateContext";
import { cancelParticipate } from "utils/CancelVote";
import Stepper from "components/Base/Stepper";

const steps = [
	{
		label: "Register or vote",
		description: "Are you registering for a vote or voting?",
	},
	{
		label: "Enter public key",
		description: "Enter your public key to see all your eligible votes.",
	},
	{
		label: "Choose a vote",
		description: "Choose an eligible vote to participate in.",
	},
	{
		label: "Choose your candidate",
		description: "Select the candidate you would like to vote for.",
	},
	{
		label: "Review & Pay",
		description:
			"Review the details of this transaction and enter your private key to pay the transaction fees.",
	},
];

export default function VerticalLinearStepper() {
	const [participateInfo, setParticipateInfo] =
		React.useContext(ParticipateContext);
	const [readyToContinue, setReadyToContinue] = React.useState(false);

	React.useEffect(() => {
		if (true) {
			setReadyToContinue(true);
		} else {
			setReadyToContinue(false);
		}
	}, [participateInfo]);

	const handleNext = () => {
		if (false) {
		} else if (participateInfo.activeStep === 5) {
			cancelParticipate(setParticipateInfo);
		} else {
			setParticipateInfo({
				...participateInfo,
				activeStep: participateInfo.activeStep + 1,
			});
		}
	};

	const handleBack = () => {
		const activeStep = participateInfo.activeStep;
		if (activeStep === 0) {
			//cancelling
			cancelParticipate(setParticipateInfo);
		} else {
			setParticipateInfo({
				...participateInfo,
				activeStep: activeStep - 1,
			});
		}
	};

	return (
		<Stepper
			steps={steps}
			stepInfo={participateInfo}
			setStepInfo={setParticipateInfo}
			handleNext={handleNext}
			readyToContinue={readyToContinue}
			handleBack={handleBack}
			cancelStepper={cancelParticipate}
		/>
	);
}
