import encodeURIMnemonic from "utils/misc/EncodeMnemonic";
import axios from "axios";

const submitVote = async (participateInfo, setParticipateInfo) => {
	try {
		const appId = parseInt(participateInfo.appId);
		const userMnemonic = encodeURIMnemonic(participateInfo.sk);
		const candidate = participateInfo.selectedCandidate;
		setParticipateInfo({ ...participateInfo, voteSubmitted: true });

		const resp = await axios.post("/api/smartContract/submitVote", {
			userMnemonic,
			appId,
			candidate,
		});

		setParticipateInfo({
			...participateInfo,
			voteSubmitted: true,
			txId: resp.data.txId,
		});

		return resp.data;
	} catch (err) {
		const error = err.response?.data?.message || err.message;
		console.warn(error);
		setParticipateInfo({ ...participateInfo, voteSubmitted: false });
		return { error };
	}
};

export default submitVote;
