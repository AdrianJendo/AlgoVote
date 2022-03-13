import axios from "axios";

const lookupVote = async (voteResults, setVoteResults) => {
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
		const numVoted = assetResp.data.numVoted;
		const creator = voteData.Creator;
		let numRegistered = 0;
		assetBalances.forEach((assetBalance) => {
			if (assetBalance.address !== creator) {
				numRegistered++;
			}
		});
		const candidates = {};
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
					"VoteTitle",
					"NumVoters",
				].includes(key)
			) {
				candidates[key] = voteData[key];
			}
		});

		setVoteResults({
			...voteResults,
			activeStep:
				voteResults.activeStep === 0
					? voteResults.activeStep + 1
					: voteResults.activeStep,
			creator,
			numRegistered,
			numVoters: voteData.NumVoters,
			numVoted,
			voteStatus,
			assetId: voteData.AssetId,
			voteTitle: voteData.VoteTitle,
			voteBegin: voteBegin.toString(),
			voteEnd: voteEnd.toString(),
			candidates,
			assetSupply: assetData.params.total,
			assetName: assetData.params.name,
			assetUnit: assetData.params["unit-name"],
		});
		return true;
	} catch (err) {
		alert("Invalid app id");
		return false;
	}
};

export default lookupVote;
