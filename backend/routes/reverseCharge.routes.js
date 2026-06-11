import express from "express";
import { getAllReverseCharges, saveReverseCharge, deleteReverseCharge } from "../controllers/reverseCharge.controller.js";

const router = express.Router();

router.get("/", getAllReverseCharges);
router.post("/", saveReverseCharge);
router.delete("/:code", deleteReverseCharge);

export default router;