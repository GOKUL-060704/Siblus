const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// @route POST /api/checkout 
// @desc Create a new Checkout Session 
// @access Private 
router.post("/", protect, async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;
    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({ message: "No items in Checkout" });
    }
    try {
        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems: checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "pending",
            isPaid: false,
        });
        console.log(`Checkout created for user : ${req.user._id}`);
        res.status(201).json(newCheckout);

    } catch (err) {
        console.log("Error Creating checkout session", err);
        res.status(500).json({ message: "Server Error" });
    }
});


// @route PUT /api/checkout/:id/pay 
// @desc Update checkout to mark as paid after successfull payment 
// @access Private 
router.put("/:id/pay", protect, async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body;
    try {
        const checkout = await Checkout.findById(req.params.id);
        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" });
        }

        if (paymentStatus === "paid") {
            checkout.isPaid = true,
                checkout.paymentStatus = paymentStatus,
                checkout.paymentDetails = paymentDetails,
                checkout.paidAt = Date.now(),
                await checkout.save();

            res.status(200).json(checkout);
        } else {
            res.status(400).json({ message: "Invalid Payment Status" })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
})



// @route POST /api/checkout/:id/finalize 
// @desc Finalize checkout and convert  to an order after payment confirmation 
// @access Private 
router.post("/:id/finalize", protect, async (req, res) => {
    try {
        console.log("aaaaa", req.params.id);
        const checkout = await Checkout.findById(req.params.id);
        console.log("bbbb", checkout);
        if (!checkout) {
            return res.status(404).json({ message: "Checkout Not Found" });
        }
        if (checkout.isPaid && !checkout.isFinalized) {
            // Create finalize orderbased on the checkout details 
            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems: checkout.checkoutItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: true,
                paidAt: checkout.paidAt,
                isDelivered: false,
                paymentStatus: "paid",
                paymentDetails: checkout.paymentDetails,
            });

            // Mark the checkout as finalized 
            checkout.isFinalized = true;
            checkout.finalOrder = finalOrder._id;
            checkout.finalizedAt = Date.now();
            await checkout.save();

            // Clear the user's cart 
            await Cart.findOneAndDelete({ user: checkout.user });

            res.status(200).json(finalOrder);
        } else if (checkout.isFinalized) {
            res.status(400).json({ message: "Checkout already finalized" });
        } else {
            res.status(400).json({ message: "Checkout not paid" });
        }

    } catch (err) {
        console.log("Error finalizing checkout", err);
        res.status(500).json({ message: "Server Error" });
    }
})


module.exports = router;