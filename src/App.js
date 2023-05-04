import React, { useState, useEffect } from "react";
import './App.css';
import { Login } from "./Login"
import { Register } from "./Register"
import { ProductListing } from "./ProductListing"
import { ProductDetail } from "./ProductDetail"
import { ShoppingCart } from "./ShoppingCart"

// Importing the Bootstrap 5 CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Import Bootstrap JavaScript
import 'bootstrap/dist/js/bootstrap.min.js';

import Axios from 'axios';

function App() {
  const [currentForm, setCurrentForm] = useState('');
  const [product_detail, setProductDetail] = useState('');

  useEffect(() => 
  {
    const checkAuth = async () => 
    {
      try 
      {
        const response = await Axios.get('http://localhost:3001/isUserAuth', 
        {
          headers: 
          {
            "x-access-token": localStorage.getItem("token"),
          },
        });

        const state = response.data.auth ? 'ProductListing' : 'Login';
        setCurrentForm(state);
      } 
      catch (error) 
      {
        console.error(error);
      }
    };

    checkAuth();
  }, []);

  return (
    <div className = "App">
      {currentForm === 'Login' ? (<Login switchComponent = {setCurrentForm} />) : currentForm === 'Register' ? (<Register switchComponent = {setCurrentForm}/>) : currentForm === 'ProductListing' ? (<ProductListing switchComponent ={ setCurrentForm} product_detail = {setProductDetail} />) : currentForm === 'ProductDetail' ? (<ProductDetail switchComponent = {setCurrentForm} product_detail = {product_detail}/>) : currentForm === 'ShoppingCart' ? (<ShoppingCart switchComponent = {setCurrentForm}/>) : null }
    </div>
  );
}

export default App;
