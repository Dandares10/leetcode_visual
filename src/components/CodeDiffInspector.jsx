import React, { useState } from 'react';
import { GitCompare, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export function CodeDiffInspector({ diffView }) {
  const [mode, setMode] = useState('split'); // 'split' | 'unified'

  if (!diffView) return null;

  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '1rem' }}>
      
      {/* Top Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <GitCompare style={{ width: '18px', height: '18px', color: '#a855f7' }} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', margin: 0 }}>
            Metacognitive Code Diff Inspector
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '0.3rem', background: 'var(--bg-primary)', padding: '2px', borderRadius: '6px' }}>
          <button
            onClick={() => setMode('split')}
            style={{
              background: mode === 'split' ? 'var(--bg-tertiary)' : 'transparent',
              color: mode === 'split' ? '#a855f7' : 'var(--text-secondary)',
              border: 'none',
              padding: '0.25rem 0.6rem',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Split View
          </button>
          <button
            onClick={() => setMode('unified')}
            style={{
              background: mode === 'unified' ? 'var(--bg-tertiary)' : 'transparent',
              color: mode === 'unified' ? '#a855f7' : 'var(--text-secondary)',
              border: 'none',
              padding: '0.25rem 0.6rem',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Unified View
          </button>
        </div>
      </div>

      {/* Main Diff Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {mode === 'split' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', height: '100%' }}>
            
            {/* Before / Buggy */}
            <div style={{ background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.25)', borderRadius: '10px', padding: '0.85rem', overflowX: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', color: '#f43f5e' }}>
                <AlertTriangle style={{ width: '15px', height: '15px' }} />
                <span style={{ fontSize: '0.78rem', fontWeight: '700' }}>
                  Naive / Vulnerable Pattern
                </span>
              </div>
              <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#fda4af', whiteSpace: 'pre-wrap', lineHeight: '1.5', margin: 0 }}>
                {diffView.before}
              </pre>
            </div>

            {/* After / Optimized */}
            <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px', padding: '0.85rem', overflowX: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', color: '#10b981' }}>
                <CheckCircle2 style={{ width: '15px', height: '15px' }} />
                <span style={{ fontSize: '0.78rem', fontWeight: '700' }}>
                  Metacognitive Optimized Pattern
                </span>
              </div>
              <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#a7f3d0', whiteSpace: 'pre-wrap', lineHeight: '1.5', margin: 0 }}>
                {diffView.after}
              </pre>
            </div>

          </div>
        ) : (
          <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1rem' }}>
            <div style={{ marginBottom: '0.75rem', color: '#f43f5e', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', background: 'rgba(244,63,94,0.1)', padding: '0.5rem', borderRadius: '4px' }}>
              - {diffView.before}
            </div>
            <div style={{ color: '#10b981', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', background: 'rgba(16,185,129,0.1)', padding: '0.5rem', borderRadius: '4px' }}>
              + {diffView.after}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
