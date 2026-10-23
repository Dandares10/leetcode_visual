import React from 'react';
import { motion } from 'framer-motion';
import { Award, Target, Trophy, Flame } from 'lucide-react';

export function MasteryPage({ topics, userXp }) {
  // Logic from ConceptMatrixModal but displayed as a full page
  const getMasteryColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'mastered': return '#a855f7'; // Purple
      case 'proficient': return '#0ea5e9'; // Cyan
      case 'learning': return '#f59e0b'; // Amber
      default: return '#64748b'; // Slate
    }
  };

  const calculateTotalMastery = () => {
    let expertCount = 0;
    topics.forEach(t => {
      if (t.status === 'Mastered') expertCount++;
    });
    return Math.min(100, Math.round((expertCount / topics.length) * 100)) || 0;
  };

  return (
    <div style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Award style={{ color: '#a855f7', width: '32px', height: '32px' }} /> Concept Mastery Matrix
      </h1>

      {/* Top Stats */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ flex: 1, background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(79, 70, 229, 0.05) 100%)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(147, 51, 234, 0.2)', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 15px rgba(147, 51, 234, 0.05)' }}>
          <div style={{ padding: '1rem', background: 'rgba(147, 51, 234, 0.15)', borderRadius: '12px' }}>
            <Trophy style={{ color: 'var(--accent-purple)', width: '28px', height: '28px' }} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Total XP</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{userXp}</div>
          </div>
        </div>
        
        <div style={{ flex: 1, background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(56, 189, 248, 0.05) 100%)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(14, 165, 233, 0.2)', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 15px rgba(14, 165, 233, 0.05)' }}>
          <div style={{ padding: '1rem', background: 'rgba(14, 165, 233, 0.15)', borderRadius: '12px' }}>
            <Target style={{ color: 'var(--accent-cyan)', width: '28px', height: '28px' }} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Completion</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{calculateTotalMastery()}%</div>
          </div>
        </div>

        <div style={{ flex: 1, background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.05) 0%, rgba(245, 158, 11, 0.05) 100%)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(217, 119, 6, 0.2)', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 15px rgba(217, 119, 6, 0.05)' }}>
          <div style={{ padding: '1rem', background: 'rgba(217, 119, 6, 0.15)', borderRadius: '12px' }}>
            <Flame style={{ color: 'var(--accent-amber)', width: '28px', height: '28px' }} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Current Streak</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>12 Days</div>
          </div>
        </div>
      </div>

      {/* Grid Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {topics.map(topic => (
          <motion.div key={topic.id} whileHover={{ y: -5 }} style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span className="badge-cyan" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>{topic.category}</span>
              <span style={{ 
                fontSize: '0.7rem', 
                padding: '2px 8px', 
                borderRadius: '12px', 
                background: getMasteryColor(topic.status) + '20',
                color: getMasteryColor(topic.status),
                border: `1px solid ${getMasteryColor(topic.status)}50`,
                textTransform: 'uppercase',
                fontWeight: 700
              }}>
                {topic.status}
              </span>
            </div>
            
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
              {topic.name}
            </h3>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', flex: 1 }}>
              {topic.description}
            </p>

            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                <span>Progress</span>
                <span>{topic.xp} / {topic.maxXp} XP</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(0,0,0,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${(topic.xp / topic.maxXp) * 100}%`, height: '100%', background: getMasteryColor(topic.status), borderRadius: '3px' }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
