const cloudinary = require("../utils/cloudinary");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const _ = require("lodash");
const Category = require("../models/Category");
const User = require("../models/User");
const Product = require("../models/Product");
const Helper = require("../helpers");

module.exports = {
  async GetCategory(req, res) {
    const categories = await Category.find();
    res.status(200).json(categories);
  },
  async CreateCategory(req, res) {
    const { name } = req.body;
    // console.log(req.file);
    try {
      const uploaded = await cloudinary.uploadSingle(req.file.path, "category");
      if (!uploaded) {
        return res.status(403).json({ message: "Upload failed" });
      }

      const existCategory = await Category.findOne({ name });
      if (existCategory) {
        return res
          .status(409)
          .json({ message: `Category name [${name}] is already exists!` });
      }

      const newCategory = new Category({
        name,
        code: _.camelCase(name),
        imageUrl: uploaded.url,
      });
      newCategory.save().then((newDoc) => {
        if (!newDoc) {
          return res.status(500).json({ message: "Something went wrong" });
        }
        res.status(201).json({
          message: `Category [${newDoc.name}] created.`,
          result: newDoc,
        });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong" });
    }
  },
  async CreateProduct(req, res) {
    const schema = Joi.object({
      name: Joi.string().min(3).required(),
      description: Joi.string().min(10).required(),
      price: Joi.number().required(),
      shipping: Joi.boolean(),
      category: Joi.objectId(),
      shop: Joi.objectId(),
      // image: Joi.required(),
    });
    const { error, value } = schema.validate(req.body);
    if (error && error.details) {
      return res.status(500).json({ message: error.details });
    }
    try {
      // console.log(req.file);
      const uploaded = await cloudinary.uploadSingle(req.file.path, "products");
      if (!uploaded) {
        return res.status(403).json({ message: "Upload failed" });
      }
      const camelName = _.camelCase(value.name);
      const newProduct = new Product({
        ...value,
        code: removeAccents(camelName),
        imageUrl: uploaded.url,
      });

      await newProduct.save();

      res.json({ message: "New product created", result: newProduct });
    } catch (err) {
      res.status(500).json({ message: "Something went wrong" });
    }
  },
  async GetAllProducts(req, res) {
    try {
      let { category, id } = req.query;
      if (id) {
        const product = await Product.findById(id).populate("category", [
          "name",
        ]);
        return res.status(200).json(product);
      }
      let products = [];
      if (category === "all") {
        products = await Product.find()
          .populate("shop", ["name", "address", "_id"])
          .sort({ createdAt: "desc" })
          .exec();
      } else {
        products = await Product.find({ category })
          .populate("shop", ["name", "address", "_id"])
          .sort({ createdAt: "desc" })
          .exec();
      }
      res.status(200).json(products);
    } catch (error) {
      res.status(403).json({ message: "Error when fetching products!", error });
    }
  },
};

function removeAccents(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}
