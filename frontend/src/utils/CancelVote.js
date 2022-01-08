const cancelVote = (setVoteInfo) => {
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

export default cancelVote;
