export const getAlgoBalance = async (algodClient, accountAddr) => {
	//Check your balance
	let accountInfo = await algodClient.accountInformation(accountAddr).do();
	let accountBalance = accountInfo.amount;
	return accountBalance;
};
