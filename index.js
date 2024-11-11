const express = require('express');
const app = express();
const mysql = require('mysql2');

// Configurar la conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.CAPROVER_HOST,
    user: process.env.CAPROVER_USER,
    password: process.env.CAPROVER_PASSWORD,
    database: process.env.CAPROVER_DATABASE
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('error connecting:', err);
        return;
    }
    console.log('conectado a la base de datos');
});

// Agregar middleware para analizar las solicitudes entrantes
app.use(express.json());

// Agregar rutas para las operaciones CRUD
// app.get('/api/meme', (req, res) => {
//     // Ejemplo de consulta a la base de datos
//     db.query('SELECT * FROM tu_tabla', (err, results) => {
//         if (err) {
//             console.error('error ejecutando consulta:', err);
//             return res.status(500).send({ message: 'Error al ejecutar la consulta' });
//         }
//         res.json(results);
//     });
// });

// test route, to check if the server is running
app.get('/api/test', (req, res) => {
    res.send('Server is running');
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000');
});