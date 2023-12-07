import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function NewBlogPost(props) {
    const [title, setTitle] = useState();
    const [content, setContent] = useState();
    const [author, setAuthor] = useState();

    const navigate = useNavigate();

    const handleSubmit = async () => {
        let obj = {
            title: title,
            content: content,
            author: author
        };

         let data = await axios.post("http://localhost:8080/blogposts", obj);
         navigate(-1);
    };

    return (
        <div className={"container d-flex flex-column gap-3 mt-2"}>
            <h1>Naujo straipsnio pridėjimas</h1>
            <div className="form-group">
                <label htmlFor="titleInput">Straipsnio pavadinimas</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    className="form-control"
                    id="titleInput"
                    placeholder="Įveskite straipsnio pavadinimą"
                />
            </div>

            <div className="form-group">
                <label htmlFor="contentInput">Straipsnio turinys</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="form-control"
                    id="contentInput"
                    rows="4"
                    placeholder="Įveskite straipsnio turinį"
                ></textarea>
            </div>

            <div className="form-group">
                <label htmlFor="authorInput">Autorius</label>
                <input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    type="text"
                    className="form-control"
                    id="authorInput"
                    placeholder="Įveskite autorių"
                />
            </div>

            <button
                onClick={handleSubmit}
                type="button"
                className="btn btn-primary align-self-center"
            >
                Pridėti straipsnį
            </button>
        </div>
    );
}
