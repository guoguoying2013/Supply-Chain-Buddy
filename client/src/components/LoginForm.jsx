/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ show, closeModal, passUsername }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = (e) => {
    e.preventDefault();
    e.target.name === 'username' ? setUsername(e.target.value) : setPassword(e.target.value);
  };

  const resetState = () => {
    setUsername('');
    setPassword('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      username,
      password,
    };
    axios.post('/auth/login', data)
      .then((res) => {
        closeModal(res.data[0]);
        passUsername(username);
      })
      .then(() => {
        resetState();
      })
      .catch((err) => {
        console.log('axios err: ', err);
      });
  };

  if (!show) {
    return null;
  }

  return (
    <div className="LoginModal">
      <form className="modal-content">
        <h1>Login Form</h1>
        <input type="text" value={username} onChange={handleChange} name="username" placeholder="Username" required />
        <br />
        <input type="password" value={password} onChange={handleChange} name="password" placeholder="Password" required />
        <br />
        <button onClick={handleSubmit} className="submit-button" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default LoginForm;
