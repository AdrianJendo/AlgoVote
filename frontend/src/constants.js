export const BASE_URL = "https://testnet.algoexplorer.io";
export const TXN_FEE = 1000;
export const MIN_ACCOUNT_BALANCE = 100000;
export const SMART_CONTRACT_BYTESLICE = 50000;
export const SMART_CONTRACT_UINT = 28500;
export const MIN_VOTER_BALANCE =
	MIN_ACCOUNT_BALANCE + // 0.1 algos is minimum account balance
	MIN_ACCOUNT_BALANCE + // 0.1 algos to opt in to ASA
	MIN_ACCOUNT_BALANCE + // 0.1 algos to opt into smart contract
	SMART_CONTRACT_BYTESLICE + // 0.05 algos for smart contract with 1 local byte slice
	TXN_FEE * 4; // 4 * 0.001 algos for txn costs (opt into asset, opt into smart contract, send asset, participate in smart contract)
