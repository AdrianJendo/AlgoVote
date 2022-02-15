import encodeURIMnemonic from "utils/EncodeMnemonic";
import axios from "axios";

const submitVote = async (participateInfo, setParticipateInfo) => {
	const appId = parseInt(participateInfo.appId);
	const userMnemonic = encodeURIMnemonic(participateInfo.sk);
	setParticipateInfo({ ...participateInfo, voteSubmitted: true });

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
};

export default submitVote;
