import React from 'react';
import { Link } from 'react-router-dom';
import { LOGIN_ROUTE, REGISTER_ROUTE } from '../../lib/constants';

function AuthNavbar() {
    return (
        <div className='my-3 w-100 auth-form'>
            <Link to={LOGIN_ROUTE} className='btn btn-primary mx-3'>
                Login
            </Link>
            <Link to={REGISTER_ROUTE} className='btn btn-primary mx-3'>
                Register
            </Link>
        </div>
    );
}

export default AuthNavbar;