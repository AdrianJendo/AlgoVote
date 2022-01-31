export const cancelVote = (setVoteInfo) => {
	setVoteInfo({
		voteStarted: false,
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
		voteStarted: false,
		activeStep: 0,
		registerOrVote: null,
		voteBegin: null,
		voteEnd: null,
		sk: "",
		appId: "",
		assetId: null,
		candidates: [],
	});
};
