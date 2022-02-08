import encodeURIMnemonic from "utils/EncodeMnemonic";
import axios from "axios";

const submitVote = async (participateInfo, setParticipateInfo) => {
	const appId = parseInt(participateInfo.appId);
	const userMnemonic = encodeURIMnemonic(participateInfo.sk);
	const candidate = participateInfo.selectedCandidate;

	const resp = await axios.post("/api/smartContract/submitVote", {
		userMnemonic,
		appId,
		candidate,
	});

	console.log(resp.data);
};

export default submitVote;
