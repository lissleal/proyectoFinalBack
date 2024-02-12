import express from "express";
import { engine } from "express-handlebars";
import * as path from "path"
import __dirname from "./utils.js";
import session from "express-session";
import sessionConfig from "./config/session.config.js";
import connectMongo from "./config/mongo.config.js";
import dotenv from 'dotenv';
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import loggerMiddleware from "./loggerMiddleware.js";
import methodOverride from 'method-override';
import specs from "./config/swagger.config.js";
import swaggerUiExpress from "swagger-ui-express";

// Variables de entorno
dotenv.config();

//Rutas
import ViewsRouter from "./router/views.routes.js";
import productsRouter from "./router/products.routes.js";
import cartsRouter from "./router/carts.routes.js";
import UserRouter from "./router/user.routes.js";

//Creación de la aplicación Express y servidor HTTP:
const app = express()
const PORT = process.env.PORT || 8080;

//Conexión a MongoDB:

connectMongo()

//Configuración de sesión:
app.use(session(sessionConfig))

//Configuración de passport:
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

//Middleware de logger:
app.use(loggerMiddleware)

//Estructura handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

//Configuración de rutas estáticas y de vistas:
app.use("/", express.static(__dirname + "/public"))

//Rutas para vistas:
app.use("/", ViewsRouter)
app.use("/api/products/css", express.static(__dirname + "/public/css"))
app.use("/api/products/img", express.static(__dirname + "/public/img"))

//Rutas para CRUD:
app.use("/api/users", UserRouter)
app.use("/api/carts", cartsRouter)
app.use("/api/products", productsRouter)

app.get('/loggerTest', function (req, res) {
    req.logger.error("Mensaje de error")
    req.logger.warn("Mensaje de advertencia")
    req.logger.info("Mensaje de información")
    req.logger.http("Mensaje http")
    req.logger.verbose("Mensaje verbose")
    req.logger.debug("Mensaje debug")
    req.logger.silly("Mensaje silly")
    res.send('Hello World');
});

app.listen(PORT, () => console.log(`Escuchando servidor en puerto ${PORT}`))









