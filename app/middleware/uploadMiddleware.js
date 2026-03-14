const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/avif": "avif",
};

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const isValid = FILE_TYPE_MAP[file.mimetype];
  if (isValid) {
    cb(null, true);
  } else {
    const error = new Error("Unsupported file format");
    cb(error, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

module.exports = upload;
