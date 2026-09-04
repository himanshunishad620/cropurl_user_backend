const { Router } = require("express");
const { clickLink, scanQr } = require("../controllers/linkController");

const router = Router();

router.get("/:shortCode", clickLink);
router.get("/q/:shortCode", scanQr);

module.exports = router;
