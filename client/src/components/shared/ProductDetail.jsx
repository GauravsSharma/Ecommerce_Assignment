import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa6'
import { Link, useParams } from 'react-router-dom'

const ProductDetail = () => {
    const [loading, setLoading] = useState(false)
    const [product, setProduct] = useState(null)
    const [selectedImage, setSelectedImage] = useState(product?.images[0]?.url || '');
    const { id } = useParams()
    const getSingleProduct = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`https://ecommerce-assignment-2-qcjd.onrender.com/api/v1/products/${id}`, {
            headers: {
              "Content-Type": "application/json"
            }
          })
          setLoading(false);
          setProduct(res.data.product)
          setSelectedImage(res.data.product.images[0].url)
        } catch (error) {
          setLoading(false)
          console.log(error.message);
    
        }
      }
      useEffect(()=>{
        getSingleProduct()
      },[])
      if(loading){
        return <div className='h-screen flex justify-center items-center text-2xl font-bold'>Loading...</div>
      }
      return (
        <div className="container relative flex justify-center items-center w-full">
              <Link to="/" className='absolute top-2 left-2  '>
             <div className='h-10 w-12 shadow-lg border bg-black/50 rounded-lg flex justify-center items-center text-white'><FaChevronLeft/></div>
          </Link>
          <div className="flex flex-col p-5 sm:p-20 md:flex-row gap-6 bg-slate-200">
            {/* Image Section */}
            <div className="w-full md:w-1/2 flex flex-col items-center">
              {/* Main Image */}
              <img
                src={selectedImage}
                alt={product?.name}
                className="w-full h-96 object-contain rounded-md shadow-md"
              />
    
              {/* Thumbnail Images */}
              <div className="flex justify-center gap-3 mt-4 overflow-x-auto">
                {product?.images?.map((img, index) => (
                  <img
                    key={index}
                    src={img.url}
                    alt={`product-img-${index}`}
                    className={`w-16 h-16 object-cover rounded cursor-pointer ${
                      selectedImage === img.url ? 'border-2 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedImage(img.url)}
                  />
                ))}
              </div>
            </div>
    
            {/* Product Details */}
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-semibold text-gray-800">{product?.name}</h2>
              <p className="text-md text-gray-500 mb-4">{product?.description}</p>
              <p className="text-lg font-bold text-gray-800 mb-4">Price: Rs. {product?.price}</p>
    
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-700">Category: {product?.category}</p>
                <p className="text-sm text-gray-700">Size: {product?.size}</p>
                <p className="text-sm text-gray-700">Color: {product?.color}</p>
                <p className="text-sm text-gray-700">Brand: {product?.brand}</p>
                <p className="text-sm text-gray-700">In Stock: {product?.stock}</p>
              </div>
    
              {/* Add to Cart Button */}
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md w-full md:w-auto">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      );
}

export default ProductDetail