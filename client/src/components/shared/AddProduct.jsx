import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Axis3dIcon, Plus } from 'lucide-react';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '../ui/button';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Toaster } from '../ui/sonner';
import { toast } from 'sonner';
import { FaChevronLeft } from "react-icons/fa6";


const AddProductForm = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState(null)
  const { id } = useParams()
  const handleImageChange = (e, setFieldValue, currentImages) => {
    const files = Array.from(e.target.files);
    let newImagePreviews = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        newImagePreviews.push(reader.result);
        if (newImagePreviews.length === files.length) {
          setSelectedImages((prev) => [...prev, ...newImagePreviews]);
        }
      };
    });

    setFieldValue('images', [...(Array.isArray(currentImages) ? currentImages : []), ...files]);
  };
  const handleSubmit = async (data,resetForm) => {
    setLoading(true);
    try {
      const res = await axios.post("https://ecommerce-assignment-2-qcjd.onrender.com/api/v1/products", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setLoading(false)
      toast.success("Added")
      console.log('Product added successfully:', res.data);
    } catch (error) {
      setLoading(false)
      console.error('Error adding product:', error.response ? error.response.data : error.message);
    }
  };
  const handleUpdate = async (data,resetForm) => {
    setLoading(true);
    try {
      const res = await axios.put(`https://ecommerce-assignment-2-qcjd.onrender.com/api/v1/products/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      toast.success("Updated")
      setLoading(false)
      console.log('Product updated successfully:', res.data);
    } catch (error) {
      setLoading(false)
      console.error('Error adding product:', error.response ? error.response.data : error.message);
    }
  }
  useEffect(() => {
    if (id) {
      getSingleProduct();
    }
  }, [id])
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
    } catch (error) {
      setLoading(false)
      console.log(error.message);

    }
  }
  console.log(product);
  const ProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number().required('Price is required').positive('Price must be positive'),
    category: Yup.string().required('Category is required'),
    size: Yup.string().required('Size is required'),
    color: Yup.string().required('Color is required'),
    brand: Yup.string().required('Brand is required'),
    stock: Yup.number().required('Stock is required').integer('Stock must be an integer'),
    images: !id&&Yup.array()
    .min(1, 'At least one image is required')
    .required('Images are required')
  });
  return (
    <>
    <Formik
      enableReinitialize
      initialValues={{
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || '',
        category: product?.category || '',
        size: product?.size || '',
        color: product?.color.join(",") || '',
        brand: product?.brand || '',
        stock: product?.stock || '',
        images: null // Initialize as an empty array
      }}
      validationSchema={ProductSchema}
      onSubmit={(values,{resetForm}) => {
        const formdata = new FormData()
        formdata.append("name", values.name)
        formdata.append("description", values.description)
        formdata.append("price", values.price)
        formdata.append("category", values.category)
        formdata.append("size", values.size)
        formdata.append("color", values.color)
        formdata.append("brand", values.brand)
        formdata.append("stock", values.stock)
        if (values.images) {
          values.images.forEach((image) => {
            formdata.append("images", image); // Append each image file
          });
        }
        if(id){
          handleUpdate(formdata,resetForm)
        }
        else{
          handleSubmit(formdata,resetForm);
        }
      }}
    >
      {({ setFieldValue, values }) => (

        <Form className="space-y-4 p-3 sm:px-20 sm:py-10">
          <Link to="/">
             <div className='h-10 w-12 shadow-lg border rounded-lg flex justify-center items-center'><FaChevronLeft/></div>
          </Link>
          <h1 className='text-2xl font-semibold '>{id?"Update":"Add"} Products</h1>

          <div className="flex flex-col">
            <label>Product Name</label>
            <Field name="name" placeholder="Product name" as={Input} />
            <ErrorMessage component="div" className="text-red-600" name="name" />
          </div>

          <div className="flex flex-col">
            <label>Product Description</label>
            <textarea
              name="description"
              placeholder="Product description"
              className="h-20 border border-gray-300 rounded p-2"
              value={values.description}
              onChange={(e) => setFieldValue('description', e.target.value)}
            />
            <ErrorMessage component="div" className="text-red-600" name="description" />
          </div>

          <div className="flex flex-col">
            <label>Product Price</label>
            <Field name="price" placeholder="Product price" type="number" as={Input} />
            <ErrorMessage component="div" className="text-red-600" name="price" />
          </div>

          <div className="flex flex-col">
            <label>Category</label>
            <Select value={values.category} onValueChange={(value) => setFieldValue('category', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  <SelectItem value="Men">Men</SelectItem>
                  <SelectItem value="Women">Women</SelectItem>
                  <SelectItem value="Kids">Kids</SelectItem>
                  <SelectItem value="Unisex">Unisex</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <ErrorMessage component="div" className="text-red-600" name="category" />
          </div>
          <div className="flex flex-col">
            <label>Size</label>
            <Select value={values.size} onValueChange={(value) => setFieldValue('size', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a size" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sizes</SelectLabel>
                  <SelectItem value="XS">XS</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                  <SelectItem value="XXL">XXL</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <ErrorMessage component="div" className="text-red-600" name="size" />
          </div>

          <div className="flex flex-col">
            <label>Color</label>
            <Field name="color" placeholder="Enter color" as={Input} />
            <ErrorMessage component="div" className="text-red-600" name="color" />
          </div>

          <div className="flex flex-col">
            <label>Brand</label>
            <Field name="brand" placeholder="Enter brand" as={Input} />
            <ErrorMessage component="div" className="text-red-600" name="brand" />
          </div>

          <div className="flex flex-col">
            <label>Stock</label>
            <Field name="stock" placeholder="Enter stock" type="number" as={Input} />
            <ErrorMessage component="div" className="text-red-600" name="stock" />
          </div>

          <div className="image-preview flex gap-2 justify-start items-center">
            {selectedImages.length > 0 && (
              <div className="flex space-x-2">
                {selectedImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt="Selected"
                    className="w-16 h-16 object-cover rounded"
                  />
                ))}
              </div>
            )}
            <div>
              <label htmlFor="images" className="h-10 w-10 flex justify-center items-center rounded-full text-xl border-2 border-slate-900">
                <Plus />
              </label>
              <input
                name="images"
                type="file"
                id="images"
                multiple
                onChange={(e) => handleImageChange(e, setFieldValue, values.images)}
                className="hidden"
              />
              <ErrorMessage name="images" component="div" className="text-red-600" />
            </div>
          </div>

          <Button type="submit" className={`w-full ${loading ? "bg-slate-900" : "bg-slate-800"}`} disabled={loading} >{loading ? "Loading..." : "Submit"}</Button>
        </Form>
      )}
    </Formik>
      <Toaster/>
      </>
  );
};

export default AddProductForm;
