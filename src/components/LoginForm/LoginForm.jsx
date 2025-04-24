import React, { useState } from 'react'
import './LoginForm.css'

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Username:', username, 'Password:', password);
  };

  return (
    <div id="login">
      <form name="form-login" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            id="user"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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