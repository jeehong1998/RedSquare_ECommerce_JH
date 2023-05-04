import React, { useState } from "react";
import Axios from 'axios';


export const Register = (props) => {
    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const validateEmail = (email) =>
    {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => 
    {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    };
 
    const handleSubmit = (event) => {
        event.preventDefault();

        if(!validateEmail(email))
        {
            alert("Invalid email inserted, please try again");
            setEmail("");
            setPassword("");
            return;
        }
        else if(!validatePassword(password))
        {
            alert("Password requirements not satisfied.\n\nBe at least 8 characters long.\nContain at least one letter (case-insensitive).\nContain at least one digit.");
            setEmail("");
            setPassword("");
            return;
        }
        
        Axios.post('http://localhost:3001/register', {username: email, password: password})
        .then(response => {
            if(response.data.status === 'fail')
            {
                setEmail("");
                setPassword("");
            }
            else if(response.data.status == 'pass')
            {
                alert("Register Successfully !");
                props.switchComponent("Login");
            }
        });
    }

    return (
        <div className = "auth-form-container">
            <h2>Register</h2>

            <form className = "register-form">
                <label htmlFor = "email" >Email</label>
                <input value = {email} onChange = {(e) => setEmail(e.target.value)} placeholder = "Your email" id = "email" name = "email"/>

                <label htmlFor = "password">Password</label>
                <input value = {password} onChange = {(e) => setPassword(e.target.value)} placeholder = "Your password" type = "password" id = "password" name = "password"/>

                <button onClick={handleSubmit}  style={{marginTop: '10px'}} >Register</button>
            </form>

            <button className = "link-btn"  onClick = {() => props.switchComponent('Login')}> Already have an account ? Login here.</button>
        </div>
    );
}