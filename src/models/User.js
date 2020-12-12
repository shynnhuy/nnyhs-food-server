const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const RefreshToken = require("../models/RefreshToken");

const CustomerSchema = new mongoose.Schema({
  stripeId: {
    type: String,
    required: true,
  },
  subscriptionId: {
    type: String,
    required: false,
  },
  subscribedDate: {
    type: Date,
    required: false,
  },
  defaultPaymentId: {
    type: String,
    required: false,
  },
});

const userSchema = new mongoose.Schema(
  {
    displayName: { type: String },
    email: { type: String },
    password: { type: String },
    gender: { type: String, enum: ["male", "female", "neutral"] },
    age: Number,
    photoUrl: String,
    address: String,
    roles: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
      default: ["5f60c199250e7815402d6c8c"],
    },
    refreshToken: { type: String },
    isRequestShop: { type: Boolean, default: false },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
    customer: {
      type: CustomerSchema,
      default: null,
      required: false,
    },
  },
  { timestamps: true }
);

// userSchema.methods.generateAuthToken = function () {
//   const token = jwt.sign(
//     { id: this._id, displayName: this.displayName, roles: this.roles },
//     process.env.ACCESS_TOKEN_SECRET,
//     {
//       expiresIn: "1h",
//     }
//   );
//   return token;
// };

userSchema.methods = {
  createAccessToken: async function () {
    try {
      let { _id, displayName, roles } = this;
      let accessToken = jwt.sign(
        { id: _id, displayName, roles },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "10m",
        }
      );
      return accessToken;
    } catch (error) {
      console.error(error);
      return;
    }
  },
  createRefreshToken: async function () {
    try {
      let { _id, displayName, roles } = this;
      let refreshToken = jwt.sign(
        { id: _id, displayName, roles },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "3d",
        }
      );

      await new RefreshToken({ token: refreshToken, user: _id }).save();
      return refreshToken;
    } catch (error) {
      console.error(error);
      return;
    }
  },
};

module.exports = mongoose.model("User", userSchema);
