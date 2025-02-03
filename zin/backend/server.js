require('dotenv').config(); // Charge les variables d'environnement

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors'); // Assurez-vous d'avoir installé cors si ce n'est pas déjà fait
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Permet les requêtes cross-origin

// Configuration de la connexion à la base de données
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Erreur de connexion à la base de données :', err.stack);
        return;
    }
    console.log('✅ Base de données connectée');
});

// Route d'inscription
app.post('/register', (req, res) => {
    const { nom, prenom, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: '❌ Les mots de passe ne correspondent pas !' });
    }

    const query = `INSERT INTO users (nom, prenom, email, password) VALUES (?, ?, ?, ?)`;
    connection.query(query, [nom, prenom, email, password], (err, results) => {
        if (err) {
            console.error('❌ Erreur lors de l\'inscription :', err);
            return res.status(500).json({ message: '❌ Erreur serveur. Réessayez plus tard.' });
        }
        res.status(201).json({ message: '✅ Inscription réussie !' });
    });
});

// Route de connexion
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
    connection.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('❌ Erreur lors de la connexion :', err);
            return res.status(500).json({ message: '❌ Erreur serveur. Réessayez plus tard.' });
        }

        if (results && results.length === 0) {
            return res.status(401).json({ message: '❌ Identifiants incorrects.' });
        } else if (results) {
            return res.status(200).json({ message: '✅ Connexion réussie !', token: 'votre_token_de_connexion' });
        } else {
            console.error("Aucune donnée renvoyée par la requête.");
            return res.status(500).json({ message: '❌ Erreur serveur. Aucune donnée renvoyée.' });
        }
    });
});

// Nouvelle route pour gérer les réservations
app.post('/reserve', (req, res) => {
    const { nom, prenom, telephone, date, time, doctor } = req.body;

    const query = `INSERT INTO reservations (nom, prenom, telephone, date, time, doctor) VALUES (?, ?, ?, ?, ?, ?)`;
    connection.query(query, [nom, prenom, telephone, date, time, doctor], (err, results) => {
        if (err) {
            console.error('❌ Erreur lors de la réservation :', err);
            return res.status(500).json({ message: '❌ Erreur serveur. Réessayez plus tard.' });
        }
        res.status(201).json({ message: '✅ Réservation réussie !' });
    });
});

app.listen(port, () => {
    console.log(`🚀 Serveur backend démarré sur http://localhost:${port}`);
});