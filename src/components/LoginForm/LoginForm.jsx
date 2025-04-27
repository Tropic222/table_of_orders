import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../api/api'
import './LoginForm.css'

const LoginForm = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = await login(userName, password);
      localStorage.setItem('authToken', data.token);
      const basicAuthToken = btoa(`${userName}:${password}`);
      localStorage.setItem('basicAuthToken', basicAuthToken);
      navigate('/orders');
    } catch (error) {
      console.error('Login error:', error);
    }
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
