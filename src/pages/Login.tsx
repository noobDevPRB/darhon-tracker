import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login as apiLogin } from '../services/api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await apiLogin(email, password);
      login(result.token, result.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d1117',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#161b22',
        border: '1px solid #30363d',
        borderRadius: '12px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
      }}>
        <h1 style={{
          color: '#f0f6fc',
          fontSize: '24px',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '8px',
        }}>
          Tools Manager
        </h1>
        <p style={{
          color: '#8b949e',
          fontSize: '14px',
          textAlign: 'center',
          marginBottom: '32px',
        }}>
          Faça login para continuar
        </p>

        {error && (
          <div style={{
            background: 'rgba(248,81,73,.1)',
            border: '1px solid rgba(248,81,73,.4)',
            borderRadius: '6px',
            padding: '10px 14px',
            marginBottom: '16px',
            color: '#f85149',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            color: '#c9d1d9',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '6px',
          }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              background: '#0d1117',
              border: '1px solid #30363d',
              borderRadius: '6px',
              color: '#f0f6fc',
              fontSize: '15px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            color: '#c9d1d9',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '6px',
          }}>
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              background: '#0d1117',
              border: '1px solid #30363d',
              borderRadius: '6px',
              color: '#f0f6fc',
              fontSize: '15px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: '#39d353',
            border: 'none',
            borderRadius: '6px',
            color: '#0d1117',
            fontSize: '15px',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default Login;
