import React, { useState } from 'react';
import { MeetingSection } from '../../services/api';
import TaskItem from './TaskItem';

interface SectionBlockProps {
  section: MeetingSection;
  secIdx: number;
  onToggleField: (secIdx: number, itemIdx: number, field: 'dev' | 'tested') => void;
  onDeleteSection: (secIdx: number) => void;
  onDeleteItem: (secIdx: number, itemIdx: number) => void;
  onAddItem: (secIdx: number, text: string) => void;
}

const SectionBlock: React.FC<SectionBlockProps> = ({
  section, secIdx, onToggleField, onDeleteSection, onDeleteItem, onAddItem,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [newItemText, setNewItemText] = useState('');

  const devCount = section.items.filter(i => i.dev).length;
  const testCount = section.items.filter(i => i.tested).length;
  const total = section.items.length;
  const pct = total > 0 ? Math.round(testCount / total * 100) : 0;

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    onAddItem(secIdx, newItemText.trim());
    setNewItemText('');
  };

  return (
    <div style={{
      marginBottom: 14,
      border: '1px solid #30363d',
      borderRadius: 10,
      overflow: 'hidden',
    }}>
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 20px',
          background: '#21262d',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <span style={{ fontSize: 15, flexShrink: 0 }}>{section.icon}</span>
        <h3 style={{ flex: 1, fontSize: 16, fontWeight: 600, color: '#f0f6fc' }}>{section.title}</h3>
        <span style={{ fontSize: 13, color: '#8b949e' }}>
          <span style={{ color: '#58a6ff' }}>D {devCount}</span> · <span style={{ color: '#39d353' }}>T {testCount}</span> / {total}
        </span>
        <div style={{
          width: 100, height: 6,
          background: '#30363d', borderRadius: 3,
          overflow: 'hidden', flexShrink: 0,
        }}>
          <div style={{
            height: '100%',
            background: '#39d353',
            borderRadius: 3,
            width: `${pct}%`,
            transition: 'width .3s',
          }} />
        </div>
        <button
          onClick={e => { e.stopPropagation(); onDeleteSection(secIdx); }}
          style={{
            background: 'none',
            border: '1px solid #30363d',
            borderRadius: 6,
            color: '#484f58',
            cursor: 'pointer',
            padding: '4px 8px',
            fontSize: 14,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#f85149'; e.currentTarget.style.color = '#f85149'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#30363d'; e.currentTarget.style.color = '#484f58'; }}
          title="Remover seção"
        >✕</button>
        <span style={{
          color: '#484f58',
          fontSize: 12,
          transform: collapsed ? 'rotate(-90deg)' : 'none',
          transition: 'transform .2s',
          flexShrink: 0,
        }}>▼</span>
      </div>

      {!collapsed && (
        <div style={{ background: '#161b22' }}>
          {section.items.map((item, itemIdx) => (
            <TaskItem
              key={itemIdx}
              item={item}
              onToggleDev={() => onToggleField(secIdx, itemIdx, 'dev')}
              onToggleTested={() => onToggleField(secIdx, itemIdx, 'tested')}
              onDelete={() => onDeleteItem(secIdx, itemIdx)}
            />
          ))}
          <div style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            padding: '12px 22px',
            borderTop: '1px solid #30363d',
          }}>
            <input
              type="text"
              value={newItemText}
              onChange={e => setNewItemText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddItem()}
              placeholder="Nova tarefa..."
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
              onClick={handleAddItem}
              style={{
                background: '#21262d',
                border: '1px solid #30363d',
                borderRadius: 6,
                color: '#8b949e',
                cursor: 'pointer',
                padding: '6px 12px',
                fontSize: 13,
                whiteSpace: 'nowrap',
              }}
            >+ Tarefa</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionBlock;
