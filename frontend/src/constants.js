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
export const MINUTES_DELAY = 5; // delay in minutes
export const DELAY = (MINUTES_DELAY - 1) * 60 * 1000; // minutes (use delay of 5 minutes) - actually 4 but we round to the nearest minutes so this is effectively 5 for any validation
