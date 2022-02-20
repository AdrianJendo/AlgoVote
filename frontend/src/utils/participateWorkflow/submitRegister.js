import encodeURIMnemonic from "utils/EncodeMnemonic";
import axios from "axios";

const submitRegister = async (participateInfo, setParticipateInfo) => {
	setParticipateInfo({ ...participateInfo, voteSubmitted: true });
	try {
		const appId = parseInt(participateInfo.appId);
		const userMnemonic = encodeURIMnemonic(participateInfo.sk);

		const resp = await axios.post("/api/smartContract/registerForVote", {
			userMnemonic,
			appId,
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

export default submitRegister;
