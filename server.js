const express = require('express');
const pool = require('./database');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

app.use(morgan('combined'));  // Guarda log de las solicitudes

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

app.get('/', (req, res, next) => {
    res.send("HelloWorld from Stgo, CL made With ❤");
});

app.get('/usuarios', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error al obtener conexión del pool:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        connection.query('SELECT * FROM Usuarios', (err, result) => {
            connection.release(); // Importante liberar la conexión después de usarla
            if (err) {
                console.error('Error al ejecutar consulta:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            res.json(result);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);

});

