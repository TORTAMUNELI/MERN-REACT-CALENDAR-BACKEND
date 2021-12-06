const { Router } = require("express");
const { check } = require("express-validator");
const { obtenerEventos, crearEvento, actualizarEvento, eliminarEvento } = require("../controllers/events");
const { isDate } = require("../helpers/isDate");
const { validarJWT } = require("../helpers/validarJWT");
const { validarCampos } = require("../middlewares/validar-campos");


const router = Router();

//Todos pasan por la validación del JWT
router.use(validarJWT);

//Obtener eventos
router.get('/', obtenerEventos);

/*Si quisiera que obtenerEventos fuera un ruta pública,
pondría en esta línea router.use(validarJWT); */

//Crear evento
router.post('/', [
    check('title', 'El título es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de finalización es obligatoria').custom(isDate),
    validarCampos
], crearEvento);

//Actualizar evento
router.put('/:id', [
    check('id', 'ID invalido').isMongoId(),
    validarCampos
], actualizarEvento);

//Eliminar evento
router.delete('/:id', [
    check('id', 'ID invalido').isMongoId(),
    validarCampos
], eliminarEvento);

module.exports = router;