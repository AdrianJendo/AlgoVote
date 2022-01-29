import React, { useState, createContext } from "react";

export const ParticipateContext = createContext();

export const ParticipateProvider = (props) => {
	const [participateInfo, setParticipateInfo] = useState({
		voteStarted: false, // checks if workflow has started
		activeStep: 0, // current step of workflow

		participantPublicKey: null,
		voteAssetId: null, // vote token id
	});
	return (
		<ParticipateContext.Provider
			value={[participateInfo, setParticipateInfo]}
		>
			{props.children}
		</ParticipateContext.Provider>
	);
};