const { Schema, model } = require("mongoose");
const Joi = require("joi");

const schema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contact = model("contact", schema);

const contactSchemaCreate = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.bool(),
});
const contactSchemaPatch = Joi.object({
  favorite: Joi.bool().required(),
});

module.exports = { Contact, contactSchemaCreate, contactSchemaPatch };
