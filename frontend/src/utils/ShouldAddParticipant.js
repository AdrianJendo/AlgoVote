const shouldAddParticipant = (value, voteInfo, dataType) => {
	return (
		value !== "" && // make sure not empty OR
		((value.includes("@") &&
			voteInfo.participantFormat === "email" && // check if it's an email OR
			dataType === "participantData") ||
			(value.match(/^[0-9]+$/) != null &&
				voteInfo.participantFormat === "phone" && // check if it's a phone number OR
				dataType === "participantData") ||
			dataType === "candidateData") // check if its a candidate
	);
};

export default shouldAddParticipant;
