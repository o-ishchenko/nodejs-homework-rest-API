const { Contact } = require("../models/contact");

const listContacts = async (query) => {
  const { page, limit, favorite } = query;
  const skipped = (page - 1) * limit;
  const skip = skipped < 0 ? 0 : skipped;
  return Contact.find({ favorite }, {}, { skip, limit }).populate(
    "owner",
    "email subscription"
  );
};

const getContactById = async (contactId) => {
  return Contact.findById(contactId);
};

const addContact = async (body, id) => {
  return Contact.create({ ...body, owner: id });
};

const updateContact = async (contactId, body) => {
  return Contact.findByIdAndUpdate(contactId, body);
};

const removeContact = async (contactId) => {
  return Contact.findByIdAndDelete(contactId);
};

const updateStatusContact = async (contactId, body) => {
  return Contact.findByIdAndUpdate(contactId, body, { new: true });
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
