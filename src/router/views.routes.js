import express from "express";
import authorizeRole from "../config/auth.config.js";
import { createFakeProducts } from "../config/faker.config.js";


const ViewsRouter = express.Router()

//Rutas GET para la página de inicio y detalles del producto:
//deberia agregar las otras vistas aca?

ViewsRouter.get("/inicio", async (req, res) => {
    const cartId = req.session.cartId
    res.render("inicio", {
        title: "App de compras",
        cartId: cartId
    })
})
ViewsRouter.get("/register", (req, res) => {
    res.render("register", {
        title: "Registro de Usuario"
    })
})

//Ruta para que el usuario se identifique
ViewsRouter.get("/login", (req, res) => {
    const cartId = req.session.cartId
    const user = req.session.user || null
    res.render("login", {
        title: "Login de Usuario",
        cartId: cartId,
        user: user
    })
})

//ruta para vista donde el usuario pide recuperacion de contraseña
ViewsRouter.get("/reset", (req, res) => {
    const cartId = req.session.cartId
    const user = req.session.user || null
    res.render("reset", {
        title: "Reset Password",
        cartId: cartId,
        user: user
    })
})


ViewsRouter.get("/addProducts", authorizeRole(["admin", "premium"]), (req, res) => {
    const cartId = req.session.cartId

    res.render("addProducts", {
        title: "Agregar Productos",
        cartId: cartId
    })
})

ViewsRouter.get("/mockingProducts", async (req, res) => {
    let products = await createFakeProducts()
    const cartId = req.session.cartId
    const user = req.session.user || null
    res.render("mockingProducts", {
        title: "Agregar Productos",
        products: products,
        cartId: cartId,
        user: user
    })
})

ViewsRouter.get("/confirmedProducts", (req, res) => {
    const cartId = req.session.cartId
    const user = req.session.user || null
    res.render("confirmedProducts", {
        title: "Productos Confirmados",
        products: products,
        cartId: cartId,
        user: user
    })
})

ViewsRouter.get("/documents", (req, res) => {
    const cartId = req.session.cartId

    res.render("upload", {
        title: "Subir Documentos",
        cartId: cartId
    })
})










export default ViewsRouter