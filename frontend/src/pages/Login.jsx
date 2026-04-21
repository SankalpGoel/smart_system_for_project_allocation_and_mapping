import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Login = () => {
  const { login } = useAuth();
  const [role, setRole] = useState('STUDENT');
  const [email, setEmail] = useState('');
  
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email');
      return;
    }
    
    try {
      if (role === 'STUDENT') {
        let res = await api.get(`/students/email/${email}`).catch(() => null);
        if (!res || !res.data || !res.data.id) {
          // Auto-register for demo
          res = await api.post('/students', { name: email.split('@')[0], email: email, selectionStatus: 'PENDING' });
          toast.success('New student account created automatically');
        }
        if (res && res.data && res.data.id) {
          login(role, email, res.data.id, res.data.name);
          toast.success(`Welcome, ${res.data.name}!`);
        }
      } else if (role === 'FACULTY') {
        let res = await api.get(`/faculty/${email}`).catch(() => null);
        if (!res || !res.data || !res.data.id) {
          // Auto-register for demo
          res = await api.post('/faculty', { name: email.split('@')[0], email: email, currentLoad: 0, maxLoad: 5 });
          toast.success('New faculty account created automatically');
        }
        if (res && res.data && res.data.id) {
          login(role, email, res.data.id, res.data.name);
          toast.success(`Welcome, Dr. ${res.data.name}!`);
        }
      } else {
        // Admin is typically a single generic user for this demo
        login('ADMIN', email, 0, 'System Admin');
        toast.success('Logged in as Admin');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to connect to backend or register user');
    }
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
