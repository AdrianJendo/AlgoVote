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
	});
};

export const cancelParticipate = (setParticipateInfo) => {
	setParticipateInfo({
		voteStarted: false,
		registerOrVote: null,
		activeStep: 0,
		publicKey: "",
		voteAssetId: null,
	});
};
