import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, Code2, BookOpen, Layers, Zap, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="custom-scroll" style={{
      flex: 1,
      minHeight: 0,
      height: '100%',
      overflowY: 'auto',
      overscrollBehavior: 'contain',
      padding: '2.5rem 3.5rem',
      background: 'var(--bg-primary)'
    }}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '3rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(99, 102, 241, 0.15)',
          marginBottom: '2.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '4px 12px', borderRadius: '20px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', marginBottom: '1.25rem' }}>
            <Sparkles style={{ width: '14px', height: '14px', color: '#38bdf8' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Engineered to Eliminate Rote Learning
            </span>
          </div>

          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#fff', margin: '0 0 1rem 0', lineHeight: '1.2' }}>
            Master C++, Systems & <br />
            <span style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Cracking the Coding Interview
            </span>
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem' }}>
            Transform your understanding through formal theoretical proofs, ISO C++ Core Guidelines, and Gayle Laakmann McDowell's 7-Step BUD Framework. Powered by an interactive AAR (After-Action Review) Reading Agent.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/concepts')}
              className="btn-primary"
              style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem' }}
            >
              <Terminal style={{ width: '18px', height: '18px' }} />
              Launch Mastery Hub & Quizzes
            </button>
            <button
              onClick={() => navigate('/leetcode')}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                padding: '0.8rem 1.5rem',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease'
              }}
            >
              <Code2 style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
              Explore LeetCode & BUD Analyses
            </button>
          </div>
        </div>
      </motion.div>

      {/* Feature Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          {
            title: 'CTCI 7-Step Method & BUD',
            desc: 'Diagnose Bottlenecks, Unnecessary work, and Duplicated work to systematically eliminate O(N^2) friction without rote memorization.',
            path: '/leetcode',
            icon: Code2,
            tag: 'CTCI 6th Edition',
            color: '#38bdf8'
          },
          {
            title: 'Anti-Rote Quiz Scenarios',
            desc: 'Counter-intuitive memory traps, lock-free ABA race conditions, and relaxed atomic memory order anomalies with AAR debriefs.',
            path: '/concepts',
            icon: ShieldCheck,
            tag: 'AAR Engine',
            color: '#a855f7'
          },
          {
            title: 'Curated Open C++ Library',
            desc: 'Direct citations from Changkun Ou, Prof. Brokken, Pat Morin, Tanenbaum, and ISO C++ Core Guidelines.',
            path: '/concepts',
            icon: BookOpen,
            tag: 'Authoritative Books',
            color: '#10b981'
          },
          {
            title: 'STL Architecture & Modern C++',
            desc: 'Comprehensive reference for dynamic vector growth amortization, custom allocators, move semantics, and C++20 concepts.',
            path: '/stl',
            icon: Layers,
            tag: 'C++20 / C++23',
            color: '#f59e0b'
          }
        ].map((feat, i) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={feat.title}
              whileHover={{ y: -5 }}
              onClick={() => navigate(feat.path)}
              className="glass-panel-interactive"
              style={{
                padding: '1.75rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: `${feat.color}20`,
                  border: `1px solid ${feat.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon style={{ width: '20px', height: '20px', color: feat.color }} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: feat.color, textTransform: 'uppercase', padding: '3px 8px', borderRadius: '8px', background: `${feat.color}15` }}>
                  {feat.tag}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem 0' }}>
                {feat.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', flex: 1, margin: '0 0 1.25rem 0' }}>
                {feat.desc}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.82rem', fontWeight: 700 }}>
                Explore Module <ArrowRight style={{ width: '14px', height: '14px' }} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
