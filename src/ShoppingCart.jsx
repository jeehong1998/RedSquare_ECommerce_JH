import React, { useState, useEffect } from "react";
import Axios from 'axios';

export const ShoppingCart = (props) => {
  const [table_details, setTableDetails] = useState('');

  const getCurrentCartInfo = async () => {
    const token = localStorage.getItem("token");
    let shopping_cart_details;

    Axios.post('http://localhost:3001/getCartDetails', {token: token})
      .then(res => {
        shopping_cart_details = res.data.result.map((element, index) => {
          return (
            <tr key={index}>
              <td><img src={element.image} alt="Product 1" /> </td>
              <td>{element.product_title}</td>
              <td>RM {element.price}</td>
              <td>RM {element.price * element.quantity}</td>
              <td>
                <button className="quantity-btn minus-btn" disabled={element.quantity === 1 ? true : false} onClick = {() => handleModifyCart({
                    "title" : element.product_title,
                    "type": "decrease"
                })}>-</button>
                <span className="quantity">{element.quantity}</span>
                <button className="quantity-btn plus-btn" onClick = {() => handleModifyCart({
                    "title" : element.product_title,
                    "type": "increase"
                })}>+</button>
              </td>
              <td><button className="remove-btn" onClick = {() => handleModifyCart({
                    "title" : element.product_title,
                    "type": "remove"
                })}>Remove</button></td>
            </tr>
          );
        });
        setTableDetails(shopping_cart_details);
      });
  }

  const handleNavigatePreviousPage = () => {
    props.switchComponent('ProductListing');
  }

  const handleModifyCart = (product_details) => 
  {
      const token = localStorage.getItem("token");

      Axios.post('http://localhost:3001/modifyCart', {product_title: product_details.title, type: product_details.type , token: token})
      .then(response => {
          getCurrentCartInfo();
      });
  }

  useEffect(() => {
    getCurrentCartInfo();
  }, []);

  return (
    <div className="auth-form-container">
      <header>
        <div className="product-detail-row">
            <button onClick = {handleNavigatePreviousPage}>Go Back</button>
            <h1>Shopping Cart</h1>
        </div>
      </header>
      <main>
        <table>
          <thead>
            <tr>
              <th>Product Image</th>
              <th>Product Title</th>
              <th>Product Price</th>
              <th>Total Product Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{table_details}</tbody>
        </table>
      </main>
    </div>
  );
}
