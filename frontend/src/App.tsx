import React, { useContext } from 'react';
import 'semantic-ui-css/semantic.min.css'
import './App.css';
import { serverURL } from './consts/ServerURL';
// React-router-dom
import { BrowserRouter as Router, Route } from 'react-router-dom';
// Apollo
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
// Context
import { GlobalProvider, GlobalContext } from './context/GlobalContext';
// Pages
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SinglePostPage from './pages/SinglePostPage';
import UserPage from './pages/UserPage';
import NotFoundPage from './pages/NotFoundPage';

const httpLink = createHttpLink({ uri: serverURL });

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : ''
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

export default function App() {
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
                    <Route exact path="/posts/:username/:postId" component={SinglePostPage} />
                    <Route exact path="/user/:username" component={UserPage} />
                    <Route exact path="/404" component={NotFoundPage} />
                </Router>
            </GlobalProvider>
        </ApolloProvider>
    );
};