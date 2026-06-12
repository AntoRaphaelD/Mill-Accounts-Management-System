import { Router } from "express";
import authRoutes from "./authRoutes.js";
import masterRoutes from "./masterRoutes.js";
import voucherRoutes from "./voucherRoutes.js";
import reportRoutes from "./reportRoutes.js";
import taxRoutes from "./taxRoutes.js";
import tdsRoutes from "./tds.routes.js";
import plSettingsRoutes from "./plSettings.routes.js";
import bsMainGroupRoutes from "./bsMainGroup.routes.js";
import bsGroupRoutes from "./bsGroup.routes.js";
import reverseChargeRoutes from "./reverseCharge.routes.js";
import billWiseOpeningRoutes from "./billWiseOpening.routes.js";
import contraEntryRoutes from "./contraEntry.routes.js";
import taxFormRoutes from "./taxForm.routes.js";

const router = Router();

router.use(authRoutes);
router.use(masterRoutes);
router.use(voucherRoutes);
router.use(reportRoutes);
router.use("/tds", tdsRoutes);
router.use("/servicetax", taxRoutes);
router.use("/plsettings", plSettingsRoutes);
router.use("/bsmaingroups", bsMainGroupRoutes);
router.use("/bsgroups", bsGroupRoutes);
router.use("/reverse-charges", reverseChargeRoutes);
router.use("/bill-wise-openings", billWiseOpeningRoutes);
router.use("/contra-entries", contraEntryRoutes);
router.use("/tax-forms", taxFormRoutes);

export default router;
