import express from "express";
import {
	getRoute,
	votingWorkflow,
	encryptMnemonic,
	timestampTest,
} from "../controllers/test.js";
const router = express.Router();

router.get("/", getRoute);
router.get("/encryptMnemonic", encryptMnemonic);

router.post("/votingWorkflow", votingWorkflow);
router.post("/timestampTest", timestampTest);

export default router;
