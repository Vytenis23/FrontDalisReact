import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import TodoList from "./TodoList";
import ProductsList from "./ProductsList";
import 'bootstrap/dist/css/bootstrap.css';
import Navbar from "./Navbar";
import NewProduct from "./NewProduct";
import Login from "./Login";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Navbar />
        <Routes>
            <Route path={"/products"} element={<ProductsList/>} />
            <Route path={"/products-new"} element={<NewProduct/>} />
            <Route path={"/todos"} element={<TodoList/>} />
            <Route path={"/login"} element={<Login/>} />

        </Routes>
    </BrowserRouter>
);