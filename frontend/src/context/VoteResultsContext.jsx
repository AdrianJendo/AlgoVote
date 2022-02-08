import React, { useState, createContext } from "react";

export const VoteResultsContext = createContext();

export const VoteResultsProvider = (props) => {
	const [voteResults, setVoteResults] = useState({
		workflowStarted: false, // current step of workflow
		activeStep: 0, // current step of workflow

		appId: null,
		assetId: null,
		participants: null,
		candidates: null,
		startVote: null,
		endVote: null,
	});
	return (
		<VoteResultsContext.Provider value={[voteResults, setVoteResults]}>
			{props.children}
		</VoteResultsContext.Provider>
	);
};
