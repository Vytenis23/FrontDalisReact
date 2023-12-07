import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';

function BlogPostDetail() {
    const {id: blogPostId} = useParams();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [comments, setComments] = useState([]);
    const [commentSaveInit, setCommentSaveInit] = useState(false);

    const [editCommentId, setEditCommentId] = useState(null);
    const [editCommentName, setEditCommentName] = useState('');
    const [editCommentEmail, setEditCommentEmail] = useState('');
    const [editCommentText, setEditCommentText] = useState('');
    const [editCommentSaveInit, setEditCommentSaveInit] = useState(false);

    const [fetchError, setFetchError] = useState('');

    const [blogPost, setBlogPost] = useState({});
    const [loading, setLoading] = useState(true);

    let isAdmin = false;
    if (localStorage.getItem("user")) {
        const user = JSON.parse(localStorage.getItem("user"));
        isAdmin = user.roles?.some(role => role.name === "ADMIN");
    }

    useEffect(() => {
        getBlogPostDetails(blogPostId);
    }, [blogPostId]);

    const getBlogPostDetails = async (id) => {
        try {
            setLoading(true);
            let response = await axios.get(`http://localhost:8080/blogposts/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            const {title, content, author, comments} = response.data;
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

    const handleEdit = async (comment) => {
        setEditCommentId(comment.id);
        setEditCommentName(comment.name);
        setEditCommentEmail(comment.email);
        setEditCommentText(comment.text);
    };
    const handleAddComment = async () => {
        try {
            const newComment = {
                name: editCommentName,
                email: editCommentEmail,
                text: editCommentText
            };

            await axios.post(`http://localhost:8080/comments/${blogPostId}`, newComment, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            setEditCommentName('');
            setEditCommentEmail('');
            setEditCommentText('');
            getBlogPostDetails(blogPostId);
        } catch (error) {
            console.log("Comment add error", error);
            setFetchError(error.response?.data?.message || 'Error adding comment');
        }
    };

    const handleUpdateComment = async () => {
        try {
            const updatedComment = {
                id: editCommentId,
                name: editCommentName,
                email: editCommentEmail,
                text: editCommentText
            };

            await axios.put(`http://localhost:8080/comments/${editCommentId}`, updatedComment, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            setEditCommentId(null);
            setEditCommentName('');
            setEditCommentEmail('');
            setEditCommentText('');
            getBlogPostDetails(blogPostId);
        } catch (error) {
            console.log("Comment update error", error);
            setFetchError(error.response?.data?.message || 'Error updating comment');
        }
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
                                                    <button className="btn btn-info"
                                                            onClick={() => handleEdit(comment)}>Edit</button>
                                                )}
                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                                <button className="btn btn-danger"
                                                        onClick={() => handleDelete(comment.id)}>Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="alert alert-danger">No comments on the blog post</p>
                            )}
                            <div className="mt-3">
                                <h4>Add Comment</h4>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={editCommentName}
                                    onChange={(e) => setEditCommentName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Email"
                                    value={editCommentEmail}
                                    onChange={(e) => setEditCommentEmail(e.target.value)}
                                />
                                <textarea
                                    placeholder="Comment"
                                    value={editCommentText}
                                    onChange={(e) => setEditCommentText(e.target.value)}
                                    className="form-control"
                                    rows={5} // Nurodo, kiek eilučių turi būti teksto lauke
                                ></textarea>
                                <button className="btn btn-primary mt-2" onClick={handleAddComment}>Add Comment</button>
                            </div>

                            {editCommentId && (
                                <div className="mt-3">
                                    <h4>Edit Comment</h4>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={editCommentName}
                                        onChange={(e) => setEditCommentName(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        value={editCommentEmail}
                                        onChange={(e) => setEditCommentEmail(e.target.value)}
                                    />
                                    <textarea
                                        placeholder="Comment"
                                        value={editCommentText}
                                        onChange={(e) => setEditCommentText(e.target.value)}
                                        className="form-control"
                                        rows={5}
                                    ></textarea>
                                    <button className="btn btn-primary mt-2" onClick={handleUpdateComment}>Update
                                        Comment
                                    </button>
                                </div>
                            )}

                            <div className="mt-3">
                                <Link to={"/"}>Go back to all blog posts</Link>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}

export default BlogPostDetail;
