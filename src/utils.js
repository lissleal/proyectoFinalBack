import path from "path"
import { fileURLToPath } from "url"
import bcrypt from "bcrypt"


//Funciones para encriptar y desencriptar contraseñas
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (user, password) => {
    try {
        // console.log("Password from user:", user.password);
        // console.log("Provided password:", password);
        return bcrypt.compareSync(password, user.password);
    } catch (error) {
        console.error("Error in isValidPassword:", error);
        return false;
    }
}

export const comparePasswords = (newPassword, oldPassword) => {
    try {
        return bcrypt.compareSync(newPassword, oldPassword);
    } catch (error) {
        console.error("Error in comparePasswords:", error);
        return false;
    }
}



//Configuracion para handlebars
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default __dirname
