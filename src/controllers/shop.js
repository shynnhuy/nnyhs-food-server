const Joi = require("joi");
const { StatusCodes } = require("http-status-codes");

const Shop = require("../models/Shop");
const Product = require("../models/Product");
const User = require("../models/User");

const _ = require("lodash");
const { response } = require("express");

module.exports = {
  async CreateShop(req, res) {
    const schema = Joi.object({
      name: Joi.string().max(35).required(),
      address: Joi.string().required(),
      identityCard: Joi.string().required(),
      categories: Joi.array().required(),
    });

    const { error, value } = schema.validate(req.body);

    if (error && error.details) {
      console.log(error);
      console.log(error.details);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.details });
    }

    const newShop = new Shop({
      ...value,
      owner: req.user.id,
    });

    const shopDoc = await newShop.save();
    await User.findOneAndUpdate(
      { _id: req.user.id },
      { isRequestShop: true, shop: shopDoc._id }
    );
    if (!shopDoc) {
      return res
        .status(500)
        .json({ message: "Error when saving your request" });
    }
    // console.log(shopDoc);
    res
      .status(201)
      .json({ message: `Your request has been submitted`, id: shopDoc._id });
  },

  async GetShop(req, res) {
    const { id } = req.params;
    try {
      // const resp = await Shop.findById(id).populate("categories");
      const result = await fetchShopAndProducts(id);
      // console.log(newResult);
      // const categories = _.zipObject(
      //   _.map(resp.categories, "code"),
      //   _.map(resp.categories, "_id")
      // );
      // res.status(StatusCodes.OK).json({ ...resp.toObject(), categories });
      // res.status(StatusCodes.OK).json(resp);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Error when getting shop detail." });
    }
  },

  async ChangeShopStatus(req, res) {
    const { id } = req.params;
    const reqStatus = req.body.status;
    try {
      const shop = await Shop.findById(id);
      if (!shop) {
        throw new Error(`Request with id [${id}] is not exist`);
      }
      const raw = await Shop.findByIdAndUpdate(
        id,
        { status: reqStatus },
        { new: true }
      ).populate("owner", "displayName");
      if (!raw) {
        throw new Error(`Error when edit the request`);
      }
      // const { status, ...doc } = raw.toJSON();
      res.json({ message: "Shop status updated", result: raw });
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  },

  async GetAllShop(req, res) {
    const shops = await Shop.find().populate("owner", "displayName");
    if (shops.length >= 1) {
      return res.status(200).json(shops);
    }
  },

  async GetShopProducts(req, res) {
    try {
      // console.log(req.query);
      const { shop, category } = req.query;
      const products = await Product.find({ shop, category });
      res.status(StatusCodes.OK).json(products);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Get products failed!", error });
    }
  },

  // async CreateRequest(req, res) {
  //   const schema = Joi.object({
  //     name: Joi.string().max(35).required(),
  //     address: Joi.string().required(),
  //     identityCard: Joi.string().required(),
  //     categories: Joi.array().required(),
  //   });

  //   const { error, value } = schema.validate(req.body);

  //   if (error && error.details) {
  //     console.log(error);
  //     console.log(error.details);
  //     return res
  //       .status(HttpStatus.BAD_REQUEST)
  //       .json({ message: error.details });
  //   }

  //   const newRequest = new ShopRequest({
  //     ...value,
  //     owner: req.user.id,
  //   });

  //   const requestDoc = await newRequest.save();
  //   await User.findOneAndUpdate(
  //     { _id: req.user.id },
  //     { isRequested: true, request: requestDoc._id }
  //   );
  //   if (!requestDoc) {
  //     return res
  //       .status(500)
  //       .json({ message: "Error when saving your request" });
  //   }
  //   res
  //     .status(201)
  //     .json({ message: `Your request has been submitted`, id: requestDoc._id });
  // },

  // async GetAllRequest(req, res) {
  //   const requests = await ShopRequest.find().populate("owner", "displayName");
  //   if (requests.length >= 1) {
  //     return res.status(200).json(requests);
  //   }
  // },

  // async ChangeRequestStatus(req, res) {
  //   const { id } = req.params;
  //   const reqStatus = req.body.status;
  //   const request = await ShopRequest.findById(id);
  //   if (!request) {
  //     return res
  //       .status(403)
  //       .json({ message: `Request with id [${id}] is not exist` });
  //   }
  //   const raw = await ShopRequest.findByIdAndUpdate(
  //     id,
  //     { status: reqStatus },
  //     { new: true }
  //   ).populate("owner", "displayName");

  //   if (!raw) {
  //     return res.status(500).json({ message: `Error when edit the request` });
  //   }
  //   const { status, ...doc } = raw.toJSON();
  //   const shop = new Shop({ ...doc, owner: doc.owner._id });
  //   // console.log(shop);
  //   res.json({ message: "Request updated", result: raw });
  // },

  // async GetRequest(req, res) {
  //   const { id } = req.params;
  //   try {
  //     const resp = await ShopRequest.findById(id).populate(
  //       "categories",
  //       "name"
  //     );
  //     res.status(StatusCodes.OK).json(resp);
  //   } catch (error) {
  //     res
  //       .status(StatusCodes.NOT_FOUND)
  //       .json({ message: "Error when getting request." });
  //   }
  // },
};

const fetchShopAndProducts = (idShop) => {
  return Promise.all([
    Shop.findById(idShop).populate("categories"),
    Product.find({ shop: idShop }),
  ]).then(([shop, products]) => ({ ...shop.toObject(), products }));
};
