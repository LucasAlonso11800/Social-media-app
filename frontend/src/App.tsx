import React, { useContext } from 'react';
import { serverURL } from './consts/ServerURL';
// Styles
import 'semantic-ui-css/semantic.min.css'
import './styles/App.css';
import './styles/MediaQuerys.css';
// React-router-dom
import { BrowserRouter as Router, Route } from 'react-router-dom';
// Apollo
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
// Context
import { GlobalProvider, GlobalContext } from './context/GlobalContext';
// Components
import Navbar from './components/Navbar'
import Snackbar from './components/Snackbar';
// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SinglePostPage from './pages/SinglePostPage';
import UserPage from './pages/UserPage';
import NotFoundPage from './pages/NotFoundPage';
import SearchPage from './pages/SearchPage';

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
    if (state !== null && inLoginOrRegisterPage) window.location.assign('/');

    return (
        <ApolloProvider client={client}>
            <GlobalProvider>
                <Router>
                    <Navbar />
                    <Snackbar />
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/register" component={RegisterPage} />
                    <Route exact path="/posts/:username/:postId" component={SinglePostPage} />
                    <Route exact path="/user/:username" component={UserPage} />
                    <Route exact path="/search" component={SearchPage} />
                    <Route exact path="/404" component={NotFoundPage} />
                </Router>
            </GlobalProvider>
        </ApolloProvider>
    );
};