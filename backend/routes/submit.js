import express from "express";
import { getRoute, postRoute } from "../controllers/submit.js";

const router = express.Router();

router.get("/", getRoute);
router.post("/", postRoute);

export default router;
