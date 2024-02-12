import passport from "passport";
import GitHubStrategy from "passport-github2";
import local from "passport-local";
import { createHash, isValidPassword } from "../utils.js";
import UserService from "../services/UserService.js";

const LocalStrategy = local.Strategy;
const userService = new UserService();

const initializePassport = () => {
    passport.use("register", new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {

        try {
            const { name, surname, email, role } = req.body;
            let user = await userService.findEmail({ email: username });
            if (user) {
                return done(null, false, { message: "User already exists" });
            }
            const hashedPassword = await createHash(password);
            const newUser = { name, surname, email, password: hashedPassword, role };
            let result = await userService.addUser(newUser);
            return done(null, result);
        } catch (error) {
            return done("Error getting the user", error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userService.getUserById(id);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })

    passport.use("login", new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
        try {
            const user = await userService.findEmail({ email: username });
            console.log("User found:", user);

            if (!user) {
                return done(null, false, { message: "User not found" });
            }
            const isValid = await isValidPassword(user, password);
            console.log("Password validation result:", isValid);

            if (!isValid) {
                return done(null, false, { message: "Wrong password" });
            }
            user.last_connection = new Date();
            await userService.updateUser(user._id, user);
            console.log("Login successful. Authenticated user");
            return done(null, user);
        } catch (error) {
            console.error("Error in login strategy:", error);
            return done(error);
        }
    }))


    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.527e35e978c0413e",
        clientSecret: "17293d094c7fb6bdab825a12492358f8df71da1d",
        callbackURL: "http://localhost:8080/api/users/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            let name = profile.displayName;

            if (email && email.length > 0) {
                let user = await userService.findEmail({ email: email });

                if (!user) {

                    let newUser = {
                        name: name,
                        email: email,
                        password: "",
                        role: "admin"
                    }

                    let result = await userService.addUser(newUser);
                    return done(null, result);
                } else {
                    return done(null, user);
                }

            } else {
                return done(null, false, { message: "User not found in GitHub" });
            }
        } catch (error) {
            return done(error);
        }
    }))
}

export default initializePassport;