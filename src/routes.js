import {Route} from "react-router-dom";
import Login from "./Login";
import ProductsList from "./ProductsList";
import NewProduct from "./NewProduct";
import TodoList from "./TodoList";
import React from "react";
import Register from "./Register";
import ProductDetail from "./ProductDetail";



export const routes = {
    public: [
        <Route key={0} index element={<ProductsList/>} />,
        <Route key={1} path="login" element={<Login />} />,
        <Route key={2} path="register" element={<Register />} />,
    ],
    protected: [
        <Route key={1} path="products-new" element={<NewProduct/>} />,
        <Route key={2} path="todos" element={<TodoList/>} />,
        <Route key={3} path="product-details/:id" element={<ProductDetail/>} />
    ],
};