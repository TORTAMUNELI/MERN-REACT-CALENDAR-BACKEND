/*
    Rutas de Usuarios /auth
    host + /api/auth
*/

const express = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarJWT } = require('../helpers/validarJWT');
const { validarCampos } = require('../middlewares/validar-campos');

const router = express.Router();

router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña debe tener 6 caracteres o más').not().isEmpty(),
    validarCampos
], loginUsuario);

router.post('/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña debe tener 6 caracteres o más').isLength({ min: 6 }),
    validarCampos
], crearUsuario);

router.get('/renew', [
    validarJWT
], revalidarToken);

module.exports = router;