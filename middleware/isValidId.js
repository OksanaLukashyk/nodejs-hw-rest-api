const { isValidObjectId } = require("mongoose");
const HttpError = require("../helpers/HttpError");

const isValidId = (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw HttpError(400, `${id} not valid id`);
  }

  next();
};

module.exports = { isValidId };
