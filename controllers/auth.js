const { request, response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req = request, res = response) => {
    const { name, email, password } = req.body;


    try {
        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({
                msg: 'Ya existe un usuario con ese correo'
            });
        }

        usuario = new Usuario({ name, email, password });

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        res.status(201).json({
            msg: 'register',
            uid: usuario.id,
            name: usuario.name
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }
}

const loginUsuario = async (req = request, res = response) => {
    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                msg: 'El email y la contraseña no coinciden con la base de datos'
            });
        }

        //Confirmar contraseña
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: 'El email y la contraseña no coinciden con la base de datos'
            });
        }

        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            msg: 'login',
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }
}

const revalidarToken = async (req = request, res = response) => {
    const { uid, name } = req;

    //Generar un nuevo JWT
    const token = await generarJWT(uid, name);

    res.json({
        uid,
        name,
        token
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}