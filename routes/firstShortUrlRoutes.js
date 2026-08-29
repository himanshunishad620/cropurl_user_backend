const { Router } = require("express");
const { firstShortUrlClick } = require("../controllers/firstShortUrl");
const router = Router();

router.get("/:shortCode", firstShortUrlClick);

module.exports = router;
