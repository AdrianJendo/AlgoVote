const isMnemonicValid = (str) => {
	const mnemonicArr = str.split(" ");
	return (
		mnemonicArr.length === 25 &&
		mnemonicArr[24] !== "" &&
		!mnemonicArr[24].includes("\n")
	); // check that number of words in mnemonic is 25
};

export default isMnemonicValid;
