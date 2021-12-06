const moongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await moongoose.connect(process.env.DB_CNN);
        console.log('DB online');
    } catch (e) {
        console.log(e);
        throw new Error('Error a la hora de inicializar la base de datos');
    }
}

module.exports = {
    dbConnection
}