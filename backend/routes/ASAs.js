import express from "express";
import {
	checkAssetBalance,
	getAssetInfo,
	createVoteAsset,
	optInToAsset,
	transferAsset,
} from "../controllers/ASAs.js";
const router = express.Router();

router.get("/checkAssetBalance", checkAssetBalance);
router.get("/getAssetInfo", getAssetInfo);

router.post("/createVoteAsset", createVoteAsset);
router.post("/optInToAsset", optInToAsset);
router.post("/transferAsset", transferAsset);

export default router;
