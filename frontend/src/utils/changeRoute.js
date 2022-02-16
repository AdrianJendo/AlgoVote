import * as cancelVote from "utils/CancelVote";

const changeRoute = (
	navigate,
	route,
	setVoteInfo = null,
	setParticipateInfo = null,
	setVoteResults = null
) => {
	if (route === "/" && setVoteInfo && setParticipateInfo && setVoteResults) {
		cancelVote.cancelVote(setVoteInfo, navigate);
		cancelVote.cancelParticipate(setParticipateInfo);
		cancelVote.cancelVoteResults(setVoteResults);
	} else {
		navigate(route);
	}
};

export default changeRoute;
