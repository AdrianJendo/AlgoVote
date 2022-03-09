import encodeURIMnemonic from "utils/misc/EncodeMnemonic";
import axios from "axios";

const lookupVote = async (participateInfo, setParticipateInfo) => {
	try {
		const state = await axios.get(
			"/api/smartContract/readVoteSmartContractState",
			{ params: { appId: participateInfo.appId } }
		);

		const userAccount = await axios.get("/api/algoAccount/getPublicKey", {
			params: {
				mnemonic: encodeURIMnemonic(participateInfo.sk),
			},
		});
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
			} else if (
				!["Creator", "VoteBegin", "VoteEnd", "NumVoters"].includes(key)
			) {
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
	} catch (err) {
		alert("Invalid app id");
	}
};

export default lookupVote;
