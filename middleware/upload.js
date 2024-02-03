const multer = require("multer");
const path = require("path");

const tempDir = path.join(__dirname, "..", "tmp");

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const storage = multer({ storage: storageConfig });

module.exports = storage;
