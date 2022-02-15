import * as React from "react";
import { ParticipateContext } from "context/ParticipateContext";
import { cancelParticipate } from "utils/CancelVote";
import Stepper from "components/base/Stepper";
import isMnemonicValid from "utils/IsMnemonicValid";
import encodeURIMnemonic from "utils/EncodeMnemonic";
import axios from "axios";

export default function VerticalLinearStepper() {
	const [participateInfo, setParticipateInfo] =
		React.useContext(ParticipateContext);
	const [readyToContinue, setReadyToContinue] = React.useState(false);

	const steps = [
		{
			label: "Register or vote",
			description: "Are you registering or voting?",
		},
		{
			label: "Enter vote information",
			description:
				"Enter the application id and sk to your voting account",
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
			const state = await axios.get(
				"/api/smartContract/readVoteSmartContractState",
				{ params: { appId: participateInfo.appId } }
			);

			const userAccount = await axios.get(
				"/api/algoAccount/getPublicKey",
				{
					params: {
						mnemonic: encodeURIMnemonic(participateInfo.sk),
					},
				}
			);
			const addr = userAccount.data.addr;

			const candidates = [];
			const assetId = state.data.AssetId;
			const voteBegin = state.data.VoteBegin;
			const voteEnd = state.data.VoteEnd;

			for (const key of Object.keys(state.data)) {
				if (
					key === "AssetId" &&
					participateInfo.registerOrVote === "vote"
				) {
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
				} else if (!["Creator", "VoteBegin", "VoteEnd"].includes(key)) {
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
		} else if (
			participateInfo.activeStep === 3 ||
			(participateInfo.activeStep === 2 &&
				participateInfo.registerOrVote === "register")
		) {
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
			cancelParticipate(setParticipateInfo); //cancelling
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
