import React, { useState, createContext } from "react";

export const VoteInfoContext = createContext();

export const VoteInfoProvider = (props) => {
	const [voteInfo, setVoteInfo] = useState({
		voteStarted: false,
		format: null,
		method: null,
		uploadType: null,
	});
	return (
		<VoteInfoContext.Provider value={[voteInfo, setVoteInfo]}>
			{props.children}
		</VoteInfoContext.Provider>
	);
};
