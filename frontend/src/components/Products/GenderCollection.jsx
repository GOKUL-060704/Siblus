import React from 'react'
import mensCollectionImage from '../../assets/mens-collection.webp'
import womensCollectionImage from '../../assets/womens-collection.webp'
import { Link } from 'react-router-dom'

const GenderCollection = () => {
    return (
        <section className='py-16 px-4 lg:px-0'>
            <div className='container mx-auto flex flex-col md:flex-row gap-8'>
                {/* womens collection */}
                <div className='relative flex-1'>
                    <img src={womensCollectionImage} alt="Womens Collection" className='w-full h-[700px] object-cover' />
                    <div className='absolute bottom-8 left-8 bg-white bg-opacity-90 p-4'>
                        <h2 className='text-2xl font-bold mb-2'>Womens Collection</h2>
                        <p className='text-gray-600 mb-4'>Discover our latest collection of women's clothing</p>
                        <Link to="/collections/all?gender=Women" className='text-gray-900 underline'>Shop Now</Link>
                    </div>  
                </div> 
                {/* mens collection */}
                <div className='relative flex-1'>
                    <img src={mensCollectionImage} alt="Mens Collection" className='w-full h-[700px] object-cover' />
                    <div className='absolute bottom-8 left-8 bg-white bg-opacity-90 p-4'>
                        <h2 className='text-2xl font-bold mb-2'>Mens Collection</h2>
                        <p className='text-gray-600 mb-4'>Discover our latest collection of men's clothing</p>
                        <Link to="/collections/all?gender=Men" className='text-gray-900 underline'>Shop Now</Link>
                    </div>  
                </div>
                
            </div>
        </section>
    )
}

export default GenderCollection

