const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");


const router = express.Router();


//  Helper function to get a cart by user Id or guest ID 
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } else if (guestId) {
        return await Cart.findOne({ guestId: guestId });
    }
    return null;
}


// @route  POST /api/cart 
// @desc Add a product to the cart for a guest or logged in user 
// @access  Public 
router.post("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Determine if the user is logged in or guest 
        let cart = await getCart(userId, guestId);

        // if the cart exist , update it 
        if (cart) {
            const productIndex = cart.products.findIndex(
                (p) =>
                    p.productId.toString() === productId &&
                    p.size === size &&
                    p.color === color);

            if (productIndex > -1) {
                // if product already exist
                cart.products[productIndex].quantity += quantity;
            } else {
                // add new product
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity
                });
            }

            // Calculate total price 
            cart.totalPrice = cart.products.reduce((total, p) => total + p.price * p.quantity, 0);
            await cart.save();
            return res.status(200).json(cart);
        } else {
            // Create new cart for the guest or user 
            const newCart = await Cart.create({
                user : userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                products: [
                    {
                        productId,
                        name: product.name,
                        image: product.images[0].url,
                        price: product.price,
                        size,
                        color,
                        quantity
                    }
                ],
                totalPrice: product.price * quantity,
            });
            return res.status(200).json(newCart);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
})



// @route PUT /api/cart 
// @desc Update product quantity in the cart for a gust or logged-in user 
// access Public 
router.put("/",async (req,res) => {
    const {productId,quantity,size,color,guestId,userId} = req.body;
    try{
        let cart = await getCart(userId,guestId);
        if(!cart) return res.status(400).json({message:"Cart not found"});
        const productIndex =  cart.products.findIndex(
            (p)=>p.productId.toString() === productId && 
            p.size === size && 
            p.color === color);
        if(productIndex > -1){
            if(quantity>0){
                //update quantity
                cart.products[productIndex].quantity = quantity;
            }else{
                cart.products.splice(productIndex,1); // Remove product if quantity is 0
            }

            cart.totalPrice = cart.products.reduce(
                (acc,item) => acc + item.price * item.quantity,
                0);
            await cart.save();
            return res.status(200).json(cart);
        }else{
            return res.status(404).json({message:"Product not found in cart"});
        }
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Server Error"});
    }
})



// @route DELETE /api/cart 
// @desc Remove a product from the cart 
// @access Public 
router.delete("/",async (req,res)=> {
    const { productId , size , color , guestId , userId } = req.body;
    try{
        let cart = await getCart(userId,guestId);
        if(!cart) return res.status(404).json({message : "Cart not found"});

        const productIndex = cart.products.findIndex((p)=>p.productId.toString()===productId && p.size === size && p.color === color);
        if(productIndex > -1){
            cart.products.splice(productIndex,1);
            cart.totalPrice = cart.products.reduce((acc,item)=>acc + item.price * item.quantity,0);
            await cart.save();
            return res.status(200).json(cart);
        }else{
            return res.status(404).json({message:"Product not found in cart"});
        }

    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Server Error"});
    }
})




// @route GET /api/cart 
// @desc Get logged in users or guest user's cart 
// @access public 
router.get("/", async (req, res) => {
    const { userId, guestId } = req.query;
    try {
        const cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        return res.status(200).json(cart);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
})



// @route POST /api/cart/merger 
// @desc Merge guest cart into user cart on login 
// @access Private  
router.post("/merge", protect, async (req, res) => {
    const { guestId } = req.body;
    const userId = req.user._id;
    try {
        // Find the guest cart and user cart 
        const guestCart = await Cart.findOne({ guestId });
        const userCart = await Cart.findOne({ user: userId });

        if(guestCart){
            if(guestCart.products.length === 0 ){
                return res.status(400).json({message:"Guest cart is empty"});
            }
            if(userCart){
                guestCart.products.forEach((guestItem)=> {
                    const productIndex = userCart.products.findIndex((item)=>
                        item.productId.toString() === guestItem.productId.toString() &&
                    item.size === guestItem.size && item.color === guestItem.color);
                    if(productIndex > -1){
                        //if item exist in the user cart, update the quantity
                        userCart.products[productIndex].quantity += guestItem.quantity;
                    }else{
                        // other wise add the guest item to the cart
                        userCart.products.push(guestItem);
                    }
                });

                // Calculate the total price for the user cart 
                userCart.totalPrice = userCart.products.reduce((acc,item)=>acc + item.price * item.quantity,0);
                await userCart.save();
                try{
                    await Cart.findOneAndDelete({guestId});
                }catch(err){
                    console.log("Error Deleting guest cart:" ,err);
                }
                res.status(200).json(userCart);
            }else{
                // if no user cart, convert guest cart to user cart 
                guestCart.user = userId;
                guestCart.guestId = undefined;
                await guestCart.save();
                res.status(200).json(guestCart);
            }
        }else{
            if(userCart){
                // Guest cart has already geen merged , return user cart 
                return res.status(200).json(userCart);
            }
            res.status(404).json({message:"Guest cart not found"})
        }
    }catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
})
 
module.exports = router;
