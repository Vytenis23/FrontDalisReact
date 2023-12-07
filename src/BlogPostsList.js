import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function BlogPostsList() {
    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const isLoggedIn = !!localStorage.getItem("accessToken");
    const isAdmin = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).roles?.some(role => role.name === "ADMIN") : false;

    useEffect(() => {
        fetchBlogPosts();
    }, []);

    const fetchBlogPosts = async () => {
        try {
            setLoading(true);
            let response = await axios.get("http://localhost:8080/blogposts");
            console.log(response.data);
            setBlogPosts(response.data);
            setError('');
        } catch (error) {
            console.log("Blog post fetch error", error);
            setError(error.response?.data?.message || 'Error fetching blog posts');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (blogPostId) => {
        setLoading(true);
        try {
            await axios.delete(`http://localhost:8080/blogposts/${blogPostId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            fetchBlogPosts();
        } catch (error) {
            console.log("Blog post delete error", error);
            setError(error.response?.data?.message || 'Error deleting blog post');
            setLoading(false);
        }
    };

    return (

        <div style={{ minWidth: "1024px" }}>
            <h2 className={"text-center my-4"}>Blog postų lentelė</h2>

            {isLoggedIn && (
            <div className="text-end mb-3">
                <Link to="/home/blogpost-new" className="btn btn-primary">
                    Pridėti naują straipsnį
                </Link>
            </div>
        )}
        
            {loading && (
                <div className={"d-flex justify-content-center"}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {!loading && error && (
                <p className="alert alert-danger mt-2">{error}</p>
            )}

            {!loading && (
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">Nr.</th>
                        <th scope="col">Pavadinimas</th>
                        <th scope="col">Autorius</th>
                        <th scope="col">Veiksmai</th>
                    </tr>
                    </thead>
                    <tbody>
                    {blogPosts?.map((post, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                <Link to={`/home/blogpost-details/${post.id}`}>{post.title}</Link>
                            </td>
                            <td>{post.author}</td>
                            <td>
                                {isLoggedIn && (
                                    <span>
                                            {isAdmin && <button className="btn btn-danger" onClick={() => handleDelete(post.id)}>Trinti</button>}
                                        {/* Add additional actions as needed */}
                                        </span>
                                )}
                                
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {/* Add any additional components or buttons here */}
        </div>
    );
}
