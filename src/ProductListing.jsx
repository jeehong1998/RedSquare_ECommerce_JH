import React, { useState, useEffect } from "react";

export const ProductListing = (props) => 
{
    const [product, setProduct] = useState('');

    const generate_products = async (keyword, sort_by) => 
    {
        const response = await fetch('https://dummyjson.com/products');
        const res = await response.json();

        const filteredProducts = res.products.filter((element) => 
            element.title.toLowerCase().includes(keyword.toLowerCase()) || element.category.toLowerCase().includes(keyword.toLowerCase())
        );

        let sortedProducts;

        if(sort_by == 'highest_price')
        {
            sortedProducts = filteredProducts.sort((a, b) => b.price - a.price);
        }
        else if(sort_by == 'lowest_price')
        {
            sortedProducts = filteredProducts.sort((a, b) => a.price - b.price);
        }
        else if(sort_by == 'ascending_product')
        {
            sortedProducts = filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
        }
        else if(sort_by == 'descending_product')
        {
            sortedProducts = filteredProducts.sort((a, b) =>{
                if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
                if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
                return 0;
            });

            sortedProducts = sortedProducts.reverse();
        }
        else
        {
            sortedProducts = filteredProducts;
        }


        const products = sortedProducts.slice(0, 10).map((element, index) => (
            <div className="product" key={index}>
                <img src={element.images[0]} alt={element.title} />
                <a href="#" onClick = {() => handleHyperlink({
                    "title" : element.title,
                    "price" : element.price,
                    "category" : element.category,
                    "image" : element.images[0],
                    "description" : element.description
                })}>
                    <h2>{element.title}</h2>
                </a>
                <p className="category">{element.category}</p>
                <p className="price">RM {element.price}</p>
            </div>
        ));

        setProduct(products);
    };

    useEffect(() => 
    {
        generate_products('');
    }, []);

    const handleKeyDown = (event) => 
    {
        if (event.key === 'Enter') 
        {
            generate_products(event.target.value, '');
        }
    }

    const handleSortBy = (keyword, sort_by) => 
    {
        generate_products(keyword, sort_by);
    };

    const handleHyperlink = (product_detail) => {
        props.switchComponent('ProductDetail');
        props.product_detail(product_detail);
    }

    const handleNavigateShoppingCart = () => {
        props.switchComponent('ShoppingCart');
    }

    const logout = () => {
        props.switchComponent('Login');

        // Remove token
        localStorage.removeItem("token");
    }


    return (
        <div className="product-list">
            <div className="header">
                <h1>Product List</h1>
                <button className = "cart-button" onClick = {handleNavigateShoppingCart}>Cart</button>
                <button className = "logout-button" onClick = {logout} >Logout</button>

                <input type="text" id="myInput" onKeyDown={handleKeyDown} placeholder="Search for names.." title="Type in a name" />
                <div className="sort-by">
                    <div className="dropdown">
                        <button onClick={() => handleSortBy(document.getElementById('myInput').value, 'highest_price')}>Sort by Highest Price</button>
                        <button onClick={() => handleSortBy(document.getElementById('myInput').value, 'lowest_price')}>Sort by Lowest Price</button>
                        <button onClick={() => handleSortBy(document.getElementById('myInput').value, 'ascending_product')}>Sort by Product Title in ascending order</button>
                        <button onClick={() => handleSortBy(document.getElementById('myInput').value, 'descending_product')}>Sort by Product Title in descending order</button>
                    </div>
                </div>
            </div>
            <div className="products">
                {product}
            </div>
        </div>
    )
}