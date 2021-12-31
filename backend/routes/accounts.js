import express from "express";
import {
	createAlgoAccount,
	registerAlgoAccount,
	checkAlgoBalance,
	sendAlgo,
} from "../controllers/accounts.js";
const router = express.Router();

router.post("/createAlgoAccount", createAlgoAccount);
router.post("/registerAlgoAccount", registerAlgoAccount);
router.get("/checkAlgoBalance", checkAlgoBalance);
router.post("/sendAlgo", sendAlgo);

export default router;
