const {
  contactSchemaCreate,
  contactSchemaPatch,
} = require("../models/contact");
const { contacts } = require("../services");

const getAll = async (req, res, next) => {
  try {
    const allContacts = await contacts.listContacts();
    res.json(allContacts);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contacts.getContactById(contactId);
    if (!contact) {
      res.status(404).json({
        message: "Not Found",
      });
      return;
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const { error } = contactSchemaCreate.validate(req.body);
    if (error) {
      res.status(400).json({
        message: "Missing required name field",
      });
      return;
    }
    const contact = await contacts.addContact(req.body);
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contacts.removeContact(contactId);
    if (!contact) {
      res.status(404).json({
        message: "Not Found",
      });
      return;
    }
    res.status(200).json({
      message: "Contact deleted",
    });
  } catch (error) {
    next(error);
  }
};

const updateById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contacts.updateContact(contactId, req.body);
    if (!contact) {
      res.status(404).json({
        message: "Not Found",
      });
      return;
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

const updateFavorite = async (req, res, next) => {
  try {
    const { error } = contactSchemaPatch.validate(req.body);
    if (error) {
      res.status(400).json({
        message: "Missing field favorite",
      });
      return;
    }
    const { contactId } = req.params;
    const contact = await contacts.updateStatusContact(contactId, req.body);
    if (!contact) {
      res.status(404).json({
        message: "Not Found",
      });
      return;
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAll,
  getById,
  addContact,
  deleteById,
  updateById,
  updateFavorite,
};
