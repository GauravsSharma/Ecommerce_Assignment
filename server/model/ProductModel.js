import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Men', 'Women', 'Kids', 'Unisex'],
    trim: true
  },
  size: {
    type: String,
    required: true,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  color: {
    type: [String], // Array to allow multiple colors
    required: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  images: {
    type: [{
        public_id:{type:String},
        url:{type:String},
    }], // Array of image URLs
    required: true
  },
},{timestamps:true});

const Product = model('Product', productSchema);
export default Product;
