import { TXN_FEE, MIN_VOTER_BALANCE } from "constants";

const getTxnCost = (numParticipants, newAccounts) => {
	return (
		(TXN_FEE + // cost to create ASA
			TXN_FEE + // cost to create smart contract
			TXN_FEE * numParticipants + // cost to send out tokens
			MIN_VOTER_BALANCE * newAccounts) /
		1e6
	); // get from microalgos to algos
};

export default getTxnCost;
