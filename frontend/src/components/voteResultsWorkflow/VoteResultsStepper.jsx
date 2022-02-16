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
				const assetData = assetResp.data;
				const candidates = {};
				let castedVotes = 0;
				let voteStatus = "register";

				const curBlock = await axios.get(
					"/api/blockchain/blockchainStatus"
				);

				const lastRound = curBlock.data["last-round"];

				if (lastRound > voteData.VoteEnd) {
					voteStatus = "complete";
				} else if (lastRound > voteData.VoteBegin) {
					voteStatus = "vote";
				}

				const creatorAssetBalance = await axios.get(
					"/api/asa/checkAssetBalance",
					{
						params: {
							addr: voteData.Creator,
							assetId: voteData.AssetId,
						},
					}
				);

				let localVoteBegin;
				if (voteStatus !== "register") {
					const voteBegin = await axios.get(
						"/api/blockchain/blockTimestamp",
						{ params: { blockRound: voteData.VoteBegin } }
					);

					localVoteBegin = new Date(voteBegin.data);
				} else {
					localVoteBegin = `Block round is ${voteData.VoteBegin}`;
				}

				const localVoteEnd = `Block round is ${voteData.VoteEnd}`;

				for (const key of Object.keys(voteData)) {
					if (
						![
							"Creator",
							"AssetId",
							"VoteBegin",
							"VoteEnd",
						].includes(key)
					) {
						candidates[key] = voteData[key];
						castedVotes += voteData[key];
					}
				}

				setVoteResults({
					...voteResults,
					activeStep: voteResults.activeStep + 1,
					creator: voteData.Creator,
					creatorAssetBalance: creatorAssetBalance.data.amount,
					voteStatus,
					assetId: voteData.AssetId,
					voteBegin: localVoteBegin.toString(),
					voteEnd: localVoteEnd,
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
