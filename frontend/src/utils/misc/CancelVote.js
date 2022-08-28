export const cancelVote = (setVoteInfo, navigate = null) => {
  if (navigate) {
    navigate("/");
  }

  setVoteInfo({
    activeStep: 0,
    accountFundingType: null,
    participantUploadMethod: null,
    participantUploadType: null,
    participantData: null,
    numParticipants: 0,
    numNewAccounts: 0,
    candidateUploadMethod: null,
    candidateUploadType: null,
    candidateData: null,
    startDate: null,
    endDate: null,
    voteSubmitted: false,
    voteCreated: false,
  });
};

export const cancelParticipate = (setParticipateInfo, navigate = null) => {
  if (navigate) {
    navigate("/");
  }

  setParticipateInfo({
    activeStep: 0,
    registerOrVote: null,
    voteTitle: "",
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

export const cancelVoteResults = (setVoteResults, navigate = null) => {
  if (navigate) {
    navigate("/");
  }

  setVoteResults({
    activeStep: 0,
    voteStatus: null,
    appId: "",
    creator: null,
    numRegistered: null,
    numVoters: null,
    numVoted: null,
    assetId: null,
    participants: null,
    voteTitle: "",
    voteBegin: null,
    voteEnd: null,
    candidates: null,
    assetSupply: 0,
    assetName: "",
    assetUnit: "",
  });
};
