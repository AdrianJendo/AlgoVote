import express from "express";
import {
	createAlgoAccount,
	checkAlgoBalance,
	sendAlgo,
	getPublicKey,
} from "../controllers/accounts.js";
const router = express.Router();

router.post("/createAlgoAccount", createAlgoAccount);
router.post("/sendAlgo", sendAlgo);

router.get("/checkAlgoBalance", checkAlgoBalance);
router.get("/getPublicKey", getPublicKey);

export default router;
