const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        const currentUser = req.user;
        if (!currentUser || !allowedRoles.includes(currentUser.role)) {
            return res.status(403).send("Acceso no autorizado");
        }

        next();
    };
}

export default authorizeRole;