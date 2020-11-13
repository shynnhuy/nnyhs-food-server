const multer = require("multer");
const uuid = require("short-uuid")

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./src/uploads");
  },
  filename: function (req, file, callback) {
    callback(null, uuid.generate() + "-" + file.originalname);
  },
});

// const fileFilter = (req, file, callback) => {
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//     callback(null, true);
//   } else {
//     callback({ message: "Unsupported file Format" }, false);
//   }
// };

const imageFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are accepted!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
});

module.exports = upload;
