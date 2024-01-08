const contacts = require("../models/contacts");
const HttpError = require("../helpers/HttpError");
const { addSchema, updSchema } = require("../schema/joi-schema");

const getAllContacts = async (req, res, next) => {
  try {
    const allContacts = await contacts.listContacts();
    res.status(200).json(allContacts);
  } catch (err) {
    next(err);
  }
};

const getSelectedContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const selectedContact = await contacts.getById(id);

    if (!selectedContact) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(selectedContact);
  } catch (err) {
    next(err);
  }
};

const addNewContact = async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const addedContact = await contacts.addContact(req.body);
    res.status(201).json(addedContact);
  } catch (err) {
    next(err);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedContact = await contacts.removeContact(id);

    if (!deletedContact) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json({ message: "Contact deleted" });
  } catch (err) {
    next(err);
  }
};

const updateExistingContact = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, "Missing fields");
    }

    const { error } = updSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const { id } = req.params;
    const updatedContact = await contacts.updateContact(id, req.body);

    if (!updatedContact) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(updatedContact);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllContacts,
  getSelectedContact,
  addNewContact,
  deleteContact,
  updateExistingContact,
};
