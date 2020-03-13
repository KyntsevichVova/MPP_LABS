import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useRedirect } from '../../hooks';
import { API } from '../../lib/api';
import { ADD_ROUTE, HOME_ROUTE, LOGIN_ROUTE, LOGOUT_ENDPOINT } from '../../lib/constants';

function Navbar() {
    const { redirect, setShouldRedirect } = useRedirect(LOGIN_ROUTE);

    const logout = () => {
        API.post(`${LOGOUT_ENDPOINT}`, {
            credentials: 'same-origin'
        }).then(() => {
            setShouldRedirect(true);
        });
    };

    return (
        <>
            {redirect.should && (<Redirect to={redirect.to}/>)}
            <nav className='navbar navbar-dark bg-primary w-100'>
                <div className='d-flex justify-content-between w-100'>
                    <ul className='navbar-nav d-flex flex-row'>
                        <li className='nav-item active mx-4'>
                            <Link to={`${HOME_ROUTE}`} className='nav-link'>
                                Home
                            </Link>
                        </li>
                        <li className='nav-item active mx-4'>
                            <Link to={`${ADD_ROUTE}`} className='nav-link'>
                                Add
                            </Link>
                        </li>
                    </ul>
                    <div>
                        <button 
                            className='btn btn-danger' 
                            onClick={logout}
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;