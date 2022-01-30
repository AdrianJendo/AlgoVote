import * as React from "react";
import { ParticipateContext } from "context/ParticipateContext";
import { cancelParticipate } from "utils/CancelVote";
import Stepper from "components/base/Stepper";
import isMnemonicValid from "utils/IsMnemonicValid";

const steps = [
	{
		label: "Register or vote",
		description: "Are you registering or voting?",
	},
	{
		label: "Enter vote information",
		description: "Enter the application id and sk to your voting account",
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
				isMnemonicValid(participateInfo.sk) &&
				participateInfo.appId &&
				!isNaN(participateInfo.appId))
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
