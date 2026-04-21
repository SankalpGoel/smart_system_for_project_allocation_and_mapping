import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const [role, setRole] = useState('STUDENT');
  const [email, setEmail] = useState('');
  
  const handleLogin = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email');
      return;
    }
    
    // Mock login IDs based on role
    const id = role === 'STUDENT' ? 1 : role === 'FACULTY' ? 1 : 0;
    login(role, email, id, email.split('@')[0]);
    toast.success(`Logged in as ${role}`);
  };

  return (
    <Card glass>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Welcome Back</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Select Role
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['STUDENT', 'FACULTY', 'ADMIN'].map((r) => (
              <Button
                key={r}
                type="button"
                variant={role === r ? 'primary' : 'outline'}
                onClick={() => setRole(r)}
                style={{ flex: 1, padding: '0.5rem' }}
              >
                {r.charAt(0) + r.slice(1).toLowerCase()}
              </Button>
            ))}
          </div>
        </div>
        
        <Input 
          label="Email Address" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        
        <Button type="submit" style={{ marginTop: '1rem' }}>
          Sign In
        </Button>
      </form>
    </Card>
  );
};

export default Login;
