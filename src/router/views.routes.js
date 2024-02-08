import express from "express";
import authorizeRole from "../config/auth.config.js";
import { createFakeProducts } from "../config/faker.config.js";


const ViewsRouter = express.Router()

//Rutas GET para la página de inicio y detalles del producto:
//deberia agregar las otras vistas aca?

ViewsRouter.get("/inicio", async (req, res) => {
    res.render("inicio", {
        title: "App de compras",
    })
})
ViewsRouter.get("/register", (req, res) => {
    res.render("register", {
        title: "Registro de Usuario"
    })
})

//Ruta para que el usuario se identifique
ViewsRouter.get("/login", (req, res) => {
    res.render("login", {
        title: "Login de Usuario"
    })
})

//ruta para vista donde el usuario pide recuperacion de contraseña
ViewsRouter.get("/reset", (req, res) => {
    res.render("reset", {
        title: "Reset Password"
    })
})


ViewsRouter.get("/addProducts", authorizeRole(["admin", "premium"]), (req, res) => {
    res.render("addProducts", {
        title: "Agregar Productos"
    })
})

ViewsRouter.get("/mockingProducts", async (req, res) => {
    let products = await createFakeProducts()
    res.render("mockingProducts", {
        title: "Agregar Productos",
        products: products
    })
})

ViewsRouter.get("/confirmedProducts", (req, res) => {
    res.render("confirmedProducts", {
        title: "Productos Confirmados",
        products: products
    })
})

ViewsRouter.get("/documents", (req, res) => {
    res.render("upload", {
        title: "Subir Documentos",
    })
})










export default ViewsRouter