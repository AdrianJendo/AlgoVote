import express from "express";
import { blockchainStatus, blockTimestamp } from "../controllers/blockchain.js";
const router = express.Router();

router.get("/blockchainStatus", blockchainStatus);
router.get("/blockTimeStamp", blockTimestamp);

export default router;
