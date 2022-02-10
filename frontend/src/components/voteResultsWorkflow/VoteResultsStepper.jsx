import * as React from "react";
import { VoteResultsContext } from "context/VoteResultsContext";
import { cancelVoteResults } from "utils/CancelVote";
import Stepper from "components/base/Stepper";
import axios from "axios";

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
	}, [voteResults, setVoteResults]);

	const handleNext = async () => {
		if (voteResults.activeStep === 0) {
			try {
				const voteResp = await axios.get(
					"/api/smartContract/readVoteSmartContractState",
					{ params: { appId: voteResults.appId } }
				);
				const voteData = voteResp.data;
				const assetResp = await axios.get("/api/asa/getAssetInfo", {
					params: { assetId: voteData.AssetId },
				});
				const assetData = assetResp.data;
				const candidates = [];
				for (const key of Object.keys(voteData)) {
					if (
						![
							"Creator",
							"AssetId",
							"VoteBegin",
							"VoteEnd",
						].includes(key)
					) {
						candidates.push({ [key]: voteData[key] });
					}
				}
				setVoteResults({
					...voteResults,
					activeStep: voteResults.activeStep + 1,
					creator: voteData.Creator,
					assetId: voteData.AssetId,
					voteBegin: voteData.VoteBegin,
					voteEnd: voteData.VoteEnd,
					candidates,
					assetSupply: assetData.params.total,
					assetName: assetData.params.name,
					assetUnit: assetData.params["unit-name"],
				});
			} catch (err) {
				alert(err.message);
			}
		} else {
			cancelVoteResults(setVoteResults);
		}
	};

	const handleBack = () => {
		const activeStep = voteResults.activeStep;
		if (activeStep === 0) {
			cancelVoteResults(setVoteResults); //cancelling
		} else {
			setVoteResults({
				...voteResults,
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
			cancelStepper={cancelVoteResults}
		/>
	);
}
