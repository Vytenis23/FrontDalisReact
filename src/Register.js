import React, { useState } from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';

function Register() {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [authInit, setAuthInit] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if(name && lastName && email && username && password && confirmPassword && (password === confirmPassword) && dateOfBirth){
                const response = await axios.post('http://localhost:8080/signup', { username, password, email, lastName, name, dateOfBirth });
                localStorage.setItem('accessToken', response.data.jwtToken);
                localStorage.setItem('user', JSON.stringify(response.data));
                navigate('/');
            }else {
                setAuthInit(true);
                setTimeout(() => setAuthInit(false), 3000)
            }
        } catch (error) {
            console.error('Registration failed:', error);
            setError(error.response?.data?.message)
        }
    };

    return (
        <div className="container d-flex flex-column gap-3 mt-2">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>

                { error &&
                    <p className="alert alert-danger mt-2">{ error }</p>
                }

                <div className="form-group mb-3">
                    <label htmlFor="name">Name: </label>
                    <input value={name}
                           onChange={(e) => setName(e.target.value)}
                           type="text" className="form-control" id="name" aria-describedby="nameHelp"
                           placeholder="Name"/>
                    { (authInit && !name) &&
                        <p className="alert alert-danger py-1 mt-2">Please enter a valid Name</p>
                    }
                </div>


                <div className="form-group mb-3">
                    <label htmlFor="lastName">Last Name: </label>
                    <input value={lastName}
                           onChange={(e) => setLastName(e.target.value)}
                           type="text" className="form-control" id="lastName" aria-describedby="lastNameHelp"
                           placeholder="Last Name"/>
                    { (authInit && !lastName) &&
                        <p className="alert alert-danger py-1 mt-2">Please enter a valid Last Name</p>
                    }
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="email">Email: </label>
                    <input value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           type="text" className="form-control" id="email" aria-describedby="emailHelp"
                           placeholder="Email"/>
                    { (authInit && !email) &&
                        <p className="alert alert-danger py-1 mt-2">Please enter a valid Email</p>
                    }
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="dateOfBirth">Date Of Birth: </label>
                    <input value={dateOfBirth}
                           onChange={(e) => setDateOfBirth(e.target.value)}
                           type="date" className="form-control" id="dateOfBirth" aria-describedby="dateOfBirthHelp"
                           placeholder="Date Of Birth"/>
                    { (authInit && !dateOfBirth) &&
                        <p className="alert alert-danger py-1 mt-2">Please enter a valid Date Of Birth</p>
                    }
                </div>

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

                <div className="form-group mb-3">
                    <label htmlFor="confirmPassword">Confirm Password: </label>
                    <input value={confirmPassword}
                           onChange={(e) => setConfirmPassword(e.target.value)}
                           type="password" className="form-control" id="confirmPassword" aria-describedby="confirmPasswordHelp"
                           placeholder="Confirm Password"/>
                    { (authInit && (!confirmPassword || confirmPassword !== password) ) &&
                        <p className="alert alert-danger py-1 mt-2">Passwords should match</p>
                    }
                </div>

                <button
                    type="submit"
                    className="btn btn-primary align-self-center">
                    Sign Up
                </button>

                <div className="mt-3">
                    <Link to={"/login"} >Already have an account? Login</Link>
                </div>

            </form>
        </div>
    );
}

export default Register;