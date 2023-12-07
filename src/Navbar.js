import { Link, NavLink, useNavigate } from "react-router-dom";
import './Navbar.css';

export default function Navbar() {

    const navigate = useNavigate();

    const isLoggedIn = !!localStorage.getItem("accessToken");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">BasketBlog</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink to="/" className="nav-link">Blog Posts</NavLink>
                        </li>
                        {isLoggedIn ?
                            <>
                                <li className="nav-item">
                                    <NavLink to="/home/todos" className="nav-link">Tasks</NavLink>
                                </li>
                                <li className="nav-item">
                                    <button onClick={handleLogout} className="btn btn-warning ml-auto">Logout</button>
                                </li>
                            </>
                            :
                            <>
                                <li className="nav-item">
                                    <NavLink to="/login" className="nav-link">Login</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/register" className="nav-link">Signup</NavLink>
                                </li>
                            </>
                        }
                    </ul>
                </div>
            </div>
        </nav>
    );
}
