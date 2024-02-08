import mongoose from "mongoose";
import ProductRepository from "../src/repositories/products.repository.js";
import Assert from "assert";
import dotenv from "dotenv";

const { ObjectId } = mongoose.Types;
mongoose.set('strictQuery', false);
dotenv.config();

const assert = Assert.strict;


describe("Test de ProductsRepository", function () {
    before(async function () {
        this.timeout(5000);
        await mongoose.connect(process.env.MONGO_TEST);
    });

    after(async function () {
        await mongoose.disconnect();
    });
    before(function () {
        this.products = new ProductRepository();
    })

    it("Se debe crear un producto", async function () {
        let mockProduct = {
            name: "Producto 1",
            description: "Descripcion 1",
            price: 100,
            stock: 10,
            category: "Categoria 1",
            thumbnail: "https://picsum.photos/200/300"
        };
        const result = await this.products.addProduct(mockProduct);
        assert.ok(result._id);
    });

    it("Se deben obtener todos los productos", async function () {
        const result = await this.products.getProducts();
        assert.ok(result);
    })

    it("Se debe eliminar un producto", async function () {
        let mockProduct = {
            name: "Producto 1",
            description: "Descripcion 1",
            price: 100,
            stock: 10,
            category: "Categoria 1",
            thumbnail: "https://picsum.photos/200/300"
        };
        const result = await this.products.addProduct(mockProduct);
        const resultDelete = await this.products.deleteProduct(result._id);
        assert.ok(resultDelete);
    })

    it("Se debe poder actualizar un producto", async function () {
        let mockProduct = {
            name: "Producto 1",
            description: "Descripcion 1",
            price: 100,
            stock: 10,
            category: "Categoria 1",
            thumbnail: "https://picsum.photos/200/300"
        };
        const result = await this.products.addProduct(mockProduct);
        const resultUpdate = await this.products.updateProduct(result._id, { name: "Producto 2" });
        assert.ok(resultUpdate);
        assert.strictEqual(resultUpdate.message, "Producto actualizado");
    })

})