import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import PayPalButton from './PayPalButton'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { createCheckout } from '../../redux/slices/checkoutSlice'
import { logout } from '../../redux/slices/authSlices';
import { clearCartError } from '../../redux/slices/cartSlice';
import axios from 'axios';
import { toast } from 'sonner';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("PayPal Error Boundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="bg-red-50 p-4 rounded-md border border-red-200">
                    <h3 className="text-red-700 text-lg font-semibold">Payment System Unavailable</h3>
                    <p className="text-red-600">There was an error loading the payment gateway. Please refresh the page or try again later.</p>
                </div>
            );
        }

        return this.props.children;
    }
}

// const cart = {
//     products: [
//         {
//             name: "Stylish Jacket",
//             size: "M",
//             color: "Red",
//             price: 1200,
//             image: "https://picsum.photos/150?random=1"
//         },
//         {
//             name: "Stylish Jacket",
//             size: "M",
//             color: "Red",
//             price: 1200,
//             image: "https://picsum.photos/150?random=2"
//         },
//         {
//             name: "Stylish Jacket",
//             size: "M",
//             color: "Red",
//             price: 1200,
//             image: "https://picsum.photos/150?random=3"
//         },
//         {
//             name: "Stylish Jacket",
//             size: "M",
//             color: "Red",
//             price: 1200,
//             image: "https://picsum.photos/150?random=4"
//         }
//     ],
//     totalPrice: 195,

// }

