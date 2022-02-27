import * as React from "react";
import { useNavigate } from "react-router-dom";
import { ParticipateContext } from "context/ParticipateContext";
import { cancelParticipate } from "utils/misc/CancelVote";
import Stepper from "components/base/Stepper";
import isMnemonicValid from "utils/misc/IsMnemonicValid";
import lookupVote from "utils/participateWorkflow/lookupVote";

export default function VerticalLinearStepper() {
	const [participateInfo, setParticipateInfo] =
		React.useContext(ParticipateContext);
	const [readyToContinue, setReadyToContinue] = React.useState(false);
	const navigate = useNavigate();

	const steps = [
		{
			label: "Register or vote",
			description: "Are you registering or voting?",
		},
		{
			label: "Enter vote information",
			description:
				"Enter the application id and secret key to your voting account",
		},
	];

	if (participateInfo.registerOrVote === "vote") {
		steps.push({
			label: "Choose your candidate",
			description: "Select the candidate you would like to vote for.",
		});
	}

	steps.push({
		label: "Review & Pay",
		description:
			"Review the details of this transaction and click 'Confirm' to pay the transaction fees.",
	});

	React.useEffect(() => {
		if (
			(participateInfo.activeStep === 0 &&
				participateInfo.registerOrVote) ||
			(participateInfo.activeStep === 1 &&
				isMnemonicValid(participateInfo.sk) &&
				participateInfo.appId &&
				!isNaN(participateInfo.appId)) ||
			(participateInfo.activeStep === 2 &&
				participateInfo.selectedCandidate !== "") ||
			participateInfo.txId
		) {
			setReadyToContinue(true);
		} else {
			setReadyToContinue(false);
		}
	}, [participateInfo, setParticipateInfo]);

	const handleNext = async () => {
		if (participateInfo.activeStep === 1) {
			lookupVote(participateInfo, setParticipateInfo);
		} else if (
			participateInfo.activeStep === 3 ||
			(participateInfo.activeStep === 2 &&
				participateInfo.registerOrVote === "register")
		) {
			cancelParticipate(setParticipateInfo, navigate);
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
			cancelParticipate(setParticipateInfo, navigate);
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
		/>
	);
}
