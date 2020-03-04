import React from 'react';
import { Link } from 'react-router-dom';
import { ADD_ENDPOINT, HOME_ENDPOINT } from '../../lib/contants';

function Navbar() {
    return (
        <nav className='navbar navbar-dark bg-primary'>
            <ul className='navbar-nav d-flex flex-row'>
                <li className='nav-item active mx-4'>
                    <Link to={`${HOME_ENDPOINT}`} className='nav-link'>
                        Home
                    </Link>
                </li>
                <li className='nav-item active mx-4'>
                    <Link to={`${ADD_ENDPOINT}`} className='nav-link'>
                        Add
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;