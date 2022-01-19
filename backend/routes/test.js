import express from "express";
import {
	getRoute,
	votingWorkflow,
	encryptMnemonic,
} from "../controllers/test.js";
const router = express.Router();

router.get("/", getRoute);
router.get("/encryptMnemonic", encryptMnemonic);

router.post("/votingWorkflow", votingWorkflow);

export default router;
