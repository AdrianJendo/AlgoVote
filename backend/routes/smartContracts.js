import express from "express";
import {
	createVoteSmartContract,
	optInVoteSmartContract,
	submitVote,
	deleteVoteSmartContract,
} from "../controllers/smartContracts.js";
const router = express.Router();

router.post("/createVoteSmartContract", createVoteSmartContract);
router.post("/optInVoteSmartContract", optInVoteSmartContract);
router.post("/submitVote", submitVote);
router.post("/deleteVoteSmartContract", deleteVoteSmartContract);

export default router;
