import React from 'react'
import { Link } from 'react-router-dom'
import { TbBrandMeta } from 'react-icons/tb';
import { IoLogoInstagram } from 'react-icons/io';
import { TbBrandTwitter } from 'react-icons/tb';
import { FiPhone } from 'react-icons/fi';

const Footer = () => {
    return <footer className='container mx-auto my-5 grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0 border-t border-gray-200 pt-6'>
        <div>
            <h3 className='text-lg text-gray-800 mb-4'>Newsletter</h3>
            <p className='text-gray-500 mb-4'>
                Be the first to hear about the new product , exclusive events , and online offers
            </p>
            <p className='font-medium text-sm text-gray-600 mb-6'>
                Sign Up and get 10% on your first order
            </p>
            {/* Newsletter form */}
            <form className='flex'>
                <input type="email" placeholder='Enter your email' className='p-3 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all' />
                <button className='bg-black text-white px-4 py-2 rounded-r-md'>Subscribe</button>
            </form>
        </div>

        {/* Shop links */}
        <div>
            <h3 className='text-lg text-gray-800 mb-4'>Shop</h3>
            <ul className='space-y-2 text-gray-600 '>
                <li>
                    <Link to='/collection/all?gender=Men' className='hover:text-gray-800'>Men's Top Wear</Link>
                </li>
                <li>
                    <Link to='/collection/all?gender=Women' className='hover:text-gray-800'>Women's Top Wear</Link>
                </li><li>
                    <Link to='/collection/all?category=Top+Wear' className='hover:text-gray-800'>Men's Bottom Wear</Link>
                </li><li>
                    <Link to='/collection/all?category=Bottom+Wear' className='hover:text-gray-800'>Women's Bottom Wear</Link>
                </li>
            </ul>
        </div>

        {/* support links */}
        <div>
            <h3 className='text-lg text-gray-800 mb-4'>Support</h3>
            <ul className='space-y-2 text-gray-600 '>
                <li>
                    <Link to='/men' className='hover:text-gray-800'>Contact Us</Link>
                </li>
                <li>
                    <Link to='/men' className='hover:text-gray-800'>About Us</Link>
                </li><li>
                    <Link to='/men' className='hover:text-gray-800'>FAQs</Link>
                </li><li>
                    <Link to='/men' className='hover:text-gray-800'>Features</Link>
                </li>
                <li>
                    <Link to='/developer' className='hover:text-gray-800'>Developer</Link>
                </li>
            </ul>
        </div>

        {/* Follow Section */}
        <div>
            <h3 className='text-lg text-gray-800 mb-4'>Follow Us</h3>
            <div className="flex items-center space-x-4 mb-6">
                <a href="https://www.facebook.com" target='_blank' rel='noopener noreferrer'>
                    <TbBrandMeta className='h-5 w-5 text-gray-700 hover:text-gray-500 transition-colors' />
                </a>
                <a href="https://www.instagram.com" target='_blank' rel='noopener noreferrer'>
                    <IoLogoInstagram className='h-5 w-5 text-gray-700 hover:text-gray-500 transition-colors' />
                </a>
                <a href="https://www.twitter.com" target='_blank' rel='noopener noreferrer'>
                    <TbBrandTwitter className='h-5 w-5 text-gray-700 hover:text-gray-500 transition-colors' />
                </a>
            </div>
            <p className='text-gray-500'>Call Us </p>
            <p>
                <FiPhone className='inline-block mr-2' />
                9363255885
            </p>
        </div>
        {/* footerbottom text */}
        <div className="mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6 col-span-1 md:col-span-4">
            <p className='text-gray-500 text-sm tracking-tighter text-center'>
                @ 2026 , CompileTab. All Rights Reserved
            </p>
        </div>
    </footer>
}

export default Footer