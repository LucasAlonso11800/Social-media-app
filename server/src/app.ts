import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import { graphqlHTTP } from 'express-graphql';
import 'dotenv/config';

import schema from './GraphQL/schema';
const app = express();

const connection = mysql.createConnection({
    host: process.env.dbHost,
    database: process.env.dbDatabase,
    user: process.env.dbUser,
    password: process.env.dbPassword
});

connection.connect((err) => {
    if(err) throw err;
    console.log('Connected to MySQL');
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/graphql', graphqlHTTP((req, res) => {
    return {
        schema,
        graphiql: true,
        context: {
            headers: req.headers,
            connection: connection
        }
    }
}));

app.get('/', (req, res) => {
    res.send('Working')
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));