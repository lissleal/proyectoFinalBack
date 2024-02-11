import UserService from "../services/UserService.js";
import UserDTO from "../dao/DTOs/user.dto.js";
import { createHash, comparePasswords } from "../utils.js";
import mailer from "../config/nodemailer.js";
import jwt from "jsonwebtoken";
import generatePasswordResetToken from "../config/token.js";

const { sendMail } = mailer;
const userService = new UserService();

export async function registerUser(req, res, next) {
    try {
        req.logger.info("Registering user...");
        const { name, surname, email, password, role } = req.body;
        if (!name || !surname || !email || !password || !role) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: USER_NOT_CREATED,
                    message: "El usuario no se ha podido crear"
                })
            )
        }
        res.redirect("/login");
    } catch (error) { res.status(500).send("Error al registrar usuario: " + error.message); }

}

export async function loginUser(req, res) {
    try {
        let user = req.user
        req.session.email = user.email
        req.session.role = user.role
        req.session.name = user.name
        req.session.surname = user.surname
        req.session.user = user;
        req.session.last_connection = user.last_connection;
        req.session.cartId = user.cart;
        req.session.userId = user._id;
        if (user.role === "admin") {

            res.redirect("/api/users/profile")
        } else {

            res.redirect("/api/products")
        }
        req.logger.info("Session established:", req.session.user);

    } catch (error) {
        res.status(500).json("Usuario o contraseña incorrectos")
    }
}

export async function logoutUser(req, res) {
    try {
        // console.log("Entra en logoutUser")
        let user = req.session.user
        user.last_connection = new Date();
        await userService.updateUser(user._id, user);
        // console.log("User logged out:", user.name + " ultima conexion: " + user.last_connection);
        req.session.destroy()
        res.redirect("/login")
    } catch (error) {
        res.status(500).json(error)
    }
}

export async function handleGitHubCallback(req, res) {
    try {
        req.session.user = req.user;
        req.session.email = req.user.email;
        req.session.role = req.user.role;

        res.redirect("/api/users/profile");
    } catch (error) {
        res.status(500).json("Error during GitHub authentication");
    }
}

export async function requestPasswordReset(req, res) {
    try {
        const { email } = req.body;
        const user = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(404).json("El usuario no existe");
        }
        const resetToken = generatePasswordResetToken({ userId: user.id, email: user.email });
        const resetUrl = `http://localhost:8080/api/users/createPass/${resetToken}`;
        const emailOptions = {
            from: "lissett777@gmail.com",
            to: email,
            subject: "Reset Password",
            html: `<p>Para cambiar tu contraseña, haz click en el siguiente link: <a href="${resetUrl}">${resetUrl}</a></p>
            <p>Reset token: ${resetToken}</p>`
        }

        await sendMail(emailOptions);
        return res.render("confirmedMail", {
            title: "Reset Mail",
        });
    } catch (error) {
        return res.status(500).json(error.message);
    }

}

export async function renderPas(req, res) {
    const token = req.params.token;

    // Decodificar el token y recuperar información adicional
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    res.render("createPass", {
        title: "Reset Password",
        email: email,
        token: token
    });
}

export async function resetPassword(req, res) {
    const { password, confirmedPassword } = req.body;
    const token = req.params.token;
    if (password !== confirmedPassword) {
        return res.status(400).json("Las contraseñas no coinciden");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;
        const user = await userService.getUserByEmail(email);
        const id = user.id;

        if (!user) {
            return res.status(404).json("El usuario no existe");
        }

        if (await comparePasswords(password, user.password)) {
            return res.status(400).json("La contraseña no puede ser igual a la anterior");
        }
        const hashedPassword = await createHash(password);
        const updatedUser = { password: hashedPassword };
        await userService.updateUser(id, updatedUser);

        return res.render("confirmedReset", {
            title: "Reset Password"
        });
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

export async function changeRole(req, res) {
    try {
        const { uid } = req.params;
        if (!uid) {
            return res.status(400).json("El id del usuario es requerido");
        }
        const user = await userService.getUserById(uid);
        if (!user) {
            return res.status(404).json("El usuario no existe");
        }

        let updatedUser;
        const documents = user.documents;
        const cantidadDocumentos = documents.length;
        const role = user.role;
        if (role === "user" && cantidadDocumentos >= 3) {
            updatedUser = { role: "premium" };
            req.session.user.role = "premium";
            // console.log("El usuario actualizado en session es ", req.session.user.role);
        }
        else {
            updatedUser = { role: "user" };
            req.session.user.role = "user";
            // console.log("El usuario actualizado en session es ", req.session.user.role);

        }
        await userService.updateUser(uid, updatedUser);
        return res.redirect("/api/users/profile");
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

export async function uploadDocuments(req, res) {
    if (!req.files) {
        return res.status(400).send({ status: "error", message: "No se ha subido ningún archivo" });
    }
    // console.log("Los archivos son ", req.files);
    let user = req.session.user;
    // console.log("El usuario es ", user);
    user.documents = req.files;
    await userService.updateUser(user._id, user);
    res.send({ status: "success", message: "Archivos subidos correctamente" });
}

export async function requestAllUsers(req, res) {
    if (req.session.user == undefined || req.session.user.role !== "admin") {
        return res.status(403).json("No tienes permisos para realizar esta acción");
    }
    try {
        let users = await userService.getUsers();
        if (!users) {
            return res.status(404).json("No se encontraron usuarios");
        }
        users = users.map(user => new UserDTO(user));
        return res.render("users", {
            title: "Lista de Usuarios",
            users: users
        })
    }
    catch (error) {
        req.logger.error("Error en la ruta /allUsers:", error);
        return res.status(500).json(error);
    }
}

export async function deleteOldUsers(req, res) {
    try {
        const users = await userService.getUsers();
        // console.log("Entre a deleteOldUsers");
        if (!users) {
            return res.status(404).json("No se encontraron usuarios");
        }
        const currentDate = new Date();
        const oldUsers = users.filter(user => {
            const lastConnection = user.last_connection;
            const diff = currentDate - lastConnection;
            const days = diff / (1000 * 60 * 60 * 24);
            return days > 2;
        });
        if (oldUsers.length === 0) {
            return res.status(404).json("No hay usuarios antiguos");
        }
        oldUsers.forEach(async user => {
            let id = user._id;
            let email = user.email;
            await userService.deleteUser(id);
            const emailOptions = {
                from: "email@admin",
                to: email,
                subject: "Cuenta eliminada",
                html: `<p>Estimado usuario, su cuenta ha sido eliminada por inactividad</p>`
            };
            await sendMail(emailOptions);
            // console.log("El usuario con email ", email, " ha sido eliminado");
        });
        const ids = oldUsers.map(user => user._id);
        await userService.deleteUser(ids);

        return res.status(200).json("Usuarios eliminados correctamente");
    } catch (error) {
        return res.status(500).json(error.message);
    }
}






