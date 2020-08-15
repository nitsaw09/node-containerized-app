const multer = require("multer");

const uploadFile = props => {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, props.destination);
    },
    filename(req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });

  const fileFilter = (req, file, cb) => {
    if (props.allowedFiles.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  };

  const limits = {
    fileSize: props.fileSize || 1024 * 1024 * 50
  };

  return multer({ storage, limits, fileFilter });
};

module.exports = uploadFile;
