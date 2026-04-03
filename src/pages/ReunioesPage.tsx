import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMeetings, createMeeting, deleteMeeting, Meeting } from '../services/api';

const ReunioesPage: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const navigate = useNavigate();

  const load = async () => {
    try {
      const data = await getMeetings();
      // Sort by date (dd/mm) descending — most recent first
      data.sort((a, b) => {
        const [da, ma] = a.date.split('/').map(Number);
        const [db, mb] = b.date.split('/').map(Number);
        return mb !== ma ? mb - ma : db - da;
      });
      setMeetings(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    const title = newTitle.trim() || `Reunião ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`;
    await createMeeting({ title });
    setNewTitle('');
    load();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Remover esta reunião e todos os itens?')) return;
    await deleteMeeting(id);
    load();
  };

  const getProgress = (meeting: Meeting) => {
    const allItems = meeting.sections.flatMap(s => s.items);
    const total = allItems.length;
    const dev = allItems.filter(i => i.dev).length;
    const tested = allItems.filter(i => i.tested).length;
    const pct = total > 0 ? Math.round(tested / total * 100) : 0;
    return { total, dev, tested, pct };
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d1117',
      color: '#f0f6fc',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
      overflowY: 'auto',
    }}>
      {/* Navbar */}
      <nav style={{
        background: '#161b22',
        borderBottom: '1px solid #30363d',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        height: 60,
        position: 'sticky',
        top: 0,
        zIndex: 200,
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: '1px solid #30363d',
            borderRadius: 6,
            color: '#8b949e',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >← Home</button>
        <span style={{ color: '#39d353', fontWeight: 700, fontSize: 18 }}>DEV_MGMT</span>
        <span style={{ color: '#484f58', fontSize: 20, fontWeight: 300 }}>/</span>
        <span style={{ color: '#8b949e', fontSize: 16 }}>surfnstein</span>
        <span style={{ flex: 1 }} />
        <span style={{
          background: 'rgba(57,211,83,.15)',
          border: '1px solid rgba(57,211,83,.35)',
          borderRadius: 20,
          color: '#39d353',
          fontSize: 13,
          fontWeight: 600,
          padding: '4px 14px',
        }}>REUNIÕES</span>
      </nav>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 32 }}>
        {/* Create Meeting */}
        <div style={{
          display: 'flex',
          gap: 12,
          marginBottom: 32,
          flexWrap: 'wrap',
          alignItems: 'flex-end',
        }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{
              display: 'block',
              fontSize: 13,
              color: '#8b949e',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '.4px',
              marginBottom: 6,
            }}>Nova Reunião</label>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder="Ex: Reunião 26/03"
              style={{
                width: '100%',
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: 6,
                color: '#f0f6fc',
                padding: '10px 12px',
                fontSize: 15,
                boxSizing: 'border-box',
              }}
            />
          </div>
          <button
            onClick={handleCreate}
            style={{
              background: '#39d353',
              border: 'none',
              borderRadius: 8,
              color: '#0d1117',
              fontSize: 15,
              fontWeight: 700,
              padding: '10px 20px',
              cursor: 'pointer',
              height: 42,
            }}
          >+ Criar Reunião</button>
        </div>

        {/* Meeting Cards */}
        {loading ? (
          <div style={{ color: '#8b949e', textAlign: 'center', padding: 40 }}>Carregando...</div>
        ) : meetings.length === 0 ? (
          <div style={{ color: '#484f58', textAlign: 'center', padding: 40, fontSize: 16 }}>
            Nenhuma reunião criada ainda. Use o formulário acima para começar.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }} className="meetings-grid">
            {meetings.map(meeting => {
              const { total, dev, tested, pct } = getProgress(meeting);
              return (
                <div
                  key={meeting._id}
                  onClick={() => navigate(`/reunioes/${meeting._id}`)}
                  style={{
                    background: '#161b22',
                    border: '1px solid #30363d',
                    borderRadius: 12,
                    padding: 24,
                    cursor: 'pointer',
                    transition: 'border-color .2s, transform .2s',
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
                      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#f0f6fc', marginBottom: 4 }}>
                        {meeting.title}
                      </h3>
                      <span style={{ fontSize: 13, color: '#484f58' }}>{meeting.date}</span>
                    </div>
                    <button
                      onClick={e => handleDelete(meeting._id, e)}
                      style={{
                        background: 'none',
                        border: '1px solid transparent',
                        borderRadius: 6,
                        color: '#484f58',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        fontSize: 14,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#f85149'; e.currentTarget.style.color = '#f85149'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = '#484f58'; }}
                    >✕</button>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <div style={{
                      width: '100%',
                      height: 6,
                      background: '#30363d',
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        background: '#39d353',
                        borderRadius: 3,
                        width: `${pct}%`,
                        transition: 'width .3s',
                      }} />
                    </div>
                  </div>

                  <div style={{ fontSize: 13, color: '#8b949e' }}>
                    <span style={{ color: '#58a6ff' }}>Dev {dev}/{total}</span>
                    {' · '}
                    <span style={{ color: '#39d353' }}>Test {tested}/{total}</span>
                    {' · '}
                    {meeting.sections.length} seções
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default ReunioesPage;
