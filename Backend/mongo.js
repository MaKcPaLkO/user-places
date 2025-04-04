const { MongoClient } = require("mongodb");

const url = "mongodb+srv://mpalko:o67JXq7lw30R6sys@mp-first.alivu.mongodb.net/?retryWrites=true&w=majority&appName=MP-First";


const createProduct = async (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    price: req.body.price
  };
  const client = new MongoClient(url);

  try {
    const db = client.db("refresher");
    const collection = db.collection("products");
    const result = collection.insertOne(newProduct);
  } finally {
    await client.close();
  }

  res.json(newProduct);
};

const getProducts = async (req, res, next) => {
  const client = new MongoClient(url);

  let products;

  try {
    const db = client.db("sample_mflix");
    products = await db.collection("movies").find().toArray();

  } catch (error) {
    return res.json({message: "Could not retrieve products"})
  } finally {
    await client.close();
  }

  res.json(products)
};

exports.createProduct = createProduct;
exports.getProducts = getProducts;
