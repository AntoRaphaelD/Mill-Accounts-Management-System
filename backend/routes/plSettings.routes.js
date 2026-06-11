import express from "express";
import { getAllPlSettings, savePlSetting, deletePlSetting } from "../controllers/plSettings.controller.js";

const router = express.Router();

router.get("/", getAllPlSettings);
router.post("/", savePlSetting);
router.delete("/:id", deletePlSetting);

export default router;