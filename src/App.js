import React, { useState, useEffect } from "react";
import './App.css';
import { Login } from "./Login"
import { Register } from "./Register"
import { ProductListing } from "./ProductListing"
import Axios from 'axios';

function App() {
  const [currentForm, setCurrentForm] = useState('');

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
      {currentForm === 'Login' ? (<Login switchComponent={setCurrentForm} />) : currentForm === 'Register' ? (<Register switchComponent={setCurrentForm}/>) : currentForm === 'ProductListing' ? (<ProductListing />) : null}
    </div>
  );
}

export default App;
