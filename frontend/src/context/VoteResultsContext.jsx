import React, { useState, createContext } from "react";

export const VoteResultsContext = createContext();

export const VoteResultsProvider = (props) => {
	const [voteResults, setVoteResults] = useState({
		workflowStarted: false, // current step of workflow
		activeStep: 0, // current step of workflow

		appId: "",
		creator: null,
		participants: null, // list of recent participants and who they voted for
		voteBegin: null,
		voteEnd: null,
		candidates: null,
		castedVotes: 0, // number of casted votes

		assetId: null,
		assetSupply: 0, // vote token supply
		assetName: "", // name of asset
		assetUnit: "", // unit of asset
	});
	return (
		<VoteResultsContext.Provider value={[voteResults, setVoteResults]}>
			{props.children}
		</VoteResultsContext.Provider>
	);
};
