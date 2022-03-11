import * as React from "react";
import { useNavigate } from "react-router-dom";
import { VoteResultsContext } from "context/VoteResultsContext";
import { cancelVoteResults } from "utils/misc/CancelVote";
import Stepper from "components/base/Stepper";
import lookupVote from "utils/voteResultsWorkflow/LookupVote";

const steps = [
	{
		label: "Enter App Id",
		description: "Enter the app id of the vote you want to view",
	},
	{
		label: "Vote Information",
		description: "View the vote information",
	},
];

export default function VerticalLinearStepper() {
	const [voteResults, setVoteResults] = React.useContext(VoteResultsContext);
	const [readyToContinue, setReadyToContinue] = React.useState(false);
	const navigate = useNavigate();

	React.useEffect(() => {
		if (
			(voteResults.activeStep === 0 &&
				voteResults.appId &&
				!isNaN(voteResults.appId)) ||
			voteResults.activeStep === 1
		) {
			setReadyToContinue(true);
		} else {
			setReadyToContinue(false);
		}
	}, [voteResults]);

	const handleNext = async () => {
		if (voteResults.activeStep === 0) {
			lookupVote(voteResults, setVoteResults);
		} else {
			cancelVoteResults(setVoteResults, navigate);
		}
	};

	const handleBack = () => {
		const activeStep = voteResults.activeStep;
		if (activeStep === 0) {
			cancelVoteResults(setVoteResults, navigate);
		} else {
			setVoteResults({
				...voteResults,
				appId: "",
				activeStep: activeStep - 1,
			});
		}
	};

	return (
		<Stepper
			steps={steps}
			stepInfo={voteResults}
			setStepInfo={setVoteResults}
			handleNext={handleNext}
			handleBack={handleBack}
			readyToContinue={readyToContinue}
		/>
	);
}
