const express = require("express");
const {
  getAll,
  getById,
  addContact,
  deleteById,
  updateById,
  updateFavorite,
} = require("../../controllers/contacts");
const { auth } = require("../../middlewares/auth");
const router = express.Router();

router.get("/", auth, getAll);

router.get("/:contactId", auth, getById);

router.post("/", auth, addContact);

router.delete("/:contactId", auth, deleteById);

router.put("/:contactId", auth, updateById);

router.patch("/:contactId", auth, updateFavorite);

module.exports = router;
