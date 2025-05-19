import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import zxcvbn from 'zxcvbn';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const passwordStrength = zxcvbn(password).score * 25;

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', margin: '10px 0' }}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', margin: '10px 0' }}
      />
      <div style={{ 
        width: '100%', 
        height: '5px',
        backgroundColor: `hsl(${passwordStrength}, 100%, 50%)`,
        margin: '10px 0'
      }} />
      <label>
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        Remember Me
      </label>
      <button 
        onClick={handleLogin}
        style={{ 
          width: '100%', 
          padding: '10px', 
          marginTop: '20px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        Login
      </button>
    </div>
  );
}