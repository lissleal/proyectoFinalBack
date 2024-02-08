import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { v4 as uuidv4 } from 'uuid';

const productCollection = "products";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 100 },
    price: { type: Number, required: true },
    code: { type: String, required: false, default: () => uuidv4() },
    category: { type: String, required: true, max: 100 },
    stock: { type: Number, required: true },
    thumbnail: { type: String, required: true, max: 100 },
    owner: {
        type: String,
        ref: "Users",
        default: "admin"
    }
})

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
