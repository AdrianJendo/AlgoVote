export const getAlgoBalance = async (algodClient, accountAddr) => {
	//Check your balance
	let accountInfo = await algodClient.accountInformation(accountAddr).do();
	console.log("Account balance: %d microAlgos", accountInfo.amount);
	let accountBalance = accountInfo.amount;
	return accountBalance;
};
