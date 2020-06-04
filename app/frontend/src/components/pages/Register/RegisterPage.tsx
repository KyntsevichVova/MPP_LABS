import React from 'react';
import { Redirect } from 'react-router-dom';
import { useRedirect } from '../../../hooks';
import { API } from '../../../lib/api';
import { HOME_ROUTE, REGISTER_ENDPOINT } from '../../../lib/constants';
import AuthNavbar from '../../AuthNavbar/AuthNavbar';
import io from 'socket.io-client';

interface UserCreds {
    email: string;
    password: string;
}

function RegisterPage() {

    const [user, setUser] = React.useState({} as UserCreds);
    const [errors, setErrors] = React.useState({} as any);
    const { redirect, setShouldRedirect } = useRedirect(HOME_ROUTE);

    const changeHandler = (event: any) => {
        setUser({...user, [event.target.name]: event.target.value})
    };

    const okCallback = (user: UserCreds) => {
        const data = {
            email: user.email,
            password: user.password,
        }
        const tasksCollection = io(`http://localhost:3000/auth`);
        tasksCollection.emit("register", data, (response: any) => {
            console.log(response);
            if (response.status === 200) {
                sessionStorage.setItem("token", response.token);
                setShouldRedirect(true);
            } else {
                setErrors(response.data.errors);
            }
        });
    };

    return (
        <>
            {redirect.should && (<Redirect to={redirect.to} />)}

            <div className="container auth-form">
                <div className="d-flex flex-column">
                    <AuthNavbar />
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            className='form-control'
                            type='email'
                            name='email'
                            value={user.email}
                            id='email'
                            onChange={changeHandler}
                        />
                        <small className='text-danger'>
                            {(errors.email_required) && (
                                'Email is required.'
                            )}

                            {(errors.invalid_email) && (
                                'Enter valid email.'
                            )}

                            {(errors.email_exists) && (
                                'Such user already exists.'
                            )}

                            {(errors.email_long) && (
                                'Email too long.'
                            )}
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            className='form-control'
                            type='password'
                            name='password'
                            value={user.password}
                            id='password'
                            onChange={changeHandler}
                        />
                        <small className='text-danger'>
                            {(errors.short_password) && (
                                'Password should be at least 4 characters.'
                            )}

                            {(errors.long_password) && (
                                'Password should be less than 32 characters.'
                            )}
                        </small>
                    </div>

                    <div className="d-flex flex-row justify-content-end">
                        <button 
                            className="btn btn-primary" 
                            onClick={() => {
                                okCallback(user);
                            }}
                        >
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RegisterPage;