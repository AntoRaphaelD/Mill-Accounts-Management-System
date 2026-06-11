import { Router } from "express";
import * as voucherController from "../controllers/voucherController.js";

const router = Router();

router.post("/vouchers", voucherController.saveVoucher);
router.delete("/vouchers/:id", voucherController.deleteVoucher);
router.post("/reverse-bills", voucherController.saveReverseBill);
router.delete("/reverse-bills/:id", voucherController.deleteReverseBill);

export default router;
