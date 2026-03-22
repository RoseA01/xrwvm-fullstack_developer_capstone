import React, { useState } from 'react';
import "./Login.css";
import Header from '../Header/Header';

const Login = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginUrl = '/login';  // relative URL - matches what reached your view

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();  // prevent any parent handlers

    console.log('Form submit handler called!');
    console.log('Username:', username);
    console.log('Sending to:', loginUrl);

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: username,  // matches what frontend sends
          password,
        }),
      });

      console.log('POST response status:', response.status);

      const json = await response.json();
      console.log('POST response JSON:', json);

      if (response.ok && json.status === 'Authenticated') {
        sessionStorage.setItem('username', json.username || json.userName);
        onClose();  // close modal
        window.location.href = '/';  // go home
      } else {
        const msg = json.message || json.error || 'Invalid credentials';
        setError(msg);
        alert(msg);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to connect to server');
      alert('Network error - please try again');
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <Header />
      {/* Backdrop - close on outside click */}
      <div className="modal-backdrop" onClick={onClose}>
        {/* Modal content - stop propagation so clicks inside don't close */}
        <div
          className="modalContainer"
          onClick={(e) => e.stopPropagation()}
        >
          <form className="login_panel" onSubmit={handleSubmit}>
            <div>
              <span className="input_field">Username</span>
              <input
                type="text"
                placeholder="Username"
                className="input_field"
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())}
                disabled={loading}
                required
              />
            </div>

            <div>
              <span className="input_field">Password</span>
              <input
                type="password"
                placeholder="Password"
                className="input_field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {error && (
              <div style={{ color: 'red', margin: '10px 0', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <div className="button-group">
              <button
                type="submit"
                className="action_button"
                disabled={loading || !username || !password}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <button
                type="button"
                className="action_button cancel"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
            </div>

            <a className="loginlink" href="/register">
              Register Now
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
