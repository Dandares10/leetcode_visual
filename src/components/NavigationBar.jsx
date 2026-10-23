import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Terminal, 
  Code2, 
  Layers, 
  Sparkles, 
  Brain, 
  BookOpen, 
  Award, 
  Settings, 
  Bot 
} from 'lucide-react';

export function NavigationBar({ userXp, onOpenAar }) {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Overview', icon: Zap },
    { path: '/concepts', label: 'C++ Hub & CTCI', icon: Terminal },
    { path: '/leetcode', label: 'LeetCode & BUD', icon: Code2 },
    { path: '/stl', label: 'STL Mechanics', icon: Layers },
    { path: '/modern', label: 'Modern C++', icon: Sparkles },
    { path: '/tutor', label: 'AI Socratic Studio', icon: Brain },
    { path: '/dashboard', label: 'Scenarios', icon: BookOpen },
    { path: '/mastery', label: 'Mastery', icon: Award }
  ];

  return (
    <header style={{
      height: '62px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(8, 13, 26, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.75rem',
      flexShrink: 0,
      zIndex: 100,
      width: '100%'
    }}>
      {/* Brand Logo */}
      <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
        <motion.div
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '11px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(56, 189, 248, 0.25) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.25)'
          }}
        >
          <Brain style={{ width: '22px', height: '22px', color: '#38bdf8' }} />
        </motion.div>
        
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              C++ <span style={{ color: '#38bdf8' }}>Mastery</span> Hub
            </span>
            <span style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              padding: '1px 6px',
              borderRadius: '6px',
              textTransform: 'uppercase'
            }}>
              Anti-Rote
            </span>
          </div>
          <span style={{ display: 'block', fontSize: '0.64rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            ISO Core Guidelines + CTCI BUD Framework
          </span>
        </div>
      </NavLink>

      {/* Nav Items with Emil Kowalski Sliding Pill */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '3px',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
        gap: '2px'
      }}>
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path || 
            (link.path === '/concepts' && location.pathname === '/cpp');

          return (
            <NavLink
              key={link.path}
              to={link.path}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.42rem 0.75rem',
                borderRadius: '9px',
                fontSize: '0.78rem',
                fontWeight: 700,
                textDecoration: 'none',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                transition: 'color 0.15s ease',
                zIndex: 1
              }}
            >
              {/* Emil Kowalski Morphing Sliding Active Pill */}
              {isActive && (
                <motion.div
                  layoutId="activeNavPill"
                  transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 32,
                    mass: 0.8
                  }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.35) 0%, rgba(56, 189, 248, 0.35) 100%)',
                    border: '1px solid rgba(56, 189, 248, 0.45)',
                    borderRadius: '9px',
                    boxShadow: '0 0 16px rgba(56, 189, 248, 0.25)',
                    zIndex: -1
                  }}
                />
              )}

              <Icon style={{ width: '14px', height: '14px', color: isActive ? '#38bdf8' : 'currentColor' }} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Action Cluster (Ask AI, XP, Settings) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Quick Launch AAR Agent Modal Button */}
        <motion.button
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
          onClick={onOpenAar}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
            border: 'none',
            borderRadius: '10px',
            padding: '0.45rem 0.85rem',
            color: '#fff',
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
          }}
        >
          <Bot style={{ width: '15px', height: '15px' }} />
          <span>Ask AAR Agent</span>
        </motion.button>

        {/* User XP Pill */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          padding: '0.4rem 0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.78rem',
          fontWeight: 800,
          color: '#38bdf8'
        }}>
          <Award style={{ width: '15px', height: '15px', color: '#a855f7' }} />
          <span>{userXp} XP</span>
        </div>

        {/* Settings Gear */}
        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '34px',
            height: '34px',
            borderRadius: '9px',
            background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${isActive ? '#38bdf8' : 'var(--border-subtle)'}`,
            color: isActive ? '#38bdf8' : 'var(--text-secondary)',
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          })}
          title="Gateway & Model Settings"
        >
          <Settings style={{ width: '16px', height: '16px' }} />
        </NavLink>
      </div>
    </header>
  );
}
