require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// module.exports = { cloudinary };

// exports.uploads = (file, folder) => {
//   return new Promise((resolve) => {
//     cloudinary.uploader.upload(
//       file,
//       (result) => {
//         resolve({
//           url: result.url,
//           id: result.public_id,
//         });
//       },
//       {
//         resource_type: "auto",
//         folder: folder,
//       }
//     );
//   });
// };

module.exports = {
  uploadSingle: (file, folder = "shop") => {
    return new Promise((resolve) => {
      cloudinary.uploader
        .upload(file, {
          folder,
          upload_preset: "nnyhs",
        })
        .then((result) => {
          if (result) {
            const fs = require("fs");
            fs.unlinkSync(file);
            resolve({ ...result });
          }
        });
    });
  },
  uploadMultiple: (file) => {
    return new Promise((resolve) => {
      cloudinary.uploader
        .upload(file, {
          folder: "home",
        })
        .then((result) => {
          if (result) {
            const fs = require("fs");
            fs.unlinkSync(file);
            resolve({
              url: result.secure_url,
              id: result.public_id,
              thumb1: self.reSizeImage(result.public_id, 200, 200),
              main: self.reSizeImage(result.public_id, 500, 500),
              thumb2: self.reSizeImage(result.public_id, 300, 300),
            });
          }
        });
    });
  },
  reSizeImage: (id, h, w) => {
    return cloudinary.url(id, {
      height: h,
      width: w,
      crop: "scale",
      format: "jpg",
    });
  },
};
