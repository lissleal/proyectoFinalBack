import path from "path"
import { fileURLToPath } from "url"
import bcrypt from "bcrypt"


//Funciones para encriptar y desencriptar contraseñas
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (user, password) => {
    try {
        return bcrypt.compareSync(password, user.password);
    } catch (error) {
        return false;
    }
}

export const comparePasswords = (newPassword, oldPassword) => {
    try {
        return bcrypt.compareSync(newPassword, oldPassword);
    } catch (error) {
        return false;
    }
}



//Configuracion para handlebars
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default __dirname
