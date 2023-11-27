import {Link, NavLink, useNavigate} from "react-router-dom";
import './Navbar.css';

export default function Navbar() {

    const navigate = useNavigate();

    const isLoggedIn = !!localStorage.getItem("accessToken")

    const handleLogout = () => {
        localStorage.clear();
        navigate("/")
    }

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">CodeAcademy</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            {/*<Link className="nav-link" to={"products"}>Produktai</Link>*/}
                            <NavLink to={""} className={({ isActive }) => isActive ? "active-red nav-link" : "nav-link"}>Produktai</NavLink>
                        </li>
                        {isLoggedIn ?
                            <>
                                <li className="nav-item">
                                    {/*<Link className="nav-link" to={"todos"}>Užduotys</Link>*/}
                                    <NavLink to={"home/todos"} className={({ isActive }) => isActive ? "active-red nav-link" : "nav-link"}>Užduotys</NavLink>
                                </li>
                                <li className="nav-item">
                                    <button onClick={handleLogout} className="btn btn-warning ml-auto">Logout</button>
                                </li>
                            </>
                            :
                            <>
                                <li className="nav-item">
                                    <NavLink to={"login"} className={({ isActive }) => isActive ? "active-red nav-link" : "nav-link"}>Login</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to={"register"} className={({ isActive }) => isActive ? "active-red nav-link" : "nav-link"}>Signup</NavLink>
                                </li>
                            </>
                        }

                        {/*<li className="nav-item dropdown">*/}
                        {/*    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">*/}
                        {/*        Dropdown link*/}
                        {/*    </a>*/}
                        {/*    <ul className="dropdown-menu">*/}
                        {/*        <li><a className="dropdown-item" href="#">Action</a></li>*/}
                        {/*        <li><a className="dropdown-item" href="#">Another action</a></li>*/}
                        {/*        <li><a className="dropdown-item" href="#">Something else here</a></li>*/}
                        {/*    </ul>*/}
                        {/*</li>*/}
                    </ul>
                </div>
            </div>
        </nav>
    );
}