import React, { useState } from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import {Navigate} from "react-router";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authInit, setAuthInit] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if(username && password){
                const response = await axios.post('http://localhost:8080/login', { username, password });
                localStorage.setItem('accessToken', response.data.jwtToken);
                localStorage.setItem('user', JSON.stringify(response.data));
                navigate('/');
            }else {
                setAuthInit(true);
                setTimeout(() => setAuthInit(false), 3000)
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError(error.response?.data?.message)
        }
    };

    return (
        <div className="container d-flex flex-column gap-3 mt-2">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>

                { error &&
                    <p className="alert alert-danger mt-2">{ error }</p>
                }

                <div className="form-group mb-3">
                    <label htmlFor="username">Username: </label>
                    <input value={username}
                           onChange={(e) => setUsername(e.target.value)}
                           type="text" className="form-control" id="username" aria-describedby="usernameHelp"
                           placeholder="Username"/>
                    { (authInit && !username) &&
                        <p className="alert alert-danger py-1 mt-2">Please enter a valid username</p>
                    }
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="password">Password: </label>
                    <input value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           type="password" className="form-control" id="password" aria-describedby="passwordHelp"
                           placeholder="Password"/>
                    { (authInit && !password) &&
                        <p className="alert alert-danger py-1 mt-2">Please enter a valid password</p>
                    }
                </div>

                <button
                    type="submit"
                    className="btn btn-primary align-self-center">
                    Login
                </button>

                <div className="mt-3">
                    <Link to={"/register"} >Don't have account? Singup</Link>
                </div>
            </form>
        </div>
    );
}