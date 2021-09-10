import express from 'express';
import mysql from 'mysql2';
// Generators
import followsGenerator from './generators/followsGenerator';
import blocksGenerator from './generators/blocksGenerator';
import usersGenerator from './generators/usersGenerator';
import postsGenerator from './generators/postsGenerator';
import commentsGenerator from './generators/commentGenerator';
import likesGenerator from './generators/likesGenerator';
import profilesGenerator from './generators/profilesGenerator';
import imagesGenerator from './generators/imagesGenerator';

const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'social_media',
    password: 'Pulqui123*'
});

connection.connect((error) => {
    if (error) throw error;
    console.log('Connected')
});

app.post('/', async (req, res) => {
    try {
        await usersGenerator(connection);
        await postsGenerator(connection);
        await commentsGenerator(connection);
        await likesGenerator(connection);
        await followsGenerator(connection, 0);
        await blocksGenerator(connection, 0);
        await profilesGenerator(connection);
        await imagesGenerator(connection);
        res.send("Everything's working");
    }
    catch (err) {
        res.send(JSON.stringify(err))
    }
});

app.listen(8000, () => console.log('Listening on 8000'));