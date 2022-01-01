import express from "express";
import { getRoute, votingWorkflow } from "../controllers/test.js";
const router = express.Router();

router.get("/", getRoute);

router.post("/votingWorkflow", votingWorkflow);

export default router;
