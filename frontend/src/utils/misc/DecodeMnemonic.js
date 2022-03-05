import CryptoJS from "crypto-js";

const decodeURIMnemonic = (mnemonic) => {
	const decryptedMnemonic = CryptoJS.AES.decrypt(
		decodeURIComponent(mnemonic),
		process.env.REACT_APP_DATA_ENCRYPTION_KEY
	).toString(CryptoJS.enc.Utf8);
	return decryptedMnemonic;
};

export default decodeURIMnemonic;
