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
export const BTC_ADDR = "bc1q950thswhn6wc2qmrh73y86qjhft86qq3p6gd58";
export const ETH_ADDR = "0x363C4B0973E88C9f016abE6c98f1314b3BF35d8a";
export const ALGO_ADDR =
	"ZGCQ73NMFLN3NWMLFFXTRDVKOKX2C33HTDDK7MVNACCDEOTVMRRA7YAYME";
