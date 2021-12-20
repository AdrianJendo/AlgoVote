import React, { useState, createContext } from "react";

export const VoteInfoContext = createContext();

export const VoteInfoProvider = (props) => {
	const [voteInfo, setVoteInfo] = useState({
		voteStarted: false,
		participantFormat: null,
		participantMethod: null,
		participantUploadType: null,
		candidateMethod: null,
		candidateUploadType: null,
		participantData: null,
		candidateData: null,
		startDate: null,
		endDate: null,
		paymentReceived: false,
		confirmed: false,
		activeStep: 0,
	});
	return (
		<VoteInfoContext.Provider value={[voteInfo, setVoteInfo]}>
			{props.children}
		</VoteInfoContext.Provider>
	);
};
