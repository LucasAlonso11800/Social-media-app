import React, { useContext } from 'react';
import 'semantic-ui-css/semantic.min.css'
import './App.css';
// React-router-dom
import { BrowserRouter as Router, Route } from 'react-router-dom';
// Apollo
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
// Context
import { GlobalProvider, GlobalContext } from './context/GlobalContext';
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
    const { state } = useContext(GlobalContext);
    const inLoginOrRegisterPage = window.location.pathname === "/login" || window.location.pathname === "/register";
    if (state !== null && inLoginOrRegisterPage) window.location.pathname = '/';
    
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
