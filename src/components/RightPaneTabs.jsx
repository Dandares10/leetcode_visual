import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Play, GitCompare, CheckSquare, Sparkles } from 'lucide-react';

const TABS = [
  { id: 'code', label: 'Annotated Code View', icon: Code2 },
  { id: 'simulator', label: 'Interactive Simulator', icon: Play },
  { id: 'diff', label: 'Diff Inspector', icon: GitCompare },
  { id: 'quiz', label: 'Checkpoint Quiz', icon: CheckSquare }
];

export function RightPaneTabs({ activeViewTab, onSelectViewTab }) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'flex-end', 
      justifyContent: 'space-between', 
      padding: '0.75rem 1rem 0.5rem 1rem', 
      borderBottom: '1px solid var(--border-subtle)', 
      background: 'rgba(9, 13, 22, 0.5)',
      height: '65px'
    }}>
      {/* Left Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', position: 'relative' }}>
        {TABS.map((tab) => {
          const isActive = activeViewTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <div key={tab.id} style={{ position: 'relative' }}>
              {/* Premium Animated Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTabUnderline"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{
                    position: 'absolute',
                    bottom: '-0.5rem',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: '#ffffff',
                    boxShadow: '0 -2px 10px rgba(255, 255, 255, 0.5)',
                    borderRadius: '2px'
                  }}
                />
              )}

              <button
                onClick={() => onSelectViewTab(tab.id)}
                style={{
                  position: 'relative',
                  background: 'transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  border: 'none',
                  padding: '0.5rem 0.9rem',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  zIndex: 2,
                  transition: 'color 0.2s ease'
                }}
              >
                {/* Sliding Background Pill */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabBackground"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'var(--bg-tertiary)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
                      zIndex: -1
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon style={{ width: '15px', height: '15px', color: isActive ? '#ffffff' : 'currentColor' }} /> 
                {tab.label}
              </button>
            </div>
          );
        })}
      </div>

      {/* Right Hint */}
      <motion.span 
        initial={{ opacity: 0.8 }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.4rem' }}
      >
        <Sparkles style={{ width: '12px', height: '12px', color: '#ffffff' }} /> Click line badges for "Why" analysis
      </motion.span>
    </div>
  );
}
