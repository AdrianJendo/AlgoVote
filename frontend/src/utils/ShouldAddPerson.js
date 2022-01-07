const shouldAddPerson = (value, voteInfo, dataType) => {
	return (
		value !== "" && // make sure not empty AND
		((value.length === 58 && // make sure address is correct length
			true) || // call api to check if the address is valid)
			dataType === "candidateData") // check if its a candidate
	);

	// return (
	// 	value !== "" && // make sure not empty OR
	// 	((value.includes("@") &&
	// 		voteInfo.participantFormat === "email" && // check if it's an email OR
	// 		dataType === "participantData") ||
	// 		(value.match(/^[0-9]+$/) != null &&
	// 			voteInfo.participantFormat === "phone" && // check if it's a phone number OR
	// 			dataType === "participantData") ||
	// 		dataType === "candidateData") // check if its a candidate
	// );
};

export default shouldAddPerson;
