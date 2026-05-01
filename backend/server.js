const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productAdminRoutes = require("./routes/productAdminRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");


dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors({
  origin: "https://siblus.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// connect to MongoDB 
connectDB();

app.get("/", (req, res) => {
  res.send("Welcome TO Siblus API");
});

//api routes 
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes); 
app.use("/api/upload", uploadRoutes); 
app.use("/api/subscribe", subscriberRoutes);

//Admin routes
app.use("/api/admin/users", adminRoutes); 
app.use("/api/admin/products",productAdminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);


app.listen(PORT, () => {
  console.log(`Server is Running on http://localhost:${PORT}`);
});
 
