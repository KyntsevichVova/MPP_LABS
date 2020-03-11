import React from 'react';
import { Link } from 'react-router-dom';
import { HOME_ENDPOINT, TASKS_ENDPOINT } from '../../lib/constants';

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
                    <Link to={`${TASKS_ENDPOINT}`} className='nav-link'>
                        Add
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;