import React, { useState } from "react";

export const ProductListing = (props) => 
{
    const [product, setProduct] = useState('');

    const generate_products = async () => 
    {
        const response = await fetch('https://dummyjson.com/products');
        const res = await response.json();

        const products = res.products.slice(0, 10).map((element, index) => (
            <div className="product" key = {index}>
                <img src={element.images[0]} alt={element.title} />
                <h2>{element.title}</h2>
                <p className="category">{element.category}</p>
                <p className="price">RM {element.price}</p>
            </div>
        ));

        setProduct(products);
    };

    generate_products();

    return (
        <div className="product-list">
            <div className="header">
                <h1>Product List</h1>
                <button className="logout-button">Logout</button>
                <input type="text" id="myInput" onkeyup="myFunction()" placeholder="Search for names.." title="Type in a name" />
            </div>
            <div className="products">
                {product}
            </div>
        </div>
    )
}