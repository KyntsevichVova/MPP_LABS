import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useRedirect } from '../../hooks';
import { API } from '../../lib/api';
import { HOME_ENDPOINT, TASKS_ENDPOINT } from '../../lib/constants';

function Navbar() {
    const { redirect, setShouldRedirect } = useRedirect('/auth/login');

    const logout = () => {
        API.post('/auth/logout').then(() => {
            setShouldRedirect(true);
        });
    };

    return (
        <>
            {redirect.should && (<Redirect to={redirect.to}/>)}
            <nav className='navbar navbar-dark bg-primary'>
                <div className='d-flex justify-content-between'>
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
                    <div>
                        <button className='btn btn-danger' onClick={logout}>Log out</button>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;