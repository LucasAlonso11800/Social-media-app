import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { GlobalContext } from '../context/GlobalContext';
import { EActionType } from '../Interfaces';

export default function NavBar() {
    const { state, dispatch } = useContext(GlobalContext);
    const pathname = window.location.pathname;
    const path = pathname === '/' ? 'home' : pathname.substring(1);
    const [activeItem, setActiveItem] = useState(path);

    const nav = state !== null ?
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
                to={`/user/${state.username}`}
                onClick={() => setActiveItem('user')}
            />
            <Menu.Menu position='right'>
                <Menu.Item
                    name='logout'
                    onClick={() => dispatch({
                        type: EActionType.LOGOUT,
                        payload: null
                    })}
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
            <Menu.Menu position='right'>
                <Menu.Item
                    name='login'
                    active={activeItem === 'login'}
                    as={Link}
                    to="/login"
                    onClick={() => setActiveItem('login')}
                />
                <Menu.Item
                    name='register'
                    active={activeItem === 'register'}
                    as={Link}
                    to="/register"
                    onClick={() => setActiveItem('register')}
                />
            </Menu.Menu>
        </Menu>

    return nav
};