const CheckOut = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart, loading, error } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const [checkoutId, setCheckoutId] = useState(null);
    const [shippingAddress, setShippingAddress] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: ""
    });

    const redirectToLogin = useCallback(() => {
        dispatch(logout());
        toast.error("Your session has expired. Please log in again.");
        navigate("/login?redirect=checkout");
    }, [dispatch, navigate])

    const isAuthError = (error) => {
        const data = error?.response?.data || error;
        return error?.response?.status === 401 ||
            data?.error === "jwt expired" ||
            data?.message?.toLowerCase().includes("not authorized");
    }

    useEffect(() => {
        if (!cart || !cart.products || cart.products.length === 0) {
            navigate("/")
        }
    }, [cart, navigate])

    useEffect(() => {
        if (isAuthError(error)) {
            dispatch(clearCartError());
            redirectToLogin();
        }
    }, [dispatch, error, redirectToLogin])

    const handleCreateCheckout = async (e) => {
        e.preventDefault();
        if (!user || !localStorage.getItem("userToken")) {
            redirectToLogin();
            return;
        }
        if (cart && cart.products.length > 0) {
            const res = await dispatch(createCheckout({
                checkoutItems: cart.products,
                shippingAddress,
                paymentMethod: "paypal",
                totalPrice: cart.totalPrice,
            }));
            // console.log("res",res);
            if (createCheckout.fulfilled.match(res) && res.payload?._id) {
                setCheckoutId(res.payload._id);
            } else if (createCheckout.rejected.match(res) && isAuthError(res.payload)) {
                redirectToLogin();
            } else if (createCheckout.rejected.match(res)) {
                toast.error(res.payload?.message || "Unable to create checkout.");
            }
        }
    }

    const handlePaymentSuccess = async (details) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
                { paymentStatus: "paid", paymentDetails: details },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`
                    }
                }
            );
            await handleFinalizeCheckout(checkoutId);
        } catch (error) {
            if (isAuthError(error)) {
                redirectToLogin();
                return;
            }
            console.log("payment error", error)
        }
    }

    const handleFinalizeCheckout = async (checkoutId) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`
                    }
                }
            );
            navigate("/order-confirmation");
        } catch (error) {
            if (isAuthError(error)) {
                redirectToLogin();
                return;
            }
            console.log("payment error", error)
        }
    }

    if (loading) {
        return <p className='text-center'>Loading...</p>
    }
    if (error) {
        return <p className='text-center text-red-500'>Error : {error}</p>
    }

    if (!cart || !cart.products || cart.products.length === 0) {
        return <p className='text-center'>Cart is Empty</p>
    }

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter'>
            {/* left section */}
            <div className='bg-white rounded-lg p-6'>
                <h2 className='text-2xl uppercase mb-6'>Checkout</h2>
                <form action="" onSubmit={handleCreateCheckout}>
                    <h3 className='text-lg mb-4'>Contact Details</h3>
                    <div className="mb-4">
                        <label className='block text-gray-700'>Email</label>
                        <input
                            type="email"
                            value={user ? user.email : ""}
                            className='w-full p-2 border rounded'
                        />
                    </div>
                    <h3 className='text-lg mb-4 '>Delivery</h3>
                    <div className='mb-4 grid grid-cols-2  gap-4'>
                        <div>
                            <label className='block text-gray-700'>First Name</label>
                            <input
                                type="text"
                                className='w-full p-2 border rounded '
                                value={shippingAddress.firstName}
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        firstName: e.target.value
                                    })}
                                required />
                        </div>
                        <div>
                            <label className='block text-gray-700'>Last Name</label>
                            <input
                                type="text"
                                className='w-full p-2 border rounded '
                                value={shippingAddress.lastName}
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        lastName: e.target.value
                                    })}
                                required />
                        </div>
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Address</label>
                        <input
                            type="text"
                            value={shippingAddress.address}
                            onChange={(e) =>
                                setShippingAddress({
                                    ...shippingAddress,
                                    address: e.target.value
                                })}
                            className='w-full p-2 border rounded'
                            required
                        />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className='block text-gray-700'>City</label>
                            <input
                                type="text"
                                className='w-full p-2 border rounded '
                                value={shippingAddress.city}
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        city: e.target.value
                                    })}
                                required />
                        </div>
                        <div>
                            <label className='block text-gray-700'>Postal Code</label>
                            <input
                                type="text"
                                className='w-full p-2 border rounded '
                                value={shippingAddress.postalCode}
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        postalCode: e.target.value
                                    })}
                                required />
                        </div>
                    </div>

                    <div className='mb-4'>
                        <label className='block text-gray-700'>Country</label>
                        <input
                            type="text"
                            value={shippingAddress.country}
                            onChange={(e) =>
                                setShippingAddress({
                                    ...shippingAddress,
                                    country: e.target.value
                                })}
                            className='w-full p-2 border rounded'
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Phone</label>
                        <input
                            type="text"
                            value={shippingAddress.phone}
                            onChange={(e) =>
                                setShippingAddress({
                                    ...shippingAddress,
                                    phone: e.target.value
                                })}
                            className='w-full p-2 border rounded'
                            required
                        />
                    </div>
                    <div className='mt-6 '>
                        {!checkoutId ? (
                            <button
                                onClick={handleCreateCheckout}
                                button="submit"
                                className='w-full bg-black text-white py-3 rounded'
                            >Continue to Payment</button>
                        ) : (
                            <div>
                                {/* <h3 className='text-lg mb-4 '>
                                    Pay with Paypal
                                </h3> */}
                                {/* Paypal Component */}
                                <ErrorBoundary>
                                    <PayPalButton
                                        amount={cart.totalPrice}
                                        onSuccess={handlePaymentSuccess}
                                        onError={() => alert("Payment failed")}
                                    />
                                </ErrorBoundary>
                            </div>
                        )
                        }
                    </div>
                </form>
            </div>
            {/* Right Section */}
            <div className='bg-gray-50 p-6 rounded-lg'>
                <h3 className='text-lg mb-4'>Order Summary</h3>
                <div className='border-t py-4 mb-4'>
                    {
                        cart.products.map((product, index) => (
                            <div key={index} className='flex items-start justify-between py-2 border-b'>
                                <div className='flex items-start'>
                                    <img src={product.image} alt={product.name} className="w-20 h-24 object-cover mr-4" />
                                    <div>
                                        <h3 className='text-md'>{product.name}</h3>
                                        <p className='text-gray-500'>Size : {product.size}</p>
                                        <p className='text-gray-500'>Color : {product.color}</p>
                                    </div>
                                </div>
                                <p className='text-xl'>${product.price?.toLocaleString()}</p>
                            </div>
                        ))
                    }
                </div>
                <div className='flex justify-between items-center text-lg mb-4'>
                    <p>Subtotal</p>
                    <p>${cart.totalPrice?.toLocaleString()}</p>
                </div>
                <div className='flex justify-between items-center text-lg'>
                    <p>Shipping</p>
                    <p>Free</p>
                </div>
                <div className='flex justify-between items-center text-lg mt-4 border-t pt-4'>
                    <p>Total</p>
                    <p>${cart.totalPrice?.toLocaleString()}</p>
                </div>
            </div>
        </div>
    )
}

export default CheckOut
