import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';

function ProductDetail() {

    const { id: productId } = useParams();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [comment, setComment] = useState('');
    const [commentSaveInit, setCommentSaveInit] = useState(false);


    const [editCommentId, setEditCommentId] = useState(null);
    const [editCommentName, setEditCommentName] = useState('');
    const [editCommentEmail, setEditCommentEmail] = useState('');
    const [editCommentText, setEditCommentText] = useState('');
    const [editCommentSaveInit, setEditCommentSaveInit] = useState(false);

    const [fetchError, setFetchError] = useState('');

    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);

    let isAdmin = false;
    if(localStorage.getItem("user")){
        const user = JSON.parse(localStorage.getItem("user"));
        isAdmin = user.roles?.some(role => role.name === "ADMIN");
    }

    useEffect(() => {
        getProductDetails(productId);
    }, [productId]);

    const getProductDetails = async (productid) => {
        try {
            setLoading(true);
            let response = await axios.get(`http://localhost:8080/products/${productid}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setProduct(response.data);
            setName('');
            setEmail('');
            setComment('');
            setEditCommentId(null)
            setFetchError('')
        } catch (error) {
            console.log("Product detail fetch error", error)
            setFetchError(error.response.data.message)
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = async (comment) => {
        setEditCommentId(comment.id);
        setEditCommentName(comment.name);
        setEditCommentEmail(comment.email);
        setEditCommentText(comment.text);
    }

    const handleDelete = async (id) => {
        setLoading(true);
        await axios.delete(`http://localhost:8080/comments/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        getProductDetails(productId);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if(name && email && comment){
                try {
                    await axios.post(`http://localhost:8080/comments/${productId}`, { name, email, text: comment }, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    });
                    getProductDetails(productId)
                } catch (error){
                    console.log("Comment edit error", error)
                    setLoading(false)
                    setFetchError(error.response.data.message)
                }
            }else {
                setCommentSaveInit(true);
                setTimeout(() => setCommentSaveInit(false), 3000)
            }
        } catch (error) {
            console.error('failed:', error);
        }
    };

    const handleSubmitEditForm = async (event) => {
        event.preventDefault();
        try {
            if(editCommentName && editCommentEmail && editCommentText){
                try {
                    await axios.put(`http://localhost:8080/comments/${editCommentId}`,
                        { name: editCommentName, email: editCommentEmail, text: editCommentText }, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                            }
                        });
                    getProductDetails(productId)
                } catch (error){
                    console.log("Comment edit error", error)
                    setLoading(false)
                    setFetchError(error.response.data.message)
                }
            }else {
                setEditCommentSaveInit(true);
                setTimeout(() => setEditCommentSaveInit(false), 3000)
            }
        } catch (error) {
            console.error('failed:', error);
        }
    };

    return (
        <>
            { loading && <div className={"d-flex mt-5 justify-content-center"}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
            }
            {!loading &&
                <div className="container d-flex flex-column gap-3 mt-2">
                    { fetchError ?
                        <p className="alert alert-danger">{fetchError}</p> :
                        <>
                            <h1 className="text-center h1">{ product.name }</h1>
                            <h3>Price: {product.price}</h3>
                            <h3>Quantity: {product.quantity}</h3>
                            <h3>Description: {product.description}</h3>
                            <h4>Comments:</h4>
                            { product.comments?.length ?
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th width="800" scope="col">Comment</th>
                                        <th width="300" scope="col">Name</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {product.comments?.map((comment, index) => <tr key={index}>
                                        <td>{comment.text}</td>
                                        <td>{comment.name}</td>
                                        <td>
                                            {!isAdmin && <button className="btn btn-info" onClick={() => handleEdit(comment)}>Edit</button>}
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            <button className="btn btn-danger" onClick={() => handleDelete(comment.id)}>Delete</button>
                                        </td>
                                    </tr>)}
                                    </tbody>
                                </table>
                                :
                                <p className="alert alert-danger">No comments on the product</p>
                            }


                            { editCommentId &&

                                <div className="mb-3">

                                    <h2>Edit the comment</h2>

                                    <form onSubmit={handleSubmitEditForm}>

                                        <div className="form-group mb-3">
                                            <label htmlFor="editCommentName">Name: </label>
                                            <input value={editCommentName}
                                                   onChange={(e) => setEditCommentName(e.target.value)}
                                                   type="text" className="form-control" id="editCommentName" aria-describedby="editCommentNameHelp"
                                                   placeholder="Name"/>
                                            { (editCommentSaveInit && !editCommentName) &&
                                                <p className="alert alert-danger py-1 mt-2">Please enter a valid name</p>
                                            }
                                        </div>

                                        <div className="form-group mb-3">
                                            <label htmlFor="editCommentEmail">Email: </label>
                                            <input value={editCommentEmail}
                                                   onChange={(e) => setEditCommentEmail(e.target.value)}
                                                   type="email" className="form-control" id="editCommentEmail" aria-describedby="editCommentEmailHelp"
                                                   placeholder="Email"/>
                                            { (editCommentSaveInit && !editCommentEmail) &&
                                                <p className="alert alert-danger py-1 mt-2">Please enter a valid email</p>
                                            }
                                        </div>

                                        <div className="form-group mb-3">
                                            <label htmlFor="editCommentText">Comment: </label>
                                            <textarea value={editCommentText}
                                                      onChange={(e) => setEditCommentText(e.target.value)}
                                                      className="form-control" id="editCommentText" aria-describedby="editCommentTextHelp"
                                                      placeholder="Comment"/>
                                            { (editCommentSaveInit && !editCommentText) &&
                                                <p className="alert alert-danger py-1 mt-2">Please enter a valid comment</p>
                                            }
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary align-self-center">
                                            Edit comment
                                        </button>
                                    </form>
                                    <hr/>

                                </div>

                            }

                            <div>

                                <h2>Add a new comment</h2>

                                <form onSubmit={handleSubmit}>

                                    <div className="form-group mb-3">
                                        <label htmlFor="username">Name: </label>
                                        <input value={name}
                                               onChange={(e) => setName(e.target.value)}
                                               type="text" className="form-control" id="name" aria-describedby="nameHelp"
                                               placeholder="Name"/>
                                        { (commentSaveInit && !name) &&
                                            <p className="alert alert-danger py-1 mt-2">Please enter a valid name</p>
                                        }
                                    </div>

                                    <div className="form-group mb-3">
                                        <label htmlFor="email">Email: </label>
                                        <input value={email}
                                               onChange={(e) => setEmail(e.target.value)}
                                               type="email" className="form-control" id="email" aria-describedby="emailHelp"
                                               placeholder="Email"/>
                                        { (commentSaveInit && !email) &&
                                            <p className="alert alert-danger py-1 mt-2">Please enter a valid email</p>
                                        }
                                    </div>

                                    <div className="form-group mb-3">
                                        <label htmlFor="comment">Comment: </label>
                                        <textarea value={comment}
                                                  onChange={(e) => setComment(e.target.value)}
                                                  className="form-control" id="comment" aria-describedby="commentHelp"
                                                  placeholder="Comment"/>
                                        { (commentSaveInit && !comment) &&
                                            <p className="alert alert-danger py-1 mt-2">Please enter a valid comment</p>
                                        }
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary align-self-center">
                                        Add comment
                                    </button>
                                </form>

                            </div>


                            <div className="mt-3">
                                <Link to={"/"} >Go back to all products</Link>
                            </div>
                        </>
                    }
                </div>
            }
        </>
    );
}

export default ProductDetail;