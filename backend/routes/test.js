import express from "express";
import {
	getRoute,
	createAccount,
	checkBalance,
	spendAlgo,
	createVoteToken,
	optInToVote,
	toggleFreeze,
	transferAsset,
	revokeToken,
} from "../controllers/test.js";

const router = express.Router();

router.get("/", getRoute);
router.post("/createAccount", createAccount);
router.get("/checkBalance", checkBalance);
router.post("/spendAlgo", spendAlgo);
router.post("/createToken", createVoteToken);
router.post("/optInToVote", optInToVote);
router.post("/toggleFreeze", toggleFreeze);
router.post("/transferAsset", transferAsset);
router.post("/revokeToken", revokeToken);

export default router;
