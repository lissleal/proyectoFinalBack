import ProductService from '../services/ProductService.js';
import ProductDTO from '../dao/DTOs/product.dto.js';
import UserDTO from '../dao/DTOs/user.dto.js';
const productService = new ProductService();
// import CustomError from '../config/customError.js';
import mailer from "../config/nodemailer.js";

const { sendMail } = mailer;



export async function getProducts(req, res, next) {
    try {
        if (!req.session.email) {
            return res.redirect("/login")

        }
        let limit = parseInt(req.query.limit) || 100; //MODIFICAR VISTA PARA QUE PUEDA CAMBIAR DE PAGE EL LIMIT DEBE SER 10
        let page = parseInt(req.query.page) || 1;
        let sort = req.query.sort || "asc";
        let query = req.query.query || {};
        let allProducts = await productService.getProducts(limit, page, sort, query);

        if (!allProducts) {
            console.log("No se encontraron productos")

            // return next(
            //     CustomError.createError({
            //         statusCode: 404,
            //         causeKey: "PRODUCTS_NOT_FOUND",
            //         message: "No se encontraron productos"
            //     })
            // )
        }

        allProducts = allProducts.docs.map(product => new ProductDTO(product))

        req.logger.info("El usuario es:", req.session.user)
        let user = req.session.user
        let { name, email, role } = user
        let cartId = req.session.cartId;
        const userData = new UserDTO({ name, email, role })

        res.render("home", {
            title: "Segunda Pre Entrega",
            products: allProducts,
            user: userData,
            cartId: cartId

        })
    } catch (error) {
        req.logger.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
}

export async function getProductById(req, res, next) {
    try {
        let user = req.session.user
        if (!user) {
            return res.redirect("/login")

        }
        const prodId = req.body.prodId || req.params.pid;
        let { name, email, role } = user
        let cartId = req.session.cartId;
        const userData = new UserDTO({ name, email, role })

        const prod = await productService.getProductById(prodId);

        if (!prod) {
            console.log("No se encontró el producto")
            // return next(
            //     CustomError.createError({
            //         statusCode: 404,
            //         causeKey: "PRODUCT_NOT_FOUND",
            //         message: "No se encontró el producto"
            //     })
            // )
        }
        const productDetail = prod.toObject();
        res.render("prod", {
            title: "Detalle de Producto",
            user,
            product: productDetail,
            userData: userData,
            cartId: cartId
        })
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
}

export async function createProduct(req, res, next) {
    try {
        //este permiso esta bien? 
        if (req.user.role === 'premium' || req.user.role === 'admin') {
            const productData = { ...req.body, owner: req.user._id };
            req.logger.debug("El body es:", req.body)

            if (!productData.name || !productData.description || !productData.price || !productData.category || !productData.stock || !productData.thumbnail) {
                console.log("El producto no se ha podido crear")
                // return next(
                //     CustomError.createError({
                //         statusCode: 404,
                //         causeKey: "PRODUCT_NOT_CREATED",
                //         message: "El producto no se ha podido crear"
                //     })
                // )
            }
            let result = await productService.addProduct(productData);
            // res.send({ result: "success", payload: result })

            res.render(confirmedProduct, { title: "Producto creado", product: result })
        }
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
}

export async function updateProduct(req, res, next) {
    try {
        let { pid } = req.params;
        // console.log("El pid es:", pid)

        //esta bien llamado? esta diferente del de createProduct
        let productToReplace = req.body;
        // console.log("El productToReplace es:", productToReplace)
        if (!productToReplace.name || !productToReplace.description || !productToReplace.price || !productToReplace.category || !productToReplace.stock || !productToReplace.thumbnail) {
            console.log("El producto no se ha podido actualizar")

            // return next(
            //     CustomError.createError({
            //         statusCode: 404,
            //         causeKey: "PRODUCT_NOT_UPDATED",
            //         message: "El producto no se ha podido actualizar"
            //     })
            // )
        }
        let result = await productService.updateProduct(pid, productToReplace);
        res.send({ result: "success", payload: result })
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
}

export async function deleteProduct(req, res, next) {

    try {
        let { pid } = req.params;
        let user = req.user;

        const product = await productService.getProductById(pid);
        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }
        let owner = product.owner;
        let ownerEmail = owner.email;
        let userId = user._id.toString();

        if (owner !== userId && user.role !== "admin") {
            return res.status(403).send("Acceso no autorizado. Este producto no te pertenece.");
        }

        let result = await productService.deleteProduct(pid);
        const mailOptions = {
            from: "email@admin",
            to: [ownerEmail, "lissett777@gmail.com"],
            subject: "Producto eliminado",
            text: `El producto ${product.name} ha sido eliminado`
        }
        sendMail(mailOptions);
        if (!result) {
            console.log("El producto no se ha podido eliminar")
            // return next(
            //     CustomError.createError({
            //         statusCode: 404,
            //         causeKey: "PRODUCT_NOT_DELETED",
            //         message: "El producto no se ha podido eliminar"
            //     })
            // )
        }
        res.send({ result: "success", payload: result })
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
}

export async function manageProducts(req, res, next) {
    try {
        let limit = parseInt(req.query.limit) || 100; //MODIFICAR VISTA PARA QUE PUEDA CAMBIAR DE PAGE EL LIMIT DEBE SER 10
        let page = parseInt(req.query.page) || 1;
        let sort = req.query.sort || "asc";
        let query = req.query.query || {};
        let allProducts = await productService.getProducts(limit, page, sort, query)
        // console.log("El allProducts es:", allProducts)

        if (!allProducts) {
            console.log("No se encontraron productos")
            // return next(
            //     CustomError.createError({
            //         statusCode: 404,
            //         causeKey: "PRODUCTS_NOT_FOUND",
            //         message: "No se encontraron productos"
            //     })
            // )
        }
        let isAdmin;
        let isAuthorized;
        let user = req.user;
        if (!user) {
            return res.redirect("/login")
        }
        if (user.role === "admin") {
            isAdmin = true;
        }
        if (user.role === "admin" || user.role === "premium") {
            isAuthorized = true;
        }

        allProducts = allProducts.docs.map(product => new ProductDTO(product))
        res.render("manageProducts", {
            title: "Gestión de Productos",
            products: allProducts,
            isAdmin,
            isAuthorized
        })
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
}



