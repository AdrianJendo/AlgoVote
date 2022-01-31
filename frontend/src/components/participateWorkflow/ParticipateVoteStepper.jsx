import * as React from "react";
import { ParticipateContext } from "context/ParticipateContext";
import { cancelParticipate } from "utils/CancelVote";
import Stepper from "components/base/Stepper";
import isMnemonicValid from "utils/IsMnemonicValid";
import encodeURIMnemonic from "utils/EncodeMnemonic";
import axios from "axios";

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
				!isNaN(participateInfo.appId)) ||
			(participateInfo.activeStep === 2 &&
				participateInfo.selectedCandidate !== "")
		) {
			setReadyToContinue(true);
		} else {
			setReadyToContinue(false);
		}
	}, [participateInfo, setParticipateInfo]);

	const handleNext = async () => {
		if (participateInfo.activeStep === 1) {
			const state = await axios.get(
				"/api/smartContract/readVoteSmartContractState",
				{ params: { appId: participateInfo.appId } }
			);

			const candidates = [];
			let assetId;
			let voteBegin;
			let voteEnd;

			for (const key of Object.keys(state.data)) {
				if (key === "AssetId") {
					assetId = state.data[key];

					const userAccount = await axios.get(
						"/api/algoAccount/getPublicKey",
						{
							params: {
								mnemonic: encodeURIMnemonic(participateInfo.sk),
							},
						}
					);
					const addr = userAccount.data.addr;
					const assetBalance = await axios.get(
						"/api/asa/checkAssetBalance",
						{
							params: {
								addr,
								assetId,
							},
						}
					);

					if (!assetBalance.data) {
						alert("You do not hold the vote token for this vote.");
						return;
					} else if (assetBalance.data.amount < 1) {
						alert(
							"You cannot participate in this vote with a vote token balance of 0."
						);
						return;
					}
				} else if (key === "VoteBegin") {
					voteBegin = state.data[key];
				} else if (key === "VoteEnd") {
					voteEnd = state.data[key];
				} else if (key !== "Creator") {
					candidates.push(key);
				}
			}

			setParticipateInfo({
				...participateInfo,
				voteBegin,
				voteEnd,
				assetId,
				candidates,
				activeStep: participateInfo.activeStep + 1,
			});
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
