import express from "express";
import {
	createVoteAsset,
	checkAssetBalance,
	optInToAsset,
	transferAsset,
} from "../controllers/ASAs.js";
const router = express.Router();

router.post("/createVoteAsset", createVoteAsset);
router.get("/checkAssetBalance", checkAssetBalance);
router.post("/optInToAsset", optInToAsset);
router.post("/transferAsset", transferAsset);

export default router;
