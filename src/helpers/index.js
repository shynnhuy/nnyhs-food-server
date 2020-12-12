const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");

/**
 * private function createToken
 * @param user
 * @param secretSignature
 * @param tokenLife
 */
let createToken = (user, secretSignature, tokenLife) => {
  return new Promise((resolve, reject) => {
    const userData = {
      id: user._id,
      displayName: user.displayName,
      roles: user.roles,
    };
    jwt.sign(
      { ...userData },
      secretSignature,
      {
        algorithm: "HS256",
        expiresIn: tokenLife,
      },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        resolve(token);
      }
    );
  });
};

/**
 * This module used for verify jwt token
 * @param {*} token
 * @param {*} secretKey
 */
let verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
};

const accessTokenLife = "1h";
const refreshTokenLife = "7d";
// const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "1h";
// const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "7d";

/**
 * public function generateAccessToken
 * @param user
 */
const generateAccessToken = async (user) => {
  try {
    let accessToken = jwt.sign(
      { id: user._id, displayName: user.displayName, roles: user.roles },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: accessTokenLife,
      }
    );
    return accessToken;
  } catch (error) {
    console.error(error);
    return;
  }
};

/**
 * public function generateRefreshToken
 * @param user
 */
const generateRefreshToken = async (user) => {
  try {
    let refreshToken = jwt.sign(
      { id: user._id, displayName: user.displayName, roles: user.roles },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: refreshTokenLife,
      }
    );

    const token = await new RefreshToken({
      token: refreshToken,
      user: user._id,
    }).save();
    return token;
  } catch (error) {
    console.error(error);
    return;
  }
};

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function getUser(id) {
  if (!isValidId(id)) throw "User not found";
  const user = await User.findById(id).populate("roles");
  if (!user) throw "User not found";
  return user;
}

