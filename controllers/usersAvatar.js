const Jimp = require("jimp");
const fs = require("fs/promises");
const path = require("path");
const User = require("../models/User");
const HttpError = require("../helpers/HttpError");
const TryCatch = require("../helpers/TryCatch");

const updateAvatar = async (req, res, next) => {
  if (!req.file) {
    throw HttpError(400, "No image for avatar provided");
  }

  const { path: tempUpload, originalname } = req.file;

  await Jimp.read(tempUpload)
    .then((avatar) => {
      return avatar.resize(250, 250).quality(60).write(tempUpload);
    })
    .catch((err) => {
      throw err;
    });

  const extentionName = path.extname(originalname);
  const baseName = path.basename(originalname, extentionName);
  const newName = `${baseName}_${req.user._id.toString()}${extentionName}`;

  const publicDir = path.join(__dirname, "..", "public", "avatars", newName);

  await fs.rename(tempUpload, publicDir);

  const avatarURL = path.join("avatar", newName);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatarURL },
    { new: true }
  );

  res.status(200).send({ avatarURL: user.avatarURL });
};

module.exports = {
  updateAvatar: TryCatch(updateAvatar),
};
