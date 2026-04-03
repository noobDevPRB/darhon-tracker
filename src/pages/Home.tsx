import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const hasPermission = (perm: string) => user?.permissions.includes(perm) ?? false;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d1117',
      padding: '32px',
    }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '48px',
        maxWidth: '800px',
        margin: '0 auto 48px',
      }}>
        <h1 style={{ color: '#39d353', fontSize: '20px', fontWeight: 700 }}>
          Tools Manager
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#8b949e', fontSize: '14px' }}>{user?.email}</span>
          <button
            onClick={logout}
            style={{
              background: 'none',
              border: '1px solid #30363d',
              borderRadius: '6px',
              color: '#8b949e',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Sair
          </button>
        </div>
      </nav>

      <div style={{
        display: 'flex',
        gap: '24px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        {hasPermission('darhon') && (
          <div
            onClick={() => navigate('/darhon')}
            style={{
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '12px',
              padding: '32px',
              cursor: 'pointer',
              width: '300px',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#39d353';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#30363d';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🐉</div>
            <h2 style={{ color: '#f0f6fc', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
              Darhon Hunt Tracker
            </h2>
            <p style={{ color: '#8b949e', fontSize: '14px', lineHeight: 1.5 }}>
              Rastreie suas caçadas diárias e drops de itens no calendário.
            </p>
          </div>
        )}

        {hasPermission('reunioes') && (
          <div
            onClick={() => navigate('/reunioes')}
            style={{
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '12px',
              padding: '32px',
              cursor: 'pointer',
              width: '300px',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#39d353';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#30363d';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>📋</div>
            <h2 style={{ color: '#f0f6fc', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
              Reuniões
            </h2>
            <p style={{ color: '#8b949e', fontSize: '14px', lineHeight: 1.5 }}>
              Gerencie tarefas e acompanhe o progresso dos alinhamentos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
