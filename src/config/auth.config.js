const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        const currentUser = req.user;
        console.log("El usuario actual es:", currentUser)
        console.log("Los roles autorizados son:", allowedRoles)
        if (!currentUser || !allowedRoles.includes(currentUser.role)) {
            return res.status(403).send("Acceso no autorizado");
        }

        next();
    };
}

export default authorizeRole;