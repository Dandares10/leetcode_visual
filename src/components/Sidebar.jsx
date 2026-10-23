import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Terminal, 
  Code2, 
  Layers, 
  Sparkles, 
  Brain, 
  BookOpen, 
  Award, 
  Settings 
} from 'lucide-react';

export function Sidebar() {
  const navItems = [
    { id: 'home', path: '/', icon: Home, label: 'Overview' },
    { id: 'concepts', path: '/concepts', icon: Terminal, label: 'C++ Hub' },
    { id: 'leetcode', path: '/leetcode', icon: Code2, label: 'LeetCode' },
    { id: 'stl', path: '/stl', icon: Layers, label: 'STL' },
    { id: 'modern', path: '/modern', icon: Sparkles, label: 'Modern' },
    { id: 'tutor', path: '/tutor', icon: Brain, label: 'AI Tutor' },
    { id: 'dashboard', path: '/dashboard', icon: BookOpen, label: 'Scenarios' },
    { id: 'mastery', path: '/mastery', icon: Award, label: 'Mastery' }
  ];

  return (
    <aside style={{
      width: '84px',
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(16px)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1.25rem 0',
      gap: '1.25rem',
      zIndex: 100,
      flexShrink: 0,
      overflowY: 'auto'
    }}>
      {/* Brand Icon */}
      <NavLink to="/" style={{ textDecoration: 'none' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(56, 189, 248, 0.25) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(56, 189, 248, 0.25)',
          transition: 'transform 0.2s ease'
        }}>
          <Brain style={{ color: '#38bdf8', width: '26px', height: '26px' }} />
        </div>
      </NavLink>

      {/* Nav Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%' }}>
        {navItems.map(item => (
          <NavLink
            key={item.id}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              padding: '0.65rem 0',
              margin: '0 0.45rem',
              borderRadius: '12px',
              position: 'relative',
              color: isActive ? '#ffffff' : 'var(--text-secondary)',
              background: isActive 
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(56, 189, 248, 0.3) 100%)' 
                : 'transparent',
              border: `1px solid ${isActive ? 'rgba(56, 189, 248, 0.4)' : 'transparent'}`,
              boxShadow: isActive ? '0 4px 14px rgba(56, 189, 248, 0.2)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            })}
            title={item.label}
          >
            <item.icon style={{ width: '20px', height: '20px', marginBottom: '0.25rem' }} />
            <span style={{ fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em', textAlign: 'center' }}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
      
      {/* Settings at bottom */}
      <div style={{ marginTop: 'auto', marginBottom: '0.5rem' }}>
        <NavLink to="/settings" style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent', 
          border: 'none', 
          color: isActive ? '#38bdf8' : 'var(--text-muted)', 
          cursor: 'pointer', 
          padding: '0.6rem',
          borderRadius: '12px',
          transition: 'all 0.2s ease'
        })}>
          <Settings style={{ width: '20px', height: '20px' }} />
        </NavLink>
      </div>
    </aside>
  );
}
