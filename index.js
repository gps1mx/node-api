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

// Si una solicitud no coincide con ninguna ruta, devolver un error 404
app.use((req, res) => {
    res.status(404).send({ message: 'Recurso no encontrado' });
});

// Todos los artículos
app.get('/api/articles', (req, res) => {
    db.query('SELECT * FROM articles', (err, results) => {
        if (err) {
            console.error('error ejecutando consulta:', err);
            return res.status(500).send({ message: 'Error al ejecutar la consulta' });
        }
        res.json(results);
    });
});

// Obtener un artículo por ID
app.get('/api/articles/:id', (req, res) => {
    db.query('SELECT * FROM articles WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            console.error('error ejecutando consulta:', err);
            return res.status(500).send({ message: 'Error al ejecutar la consulta' });
        }
        if (results.length === 0) {
            return res.status(404).send({ message: 'Artículo no encontrado' });
        }
        res.json(results[0]);
    });
});

// Crear un nuevo artículo
app.post('/api/articles', (req, res) => {
    const { title, body, author_id, initial_date, final_date } = req.body;
    const filtered_final_date = final_date ? final_date : null;
    db.query('INSERT INTO articles (title, body, author_id, initial_date, final_date) VALUES (?, ?, ?, ?, ?)', [title, body, author_id, initial_date, filtered_final_date], (err, results) => {
        if (err) {
            console.error('error ejecutando consulta:', err);
            return res.status(500).send({ message: 'Error al ejecutar la consulta' });
        }
        res.status(201).send({ message: 'Artículo creado' });
    });
});

// Actualizar un artículo
app.put('/api/articles/:id', (req, res) => {
    const { title, body, author_id, initial_date, final_date } = req.body;
    const filtered_final_date = final_date ? final_date : null;
    db.query('UPDATE articles SET title = ?, body = ?, author_id = ?, initial_date = ?, final_date = ? WHERE id = ?', [title, body, author_id, initial_date, filtered_final_date, req.params.id], (err, results) => {
        if (err) {
            console.error('error ejecutando consulta:', err);
            return res.status(500).send({ message: 'Error al ejecutar la consulta' });
        }
        res.send({ message: 'Artículo actualizado' });
    });
});

// Eliminar un artículo (soft delete)
app.delete('/api/articles/:id', (req, res) => {
    db.query('UPDATE articles SET deleted = 1 WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            console.error('error ejecutando consulta:', err);
            return res.status(500).send({ message: 'Error al ejecutar la consulta' });
        }
        res.send({ message: 'Artículo eliminado' });
    });
});

// test route, to check if the server is running
app.get('/health', (req, res) => {
    res.send('Server is running');
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000');
});