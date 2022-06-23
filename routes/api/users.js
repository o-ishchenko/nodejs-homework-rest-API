const express = require("express");
const { uploadAvatar } = require("../../controllers/auth");
const { auth } = require("../../middlewares/auth");
const { upload } = require("../../middlewares/upload");
const router = express.Router();

router.patch("/avatars", auth, upload.single("avatar"), uploadAvatar);

module.exports = router;
