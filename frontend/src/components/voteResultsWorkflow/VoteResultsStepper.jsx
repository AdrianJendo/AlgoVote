import * as React from "react";
import { VoteResultsContext } from "context/VoteResultsContext";
import { cancelVoteResults } from "utils/CancelVote";
import Stepper from "components/base/Stepper";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
				const assetData = assetResp.data.assetData;
				const assetBalances = assetResp.data.assetBalances;
				const creator = voteData.Creator;
				let numRegistered = 0;
				assetBalances.forEach((assetBalance) => {
					if (assetBalance.address !== creator) {
						numRegistered++;
					}
				});
				const candidates = {};
				let castedVotes = 0;
				let voteStatus = "register";

				const today = new Date();
				const curTimeUTC =
					Date.UTC(
						today.getUTCFullYear(),
						today.getUTCMonth(),
						today.getUTCDate(),
						today.getUTCHours(),
						today.getUTCMinutes(),
						today.getUTCSeconds()
					) / 1000;

				if (curTimeUTC > voteData.VoteEnd) {
					voteStatus = "complete";
				} else if (curTimeUTC > voteData.VoteBegin) {
					voteStatus = "vote";
				}

				const voteBegin = new Date(voteData.VoteBegin * 1000);
				const voteEnd = new Date(voteData.VoteEnd * 1000);

				Object.keys(voteData).forEach((key) => {
					if (
						![
							"Creator",
							"AssetId",
							"VoteBegin",
							"VoteEnd",
							"NumVoters",
						].includes(key)
					) {
						candidates[key] = voteData[key];
						castedVotes += voteData[key];
					}
				});

				setVoteResults({
					...voteResults,
					activeStep: voteResults.activeStep + 1,
					creator,
					numRegistered,
					numVoters: voteData.NumVoters,
					voteStatus,
					assetId: voteData.AssetId,
					voteBegin: voteBegin.toString(),
					voteEnd: voteEnd.toString(),
					candidates,
					castedVotes,
					assetSupply: assetData.params.total,
					assetName: assetData.params.name,
					assetUnit: assetData.params["unit-name"],
				});
			} catch (err) {
				alert("Invalid App Id");
			}
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