module.exports = {
  firstUpper: (username) => {
    const name = username.toLowerCase();
    return name.charAt(0).toUpperCase() + name.slice(1);
  },
  lowerCase: (str) => {
    return str.toLowerCase();
  },
  // generateToken: generateToken,
  verifyToken: verifyToken,
  getUser,
  generateAccessToken,
  generateRefreshToken,
  isValidId,
  getDistrict: () => {
    return [
      {
        name: "Liên Chiểu",
        type: "quan",
        slug: "lien-chieu",
        name_with_type: "Quận Liên Chiểu",
        path: "Liên Chiểu, Đà Nẵng",
        path_with_type: "Quận Liên Chiểu, Thành phố Đà Nẵng",
        code: "490",
        parent_code: "48",
        "xa-phuong": [
          {
            name: "Hòa Hiệp Bắc",
            type: "phuong",
            slug: "hoa-hiep-bac",
            name_with_type: "Phường Hòa Hiệp Bắc",
            path: "Hòa Hiệp Bắc, Liên Chiểu, Đà Nẵng",
            path_with_type:
              "Phường Hòa Hiệp Bắc, Quận Liên Chiểu, Thành phố Đà Nẵng",
            code: "20194",
            parent_code: "490",
          },
          {
            name: "Hòa Hiệp Nam",
            type: "phuong",
            slug: "hoa-hiep-nam",
            name_with_type: "Phường Hòa Hiệp Nam",
            path: "Hòa Hiệp Nam, Liên Chiểu, Đà Nẵng",
            path_with_type:
              "Phường Hòa Hiệp Nam, Quận Liên Chiểu, Thành phố Đà Nẵng",
            code: "20195",
            parent_code: "490",
          },
          {
            name: "Hòa Khánh Bắc",
            type: "phuong",
            slug: "hoa-khanh-bac",
            name_with_type: "Phường Hòa Khánh Bắc",
            path: "Hòa Khánh Bắc, Liên Chiểu, Đà Nẵng",
            path_with_type:
              "Phường Hòa Khánh Bắc, Quận Liên Chiểu, Thành phố Đà Nẵng",
            code: "20197",
            parent_code: "490",
          },
          {
            name: "Hòa Khánh Nam",
            type: "phuong",
            slug: "hoa-khanh-nam",
            name_with_type: "Phường Hòa Khánh Nam",
            path: "Hòa Khánh Nam, Liên Chiểu, Đà Nẵng",
            path_with_type:
              "Phường Hòa Khánh Nam, Quận Liên Chiểu, Thành phố Đà Nẵng",
            code: "20198",
            parent_code: "490",
          },
          {
            name: "Hòa Minh",
            type: "phuong",
            slug: "hoa-minh",
            name_with_type: "Phường Hòa Minh",
            path: "Hòa Minh, Liên Chiểu, Đà Nẵng",
            path_with_type:
              "Phường Hòa Minh, Quận Liên Chiểu, Thành phố Đà Nẵng",
            code: "20200",
            parent_code: "490",
          },
        ],
      },
      {
        name: "Thanh Khê",
        type: "quan",
        slug: "thanh-khe",
        name_with_type: "Quận Thanh Khê",
        path: "Thanh Khê, Đà Nẵng",
        path_with_type: "Quận Thanh Khê, Thành phố Đà Nẵng",
        code: "491",
        parent_code: "48",
        "xa-phuong": [
          {
            name: "Tam Thuận",
            type: "phuong",
            slug: "tam-thuan",
            name_with_type: "Phường Tam Thuận",
            path: "Tam Thuận, Thanh Khê, Đà Nẵng",
            path_with_type:
              "Phường Tam Thuận, Quận Thanh Khê, Thành phố Đà Nẵng",
            code: "20203",
            parent_code: "491",
          },
          {
            name: "Thanh Khê Tây",
            type: "phuong",
            slug: "thanh-khe-tay",
            name_with_type: "Phường Thanh Khê Tây",
            path: "Thanh Khê Tây, Thanh Khê, Đà Nẵng",
            path_with_type:
              "Phường Thanh Khê Tây, Quận Thanh Khê, Thành phố Đà Nẵng",
            code: "20206",
            parent_code: "491",
          },
          {
            name: "Thanh Khê Đông",
            type: "phuong",
            slug: "thanh-khe-dong",
            name_with_type: "Phường Thanh Khê Đông",
            path: "Thanh Khê Đông, Thanh Khê, Đà Nẵng",
            path_with_type:
              "Phường Thanh Khê Đông, Quận Thanh Khê, Thành phố Đà Nẵng",
            code: "20207",
            parent_code: "491",
          },
          {
            name: "Xuân Hà",
            type: "phuong",
            slug: "xuan-ha",
            name_with_type: "Phường Xuân Hà",
            path: "Xuân Hà, Thanh Khê, Đà Nẵng",
            path_with_type: "Phường Xuân Hà, Quận Thanh Khê, Thành phố Đà Nẵng",
            code: "20209",
            parent_code: "491",
          },
          {
            name: "Tân Chính",
            type: "phuong",
            slug: "tan-chinh",
            name_with_type: "Phường Tân Chính",
            path: "Tân Chính, Thanh Khê, Đà Nẵng",
            path_with_type:
              "Phường Tân Chính, Quận Thanh Khê, Thành phố Đà Nẵng",
            code: "20212",
            parent_code: "491",
          },
          {
            name: "Chính Gián",
            type: "phuong",
            slug: "chinh-gian",
            name_with_type: "Phường Chính Gián",
            path: "Chính Gián, Thanh Khê, Đà Nẵng",
            path_with_type:
              "Phường Chính Gián, Quận Thanh Khê, Thành phố Đà Nẵng",
            code: "20215",
            parent_code: "491",
          },
          {
            name: "Vĩnh Trung",
            type: "phuong",
            slug: "vinh-trung",
            name_with_type: "Phường Vĩnh Trung",
            path: "Vĩnh Trung, Thanh Khê, Đà Nẵng",
            path_with_type:
              "Phường Vĩnh Trung, Quận Thanh Khê, Thành phố Đà Nẵng",
            code: "20218",
            parent_code: "491",
          },
          {
            name: "Thạc Gián",
            type: "phuong",
            slug: "thac-gian",
            name_with_type: "Phường Thạc Gián",
            path: "Thạc Gián, Thanh Khê, Đà Nẵng",
            path_with_type:
              "Phường Thạc Gián, Quận Thanh Khê, Thành phố Đà Nẵng",
            code: "20221",
            parent_code: "491",
          },
          {
            name: "An Khê",
            type: "phuong",
            slug: "an-khe",
            name_with_type: "Phường An Khê",
            path: "An Khê, Thanh Khê, Đà Nẵng",
            path_with_type: "Phường An Khê, Quận Thanh Khê, Thành phố Đà Nẵng",
            code: "20224",
            parent_code: "491",
          },
          {
            name: "Hòa Khê",
            type: "phuong",
            slug: "hoa-khe",
            name_with_type: "Phường Hòa Khê",
            path: "Hòa Khê, Thanh Khê, Đà Nẵng",
            path_with_type: "Phường Hòa Khê, Quận Thanh Khê, Thành phố Đà Nẵng",
            code: "20225",
            parent_code: "491",
          },
        ],
      },
      {
        name: "Hải Châu",
        type: "quan",
        slug: "hai-chau",
        name_with_type: "Quận Hải Châu",
        path: "Hải Châu, Đà Nẵng",
        path_with_type: "Quận Hải Châu, Thành phố Đà Nẵng",
        code: "492",
        parent_code: "48",
        "xa-phuong": [
          {
            name: "Thanh Bình",
            type: "phuong",
            slug: "thanh-binh",
            name_with_type: "Phường Thanh Bình",
            path: "Thanh Bình, Hải Châu, Đà Nẵng",
            path_with_type:
              "Phường Thanh Bình, Quận Hải Châu, Thành phố Đà Nẵng",
            code: "20227",
            parent_code: "492",
          },
          {
            name: "Thuận Phước",
            type: "phuong",
            slug: "thuan-phuoc",
            name_with_type: "Phường Thuận Phước",
            path: "Thuận Phước, Hải Châu, Đà Nẵng",
            path_with_type:
              "Phường Thuận Phước, Quận Hải Châu, Thành phố Đà Nẵng",
            code: "20230",
            parent_code: "492",
          },
          {
            name: "Thạch Thang",
            type: "phuong",
            slug: "thach-thang",
            name_with_type: "Phường Thạch Thang",
            path: "Thạch Thang, Hải Châu, Đà Nẵng",
            path_with_type:
              "Phường Thạch Thang, Quận Hải Châu, Thành phố Đà Nẵng",
            code: "20233",
            parent_code: "492",
          },
          {
            name: "Hải Châu  I",
            type: "phuong",
            slug: "hai-chau-i",
            name_with_type: "Phường Hải Châu  I",
            path: "Hải Châu  I, Hải Châu, Đà Nẵng",
            path_with_type:
              "Phường Hải Châu  I, Quận Hải Châu, Thành phố Đà Nẵng",
            code: "20236",
            parent_code: "492",
          },
          {
            name: "Hải Châu II",
            type: "phuong",
            slug: "hai-chau-ii",
            name_with_type: "Phường Hải Châu II",
            path: "Hải Châu II, Hải Châu, Đà Nẵng",
            path_with_type:
              "Phường Hải Châu II, Quận Hải Châu, Thành phố Đà Nẵng",
            code: "20239",
            parent_code: "492",
          },
          {
            name: "Phước Ninh",
            type: "phuong",
            slug: "phuoc-ninh",
            name_with_type: "Phường Phước Ninh",
            path: "Phước Ninh, Hải Châu, Đà Nẵng",
            path_with_type:
              "Phường Phước Ninh, Quận Hải Châu, Thành phố Đà Nẵng",
            code: "20242",
            parent_code: "492",
          },
          {
            name: "Hòa Thuận Tây",
            type: "phuong",
            slug: "hoa-thuan-tay",
            name_with_type: "Phường Hòa Thuận Tây",
            path: "Hòa Thuận Tây, Hải Châu, Đà Nẵng",
            path_with_type:
              "Phường Hòa Thuận Tây, Quận Hải Châu, Thành phố Đà Nẵng",
            code: "20245",
            parent_code: "492",
          },
          {
            name: "Hòa Thuận Đông",
            type: "phuong",
            slug: "hoa-thuan-dong",
            name_with_type: "Phường Hòa Thuận Đông",
            path: "Hòa Thuận Đông, Hải Châu, Đà Nẵng",
            path_with_type:
              "Phường Hòa Thuận Đông, Quận Hải Châu, Thành phố Đà Nẵng",
            code: "20246",
            parent_code: "492",
          },
          {
            name: "Nam Dương",
            type: "phuong",
            slug: "nam-duong",
            name_with_type: "Phường Nam Dương",
            path: "Nam Dương, Hải Châu, Đà Nẵng",
            path_with_type:
              "Phường Nam Dương, Quận Hải Châu, Thành phố Đà Nẵng",
            code: "20248",
            parent_code: "492",
          },
          {
            name: "Bình Hiên",
            type: "phuong",
            slug: "binh-hien",
            name_with_type: "Phường Bình Hiên",
            path: "Bình Hiên, Hải Châu, Đà Nẵng",
            path_with_type:
              "Phường Bình Hiên, Quận Hải Châu, Thành phố Đà Nẵng",
            code: "20251",
            parent_code: "492",
          },
          {
            name: "Bình Thuận",
            type: "phuong",
            slug: "binh-thuan",
            name_with_type: "Phường Bình Thuận",
            path: "Bình Thuận, Hải Châu, Đà Nẵng",
            path_with_type:
              "Phường Bình Thuận, Quận Hải Châu, Thành phố Đà Nẵng",
            code: "20254",
            parent_code: "492",
          },
          {
            name: "Hòa Cường Bắc",
            type: "phuong",
            slug: "hoa-cuong-bac",
            name_with_type: "Phường Hòa Cường Bắc",
            path: "Hòa Cường Bắc, Hải Châu, Đà Nẵng",
            path_with_type:
              "Phường Hòa Cường Bắc, Quận Hải Châu, Thành phố Đà Nẵng",
            code: "20257",
            parent_code: "492",
          },
          {
            name: "Hòa Cường Nam",
            type: "phuong",
            slug: "hoa-cuong-nam",
            name_with_type: "Phường Hòa Cường Nam",
            path: "Hòa Cường Nam, Hải Châu, Đà Nẵng",
            path_with_type:
              "Phường Hòa Cường Nam, Quận Hải Châu, Thành phố Đà Nẵng",
            code: "20258",
            parent_code: "492",
          },
        ],
      },
      {
        name: "Sơn Trà",
        type: "quan",
        slug: "son-tra",
        name_with_type: "Quận Sơn Trà",
        path: "Sơn Trà, Đà Nẵng",
        path_with_type: "Quận Sơn Trà, Thành phố Đà Nẵng",
        code: "493",
        parent_code: "48",
        "xa-phuong": [
          {
            name: "Thọ Quang",
            type: "phuong",
            slug: "tho-quang",
            name_with_type: "Phường Thọ Quang",
            path: "Thọ Quang, Sơn Trà, Đà Nẵng",
            path_with_type: "Phường Thọ Quang, Quận Sơn Trà, Thành phố Đà Nẵng",
            code: "20263",
            parent_code: "493",
          },
          {
            name: "Nại Hiên Đông",
            type: "phuong",
            slug: "nai-hien-dong",
            name_with_type: "Phường Nại Hiên Đông",
            path: "Nại Hiên Đông, Sơn Trà, Đà Nẵng",
            path_with_type:
              "Phường Nại Hiên Đông, Quận Sơn Trà, Thành phố Đà Nẵng",
            code: "20266",
            parent_code: "493",
          },
          {
            name: "Mân Thái",
            type: "phuong",
            slug: "man-thai",
            name_with_type: "Phường Mân Thái",
            path: "Mân Thái, Sơn Trà, Đà Nẵng",
            path_with_type: "Phường Mân Thái, Quận Sơn Trà, Thành phố Đà Nẵng",
            code: "20269",
            parent_code: "493",
          },
          {
            name: "An Hải Bắc",
            type: "phuong",
            slug: "an-hai-bac",
            name_with_type: "Phường An Hải Bắc",
            path: "An Hải Bắc, Sơn Trà, Đà Nẵng",
            path_with_type:
              "Phường An Hải Bắc, Quận Sơn Trà, Thành phố Đà Nẵng",
            code: "20272",
            parent_code: "493",
          },
          {
            name: "Phước Mỹ",
            type: "phuong",
            slug: "phuoc-my",
            name_with_type: "Phường Phước Mỹ",
            path: "Phước Mỹ, Sơn Trà, Đà Nẵng",
            path_with_type: "Phường Phước Mỹ, Quận Sơn Trà, Thành phố Đà Nẵng",
            code: "20275",
            parent_code: "493",
          },
          {
            name: "An Hải Tây",
            type: "phuong",
            slug: "an-hai-tay",
            name_with_type: "Phường An Hải Tây",
            path: "An Hải Tây, Sơn Trà, Đà Nẵng",
            path_with_type:
              "Phường An Hải Tây, Quận Sơn Trà, Thành phố Đà Nẵng",
            code: "20278",
            parent_code: "493",
          },
          {
            name: "An Hải Đông",
            type: "phuong",
            slug: "an-hai-dong",
            name_with_type: "Phường An Hải Đông",
            path: "An Hải Đông, Sơn Trà, Đà Nẵng",
            path_with_type:
              "Phường An Hải Đông, Quận Sơn Trà, Thành phố Đà Nẵng",
            code: "20281",
            parent_code: "493",
          },
        ],
      },
      {
        name: "Ngũ Hành Sơn",
        type: "quan",
        slug: "ngu-hanh-son",
        name_with_type: "Quận Ngũ Hành Sơn",
        path: "Ngũ Hành Sơn, Đà Nẵng",
        path_with_type: "Quận Ngũ Hành Sơn, Thành phố Đà Nẵng",
        code: "494",
        parent_code: "48",
        "xa-phuong": [
          {
            name: "Mỹ An",
            type: "phuong",
            slug: "my-an",
            name_with_type: "Phường Mỹ An",
            path: "Mỹ An, Ngũ Hành Sơn, Đà Nẵng",
            path_with_type:
              "Phường Mỹ An, Quận Ngũ Hành Sơn, Thành phố Đà Nẵng",
            code: "20284",
            parent_code: "494",
          },
          {
            name: "Khuê Mỹ",
            type: "phuong",
            slug: "khue-my",
            name_with_type: "Phường Khuê Mỹ",
            path: "Khuê Mỹ, Ngũ Hành Sơn, Đà Nẵng",
            path_with_type:
              "Phường Khuê Mỹ, Quận Ngũ Hành Sơn, Thành phố Đà Nẵng",
            code: "20285",
            parent_code: "494",
          },
          {
            name: "Hoà Quý",
            type: "phuong",
            slug: "hoa-quy",
            name_with_type: "Phường Hoà Quý",
            path: "Hoà Quý, Ngũ Hành Sơn, Đà Nẵng",
            path_with_type:
              "Phường Hoà Quý, Quận Ngũ Hành Sơn, Thành phố Đà Nẵng",
            code: "20287",
            parent_code: "494",
          },
          {
            name: "Hoà Hải",
            type: "phuong",
            slug: "hoa-hai",
            name_with_type: "Phường Hoà Hải",
            path: "Hoà Hải, Ngũ Hành Sơn, Đà Nẵng",
            path_with_type:
              "Phường Hoà Hải, Quận Ngũ Hành Sơn, Thành phố Đà Nẵng",
            code: "20290",
            parent_code: "494",
          },
        ],
      },
      {
        name: "Cẩm Lệ",
        type: "quan",
        slug: "cam-le",
        name_with_type: "Quận Cẩm Lệ",
        path: "Cẩm Lệ, Đà Nẵng",
        path_with_type: "Quận Cẩm Lệ, Thành phố Đà Nẵng",
        code: "495",
        parent_code: "48",
        "xa-phuong": [
          {
            name: "Khuê Trung",
            type: "phuong",
            slug: "khue-trung",
            name_with_type: "Phường Khuê Trung",
            path: "Khuê Trung, Cẩm Lệ, Đà Nẵng",
            path_with_type: "Phường Khuê Trung, Quận Cẩm Lệ, Thành phố Đà Nẵng",
            code: "20260",
            parent_code: "495",
          },
          {
            name: "Hòa Phát",
            type: "phuong",
            slug: "hoa-phat",
            name_with_type: "Phường Hòa Phát",
            path: "Hòa Phát, Cẩm Lệ, Đà Nẵng",
            path_with_type: "Phường Hòa Phát, Quận Cẩm Lệ, Thành phố Đà Nẵng",
            code: "20305",
            parent_code: "495",
          },
          {
            name: "Hòa An",
            type: "phuong",
            slug: "hoa-an",
            name_with_type: "Phường Hòa An",
            path: "Hòa An, Cẩm Lệ, Đà Nẵng",
            path_with_type: "Phường Hòa An, Quận Cẩm Lệ, Thành phố Đà Nẵng",
            code: "20306",
            parent_code: "495",
          },
          {
            name: "Hòa Thọ Tây",
            type: "phuong",
            slug: "hoa-tho-tay",
            name_with_type: "Phường Hòa Thọ Tây",
            path: "Hòa Thọ Tây, Cẩm Lệ, Đà Nẵng",
            path_with_type:
              "Phường Hòa Thọ Tây, Quận Cẩm Lệ, Thành phố Đà Nẵng",
            code: "20311",
            parent_code: "495",
          },
          {
            name: "Hòa Thọ Đông",
            type: "phuong",
            slug: "hoa-tho-dong",
            name_with_type: "Phường Hòa Thọ Đông",
            path: "Hòa Thọ Đông, Cẩm Lệ, Đà Nẵng",
            path_with_type:
              "Phường Hòa Thọ Đông, Quận Cẩm Lệ, Thành phố Đà Nẵng",
            code: "20312",
            parent_code: "495",
          },
          {
            name: "Hòa Xuân",
            type: "phuong",
            slug: "hoa-xuan",
            name_with_type: "Phường Hòa Xuân",
            path: "Hòa Xuân, Cẩm Lệ, Đà Nẵng",
            path_with_type: "Phường Hòa Xuân, Quận Cẩm Lệ, Thành phố Đà Nẵng",
            code: "20314",
            parent_code: "495",
          },
        ],
      },
      {
        name: "Hòa Vang",
        type: "huyen",
        slug: "hoa-vang",
        name_with_type: "Huyện Hòa Vang",
        path: "Hòa Vang, Đà Nẵng",
        path_with_type: "Huyện Hòa Vang, Thành phố Đà Nẵng",
        code: "497",
        parent_code: "48",
        "xa-phuong": [
          {
            name: "Hòa Bắc",
            type: "xa",
            slug: "hoa-bac",
            name_with_type: "Xã Hòa Bắc",
            path: "Hòa Bắc, Hòa Vang, Đà Nẵng",
            path_with_type: "Xã Hòa Bắc, Huyện Hòa Vang, Thành phố Đà Nẵng",
            code: "20293",
            parent_code: "497",
          },
          {
            name: "Hòa Liên",
            type: "xa",
            slug: "hoa-lien",
            name_with_type: "Xã Hòa Liên",
            path: "Hòa Liên, Hòa Vang, Đà Nẵng",
            path_with_type: "Xã Hòa Liên, Huyện Hòa Vang, Thành phố Đà Nẵng",
            code: "20296",
            parent_code: "497",
          },
          {
            name: "Hòa Ninh",
            type: "xa",
            slug: "hoa-ninh",
            name_with_type: "Xã Hòa Ninh",
            path: "Hòa Ninh, Hòa Vang, Đà Nẵng",
            path_with_type: "Xã Hòa Ninh, Huyện Hòa Vang, Thành phố Đà Nẵng",
            code: "20299",
            parent_code: "497",
          },
          {
            name: "Hòa Sơn",
            type: "xa",
            slug: "hoa-son",
            name_with_type: "Xã Hòa Sơn",
            path: "Hòa Sơn, Hòa Vang, Đà Nẵng",
            path_with_type: "Xã Hòa Sơn, Huyện Hòa Vang, Thành phố Đà Nẵng",
            code: "20302",
            parent_code: "497",
          },
          {
            name: "Hòa Nhơn",
            type: "xa",
            slug: "hoa-nhon",
            name_with_type: "Xã Hòa Nhơn",
            path: "Hòa Nhơn, Hòa Vang, Đà Nẵng",
            path_with_type: "Xã Hòa Nhơn, Huyện Hòa Vang, Thành phố Đà Nẵng",
            code: "20308",
            parent_code: "497",
          },
          {
            name: "Hòa Phú",
            type: "xa",
            slug: "hoa-phu",
            name_with_type: "Xã Hòa Phú",
            path: "Hòa Phú, Hòa Vang, Đà Nẵng",
            path_with_type: "Xã Hòa Phú, Huyện Hòa Vang, Thành phố Đà Nẵng",
            code: "20317",
            parent_code: "497",
          },
          {
            name: "Hòa Phong",
            type: "xa",
            slug: "hoa-phong",
            name_with_type: "Xã Hòa Phong",
            path: "Hòa Phong, Hòa Vang, Đà Nẵng",
            path_with_type: "Xã Hòa Phong, Huyện Hòa Vang, Thành phố Đà Nẵng",
            code: "20320",
            parent_code: "497",
          },
          {
            name: "Hòa Châu",
            type: "xa",
            slug: "hoa-chau",
            name_with_type: "Xã Hòa Châu",
            path: "Hòa Châu, Hòa Vang, Đà Nẵng",
            path_with_type: "Xã Hòa Châu, Huyện Hòa Vang, Thành phố Đà Nẵng",
            code: "20323",
            parent_code: "497",
          },
          {
            name: "Hòa Tiến",
            type: "xa",
            slug: "hoa-tien",
            name_with_type: "Xã Hòa Tiến",
            path: "Hòa Tiến, Hòa Vang, Đà Nẵng",
            path_with_type: "Xã Hòa Tiến, Huyện Hòa Vang, Thành phố Đà Nẵng",
            code: "20326",
            parent_code: "497",
          },
          {
            name: "Hòa Phước",
            type: "xa",
            slug: "hoa-phuoc",
            name_with_type: "Xã Hòa Phước",
            path: "Hòa Phước, Hòa Vang, Đà Nẵng",
            path_with_type: "Xã Hòa Phước, Huyện Hòa Vang, Thành phố Đà Nẵng",
            code: "20329",
            parent_code: "497",
          },
          {
            name: "Hòa Khương",
            type: "xa",
            slug: "hoa-khuong",
            name_with_type: "Xã Hòa Khương",
            path: "Hòa Khương, Hòa Vang, Đà Nẵng",
            path_with_type: "Xã Hòa Khương, Huyện Hòa Vang, Thành phố Đà Nẵng",
            code: "20332",
            parent_code: "497",
          },
        ],
      },
    ];
  },
};
