import React, { useState, createContext } from "react";

export const ParticipateContext = createContext();

export const ParticipateProvider = (props) => {
	const [participateInfo, setParticipateInfo] = useState({
		activeStep: 0, // current step of workflow
		registerOrVote: null, // either "register" or "vote"
		voteTitle: "",
		voteBegin: null, // vote start UTC time
		voteEnd: null, // vote end UTC time
		sk: "", // secret key of participant
		appId: "", // smart contract application id
		assetId: null, // vote token id
		candidates: [], // list of candidates
		selectedCandidate: "", // selected candidate for vote
		voteSubmitted: false, // true when vote/register transaction submitted
		txId: null, // txn id of vote / register txn
	});
	return (
		<ParticipateContext.Provider
			value={[participateInfo, setParticipateInfo]}
		>
			{props.children}
		</ParticipateContext.Provider>
	);
};
