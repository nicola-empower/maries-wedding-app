// src/components/LoginPage.jsx
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      // This function securely sends the email and password to Firebase
      await signInWithEmailAndPassword(auth, email, password);
      // If successful, the main App component will handle showing the dashboard
    } catch (err) {
      console.error("Login failed:", err);
      setError('Login failed. Please check your email and password.');
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 Marie's Login</h2>
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default LoginPage;