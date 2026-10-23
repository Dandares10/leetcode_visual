import React from 'react';
import { X, Award, CheckCircle2, BookOpen, Sparkles, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export function ConceptMatrixModal({ isOpen, onClose, topics, userXp }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 1050,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-glow)',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255, 255, 255, )', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trophy style={{ width: '20px', height: '20px', color: '#ffffff' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff', margin: 0 }}>
                Concept Mastery Matrix
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                Track your architectural growth and conceptual comprehension across core engineering domains.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>

        {/* User Rank & Stats Overview */}
        <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(255, 255, 255, ) 100%)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: '#ffffff', fontWeight: '700', textTransform: 'uppercase' }}>
              CURRENT LEARNER STATUS
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff', margin: '0.2rem 0' }}>
              Senior System Architect Level 4
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Completed 3/3 Core Micro-Simulations
            </span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff' }}>
              {userXp} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>/ 3000 XP</span>
            </span>
            <div style={{ width: '120px', height: '6px', background: 'var(--bg-primary)', borderRadius: '3px', marginTop: '0.4rem', overflow: 'hidden' }}>
              <div style={{ width: `${(userXp / 3000) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #ffffff)' }} />
            </div>
          </div>
        </div>

        {/* Topics Matrix Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {topics.map(t => (
            <div key={t.id} className="glass-panel" style={{ padding: '1rem', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                  {t.category}
                </span>
                <span className={t.status === 'Mastered' ? 'badge-emerald' : t.status === 'Proficient' ? 'badge-cyan' : 'badge-purple'} style={{ fontSize: '0.65rem', padding: '1px 7px', borderRadius: '10px', fontWeight: '700' }}>
                  {t.status}
                </span>
              </div>

              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff', margin: '0 0 0.3rem 0' }}>
                {t.name}
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '0.75rem' }}>
                {t.description}
              </p>

              {/* Progress bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                  <span>{t.level} Level</span>
                  <span>{t.xp} / {t.maxXp} XP</span>
                </div>
                <div style={{ width: '100%', height: '5px', background: 'var(--bg-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${(t.xp / t.maxXp) * 100}%`, height: '100%', background: t.status === 'Mastered' ? '#10b981' : t.status === 'Proficient' ? '#ffffff' : '#a855f7' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </motion.div>
    </div>
  );
}
