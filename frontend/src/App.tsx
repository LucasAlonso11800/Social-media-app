import React from 'react';
import 'semantic-ui-css/semantic.min.css'
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
// Pages
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const client = new ApolloClient({
    uri: 'http://localhost:5000',
    cache: new InMemoryCache()
});

function App() {
    return (
        <ApolloProvider client={client}>
            <Router>
                <Navbar />
                <Route exact path="/" component={HomePage} />
                <Route exact path="/login" component={LoginPage} />
                <Route exact path="/register" component={RegisterPage} />
            </Router>
        </ApolloProvider>
    );
}

export default App;
