import React from 'react';
import { X, HelpCircle, ShieldAlert, Zap, Layers, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function WhyDrawer({ isOpen, lineNum, annotation, onClose }) {
  if (!isOpen || !annotation) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            width: '100%',
            maxWidth: '480px',
            height: '100%',
            background: 'var(--bg-secondary)',
            borderLeft: '1px solid var(--border-glow)',
            boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
            overflowY: 'auto'
          }}
        >
          {/* Top Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, )',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <HelpCircle style={{ width: '18px', height: '18px', color: '#ffffff' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', margin: 0 }}>
                  Why Line {lineNum}?
                </h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  Architectural Rationale Inspector
                </span>
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

          {/* Badge & Category */}
          <div style={{ marginBottom: '1.25rem' }}>
            <span className="badge-cyan" style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '12px', fontWeight: '700' }}>
              {annotation.badge}
            </span>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginTop: '0.6rem', lineHeight: '1.3' }}>
              {annotation.title}
            </h2>
          </div>

          {/* Quick Summary Box */}
          <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700', display: 'block', marginBottom: '0.3rem' }}>
              EXECUTIVE SUMMARY
            </span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
              {annotation.summary}
            </p>
          </div>

          {/* Detailed Rationale */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.82rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Zap style={{ width: '14px', height: '14px' }} /> Architectural & Engineering Motivation
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6', background: 'rgba(255,255,255,0.02)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              {annotation.rationale}
            </p>
          </div>

          {/* Anti-Pattern & Pitfall Alert */}
          <div style={{ background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '10px', padding: '1rem', marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
              <AlertTriangle style={{ width: '16px', height: '16px', color: '#f43f5e' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#fecdd3' }}>
                Anti-Pattern to Avoid
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#fda4af', lineHeight: '1.45' }}>
              Omitting this line leads to unhandled async state updates, UI glitches during fast interaction, or memory leaks on component unmount.
            </p>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
