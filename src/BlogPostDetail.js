import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

function BlogPostDetail() {
    const { id: blogPostId } = useParams();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');

    let isAdmin = false;
    if (localStorage.getItem("user")) {
        const user = JSON.parse(localStorage.getItem("user"));
        isAdmin = user.roles?.some(role => role.name === "ADMIN");
    }

    useEffect(() => {
        getBlogPostDetails(blogPostId);
    }, [blogPostId]);

    const getBlogPostDetails = async (blogPostId) => {
        try {
            setLoading(true);
            let response = await axios.get(`http://localhost:8080/blogposts/${blogPostId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            const { title, content, author, comments } = response.data;
            setTitle(title);
            setContent(content);
            setAuthor(author);
            setComments(comments);
            setFetchError('');
        } catch (error) {
            console.log("Blog post detail fetch error", error);
            setFetchError(error.response?.data?.message || 'Error fetching blog post details');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (commentId) => {
        setLoading(true);
        try {
            await axios.delete(`http://localhost:8080/comments/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            getBlogPostDetails(blogPostId);
        } catch (error) {
            console.log("Comment delete error", error);
            setLoading(false);
            setFetchError(error.response?.data?.message || 'Error deleting comment');
        }
    };

    const handleEdit = (comment) => {
        // Implement your edit logic here
    };

    return (
        <>
            {loading && (
                <div className={"d-flex mt-5 justify-content-center"}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            {!loading && (
                <div className="container d-flex flex-column gap-3 mt-2">
                    {fetchError ? (
                        <p className="alert alert-danger">{fetchError}</p>
                    ) : (
                        <>
                            <h1 className="text-center h1">{title}</h1>
                            <h3>Author: {author}</h3>
                            <h3>Content: {content}</h3>

                            <h4>Comments:</h4>
                            {comments.length ? (
                                <table className="table">
                                    <tbody>
                                    {comments.map((comment, index) => (
                                        <tr key={index}>
                                            <td>{comment.text}</td>
                                            <td>{comment.name}</td>
                                            <td>
                                                {!isAdmin && (
                                                    <button className="btn btn-info" onClick={() => handleEdit(comment)}>Edit</button>
                                                )}
                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                                <button className="btn btn-danger" onClick={() => handleDelete(comment.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="alert alert-danger">No comments on the blog post</p>
                            )}

                            {/* Remaining form elements */}

                            <div className="mt-3">
                                <Link to={"/"} >Go back to all blog posts</Link>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}

export default BlogPostDetail;
