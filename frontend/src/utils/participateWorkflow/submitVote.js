import encodeURIMnemonic from "utils/EncodeMnemonic";
import axios from "axios";

const submitVote = async (participateInfo, setParticipateInfo) => {
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
		voteAccepted: true,
	});

	console.log(resp.data);
	return resp.data;
};

export default submitVote;
