import express from "express";
import {
	checkAssetBalance,
	getAssetInfo,
	createVoteAsset,
	optInToAsset,
	transferAsset,
	delayedTransferAsset,
} from "../controllers/ASAs.js";
const router = express.Router();

router.get("/checkAssetBalance", checkAssetBalance);
router.get("/getAssetInfo", getAssetInfo);

router.post("/createVoteAsset", createVoteAsset);
router.post("/optInToAsset", optInToAsset);
router.post("/transferAsset", transferAsset);
router.post("/delayedTransferAsset", delayedTransferAsset);

export default router;
