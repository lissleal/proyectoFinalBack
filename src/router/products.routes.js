import express from "express";
import { getProducts, createProduct, deleteProduct, getProductById, updateProduct, manageProducts } from "../controllers/products.controller.js";

const productsRouter = express.Router()


productsRouter.get("/manageProducts", manageProducts)
productsRouter.get("/:pid", getProductById)
productsRouter.get("/", getProducts)
productsRouter.post("/", createProduct)
productsRouter.put("/update/:pid", updateProduct)
productsRouter.delete("/delete/:pid", deleteProduct)


export default productsRouter;