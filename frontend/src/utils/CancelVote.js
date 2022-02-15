export const cancelVote = (setVoteInfo) => {
	setVoteInfo({
		activeStep: 0,
		accountFundingType: null,
		participantUploadMethod: null,
		participantUploadType: null,
		participantData: null,
		privatePublicKeyPairs: null,
		numAccounts: 0,
		candidateUploadMethod: null,
		candidateUploadType: null,
		candidateData: null,
		startDate: null,
		startTime: null,
		endDate: null,
		endTime: null,
		voteSubmitted: false,
		voteCreated: false,
	});
};

export const cancelParticipate = (setParticipateInfo) => {
	setParticipateInfo({
		activeStep: 0,
		registerOrVote: null,
		voteBegin: null,
		voteEnd: null,
		sk: "",
		appId: "",
		assetId: null,
		candidates: [],
		selectedCandidate: "",
		voteSubmitted: false,
		txId: null,
	});
};

export const cancelVoteResults = (setVoteResults) => {
	setVoteResults({
		activeStep: 0,
		voteStatus: null,
		appId: "",
		creator: null,
		creatorAssetBalance: null,
		assetId: null,
		participants: null,
		voteBegin: null,
		voteEnd: null,
		candidates: null,
		castedVotes: 0,
		assetSupply: 0,
		assetName: "",
		assetUnit: "",
	});
};
