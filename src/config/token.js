import jwt from "jsonwebtoken";

const generatePasswordResetToken = (user) => {
    return jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
}

export default generatePasswordResetToken;