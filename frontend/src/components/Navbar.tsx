import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
// Context
import { GlobalContext } from '../context/GlobalContext';
// Interfaces
import { EActionType } from '../Interfaces';

export default function NavBar() {
    const { state, dispatch } = useContext(GlobalContext);

    const { pathname } = window.location;
    const path = pathname === '/' ? 'home' : pathname.substring(1);

    const [activeItem, setActiveItem] = useState<string>(path);

    return state !== null ?
        <Menu secondary pointing size={'huge'}>
            <Menu.Item
                name="Home"
                active={activeItem === 'home'}
                as={Link}
                to="/"
                onClick={() => setActiveItem('home')}
            />
            <Menu.Item
                name={state.username}
                active={activeItem === 'user'}
                as={Link}
                to={`/user/${state.id}`}
                onClick={() => setActiveItem('user')}
                data-testid="navbarUsername"
            />
            <Menu.Item
                name="Search"
                active={activeItem === 'search'}
                as={Link}
                to="/search"
                onClick={() => setActiveItem('search')}
                data-testid="navbarSearch"
            />
            <Menu.Menu position='right'>
                <Menu.Item
                    name='logout'
                    onClick={() => dispatch({
                        type: EActionType.LOGOUT,
                        payload: null
                    })}
                    data-testid="logout"
                />
            </Menu.Menu>
        </Menu>
        :
        <Menu secondary pointing size={'huge'}>
            <Menu.Item
                name='home'
                active={activeItem === 'home'}
                as={Link}
                to="/"
                onClick={() => setActiveItem('home')}
            />
            <Menu.Item
                name="Search"
                active={activeItem === 'search'}
                as={Link}
                to="/search"
                onClick={() => setActiveItem('search')}
                data-testid="navbarSearch"
            />
            <Menu.Menu position='right'>
                <Menu.Item
                    name='login'
                    active={activeItem === 'login'}
                    as={Link}
                    to="/login"
                    onClick={() => setActiveItem('login')}
                    data-testid="login"
                />
                <Menu.Item
                    name='register'
                    active={activeItem === 'register'}
                    as={Link}
                    to="/register"
                    onClick={() => setActiveItem('register')}
                    data-testid="register"
                />
            </Menu.Menu>
        </Menu>
};