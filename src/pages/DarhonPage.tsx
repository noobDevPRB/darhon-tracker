import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Calendar from '../components/Calendar';
import { getDarhonData, saveDarhonData } from '../services/api';

const DarhonPage: React.FC = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const navigate = useNavigate();

  // Load data from MongoDB on mount
  useEffect(() => {
    getDarhonData()
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          const existing = JSON.parse(localStorage.getItem('calendarData') || '{}');
          const merged = { ...data, ...existing };
          localStorage.setItem('calendarData', JSON.stringify(merged));
        }
      })
      .catch(() => {});
  }, []);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleSaveToMongo = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      const data = JSON.parse(localStorage.getItem('calendarData') || '{}');
      await saveDarhonData(data);
      setSaveMsg('Dados salvos no MongoDB!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err: any) {
      setSaveMsg('Erro: ' + (err.message || 'Falha ao salvar'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        background: '#161b22',
        borderBottom: '1px solid #30363d',
      }}>
        <button
          onClick={() => navigate('/')}
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
          ← Voltar
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {saveMsg && (
            <span style={{
              color: saveMsg.startsWith('Erro') ? '#f85149' : '#39d353',
              fontSize: '13px',
            }}>
              {saveMsg}
            </span>
          )}
          <button
            onClick={handleSaveToMongo}
            disabled={saving}
            style={{
              background: '#39d353',
              border: 'none',
              borderRadius: '6px',
              color: '#0d1117',
              padding: '8px 16px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              fontWeight: 700,
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Salvando...' : 'Gravar no MongoDB'}
          </button>
        </div>
      </div>

      <Header />
      <Calendar
        date={currentDate}
        onPrev={goToPreviousMonth}
        onNext={goToNextMonth}
      />
    </div>
  );
};

export default DarhonPage;
