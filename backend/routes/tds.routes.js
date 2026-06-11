import express from "express";
import { getAllTds, saveTdsRecord, deleteTdsRecord } from "../controllers/tds.controller.js";

const router = express.Router();

router.get("/", getAllTds);
router.post("/", saveTdsRecord);
router.delete("/:code", deleteTdsRecord);

export default router;