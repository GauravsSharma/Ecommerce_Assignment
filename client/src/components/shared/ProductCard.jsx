import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { FaRegTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const ProductCard = ({
    image,
    name,
    brand,
    price,
    id,
    setOpenDialogBox,
    setProductId
}) => {


    return (
        <div className="flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg my-6 w-full sm:w-72 relative">
            <div className="m-1  rounded-md h-96 flex justify-center items-center relative">
                <img className="w-full h-full object-cover" src={image} alt="product" />
                <Popover>
                    <PopoverTrigger>
                        <EllipsisVertical
                            className='absolute top-1 right-2 text-white cursor-pointer'
                        />
                    </PopoverTrigger>
                    <PopoverContent className="absolute p-0 w-28 -right-2 -top-40 sm:-right-10">
                        <Link to={`/update/product/${id}`}>
                            <div className="flex gap-2 px-2 py-2 cursor-pointer hover:bg-slate-300 justify-start items-center"
                            >
                                <MdEdit className='text-md' />
                                Edit</div>
                        </Link>
                        <div className="flex gap-2 px-2 cursor-pointer hover:bg-slate-300 pb-2 justify-start items-center"
                        onClick={() => {
                            setProductId(id)
                            setOpenDialogBox(true)}}
                        >
                            <FaRegTrashAlt className='text-red-500 text-md' />
                            Delete</div>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="py-1 px-4">
                <h4 className="text-left text-md font-semibold text-slate-500">
                    {brand}
                </h4>
                <p className="text-lg text-left font-semibold text-slate-800 uppercase">
                    {name}
                </p>
                <p className="text-sm text-left font-semibold text-slate-800">
                    Rs. {price}
                </p>
            </div>
            <Link to={`/product/view/${id}`} className="flex justify-center p-2">
                <button
                    className="w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                >
                    View
                </button>
            </Link>
          
        </div>
    );
}

export default ProductCard;
