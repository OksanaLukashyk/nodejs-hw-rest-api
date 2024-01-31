const Contact = require("../models/contact");

const HttpError = require("../helpers/HttpError");
const {
  addSchema,
  updSchema,
  updFavoriteSchema,
} = require("../schema/contactSchema");

const getAllContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const allContacts = await Contact.find({ owner }).populate(
      "owner",
      "email subscription"
    );
    res.status(200).json(allContacts);
  } catch (err) {
    next(err);
  }
};

const getSelectedContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;

    const selectedContact = await Contact.findOne({ owner, _id: id });

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
    const { _id: owner } = req.user;
    const addedContact = await Contact.create({ ...req.body, owner });
    res.status(201).json(addedContact);
  } catch (err) {
    next(err);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;

    const deletedContact = await Contact.findOneAndDelete({ owner, _id: id });

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
    const { _id: owner } = req.user;
    const updatedContact = await Contact.findOneAndUpdate(
      { owner, _id: id },
      req.body,
      {
        new: true,
      }
    );

    if (!updatedContact) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(updatedContact);
  } catch (err) {
    next(err);
  }
};

const updateStatusFavorite = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, "missing field favorite");
    }

    const { error } = updFavoriteSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const { id } = req.params;
    const { _id: owner } = req.user;
    const updatedStatus = await Contact.findOneAndUpdate(
      { owner, _id: id },
      req.body,
      {
        new: true,
      }
    );

    if (!updatedStatus) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(updatedStatus);
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
  updateStatusFavorite,
};
