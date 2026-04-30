import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineUser, HiBars3BottomRight, HiOutlineShoppingBag } from 'react-icons/hi2'
import { IoMdClose } from 'react-icons/io'
import SearchBar from './SearchBar'
import CardDrawer from '../Layout/CardDrawer'
import { useSelector } from 'react-redux';

const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [navDrawerOpen, setNavDrawerOpen] = useState(false);
    const { cart } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

    const cartItemCount = cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    }

    const toggleNavDrawer = () => {
        setNavDrawerOpen(!navDrawerOpen);
    }

    const closeNavDrawer = () => {
        setNavDrawerOpen(false);
    }

    return <>
        <nav className='container mx-auto flex items-center justify-between py-4 px-6'>
            {/* Left Logo */}
            <div>
                <Link to="/" className='text-2xl font-medium'>
                    Siblus
                </Link>
            </div>

            {/* Center Navigation - Desktop */}
            <div className='hidden md:flex space-x-8'>
                <Link to="/collection/all?gender=Men" className='text-gray-700 hover:text-black text-sm font-medium uppercase transition-colors'>
                    Men
                </Link>
                <Link to="/collection/all?gender=Women" className='text-gray-700 hover:text-black text-sm font-medium uppercase transition-colors'>
                    Women
                </Link>
                <Link to="/collection/all?category=Top Wear" className='text-gray-700 hover:text-black text-sm font-medium uppercase transition-colors'>
                    Top Wear
                </Link>
                <Link to="/collection/all?category=Bottom Wear" className='text-gray-700 hover:text-black text-sm font-medium uppercase transition-colors'>
                    Bottom Wear
                </Link>
            </div>

            {/* Right Section */}
            <div className='flex items-center space-x-4'>
                {user && user.role === "admin" && (
                    <Link to="/admin" className='block bg-black px-2 rounded text-sm text-white'>Admin</Link>
                )}
                <Link to="/profile" className='hover:text-black transition-colors'>
                    <HiOutlineUser className='h-6 w-6 text-gray-700' />
                </Link>

                <button onClick={toggleDrawer} className="relative hover:text-black transition-colors">
                    <HiOutlineShoppingBag className='h-6 w-6 text-gray-700' />
                    {cartItemCount > 0 &&
                        (<span className='bg-red-500 -top-1 -right-1 absolute text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center'>
                            {cartItemCount}</span>)}

                </button>

                {/* search */}
                <div className='overflow-hidden hidden sm:block'>
                    <SearchBar />
                </div>

                <button onClick={toggleNavDrawer} className='md:hidden'>
                    <HiBars3BottomRight className='h-6 w-6 text-gray-700' />
                </button>
            </div>
        </nav>

        {/* Cart Drawer */}
        <CardDrawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />

        {/* Mobile Navigation Drawer */}
        <>
            {/* Overlay */}
            {navDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                    onClick={toggleNavDrawer}
                />
            )}

            {/* Drawer - Now opens from LEFT */}
            <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${navDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className='flex justify-between items-center p-4 border-b'>
                    <span className='text-lg font-medium'>Menu</span>
                    <button onClick={closeNavDrawer} className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
                        <IoMdClose className="h-6 w-6 text-gray-600" />
                    </button>
                </div>

                {/* Mobile Navigation Links */}
                <div className='p-4 flex flex-col space-y-4'>
                    <Link
                        to="/collection/all?gender=Men"
                        className='text-gray-700 hover:text-black text-base font-medium py-2 border-b border-gray-100'
                        onClick={toggleNavDrawer}
                    >
                        Men
                    </Link>
                    <Link
                        to="/collection/all?gender=Women"
                        className='text-gray-700 hover:text-black text-base font-medium py-2 border-b border-gray-100'
                        onClick={toggleNavDrawer}
                    >
                        Women
                    </Link>
                    <Link
                        to="/collection/all?category=Top Wear"
                        className='text-gray-700 hover:text-black text-base font-medium py-2 border-b border-gray-100'
                        onClick={toggleNavDrawer}
                    >
                        Top Wear
                    </Link>
                    <Link
                        to="/collection/all?category=Bottom Wear"
                        className='text-gray-700 hover:text-black text-base font-medium py-2 border-b border-gray-100'
                        onClick={toggleNavDrawer}
                    >
                        Bottom Wear
                    </Link>
                </div>
            </div>
        </>
    </>
}

export default Navbar