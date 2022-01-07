import axios from "axios";
export const generateAlgorandAccounts = async (numAccounts) => {
	const algoAccountPromises = [];
	for (let i = 0; i < numAccounts; i++) {
		algoAccountPromises.push(
			axios.post("/api/algoAccount/createAlgoAccount")
		);
	}
	const algoAccounts = await Promise.all(algoAccountPromises);
	return algoAccounts.map((account) => account.data);
};
