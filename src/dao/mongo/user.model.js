import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, max: 100 },
    surname: { type: String, required: false, max: 100 },
    email: { type: String, required: true, max: 100 },
    age: { type: Number, required: false, max: 100 },
    password: { type: String, required: false, max: 100 },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
        required: true,
        unique: true
    },
    role: { type: String, required: true, max: 100, enum: ['user', 'admin', 'premium'], default: 'user' },
    documents: [{ filename: String, destination: String }],
    last_connection: { type: Date, required: false }
})

const userModel = mongoose.model(userCollection, userSchema);
export default userModel;