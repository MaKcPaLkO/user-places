const mongoose = require("mongoose");

const Product = require("./models/product");

mongoose.connect("mongodb+srv://mpalko:o67JXq7lw30R6sys@mp-first.alivu.mongodb.net/refresher?retryWrites=true&w=majority&appName=MP-First")
  .then(() => {
    console.log("Connected to DB")
  }).catch((error) => {
  console.log(error)
})

const createProduct = async (req, res, next) => {
  const createdProduct = new Product({
    name: req.body.name,
    price: req.body.price,
    amount: req.body.amount
  });

  const result = await createdProduct.save();

  res.json(result);
}

const getProducts = async (req, res, next) => {
  const products = await Product.find().exec();
  res.json(products);
}

exports.createProduct = createProduct;
exports.getProducts = getProducts;
