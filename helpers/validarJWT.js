const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req = request, res = response, next) => {
    //Authorization
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({
            msg: "No hay token en la petición"
        });
    }

    try {

        const { uid, name } = jwt.verify(token, process.env.PRIVATE_KEY);

        req.uid = uid;
        req.name = name;

    } catch (e) {
        return res.status(401).json({
            msg: 'Token no válido'
        });
    }

    next();
};

module.exports = {
    validarJWT
}