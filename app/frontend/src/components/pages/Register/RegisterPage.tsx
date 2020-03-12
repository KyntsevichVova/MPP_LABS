import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { useRedirect } from '../../../hooks';
import { API } from '../../../lib/api';

interface UserCreds {
    email: string;
    password: string;
}

function RegisterPage() {

    const [user, setUser] = React.useState({} as UserCreds);
    const [errors, setErrors] = React.useState({} as any);
    const { redirect, setShouldRedirect } = useRedirect('/');

    const changeHandler = (event: any) => {
        setUser({...user, [event.target.name]: event.target.value})
    };

    const okCallback = (user: UserCreds) => {
        const data = new FormData();
        data.append('email', user.email);
        data.append('password', user.password);
        API.post('/auth/register', {
            body: data
        }).then(response => {
            if (response.status === 200) {
                setShouldRedirect(true);
            } else {
                response.json().then(json => {
                    setErrors(json.errors);
                });
            }
        });
    };

    return (
        <>
            {redirect.should && (<Redirect to={redirect.to} />)}

            <div className="container auth-form">
                <div className="d-flex flex-column">
                    <div className='my-3'>
                        <Link to={'/auth/login'} className='btn btn-primary mx-3'>Login</Link>
                        <Link to={'/auth/register'} className='btn btn-primary mx-3'>Register</Link>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            className='form-control'
                            type='text'
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