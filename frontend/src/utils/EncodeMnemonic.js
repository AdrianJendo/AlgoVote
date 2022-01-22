import CryptoJS from "crypto-js";

const encodeURIMnemonic = (mnemonic) => {
	const encryptedMnemonic = encodeURIComponent(
		CryptoJS.AES.encrypt(
			mnemonic,
			process.env.REACT_APP_ENCRYPTION_KEY
		).toString()
	);
	return encryptedMnemonic;
};

export default encodeURIMnemonic;
