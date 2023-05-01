import React, { useState } from "react";
import Axios from 'axios';


export const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        Axios.post('http://localhost:3001/login', {username: email, password: password})
        .then(response => {
            alert(response.data.message);
            if(response.data.auth)
            {
                // Remove token if there is any
                localStorage.removeItem("token");

                // Store token
                localStorage.setItem("token", response.data.token);
                props.switchComponent('ProductListing');
            }
        });
    }

    return (
        <div className = "auth-form-container">
            <h2>Login</h2>
            
            <form className = "login-form">
                <label htmlFor = "email">Email</label>
                <input value = {email} onChange = {(e) => setEmail(e.target.value)} type = "email" placeholder = "Please enter your email" id = "email" name = "email"/>

                <label htmlFor = "password">Password</label>
                <input value = {password} onChange = {(e) => setPassword(e.target.value)} placeholder = "Please enter your password" type = "password" id = "password" name = "password"/>

                <button onClick={handleSubmit}>Login</button>
            </form>

            <button className = "link-btn" onClick = {() => props.switchComponent('Register')}> Don't have an account ? Register here.</button>
        </div>
    );
}