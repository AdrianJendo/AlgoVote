import React, { useState, createContext } from "react";

export const ParticipateContext = createContext();

export const ParticipateProvider = (props) => {
	const [participateInfo, setParticipateInfo] = useState({
		voteStarted: false, // checks if workflow has started
		activeStep: 0, // current step of workflow
		registerOrVote: null, // either "register" or "vote"
		voteBegin: null, // vote start block
		voteEnd: null, // vote end block
		sk: "", // secret key of participant
		appId: "", // smart contract application id
		assetId: null, // vote token id
		candidates: [], // list of candidates
		selectedCandidate: "", // selected candidate for vote
	});
	return (
		<ParticipateContext.Provider
			value={[participateInfo, setParticipateInfo]}
		>
			{props.children}
		</ParticipateContext.Provider>
	);
};
