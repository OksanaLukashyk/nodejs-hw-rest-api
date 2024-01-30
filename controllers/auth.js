require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const HttpError = require("../helpers/HttpError");
const TryCatch = require("../helpers/TryCatch");
const User = require("../models/User");
const { authUserSchema, subscrSchema } = require("../schema/authSchema");

const register = async (req, res, next) => {
  const { error } = authUserSchema.validate(req.body);

  if (error) {
    throw HttpError(400, error.message);
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user !== null) {
    throw HttpError(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashedPassword });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res, next) => {
  const { error } = authUserSchema.validate(req.body);

  if (error) {
    throw HttpError(400, error.message);
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user === null) {
    throw HttpError(401, "Email or password is wrong");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw HttpError(401, "Email or password wrong");
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, subscription: user.subscription },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  await User.findByIdAndUpdate(user._id, { token });

  res
    .status(200)
    .json({ token, user: { email, subscription: user.subscription } });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });

  res.status(204).end();
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const updSubscription = async (req, res) => {
  const { error } = subscrSchema.validate(req.body);

  if (error) {
    throw HttpError(400, error.message);
  }

  const { _id } = req.user;
  const subscription = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });

  if (!subscription) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(subscription);
};

module.exports = {
  register: TryCatch(register),
  login: TryCatch(login),
  logout: TryCatch(logout),
  getCurrent: TryCatch(getCurrent),
  updSubscription: TryCatch(updSubscription),
};
