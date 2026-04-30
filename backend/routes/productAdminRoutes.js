const express = require("express"); 
const Product = require("../models/Product"); 
const { protect, admin } = require("../middleware/authMiddleware"); 


const router = express.Router();

const PRODUCT_FIELDS = [
  "name",
  "description",
  "price",
  "discountPrice",
  "countInStock",
  "category",
  "brand",
  "sizes",
  "colors",
  "collections",
  "material",
  "gender",
  "images",
  "isFeatured",
  "isPublished",
  "tags",
  "dimensions",
  "weight",
  "sku",
];


//  @route /api/admin/products 
// @desc Get all products (admin only) 
// @access Private/Admin 
router.get("/",protect,admin,async(req,res)=>{
  try{
    const products = await Product.find({});
    if(products.length === 0){
      return res.status(404).json({message:"No products found"});
    }
    res.json(products);
  }catch(err){
    console.error(err);
    res.status(500).json({message : "Server Error"})
  }
})

//  @route POST /api/admin/products
// @desc Create a product (admin only)
// @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const productData = PRODUCT_FIELDS.reduce((data, field) => {
      if (req.body[field] !== undefined) {
        data[field] = req.body[field];
      }
      return data;
    }, {});

    const product = new Product({
      ...productData,
      user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (err) {
    console.error("Error Creating Product", err);
    res.status(500).json({ message: "Server Error" });
  }
});

//  @route PUT /api/admin/products/:id
// @desc Update a product (admin only)
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    PRODUCT_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    console.error("Error Updating Product", err);
    res.status(500).json({ message: "Server Error" });
  }
});

//  @route DELETE /api/admin/products/:id
// @desc Delete a product (admin only)
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product Removed" });
  } catch (err) {
    console.error("Error Deleting Product", err);
    res.status(500).json({ message: "Server Error" });
  }
});




module.exports = router;


