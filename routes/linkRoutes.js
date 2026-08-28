const { Router } = require("express");
const { linkClick } = require("../controllers/linkController");

const router = Router();

router.get("/:actionType/:shortCode", linkClick);

module.exports = router;
