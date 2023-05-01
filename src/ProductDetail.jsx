import React, { useState, useEffect } from "react";
import Axios from 'axios';

export const ProductDetail = (props) => 
{
    const handleSubmit = (event) => 
    {
        event.preventDefault();
        const token = localStorage.getItem("token");

        Axios.post('http://localhost:3001/addToCart', {product_title: props.product_detail.title, product_image: props.product_detail.image, product_price: props.product_detail.price, quantity: 1, token: token})
        .then(response => {
            alert(response.data.message);
        });
    }

    const handleNavigatePreviousPage = () => {
        props.switchComponent('ProductListing');
    }

    return (
        <div className="product-list">
            <div className="product-detail-header">

                <div className="product-detail-row">
                    <button onClick = {handleNavigatePreviousPage}>Go Back</button>
                    <h1>Product Detail</h1>
                </div>

                <div className="product-details">
                    <img className = "product-detail-image" src={props.product_detail.image} alt="Product Image" />

                    <div className="field-row">
                        <span className="field-label">Product: </span>
                        <span className="field-value">{props.product_detail.title}</span>
                    </div>

                    <div className="field-row">
                        <span className="field-label">Price: </span>
                        <span className="field-value">RM {props.product_detail.price}</span>
                    </div>
                    
                    <div className="field-row">
                        <span className="field-label">Category: </span>
                        <span className="field-value">{props.product_detail.category}</span>
                    </div>

                    <div className="field-row">
                        <span className="field-label">Description: </span>
                        <span className="field-value">{props.product_detail.description}</span>
                    </div>

                    <div className="field-row">
                        <button onClick={handleSubmit}>Add To Cart</button>
                    </div>
                </div>

            </div>
        </div>
    )
}