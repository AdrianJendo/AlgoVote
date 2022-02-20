import axios from "axios";

export const generateAlgorandAccounts = async (
	numParticipants,
	participantData
) => {
	try {
		const algoAccountPromises = [];
		for (let i = 0; i < numParticipants; i++) {
			algoAccountPromises.push(
				axios.post("/api/algoAccount/createAlgoAccount")
			);
		}
		const algoAccounts = await Promise.all(algoAccountPromises);

		// save accounts
		const accounts = algoAccounts.map((account) => account.data);
		const newParticipantData = {};
		const privatePublicKeyPairs = {};

		for (let i = 0; i < accounts.length; i++) {
			privatePublicKeyPairs[accounts[i].accountAddr] =
				accounts[i].accountMnemonic;
			newParticipantData[accounts[i].accountAddr] =
				participantData[`New Account ${i + 1}`];
		}

		Object.keys(participantData).forEach((account) => {
			if (!account.includes("New Account")) {
				newParticipantData[account] = participantData[account];
			}
		});

		return { newParticipantData, privatePublicKeyPairs };
	} catch (err) {
		const error = err.response?.data?.message || err.message;
		console.warn(error);
		return { error };
	}
};
