const Joi = require("joi");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const Helper = require("../helpers");

const _ = require("lodash");

const mongoose = require("mongoose");
const { createStripeCustomer } = require("../utils/stripe");
const User = mongoose.model("User");
const Role = mongoose.model("Role");
const Token = mongoose.model("RefreshToken");

dotenv.config();

module.exports = {
  async GetRoles(req, res) {
    const roles = await Role.find();
    if (roles.length) {
      res
        .status(200)
        .json(_.zipObject(_.map(roles, "roleName"), _.map(roles, "_id")));
    }
  },

  async CreateRole(req, res) {
    const schema = Joi.object({
      roleName: Joi.string().min(3).required(),
    });
    const { error, value } = schema.validate(req.body);

    if (error && error.details) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.details });
    }

    const roleExists = await Role.findOne({
      roleName: Helper.firstUpper(req.body["roleName"]),
    });
    if (roleExists) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "Role already exists" });
    }

    const newRole = new Role({
      roleName: Helper.firstUpper(value.roleName),
    });

    newRole
      .save()
      .then((role) => {
        res.status(StatusCodes.CREATED).json({
          message: "Role created successfully",
          role,
        });
      })
      .catch((err) =>
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Something error + " + err })
      );
  },

  async Register(req, res) {
    const schema = Joi.object({
      displayName: Joi.string().min(4).required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net", "org"] },
        })
        .required(),
      gender: Joi.string().valid("male", "female", "neutral"),
      age: Joi.number().min(14),
      photoUrl: Joi.string(),
      address: Joi.string(),
    });

    const { error, value } = schema.validate(req.body);

    if (error && error.details) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.details });
    }

    const user = await User.findOne({
      email: Helper.lowerCase(req.body.email),
    });
    if (user) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "Email already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(value.password, salt);
    if (!hash) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Error hashing password" });
    }

    const stripeCustomer = await createStripeCustomer({
      email: Helper.lowerCase(value.email),
    });

    const newUser = new User({
      displayName: Helper.firstUpper(value.displayName),
      email: Helper.lowerCase(value.email),
      gender: value.gender,
      age: value.age,
      address: value.address,
      password: hash,
      customer: {
        stripeId: stripeCustomer.id,
      },
    });

    const userDoc = await newUser.save();
    if (!userDoc) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Something error + " + err });
    }

    let accessToken = await Helper.generateAccessToken(userDoc);
    let refreshToken = await Helper.generateRefreshToken(userDoc);
    newUser.refreshToken = refreshToken.token;
    await newUser.save();

    return res.status(StatusCodes.CREATED).json({
      message: `${userDoc.displayName} created successfully ✅`,
      token: { accessToken, refreshToken: refreshToken.token },
      user: _.omit(userDoc.toObject(), ["password"]),
    });
  },

  async Login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "No empty fields allowed",
      });
    }

    const user = await User.findOne({
      email: Helper.lowerCase(email),
    }).populate("roles");
    if (!user)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Email isn't exists" });

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword)
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Password is incorrect",
      });

    // const token = await Helper.generateToken(user);
    // const token = user.generateAuthToken();

    let accessToken = await Helper.generateAccessToken(user);
    let refreshToken = await Helper.generateRefreshToken(user);
    user.refreshToken = refreshToken.token;
    await user.save();

    // console.log(user);

    return res.status(StatusCodes.OK).json({
      message: `Logged in as ${user.displayName} ✅`,
      token: { accessToken, refreshToken: refreshToken.token },
      user: _.omit(user.toObject(), ["password"]),
    });
  },

  RefreshToken: async (req, res) => {
    try {
      //get refreshToken
      let token = req.body.refreshToken;
      //send error if no refreshToken is sent
      if (!token) {
        return res
          .status(401)
          .json({ message: "Access denied,token missing!" });
      } else {
        const oldRefreshToken = await Token.findOne({
          token,
        }).populate("user");
        if (!oldRefreshToken || oldRefreshToken.revoked) {
          return res.status(401).json({ message: "Token invalid or expired!" });
        } else {
          const payload = jwt.verify(
            oldRefreshToken.token,
            process.env.REFRESH_TOKEN_SECRET
          );
          if (payload && Date.now() > payload.exp * 1000) {
            // oldRefreshToken.revoked = true;
            // await oldRefreshToken.save();
            // throw "Refresh Token Exprired";
            let newRefreshToken = await Helper.generateRefreshToken(
              oldRefreshToken.user
            );
            oldRefreshToken.revoked = true;
            oldRefreshToken.replacedByToken = newRefreshToken.token;
            await oldRefreshToken.save();
            await User.findOneAndUpdate(
              { _id: oldRefreshToken.user._id },
              { refreshToken: newRefreshToken.token }
            );

            return res
              .status(200)
              .json({ accessToken, refreshToken: newRefreshToken.token });
          }

          const accessToken = await Helper.generateAccessToken(
            oldRefreshToken.user
          );
          return res
            .status(200)
            .json({ accessToken, refreshToken: oldRefreshToken.token });
        }
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: error || "Internal Server Error!" });
    }
  },

  async CheckToken(req, res) {
    const { authorization } = req.headers;
    try {
      if (!authorization) return res.json(false);
      const token = authorization.split(" ")[1];
      if (!token) return res.json(false);

      const verified = jwt.verify(token, process.env.SECRET_JWT);
      if (!verified) return res.json(false);

      const user = await User.findById(verified.id);
      if (!user) return res.json(false);

      return res.json(true);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async GetUserById(req, res) {
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
  },

  async GetUserData(req, res) {
    const user = await User.findById(req.user.id).populate("roles", "roleName");
    if (user) {
      res.status(StatusCodes.OK).json({
        message: "User data loaded ✅",
        token: { accessToken: req.token, refreshToken: user.refreshToken },
        user: _.omit(user.toObject(), ["password", "refreshToken"]),
      });
    }
  },

  async GetAllUsers(req, res) {
    const users = await User.find();
    // console.log(_.omit(users, ["password"]));
    res.status(StatusCodes.OK).json(users);
  },

  async ChangeUserData(req, res) {
    const schema = Joi.object({
      displayName: Joi.string().alphanum().min(4).max(16).required(),
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net", "org"] },
        })
        .required(),
      gender: Joi.string().valid("male", "female", "neutral"),
      age: Joi.number().min(14),
      address: Joi.string(),
    });

    const { error, value } = schema.validate(req.body);

    if (error && error.details) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.details });
    }
    User.updateOne({ _id: req.user.id }, { ...value }, (err, raw) => {
      if (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Something error + " + err });
      }

      res
        .status(StatusCodes.OK)
        .json({ message: `Your profile has been updated!` });
    });
  },
};
