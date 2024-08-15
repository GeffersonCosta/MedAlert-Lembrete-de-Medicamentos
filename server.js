const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do CORS para permitir requisições de outros domínios
app.use(cors());

// Configuração do body-parser para interpretar JSON
app.use(bodyParser.json());

// Configuração do banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'medalert'
});

// Conexão ao banco de dados
db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        process.exit(1);
    }
    console.log('Conectado ao MySQL');
});

// Rota para adicionar medicamento
app.post('/add-medication', (req, res) => {
    const { medicationName, dosage, time } = req.body;

    const query = 'INSERT INTO medicamentos (nome, dosagem, horario) VALUES (?, ?, ?)';
    db.query(query, [medicationName, dosage, time], (err, result) => {
        if (err) {
            console.error('Erro ao inserir no banco de dados:', err);
            res.status(500).send('Erro ao inserir no banco de dados');
        } else {
            res.status(200).send('Medicamento adicionado com sucesso');
        }
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
