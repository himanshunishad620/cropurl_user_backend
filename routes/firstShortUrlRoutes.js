const { Router } = require("express");
const { firstShortUrlClick } = require("../controllers/firstShortUrl");
const router = Router();

router.get("/f/:shortCode", firstShortUrlClick);

module.exports = router;
