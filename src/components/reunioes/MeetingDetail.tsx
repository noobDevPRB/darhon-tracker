import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMeeting, updateMeeting, deleteSection, deleteItem, finalizarRevisao, Meeting } from '../../services/api';
import SectionBlock from './SectionBlock';

const DYN_ICONS = ['📌','📝','🎬','🏄','⚖️','🗳️','🔐','👤','🎯','📱','💳','🐛','✨','🔧','🌊','📋'];

const MeetingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [newSecIcon, setNewSecIcon] = useState(DYN_ICONS[0]);
  const [newSecTitle, setNewSecTitle] = useState('');
  const [finalizing, setFinalizing] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = async () => {
    if (!id) return;
    try {
      const data = await getMeeting(id);
      setMeeting(data);
    } catch {
      navigate('/reunioes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return <div style={{ color: '#8b949e', padding: 40, textAlign: 'center' }}>Carregando...</div>;
  if (!meeting) return null;

  const handleToggleField = async (secIdx: number, itemIdx: number, field: 'dev' | 'tested') => {
    const updated = { ...meeting };
    const item = updated.sections[secIdx].items[itemIdx];
    if (field === 'dev') item.dev = !item.dev;
    else item.tested = !item.tested;
    const result = await updateMeeting(meeting._id, { sections: updated.sections });
    setMeeting(result);
  };

  const handleDeleteSection = async (secIdx: number) => {
    if (!confirm('Remover esta seção e seus itens?')) return;
    const result = await deleteSection(meeting._id, secIdx);
    setMeeting(result);
  };

  const handleDeleteItem = async (secIdx: number, itemIdx: number) => {
    const result = await deleteItem(meeting._id, secIdx, itemIdx);
    setMeeting(result);
  };

  const handleAddItem = async (secIdx: number, text: string) => {
    const updated = { ...meeting };
    updated.sections[secIdx].items.push({ dev: false, tested: false, text });
    const result = await updateMeeting(meeting._id, { sections: updated.sections });
    setMeeting(result);
  };

  const handleUpdateItemText = async (secIdx: number, itemIdx: number, text: string) => {
    const updated = { ...meeting };
    updated.sections[secIdx].items[itemIdx].text = text;
    const result = await updateMeeting(meeting._id, { sections: updated.sections });
    setMeeting(result);
  };

  const handleAddSection = async () => {
    if (!newSecTitle.trim()) return;
    const updated = { ...meeting };
    updated.sections.push({ icon: newSecIcon, title: newSecTitle.trim(), items: [] });
    const result = await updateMeeting(meeting._id, { sections: updated.sections });
    setMeeting(result);
    setNewSecTitle('');
  };

  const handleFinalizar = async () => {
    if (!confirm('Finalizar revisão? Itens não testados serão movidos para uma nova reunião.')) return;
    setFinalizing(true);
    try {
      const result = await finalizarRevisao(meeting._id);
      if (result.targetMeeting) {
        navigate(`/reunioes/${result.targetMeeting._id}`);
      } else {
        setMeeting(result.original);
      }
    } finally {
      setFinalizing(false);
    }
  };

  const generateMarkdown = () => {
    let md = `# ${meeting.title} — ${meeting.date}\n\n`;

    for (const section of meeting.sections) {
      md += `## ${section.icon} ${section.title}\n\n`;
      for (const item of section.items) {
        const check = item.tested ? 'x' : ' ';
        const devTag = item.dev ? ' `[DEV]`' : '';
        md += `- [${check}]${devTag} ${item.text}\n`;
        if (item.details) {
          for (const d of item.details) {
            md += `  - \`${d.label}\` — ${d.desc}\n`;
          }
        }
      }
      md += '\n';
    }

    return md.trimEnd();
  };

  const handleCopyMd = async () => {
    const md = generateMarkdown();
    try {
      await navigator.clipboard.writeText(md);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = md;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Global progress
  const allItems = meeting.sections.flatMap(s => s.items);
  const gDev = allItems.filter(i => i.dev).length;
  const gTest = allItems.filter(i => i.tested).length;
  const gTotal = allItems.length;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d1117',
      color: '#f0f6fc',
      overflowY: 'auto',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
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
          onClick={() => navigate('/reunioes')}
          style={{
            background: 'none',
            border: '1px solid #30363d',
            borderRadius: 6,
            color: '#8b949e',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >← Voltar</button>
        <span style={{ color: '#39d353', fontWeight: 700, fontSize: 18 }}>DEV_MGMT</span>
        <span style={{ color: '#484f58', fontSize: 20, fontWeight: 300 }}>/</span>
        <span style={{ color: '#8b949e', fontSize: 16 }}>{meeting.title}</span>
        <span style={{ flex: 1 }} />
        <span style={{
          background: 'rgba(57,211,83,.15)',
          border: '1px solid rgba(57,211,83,.35)',
          borderRadius: 20,
          color: '#39d353',
          fontSize: 13,
          fontWeight: 600,
          padding: '4px 14px',
        }}>REUNIÃO</span>
      </nav>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 32 }}>
        {/* Progress & Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 15, color: '#8b949e', flex: 1 }}>
            <span style={{ color: '#58a6ff' }}>Dev {gDev}/{gTotal}</span> · <span style={{ color: '#39d353' }}>Test {gTest}/{gTotal}</span>
          </span>
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: 4, background: '#58a6ff', verticalAlign: 'middle' }}></span> Desenvolvido
            <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: 4, background: '#39d353', verticalAlign: 'middle', marginLeft: 12 }}></span> Testado
          </span>
          <button
            onClick={handleCopyMd}
            style={{
              background: copied ? 'rgba(57,211,83,.15)' : '#21262d',
              border: `1px solid ${copied ? '#39d353' : '#30363d'}`,
              borderRadius: 8,
              color: copied ? '#39d353' : '#8b949e',
              fontSize: 14,
              fontWeight: 600,
              padding: '10px 20px',
              cursor: 'pointer',
              transition: 'all .15s',
            }}
          >
            {copied ? '✓ Copiado!' : '📋 Copiar MD'}
          </button>
          <button
            onClick={handleFinalizar}
            disabled={finalizing}
            style={{
              background: '#39d353',
              border: 'none',
              borderRadius: 8,
              color: '#0d1117',
              fontSize: 14,
              fontWeight: 700,
              padding: '10px 20px',
              cursor: finalizing ? 'not-allowed' : 'pointer',
              opacity: finalizing ? 0.7 : 1,
            }}
          >
            {finalizing ? 'Finalizando...' : 'Finalizar Revisão'}
          </button>
        </div>

        {/* Sections */}
        {meeting.sections.map((section, secIdx) => (
          <SectionBlock
            key={secIdx}
            section={section}
            secIdx={secIdx}
            onToggleField={handleToggleField}
            onDeleteSection={handleDeleteSection}
            onDeleteItem={handleDeleteItem}
            onAddItem={handleAddItem}
            onUpdateItemText={handleUpdateItemText}
          />
        ))}

        {/* Add Section */}
        <div style={{
          padding: '14px 22px',
          background: '#21262d',
          borderRadius: 10,
          border: '1px solid #30363d',
          marginTop: 18,
        }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={newSecIcon}
              onChange={e => setNewSecIcon(e.target.value)}
              style={{
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: 6,
                color: '#f0f6fc',
                padding: '7px 8px',
                fontSize: 16,
                cursor: 'pointer',
              }}
            >
              {DYN_ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
            </select>
            <input
              type="text"
              value={newSecTitle}
              onChange={e => setNewSecTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddSection()}
              placeholder="Nome da seção..."
              style={{
                flex: 1,
                minWidth: 160,
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: 6,
                color: '#f0f6fc',
                padding: '8px 12px',
                fontSize: 14,
              }}
            />
            <button
              onClick={handleAddSection}
              style={{
                background: '#21262d',
                border: '1px solid #30363d',
                borderRadius: 6,
                color: '#8b949e',
                cursor: 'pointer',
                padding: '6px 12px',
                fontSize: 13,
              }}
            >+ Seção</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MeetingDetail;
