const shouldAddPerson = (value, dataType) => {
	return (
		value !== "" && // make sure not empty AND
		((value.length === 58 && // make sure address is correct length
			true) || // call api to check if the address is valid)
			dataType === "candidateData") // check if its a candidate
	);
};

export default shouldAddPerson;
