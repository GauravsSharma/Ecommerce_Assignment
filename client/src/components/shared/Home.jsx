import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ProductCard from './ProductCard'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast, Toaster } from 'sonner'

const Home = () => {
  const [products,setProducts] = useState(null)
  const [loading,setLoading] = useState(false);
  const [deleteLoading,setDeleteLoadig] = useState(false)
  const [openDialogBox, setOpenDialogBox] = useState(false);
  const [productId,setProductId] = useState(null)

  const getProducts = async()=>{
   try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/api/v1/products");
      setProducts(res.data.products)
      setLoading(false);
   } catch (error) {
      console.log(error.message);
      setLoading(false);
   }
  }
  useEffect(()=>{
    getProducts()
  },[])
  if(loading){
    return <div className='h-screen flex justify-center items-center text-2xl font-bold'>Loading...</div>
  }
  const handleDelete = async()=>{
    try {
      setDeleteLoadig(true)
      let res  = await axios.delete(`http://localhost:3000/api/v1/products/${productId}`)
      setDeleteLoadig(false)
      if(res.data.success){
       toast.success("Item Deleted.")     
        getProducts();
        setOpenDialogBox(false)
      }
    } catch (error) {
      setDeleteLoadig(false)
      toast.error("Something went wrong !")
      console.log(error.message);
      
    }
  }
  
  return (
    <div className=' bg-slate-200 text-center py-5 sm:px-5 md:px-20 sm:py-10'>
        <h1 className='text-3xl font-bold text-slate-800 text-center mb-5 '>Product List</h1>
        <Link to="/add/product">
        <Button className="w-[70%]">Add product</Button>
        </Link>
        <div className="flex justify-normal items-center gap-3 flex-wrap">
            {
              products?.map((product)=>(
                <ProductCard 
                key={product._id}
                id={product._id}
                name={product.name}
                brand={product.brand}
                price={product.price}
               image={product.images[0].url}
               setOpenDialogBox={setOpenDialogBox}
               setProductId={setProductId}
                />
              ))
            }
        </div>
        <Dialog open={openDialogBox} onOpenChange={setOpenDialogBox}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Product ?</DialogTitle>
                        <DialogDescription>
                            Are you sure ? This action will delete this product.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="submit" disabled={deleteLoading} className="bg-red-500 hover:bg-red-600 w-full"
                        onClick={handleDelete}
                        >{deleteLoading?"Loading...":"Delete"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Toaster/>
    </div>
  )
}

export default Home