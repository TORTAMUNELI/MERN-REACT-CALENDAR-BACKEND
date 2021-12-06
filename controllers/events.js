const { request, response } = require("express");
const Evento = require("../models/Evento");

const obtenerEventos = async (req = request, res = response) => {

    const eventos = await Evento.find()
        .populate('user', 'name');

    res.json({
        eventos
    });
}

const crearEvento = async (req = request, res = response) => {

    const { title, notes, start, end } = req.body;
    const user = req.uid;

    try {
        const evento = new Evento({ title, notes, start, end, user });

        await evento.save();

        res.status(201).json(evento);
    } catch (e) {
        console.log(e);

        res.status(500).json({
            msg: "Hable con el administrador"
        });
    }
}

const actualizarEvento = async (req = request, res = response) => {
    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                msg: 'El evento con ese id no existe'
            });
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                msg: 'No tiene los privilegios para editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });

        res.json({
            evento: eventoActualizado
        });
    } catch (e) {
        console.log(e);

        res.status(500).json({
            msg: "Hable con el administrador"
        });
    }
}

const eliminarEvento = async (req = request, res = response) => {
    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                msg: 'El evento con ese id no existe'
            });
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                msg: 'No tiene los privilegios para editar este evento'
            });
        }


        await Evento.findByIdAndDelete(eventoId);

        res.json({
            msg: 'El evento ha sido eliminado'
        });
    } catch (e) {
        console.log(e);

        res.status(500).json({
            msg: "Hable con el administrador"
        });
    }
}

module.exports = {
    obtenerEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}