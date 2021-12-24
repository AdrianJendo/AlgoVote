import express from "express";
import { getRoute } from "../controllers/test.js";

const router = express.Router();

router.get("/", getRoute);

export default router;
