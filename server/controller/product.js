import { getDataUrl } from "../db/dataUri.js";
import Product from "../model/ProductModel.js";
import { v2 as cloudinary } from "cloudinary"

export const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, size, color, brand, stock } = req.body;
        const images = req.files;     
        if (!name || !description || !price || !category || !size || !color || !brand || !stock || images.length===0) {
            return res.status(400).json({
                success: false,
                message: "Something is missing"
            });
        }
        const fileUries = images.map((image)=>{
            return getDataUrl(image);
        })
        console.log("hello",fileUries);
        const uploadedImgArray = await Promise.all(
            fileUries.map(async (image) => {
                const myCloud = await cloudinary.uploader.upload(image.content, {
                    folder: "ecommerce"
                });
                return { public_id: myCloud.public_id, url: myCloud.secure_url };
            })
        );
        console.log(uploadedImgArray);
        
        const productObj = {
            name,
            description,
            price,
            category,
            size,
            color,
            brand,
            stock,
            images: uploadedImgArray
        };
        const product = new Product(productObj);
        await product.save();
        res.status(201).json({
            success: true,
            message: "Product added successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, size, color, brand, stock } = req.body;
        const id = req.params.id;
        const images = req.files;
        // Find the product by ID
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Update product fields if they exist in the request
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (category) product.category = category;
        if (size) product.size = size;
        if (color) product.color = color;
        if (brand) product.brand = brand;
        if (stock) product.stock = stock;

        if (images && images.length > 0) {
            const oldImages = product.images;
            await Promise.all(
                oldImages.map(async (img) => {
                    const publicId = img.public_id;
                    if (publicId) {
                        await cloudinary.uploader.destroy(publicId);
                    }
                })
            );

            const uploadedImgArray = await Promise.all(
                images.map(async (image) => {
                    const myCloud = await cloudinary.uploader.upload(image, {
                        folder: "ecommerce"
                    });
                    return {
                        secure_url: myCloud.secure_url,
                        public_id: myCloud.public_id
                    };
                })
            );

            product.images = uploadedImgArray;
        }
        await product.save();

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        if (!products) {
            return res.status(404).json({
                success: false,
                message: "Products not found"
            });
        }
        return res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export const getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        return res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export const deleteProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        const oldImages = product.images;
        await Promise.all(
            oldImages.map(async (img) => {
                const publicId = img.public_id;
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            })
        );

        await product.deleteOne(); 
        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

