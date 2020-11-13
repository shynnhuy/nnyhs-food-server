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
};
