import mongoose from "mongoose";
import UserRepository from "../src/repositories/users.repository.js";
import Assert from "assert";
import dotenv from "dotenv";

const { ObjectId } = mongoose.Types;
mongoose.set('strictQuery', false);
dotenv.config();

const assert = Assert.strict;

describe("Test UserRepository", function () {
    before(async function () {
        this.timeout(5000);
        await mongoose.connect(process.env.MONGO_TEST);
    });

    after(async function () {
        await mongoose.disconnect();
    });
    before(function () {
        this.users = new UserRepository();
    })

    this.afterEach(async function () {
        await mongoose.connection.collections.users.drop();
    })

    it("Se debe crear un usuario", async function () {
        let mockUser = {
            name: "Usuario 1",
            surname: "Apellido 1",
            email: "emailprueba@email.com",
            age: 30,
            password: "1234",
            cart: [],
            role: "user"
        }
        const result = await this.users.addUser(mockUser);
        assert.ok(result._id);
    })

    it("Se deben obtener todos los usuarios", async function () {
        let mockUser = {
            name: "Usuario 2",
            surname: "Apellido 2",
            email: "emailprueba@email.com",
            age: 30,
            password: "1234",
            cart: [],
            role: "user"
        }
        await this.users.addUser(mockUser);
        const result = await this.users.getUsers();
        assert.ok(result);
    })

    it("Se debe actualizar un usuario", async function () {
        let mockUser = {
            name: "Usuario 3",
            surname: "Apellido 3",
            email: "emailprueba@email.com",
            age: 30,
            password: "1234",
            cart: [],
            role: "user"
        }
        let resultOrig = await this.users.addUser(mockUser);
        let userOrId = resultOrig._id;
        let userMod = {
            name: "Usuario 4 Modificado"
        }
        const result = await this.users.updateUser(userOrId, userMod);
        assert.ok(result);
    })

    it("Se debe eliminar un usuario", async function () {
        let mockUser = {
            name: "Usuario 5",
            surname: "Apellido 5",
            email: "emailprueba@email.com",
            age: 30,
            password: "1234",
            cart: [],
            role: "user"
        }
        let resultOrig = await this.users.addUser(mockUser);
        let userOrId = resultOrig._id;
        const result = await this.users.deleteUser(userOrId);
        assert.ok(result);
    })
})