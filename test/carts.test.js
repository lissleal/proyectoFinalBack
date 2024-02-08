import mongoose from "mongoose";
import CartRepository from "../src/repositories/carts.repository.js";
import Assert from "assert";
import dotenv from "dotenv";

mongoose.set('strictQuery', false);
dotenv.config();
const { ObjectId } = mongoose.Types;

const assert = Assert.strict;


describe("Test CartsRepository", function () {
    before(async function () {
        this.timeout(5000);
        await mongoose.connect(process.env.MONGO_TEST);
    });

    after(async function () {
        await mongoose.disconnect();
    });
    before(function () {
        this.carts = new CartRepository();
    })

    it("Se debe crear un carro", async function () {
        let mockCarro = {
            name: "Carro 1",
            description: "Descripcion 1",
            products: [
                {
                    productId: "60b0e4d9a2e8f22a7c1b1d4f",
                    quantity: 1
                }
            ]
        }
        const result = await this.carts.addCart(mockCarro);
        assert.ok(result._id);
    });

    it("Se debe obtener todos los carros", async function () {
        const result = await this.carts.readCarts();
        assert.ok(result);
    })

    it("Se debe leer los productos de un carro", async function () {
        const mockCarro = {
            name: "Carro 2",
            description: "Descripcion 2",
            products: [
                {
                    productId: "60b0e4d9a2e8f22a7c1b1d4f",
                    quantity: 1
                }
            ]
        }
        const result = await this.carts.addCart(mockCarro);
        const cartId = result._id;
        const prodInCart = await this.carts.getProductsInCart(cartId);
        assert.ok(prodInCart);
    })


    it("Se debe poder añadir producto a carro", async function () {
        let mockCarro = {
            name: "Carro 3",
            description: "Descripcion 3",
            products: [
                {
                    productId: mongoose.Types.ObjectId("60b0e4d9a2e8f22a7c1b1d4f"),
                    quantity: 1
                }
            ]
        }
        const result = await this.carts.addCart(mockCarro);
        const cartId = result._id.toString();
        let mockProduct = {
            productId: "60b0e4d9a2e8f22a7c1b1d4f",
            quantity: 2
        }
        const addedProduct = await this.carts.addProductInCart(cartId, mockProduct.productId);
        assert.ok(addedProduct);
    })

    it("Se debe poder eliminar producto de carro", async function () {
        let mockCarro = {
            name: "Carro 4",
            description: "Descripcion 4",
            products: [
                {
                    productId: mongoose.Types.ObjectId("60b0e4d9a2e8f22a7c1b1d4f"),
                    quantity: 1
                }
            ]
        }
        const result = await this.carts.addCart(mockCarro);
        const cartId = result._id.toString();
        let mockProduct = {
            productId: "60b0e4d9a2e8f22a7c1b1d4f",
            quantity: 2
        }
        const deletedProduct = await this.carts.deleteProductInCart(cartId, mockProduct.productId);
        assert.ok(deletedProduct);
    })



});