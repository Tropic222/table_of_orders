import React, { useState } from 'react'
import './LoginForm.css'

const LoginForm = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();  
    const authString = `${userName}:${password}`;
    // conversion to base64 
    const basicAuthToken = btoa(authString);  
      
    const url = '/api/tms/hs/es-api/auth';
    const requestBody = {
      login: userName,
      password: password
    };

    // console.log('Token:', basicAuthToken);
    // console.log('Request:', JSON.stringify(requestBody));

    fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuthToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        localStorage.setItem('authToken', data.token);
        console.log('Token saved', data.token);
      })
      .catch(error => {
        console.error('ERROR:', error);
      });
  };

  return (
    <div id="login">
      <form name="form-login" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            id="user"
            placeholder="UserName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            id="pass"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <input type="submit" value="Sign in" />
      </form>
    </div>
  );
};

export default LoginForm;
