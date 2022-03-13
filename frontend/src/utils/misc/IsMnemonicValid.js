const isMnemonicValid = (str) => {
	const mnemonicArr = str.split(" ");
	return (
		mnemonicArr.length === 25 &&
		mnemonicArr[24] !== "" &&
		!mnemonicArr.some((word) => word.includes("\n")) // make sure there are no newline characters in the secret key
	); // check that number of words in mnemonic is 25
};

export default isMnemonicValid;
