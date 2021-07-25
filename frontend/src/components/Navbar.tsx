import React, { useState } from 'react'
import { Menu } from 'semantic-ui-react'

export default function NavBar() {
    const pathname = window.location.pathname;
    const path = pathname === '/' ? 'home' : pathname.substring(1);
    const [activeItem, setActiveItem] = useState(path);

    return (
        <Menu secondary pointing size={'huge'}>
            <Menu.Item
                name='home'
                active={activeItem === 'home'}
                onClick={() => setActiveItem('home')}
            />
            <Menu.Menu position='right'>
                <Menu.Item
                    name='login'
                    active={activeItem === 'login'}
                    onClick={() => setActiveItem('login')}
                />
                <Menu.Item
                    name='register'
                    active={activeItem === 'register'}
                    onClick={() => setActiveItem('register')}
                />
            </Menu.Menu>
        </Menu>
    )
};