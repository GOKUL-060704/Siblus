import React, { useEffect, useState } from 'react'
import axios from 'axios'

import Hero from '../components/Layout/Hero'
import GenderCollection from '../components/Products/GenderCollection'
import NewArrivals from '../components/Products/NewArrivals'
import ProductDetails from '../components/Products/ProductDetails'
import ProductGrid from '../components/Products/ProductGrid'
import FeaturedCollection from '../components/Products/FeaturedCollection'
import FeaturesSecion from '../components/Products/FeaturesSecion'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductsByFilters } from '../redux/slices/productsSlice'

// const placeholderProducts = [
//   {
//     _id: 1,
//     name: "Product 1",
//     price: 100,
//     images: [
//       {
//         url: "https://picsum.photos/500?random=1",
//         altText: "Stylish Jacket 1",
//       }
//     ]
//   },
//   {
//     _id: 2,
//     name: "Product 2",
//     price: 100,
//     images: [
//       {
//         url: "https://picsum.photos/500?random=2",
//         altText: "Stylish Jacket 1",
//       }
//     ]
//   },
//   {
//     _id: 3,
//     name: "Product 3",
//     price: 100,
//     images: [
//       {
//         url: "https://picsum.photos/500?random=3",
//         altText: "Stylish Jacket 1",
//       }
//     ]
//   },
//   {
//     _id: 1,
//     name: "Product 4",
//     price: 100,
//     images: [
//       {
//         url: "https://picsum.photos/500?random=4",
//         altText: "Stylish Jacket 1",
//       }
//     ]
//   },
//   {
//     _id: 5,
//     name: "Product 1",
//     price: 100,
//     images: [
//       {
//         url: "https://picsum.photos/500?random=5",
//         altText: "Stylish Jacket 1",
//       }
//     ]
//   },
//   {
//     _id: 6,
//     name: "Product 2",
//     price: 100,
//     images: [
//       {
//         url: "https://picsum.photos/500?random=6",
//         altText: "Stylish Jacket 1",
//       }
//     ]
//   },
//   {
//     _id: 7,
//     name: "Product 3",
//     price: 100,
//     images: [
//       {
//         url: "https://picsum.photos/500?random=7",
//         altText: "Stylish Jacket 1",
//       }
//     ]
//   },
//   {
//     _id: 8,
//     name: "Product 4",
//     price: 100,
//     images: [
//       {
//         url: "https://picsum.photos/500?random=8",
//         altText: "Stylish Jacket 1",
//       }
//     ]
//   }
// ]

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);


  useEffect(() => {
    dispatch(fetchProductsByFilters({
      gender: "Women",
      category: "Bottom",
      limit: 8,
    })
    );
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
        setBestSellerProduct(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBestSeller();
  }, [dispatch])

  return <>
    <Hero />
    <GenderCollection />
    <NewArrivals />
    {/* BestSellers */}
    <h2 className='text-3xl text-center font-bold mb-4'>Best Seller</h2>
    {bestSellerProduct ? (<ProductDetails productId={bestSellerProduct._id} />) : (
      <p className='text-center'>Loading best seller product ...</p>
    )}
    <div className='container mx-auto'>
      <h2 className='text-3xl text-center font-bold mb-4'>
        Top Wears for Women
      </h2>
      <ProductGrid products={products} lading={loading} error={error} />

      <FeaturedCollection />

      <FeaturesSecion />
    </div>
  </>
}

export default Home