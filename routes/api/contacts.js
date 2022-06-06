const express = require("express");
// const {
//   contactSchemaCreate,
//   contactSchemaPatch,
// } = require("../../models/contact");
// const { contacts } = require("../../services");
const {
  getAll,
  getById,
  addContact,
  deleteById,
  updateById,
  updateFavorite,
} = require("../../controllers/contacts");
const router = express.Router();

router.get("/", getAll);

router.get("/:contactId", getById);

router.post("/", addContact);

router.delete("/:contactId", deleteById);

router.put("/:contactId", updateById);

router.patch("/:contactId", updateFavorite);

module.exports = router;
