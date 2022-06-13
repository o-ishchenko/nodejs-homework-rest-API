const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  updateSubscription,
} = require("../../controllers/auth");
const { auth } = require("../../middlewares/auth");
const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", auth, logoutUser);
router.post("/current", auth, currentUser);
router.patch("/:userId", auth, updateSubscription);

module.exports = router;
