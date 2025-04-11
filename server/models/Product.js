import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {type: String,required: true},
    description: {type: Array,required: true},
    price: {type: Number,required: true},
    offerprice: {type: Number,required: true},


},{timestamp : true})
const Product = mongoose.models.product || mongoose.model('Product',productSchema)
 
export default Product;