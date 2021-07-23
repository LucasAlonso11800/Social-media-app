const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
require('dotenv').config()

const schema = require('./GraphQL/schema');
const app = express();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => console.log('Connected to DB'));

app.use(cors());

app.use('/graphql', graphqlHTTP((req, res) => {
    return {
        schema,
        graphiql: true,
        context: {
            headers: req.headers,
        }
    }
}))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Listening on ${PORT}`));