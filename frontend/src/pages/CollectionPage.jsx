import React, { useEffect, useRef, useState } from 'react'
import { FaFilter } from "react-icons/fa"
import FilterSideBar from '../components/Products/FilterSideBar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productsSlice';


// const products = [
//     {
//         _id: 1,
//         name: "Product 1",
//         price: 100,
//         images: [
//             {
//                 url: "https://picsum.photos/500?random=1",
//                 altText: "Stylish Jacket 1",
//             }
//         ]
//     },
//     {
//         _id: 2,
//         name: "Product 2",
//         price: 100,
//         images: [
//             {
//                 url: "https://picsum.photos/500?random=2",
//                 altText: "Stylish Jacket 1",
//             }
//         ]
//     },
//     {
//         _id: 3,
//         name: "Product 3",
//         price: 100,
//         images: [
//             {
//                 url: "https://picsum.photos/500?random=3",
//                 altText: "Stylish Jacket 1",
//             }
//         ]
//     },
//     {
//         _id: 1,
//         name: "Product 4",
//         price: 100,
//         images: [
//             {
//                 url: "https://picsum.photos/500?random=4",
//                 altText: "Stylish Jacket 1",
//             }
//         ]
//     },
//     {
//         _id: 5,
//         name: "Product 1",
//         price: 100,
//         images: [
//             {
//                 url: "https://picsum.photos/500?random=5",
//                 altText: "Stylish Jacket 1",
//             }
//         ]
//     },
//     {
//         _id: 6,
//         name: "Product 2",
//         price: 100,
//         images: [
//             {
//                 url: "https://picsum.photos/500?random=6",
//                 altText: "Stylish Jacket 1",
//             }
//         ]
//     },
//     {
//         _id: 7,
//         name: "Product 3",
//         price: 100,
//         images: [
//             {
//                 url: "https://picsum.photos/500?random=7",
//                 altText: "Stylish Jacket 1",
//             }
//         ]
//     },
//     {
//         _id: 8,
//         name: "Product 4",
//         price: 100,
//         images: [
//             {
//                 url: "https://picsum.photos/500?random=8",
//                 altText: "Stylish Jacket 1",
//             }
//         ]
//     }
// ]

const CollectionPage = () => {
    const {collection} = useParams();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const {products,loading,error } = useSelector((state) => state.products);
    const queryParams = Object.fromEntries([...searchParams])
    const sideBar = useRef(null);
    const [isSidebarOpen, setIsSideBarOpen] = useState(false);


    useEffect(()=>{
        dispatch(fetchProductsByFilters({collection,...queryParams}))
    },[dispatch,collection,searchParams])

    const toggleSideBar = () => {
        setIsSideBarOpen(!isSidebarOpen);
    }

    const handleClickOutSide = (event) => {
        if (sideBar.current && !sideBar.current.contains(event.target)) {
            setIsSideBarOpen(false);
        }
    }

    useEffect(() => {
        // add event listener for clicks 
        document.addEventListener("mousedown", handleClickOutSide);
        return () => {
            document.removeEventListener("mousedown", handleClickOutSide);
        }
    }, [])

    return (
        <div className='flex flex-col lg:flex-row '>
            {/* mobile filter */}
            <button onClick={toggleSideBar}
                className='lg:hidden border p-2 flex justify-center items-center'>
                <FaFilter className='mr-2 ' /> filter
            </button>

            {/* filter sidebar */}
            <div ref={sideBar}
                className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}>
                <FilterSideBar />
            </div>

            <div className='grow p-4'>
                <h2 className='text-2xl uppercase mb-4'>All Collection</h2>

                {/* sort Options */}

                <SortOptions />

                {/* Product Grid */}

                <ProductGrid products={products} loading={loading} error={error}/>

            </div>
        </div>
    )
}

export default CollectionPage