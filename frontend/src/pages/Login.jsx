import { useState , useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import login from "../assets/login.webp"
import { loginUser } from '../redux/slices/authSlices'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { mergeCart } from '../redux/slices/cartSlice'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation(); 
    const {user,guestId , loading}  = useSelector((state)=>state.auth) 
    const { cart } = useSelector((state)=>state.cart) 

    const redirect = new URLSearchParams(location.search).get("redirect") || "/" 
    const isCheckoutRedirect = redirect.includes("checkout"); 

    useEffect(() => {
        if(user){
            if(cart?.products.length > 0 && guestId){
                dispatch(mergeCart({guestId,user})).then(() => {
                    navigate(isCheckoutRedirect? "/checkout" : "/");
                })
            }else{
                navigate(redirect);
            }
        }
    }, [user,guestId,cart,navigate,isCheckoutRedirect,dispatch])

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
        setEmail("")
        setPassword("")
    }

    return (
        <div className='flex'>
            <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12'>
                <form onSubmit={handleSubmit} className='w-full max-w-full bg-white rounded-lg border shadow-sm'>
                    <div className='flex justify-center mb-6'>
                        <h2 className='text-xl font-medium mt-3'>Siblus</h2>
                    </div>
                    <h2 className='text-2xl font-bold text-center mb-6'>Hey there ! 👋</h2>
                    <p className='text-center mb-6'>
                        Enter your  username and password to Login
                    </p>
                    <div className='px-4 mx-4 my-5'>
                        <label className='block text-sm font-semibold mb-2'>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full p-2 border rounded'
                            placeholder='Enter Your Email Address'
                        />
                    </div>
                    <div className='px-4 mx-4 mb-10'>
                        <label className='block text-sm font-semibold mb-2'>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full p-2 border rounded'
                            placeholder='Enter Your Password'
                        />
                    </div>
                    <div className='px-4 mx-4 mb-4'>
                        <button type='submit' className='w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition'>
                            {loading ? "loading ..." : "Sign in"}
                        </button>
                    </div>
                    <p className='mt-6 text-center text-sm mb-2'>
                        Don't have an account ?
                        <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className='text-blue-600 hover:underline ml-1'>
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>

            <div className='hidden md:block w-1/2 bg-gray-800'>
                <div className='h-full flex flex-col justify-center items-center'>
                    <img src={login} alt="Login to Account" className='h-[750px] w-full object-cover' />
                </div>
            </div>
        </div>
    )
}

export default Login