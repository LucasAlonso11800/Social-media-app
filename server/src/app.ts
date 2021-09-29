import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import { graphqlHTTP } from 'express-graphql';
import 'dotenv/config';

import schema from './GraphQL/schema';
import { mysqlConnection } from './Helpers/ConnectionToDBPromise';
const app = express();

const connection = mysql.createConnection({
    host: process.env.dbHost,
    database: process.env.dbDatabase,
    user: process.env.dbUser,
    password: process.env.dbPassword
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/graphql', async (req, res, next) => {
    await mysqlConnection(connection);
    console.log('Connected to MySQL');
    next()
});

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