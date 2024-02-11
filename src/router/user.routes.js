import express from "express";
import passport from "passport";
import { registerUser, loginUser, logoutUser, handleGitHubCallback, requestPasswordReset, resetPassword, renderPas, changeRole, uploadDocuments, requestAllUsers, deleteOldUsers } from "../controllers/users.controller.js";
import UserDTO from "../dao/DTOs/user.dto.js";
import uploader from "../multer.js";
const UserRouter = express.Router()

UserRouter.post("/register",
    passport.authenticate("register",
        { failureRedirect: "/api/users/failregister" }), registerUser
)

UserRouter.get("/failregister", async (req, res) => {
    req.logger.error("Failed Strategy")
    res.send({ error: "Failed" })
})

UserRouter.post("/login",
    passport.authenticate("login",
        { failureRedirect: "/faillogin" }), loginUser
)

UserRouter.get("/faillogin", async (req, res) => {
    res.send({ error: "Failed Login" })
})

UserRouter.get("/logout", logoutUser)

UserRouter.get("/github", passport.authenticate("github", { scope: ["user: email"] }), async (req, res) => {
    req.logger.info("Redirecting to GitHub for authentication...")
})

UserRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), handleGitHubCallback);

UserRouter.get("/profile", async (req, res) => {
    try {
        let user = req.session.user
        let cartId = req.session.cartId;

        // console.log("El role es: ", user.role)

        if (!user || !user.email) {
            return res.redirect("/login")
        }
        const userData = {
            email: user.email,
            role: user.role,
            id: user._id,
        }
        let isAdmin = false;
        let isAuthorized = false;
        // console.log("El isAdmin es: ", isAdmin)
        // console.log("El isAuthorized es: ", isAuthorized)
        // console.log("El role es: ", user.role)

        if (user.role === "admin") {
            isAdmin = true;
            isAuthorized = true;
        } else if (user.role === "premium") {
            isAdmin = false;
            isAuthorized = true;
        }

        // console.log("El isAdmin es: ", isAdmin)
        // console.log("El isAuthorized es: ", isAuthorized)

        return res.render("profile", {
            title: "Perfil de Usuario",
            user: userData,
            isAdmin: isAdmin,
            isAuthorized: isAuthorized,
            cartId: cartId
        })
    }
    catch (error) {
        req.logger.error("Error en la ruta /profile:", error);
        return res.status(500).json(error);
    }
})

UserRouter.get("/current", async (req, res) => {
    try {
        let user = req.session.user
        let cartId = req.session.cartId;


        if (!user || user == null || user == undefined) {
            req.logger.error("No se encontró el usuario")
            return res.redirect("/login")
        }
        const userData = {
            name: user.name,
            surname: user.surname,
            email: user.email,
            age: user.age,
            password: user.password,
            cart: user.cart,
            role: user.role
        }

        const userSafe = new UserDTO(userData).toSafeObject()

        return res.render("current", {
            title: "Perfil de Usuario",
            user: userSafe,
            cartId: cartId

        })
    }
    catch (error) {
        req.logger.error("Error en la ruta /current:", error);
        return res.status(500).json(error);
    }
})

UserRouter.get("/allUsers", requestAllUsers)

UserRouter.post("/request-password", requestPasswordReset)


//ruta para vista para que el usuario cree una nueva contraseña
UserRouter.get("/createPass/:token", renderPas)


// Ruta para enviar correo de recuperacion de contraseña
UserRouter.post("/createPass/:token", resetPassword)

//Ruta para cambiar el rol del usuario
UserRouter.get("/premium/:uid", changeRole)

//Ruta para subir documentos
UserRouter.post("/:uid/documents", uploader.array("documents"), uploadDocuments)

//Ruta Eliminar usuarios
UserRouter.post("/deleteOldUsers", deleteOldUsers)





export default UserRouter;



