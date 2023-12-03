import { Route } from "react-router-dom";
import Login from "./Login";
import BlogPostsList from "./BlogPostsList";
import NewBlogPost from "./NewBlogPost";
import TodoList from "./TodoList";
import React from "react";
import Register from "./Register";
import BlogPostDetail from "./BlogPostDetail";

export const routes = {
    public: [
        <Route key={0} index element={<BlogPostsList />} />,
        <Route key={1} path="login" element={<Login />} />,
        <Route key={2} path="register" element={<Register />} />,
        <Route key={3} path="blogposts-new" element={<NewBlogPost />} />,
        <Route key={4} path="todos" element={<TodoList />} />,
        <Route key={5} path="blogpost-details/:id" element={<BlogPostDetail />} />
    ],
    protected: []
};
