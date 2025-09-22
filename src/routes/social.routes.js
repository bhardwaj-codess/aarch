const express = require("express");
const router = express.Router();
const { socialLogin } = require("../controllers/social.controller.js");

router.post("/social-login", socialLogin);

module.exports = router;
