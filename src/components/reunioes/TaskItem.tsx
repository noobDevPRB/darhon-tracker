import React, { useState } from 'react';
import { MeetingItem } from '../../services/api';

interface TaskItemProps {
  item: MeetingItem;
  onToggleDev: () => void;
  onToggleTested: () => void;
  onDelete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ item, onToggleDev, onToggleTested, onDelete }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const isComplete = item.dev && item.tested;

  return (
    <div style={{ borderTop: '1px solid #30363d' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '14px 22px',
        fontSize: '15px',
        transition: 'background .12s',
      }}>
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <div
            onClick={onToggleDev}
            style={{
              width: 28, height: 28,
              borderRadius: 6,
              border: `2px solid ${item.dev ? '#58a6ff' : '#30363d'}`,
              background: item.dev ? '#58a6ff' : 'transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
              color: item.dev ? '#fff' : '#484f58',
              transition: 'all .12s',
            }}
            title="Desenvolvido"
          >D</div>
          <div
            onClick={onToggleTested}
            style={{
              width: 28, height: 28,
              borderRadius: 6,
              border: `2px solid ${item.tested ? '#39d353' : '#30363d'}`,
              background: item.tested ? '#39d353' : 'transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
              color: item.tested ? '#fff' : '#484f58',
              transition: 'all .12s',
            }}
            title="Testado"
          >T</div>
        </div>

        <span
          style={{
            flex: 1,
            textDecoration: isComplete ? 'line-through' : 'none',
            color: isComplete ? '#484f58' : '#f0f6fc',
            cursor: item.details ? 'pointer' : 'default',
          }}
          onClick={() => item.details && setDetailsOpen(!detailsOpen)}
        >
          {item.text}
          {item.details && (
            <span style={{
              display: 'inline-block',
              fontSize: 9,
              marginLeft: 5,
              color: '#484f58',
              transform: detailsOpen ? 'rotate(90deg)' : 'none',
              transition: 'transform .2s',
            }}>&#9658;</span>
          )}
        </span>

        <button
          onClick={onDelete}
          style={{
            background: 'none',
            border: '1px solid #30363d',
            borderRadius: 6,
            color: '#484f58',
            cursor: 'pointer',
            padding: '4px 8px',
            fontSize: 14,
            transition: 'all .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#f85149'; e.currentTarget.style.color = '#f85149'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#30363d'; e.currentTarget.style.color = '#484f58'; }}
          title="Remover"
        >
          ✕
        </button>
      </div>

      {detailsOpen && item.details && (
        <div style={{ padding: '6px 0 12px 84px' }}>
          <ul style={{
            listStyle: 'none',
            borderLeft: '2px solid #30363d',
            paddingLeft: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
          }}>
            {item.details.map((d, i) => (
              <li key={i} style={{ fontSize: 13, color: '#8b949e', lineHeight: 1.5 }}>
                <code style={{
                  fontFamily: "'SF Mono','Fira Code',monospace",
                  fontSize: 12,
                  color: '#58a6ff',
                  background: '#0d1117',
                  padding: '1px 5px',
                  borderRadius: 4,
                }}>{d.label}</code> — {d.desc}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
