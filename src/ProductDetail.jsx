import React, { useState, useEffect } from "react";

export const ProductDetail = (props) => 
{
    return (
        <div className="product-list">
            <div className="product-detail-header">

                <div className="product-detail-row">
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
                        <span className="field-value">{props.product_detail.price}</span>
                    </div>
                    
                    <div className="field-row">
                        <span className="field-label">Category: </span>
                        <span className="field-value">{props.product_detail.category}</span>
                    </div>

                    <div className="field-row">
                        <span className="field-label">Description: </span>
                        <span className="field-value">{props.product_detail.description}</span>
                    </div>
                </div>

                <div>
                    
                </div>
            </div>
        </div>
    )
}