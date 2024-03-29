import CartService from '../services/CartService.js';
import ProductService from '../services/ProductService.js';
const cartService = new CartService();
const productService = new ProductService();
import mailer from '../config/nodemailer.js';
import CustomError from '../config/customError.js';

const { sendMail } = mailer;

export async function getCarts(req, res, next) {
    try {
        let carts = await cartService.readCarts();

        if (!carts) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: "CART_NOT_FOUND",
                    message: "No se encontraron carritos"
                })
            )
        }

        res.send({ result: "success", payload: carts })
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener los carritos' });
    }
}

//Obtiene carrito con sus productos
export async function getCart(req, res, next) {
    const cartId = req.params.cid;
    const user = req.user;

    try {
        const cart = await cartService.getCartById(cartId);
        const products = await cartService.getProductsInCart(cartId);
        if (!cart) {
            return res.redirect("/api/users/login");
        }

        const formattedProducts = await Promise.all(products.map(async (product) => {
            const productData = await productService.getProductById(product.productId);
            return {
                id: product.productId,
                quantity: product.quantity,
                name: productData.name,
                thumbnail: productData.thumbnail,
                price: productData.price,
                total: productData.price * product.quantity
            };
        }));

        res.render("carts", {
            title: "Carrito",
            cartId: cartId,
            cart: cart,
            products: formattedProducts,
            user: user
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
}

export async function createCart(req, res, next) {
    let { name, description, products } = req.body;

    if (!name || !description || !products) {
        if (!carts) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: CART_NOT_CREATED,
                    message: "El carrito no se ha podido crear"
                })
            )
        }
    }
    let result = await cartService.addCart({
        name,
        description,
        products
    })
    res.send({ result: "success", payload: result })
}

//Actualiza carrito

export async function updateCart(req, res, next) {
    let { cid } = req.params;
    let cartToReplace = req.body;
    if (!cartToReplace.name || !cartToReplace.description || !cartToReplace.products) {
        if (!carts) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: CART_NOT_UPDATED,
                    message: "El carrito no se ha podido actualizar"
                })
            )
        }
    }
    let result = await cartService.updateCart(cid, cartToReplace);
    res.send({ result: "success", payload: result })
}

//Elimina carrito
export async function deleteCart(req, res, next) {
    let { cid } = req.params;
    try {
        let result = await cartService.deleteCart(cid);
        if (!result) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: CART_NOT_DELETED,
                    message: "El carrito no se ha podido eliminar"
                })
            )
        }
        res.send({ result: "success", payload: result })
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el carrito' });
    }
}

//Productos dentro del carrito
export async function getProductsInCart(req, res, next) {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const result = await cartService.existProductInCart(cartId, productId);
        if (!result) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: "PRODUCT_NOT_FOUND_IN_CART",
                    message: "No se encontró el producto en el carrito"
                })
            )
        }
        res.send({ result: "success", payload: result })
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
}

//Agrega producto al carrito
export async function addProductInCart(req, res, next) {
    try {

        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;
        const user = req.user;
        const product = await productService.getProductById(productId);
        if (!product) {
            res.status(404).send("Producto no encontrado");
            return;
        }

        if (product.owner.toString() === user._id.toString()) {
            res.send("Este producto te pertenece, no puedes agregarlo a tu carro.");
            return;
        }

        const existProductInCart = await cartService.existProductInCart(cartId, productId);
        let result;
        if (existProductInCart) {
            result = await cartService.updateQuantityOfProduct(cartId, productId, quantity);
        }
        else {
            result = await cartService.addProductInCart(cartId, productId, quantity);
        }
        if (!result) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: "PRODUCT_NOT_CREATED_IN_CART",
                    message: "No se pudo agregar el producto al carrito"
                })
            )
        }
        res.send({ result: "success", payload: result })
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
}

//Actualiza cantidad de productos 
export async function updateQuantityOfProduct(req, res, next) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    try {
        const result = await cartService.updateQuantityOfProduct(cartId, productId, newQuantity);
        if (!result) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: "PRODUCT_NOT_UPDATED_IN_CART",
                    message: "No se pudo actualizar el producto en el carrito"
                })
            )
        }
        res.send({ result: "success", payload: result })
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
}

//Elimina del carrito el producto seleccionado
export async function deleteProductInCart(req, res, next) {
    let cartId = req.params.cid;
    let productId = req.params.pid;

    try {
        const result = await cartService.deleteProductInCart(cartId, productId);
        if (!result) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: "PRODUCT_NOT_DELETED_IN_CART",
                    message: "No se pudo eliminar el producto del carrito"
                })
            )
        }
        res.send({ result: "success", payload: result })
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
}

//Finaliza la compra
export async function purchaseCart(req, res, next) {
    let cartId = req.session.cartId;
    let contactPhone = req.body.contactPhone;
    let deliveryAddress = req.body.deliveryAddress;
    let deliveryData = { contactPhone, deliveryAddress };
    try {
        const result = await cartService.purchaseCart(cartId, deliveryData);
        const ticket = result.ticket;
        let productsBuyed = ticket.products.map(product => product.name);
        const cart = result.cart;

        let productsNotAvailable;
        if (cart.products.length === 0) {
            productsNotAvailable = "Todos los productos disponibles";
        } else {
            productsNotAvailable = cart.products.map(product => product.name);
        } const user = req.user;
        const email = user.email;

        if (!result) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: "PURCHASE_ERROR",
                    message: "Error en la compra"
                })
            )
        }
        const emailOptions = {
            from: "E-commerce",
            to: email,
            subject: "Compra realizada",
            html: `<h1>Compra realizada con éxito</h1>
            <p>Estimado ${user.name}, le informamos que con fecha ${ticket.purchase_datetime} se emitió la compra: ${ticket.code} </p>
            <p>Productos: ${productsBuyed}</p>
            <p>Monto: ${ticket.amount}</p>
            
            <p>Direccion de Entrega: ${ticket.deliveryAddress}</p>
            <p>Telefono de contacto: ${ticket.contactPhone}</p>
            <p>Productos no incluidos: ${productsNotAvailable}</p>
            <p>Gracias por su compra</p>
            `
        }
        await sendMail(emailOptions);
        return res.render("confirmedPurchase", {
            title: "Compra realizada",
            ticket: ticket.code,
            productsBuyed: productsBuyed,
            productsNotAvailable: productsNotAvailable,
            amount: ticket.amount,
            deliveryAddress: ticket.deliveryAddress,
            contactPhone: ticket.contactPhone,
            user: user
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al realizar la compra' });
    }
}