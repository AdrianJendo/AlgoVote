import React, { useState, createContext } from "react";

export const VoteInfoContext = createContext();

export const VoteInfoProvider = (props) => {
	const [voteInfo, setVoteInfo] = useState({
		activeStep: 0, // current step of workflow

		accountFundingType: null, // pre-funded or existing account
		// contactParticipantMethod: null,
		participantUploadMethod: null, // Upload file or manual
		participantUploadType: null, // csv/text or excel (for file)
		participantData: null, // uploaded partipcant data
		numAccounts: 0, // number of accounts
		privatePublicKeyPairs: null, // if accountFundingType === newAccounts, then we keep track of public-private-keys which are needed for voting

		candidateUploadMethod: null, // Upload file or manual
		candidateUploadType: null, // csv/text or excel (for file)
		candidateData: null, // uploaded candidate data

		startDate: null, // start date of vote
		startTime: null, // start time of vote
		endDate: null, // end date of vote
		endTime: null, // start time of vote

		voteSubmitted: false, // set to true when payment is made
		voteCreated: false, // set to true when payment is successful
	});
	return (
		<VoteInfoContext.Provider value={[voteInfo, setVoteInfo]}>
			{props.children}
		</VoteInfoContext.Provider>
	);
};
