import React from 'react';
import 'semantic-ui-css/semantic.min.css'
import './App.css';
// React-router-dom
import { BrowserRouter as Router, Route } from 'react-router-dom';
// Apollo
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
// Context
import { GlobalProvider } from './context/GlobalContext';
// Pages
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const client = new ApolloClient({
    uri: 'http://localhost:5000/graphql',
    cache: new InMemoryCache()
});

function App() {
    return (
        <ApolloProvider client={client}>
            <GlobalProvider>
                <Router>
                    <Navbar />
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/register" component={RegisterPage} />
                </Router>
            </GlobalProvider>
        </ApolloProvider>
    );
}

export default App;
