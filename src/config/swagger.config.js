import swaggerJSDoc from "swagger-jsdoc";
import __dirname from "../utils.js";
import path from "path";

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentacion API REST",
            description: "API REST proyecto de Backend Coderhouse",
            version: "1.0.0"
        }
    },
    apis: [`${path.join(__dirname, "/docs/**/*.yaml")}`],
}

const specs = swaggerJSDoc(swaggerOptions);

export default specs;