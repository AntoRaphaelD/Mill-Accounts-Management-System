import { Router } from "express";
import * as taxController from "../controllers/taxController.js";

const router = Router();

router.post("/", taxController.saveServiceTax);
router.delete("/:code", taxController.deleteServiceTax);

export default router;
