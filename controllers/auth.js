require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");
const User = require("../models/User");
const {
  authUserSchema,
  subscrSchema,
  verifyEmailSchema,
} = require("../schema/authSchema");
const HttpError = require("../helpers/HttpError");
const sendEmail = require("../helpers/SendEmail");
const TryCatch = require("../helpers/TryCatch");

const { BASE_URL } = process.env;

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
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const verifyMsg = {
    to: email,
    subject: "Сonfirm your registration",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click to confirm your registration</a>`,
    text: `Open the link to confirm your registration: ${BASE_URL}/users/verify/${verificationToken}`,
  };

  await sendEmail(verifyMsg);

  const newUser = await User.create({
    ...req.body,
    password: hashedPassword,
    avatarURL,
    verificationToken,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
      verificationToken: newUser.verificationToken,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200).json({
    message: "Verification successful",
  });
};

const resendVerify = async (req, res) => {
  const { error } = verifyEmailSchema.validate(req.body);

  if (error) {
    throw HttpError(400, error.message);
  }

  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyMsg = {
    to: email,
    subject: "Сonfirm your registration",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click to confirm your registration</a>`,
    text: `Open the link to confirm your registration: ${BASE_URL}/users/verify/${user.verificationToken}`,
  };

  await sendEmail(verifyMsg);

  res.status(200).json({
    message: "Verification email sent",
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

  if (!user.verify) {
    throw HttpError(401, "Your email isn't verified");
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
  verify: TryCatch(verify),
  resendVerify: TryCatch(resendVerify),
  login: TryCatch(login),
  logout: TryCatch(logout),
  getCurrent: TryCatch(getCurrent),
  updSubscription: TryCatch(updSubscription),
};
