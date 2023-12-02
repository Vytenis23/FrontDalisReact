import React, {useEffect, useRef, useState} from "react";
import "./ProductsList.css";
import {useGeolocation} from "react-use";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";

export default function ProductsList() {

    const geo = useGeolocation();
    const navigate = useNavigate();
    const ref = useRef();

    const [todos, setTodos] = useState(() => createInitialTodos());
    const [products, setProducts] = useState([]);
    const [inputValue, setInputValue] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const isLoggedIn = !!localStorage.getItem("accessToken")
    let isAdmin = false;
    if(localStorage.getItem("user")){
        const user = JSON.parse(localStorage.getItem("user"));
        isAdmin = user.roles?.some(role => role.name === "ADMIN");
    }

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            setLoading(true);
            let response = await axios.get("http://localhost:8080/products");
            setProducts(response.data);
            setError('')
        } catch (error){
            console.log("Product fetch error", error)
            setError(error.response.data.message)
        } finally {
            setLoading(false);
        }
    }

    function createInitialTodos() {
        console.log("kuriami initial todos");
        return [
            "Pirmą užduotis yra labai ilga ir labai ilgai trunkanti",
            "Antra užduotis",
            "Trečia užduotis",
            "Sutvarkyti kambarį"
        ]
    }

    const handleSubmit = () => {
        // nunaviguotu i naujo produkto komponenta
        navigate("/home/products-new");
        // setTodos([...todos, inputValue]);
        // setInputValue("");
    }

    const handleDelete = async (uuid) => {
        setLoading(true);
        try {
            await axios.delete(`http://localhost:8080/products/${uuid}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            getData();
        } catch (error){
            console.log("Product fetch error", error)
            setLoading(false)
            setError(error.response.data.message)
        }
    }

    return (
        <div style={{minWidth: "1024px"}}>
            <h2 className={"text-center my-4"}>Produktų lentelė</h2>

            {/*{(!products || products.length < 1) && <div style={{fontWeight: 700, color: "rebeccapurple"}}>*/}
            {/*    Šiuo metu produktų nėra, prašome įterpti*/}
            {/*</div>}*/}

            {/*{products && products.map((product, index) => (*/}
            {/*    <div key={index}>*/}
            {/*        Produkto pavadinimas: <b>{product.name}</b> ({product.price} EUR), kiekis: <b>{product.quantity}</b>*/}
            {/*        /!*<button onClick={() => handleDelete(product)}>Ištrinti</button>*!/*/}
            {/*    </div>*/}
            {/*))}*/}

            {loading && <div className={"d-flex justify-content-center"}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>}

            { (!loading && error) &&
                <p className="alert alert-danger mt-2">{ error }</p>
            }

            {!loading && <table className="table">
                <thead>
                <tr>
                    <th scope="col">Nr.</th>
                    <th scope="col">Pavadinimas</th>
                    <th scope="col">Kaina</th>
                    <th scope="col">Kiekis</th>
                    <th scope="col">Veiksmai</th>
                </tr>
                </thead>
                <tbody>
                {products?.map((product, index) => <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                        {isLoggedIn ? <Link to={`/home/product-details/${product.id}`}>{product.name}</Link> : <> {product.name} </> }
                    </td>
                    <td>{product.price}</td>
                    <td>{product.quantity}</td>
                    <td>
                        {isAdmin && <button className="btn btn-danger" onClick={() => handleDelete(product.id)}>Trinti</button>}
                    </td>
                </tr>)}
                </tbody>
            </table>}

            <div className={"form-container"}>
                {/*<input value={inputValue}*/}
                {/*       onChange={(e) => setInputValue(e.target.value)}*/}
                {/*       className={"todo-input-field"}*/}
                {/*       type={"text"}*/}
                {/*       placeholder={"Įveskite kitą užduotį (kontroliuojamas "}/>*/}

                {/*<form>*/}
                {/*    <input className={"todo-input-field"}*/}
                {/*           ref={ref}*/}
                {/*           required={true}*/}
                {/*           placeholder={"Įveskite kitą užduotį (nekontroliuojama) "}/>*/}

                {/*    <button type={"submit"}/>*/}
                {/*</form>*/}

                {/*         buvo anksciau: () => setTodos([...todos, inputValue])              */}
                {isAdmin &&
                    <button
                        onClick={handleSubmit}
                        type="button"
                        className="btn btn-primary align-self-center">
                        Pridėti naują užduotį
                    </button>
                }
                {/*<button onClick={handleSubmit}>Pridėti naują užduotį</button>*/}
            </div>

            {/*<pre>*/}
            {/*     {JSON.stringify(geo, null, 2)}*/}
            {/* </pre>*/}
        </div>
    )
}
