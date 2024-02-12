import mongoose from "mongoose";

const ticketCollection = "tickets";

const productSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' }, // Referencia al modelo de productos
    quantity: { type: Number, required: true },
    name: { type: String, required: true }
});

const ticketSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, max: 100 },
    purchase_datetime: { type: Date, required: true, default: Date.now() },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true, max: 100 },
    products: [productSchema],
    deliveryAddress: { type: String, required: true },
    contactPhone: { type: String, required: true }
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;