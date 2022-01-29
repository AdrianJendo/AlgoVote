import * as React from "react";
import { ParticipateContext } from "context/ParticipateContext";
import { cancelParticipate } from "utils/CancelVote";
import isPublicKeyValid from "utils/participate/IsPublicKeyValid";
import Stepper from "components/base/Stepper";

const steps = [
	{
		label: "Register or vote",
		description: "Are you registering or voting?",
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
		if (
			(participateInfo.activeStep === 0 &&
				participateInfo.registerOrVote) ||
			(participateInfo.activeStep === 1 &&
				isPublicKeyValid(participateInfo.publicKey))
		) {
			setReadyToContinue(true);
		} else {
			setReadyToContinue(false);
		}
	}, [participateInfo, setParticipateInfo]);

	const handleNext = () => {
		setParticipateInfo({
			...participateInfo,
			activeStep: participateInfo.activeStep + 1,
		});
	};

	const handleBack = () => {
		const activeStep = participateInfo.activeStep;
		if (activeStep === 0) {
			//cancelling
			cancelParticipate(setParticipateInfo);
		} else if (activeStep === 1) {
			setParticipateInfo({
				...participateInfo,
				registerOrVote: null,
				activeStep: activeStep - 1,
			});
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
			handleBack={handleBack}
			readyToContinue={readyToContinue}
			cancelStepper={cancelParticipate}
		/>
	);
}
