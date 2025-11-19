import express from 'express';
import mysql from 'mysql2';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { configDotenv } from 'dotenv';

configDotenv();

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// CONEXÃO COM O BANCO DE DADOS MYSQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// ROTA PRINCIPAL
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// INSERIR PRODUTO
app.post('/produto', (req,res) => {
    const { nome, quantidade } = req.body;
    db.query(`
        INSERT INTO produtos (nome, quantidade) 
        VALUES (?, ?)`,
        [nome, quantidade],

        (err) => {
            if (err) res.status(500).send(err);
            res.send('Produto inserido com sucesso!');
        });
});

app.pat

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
