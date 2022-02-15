import express from "express";
import {
	createVoteSmartContract,
	optInVoteSmartContract,
	submitVote,
	readVoteSmartContractState,
	deleteVoteSmartContract,
	didUserVote,
	registerForVote,
} from "../controllers/smartContracts.js";
const router = express.Router();

router.get("/readVoteSmartContractState", readVoteSmartContractState);
router.get("/didUserVote", didUserVote);

router.post("/createVoteSmartContract", createVoteSmartContract);
router.post("/optInVoteSmartContract", optInVoteSmartContract);
router.post("/submitVote", submitVote);
router.post("/deleteVoteSmartContract", deleteVoteSmartContract);

router.post("/registerForVote", registerForVote);

export default router;
