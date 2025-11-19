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

// ATUALIZAR PRODUTO
app.put('/produto/:id', (req,res) => {
    const { id } = req.params;
    const { quantidade } = req.body;

    db.query(`UPDATE produtos SET quantidade = ? WHERE id = ?`,
        [quantidade, id],
        (err) => {
            if (err) res.status(500).send(err);
            res.send('Produto atualizado com sucesso!');
        });
});

// LISTAR LOGS
app.get('/logs', (req, res) => {
    const sql = `
        SELECT 
            id, 
            id_produto,
            nome_produto,
            quantidade_anterior, 
            quantidade_atual,
            DATE_FORMAT(data_modificacao, '%d/%m/%Y %H:%i:%s') AS data_modificacao
        FROM log_estoque
        ORDER BY data_modificacao DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).res.send(err);
        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
