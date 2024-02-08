import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.set('strictQuery', false); //Para que no de error deprecated al buscar por query


const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to database");
    } catch (error) {
        console.log("Error connecting to database: ", error);
        process.exit();
    }
}

export default connectMongo;

