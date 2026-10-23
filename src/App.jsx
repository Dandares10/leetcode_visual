import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Terminal, Code2, BookOpen, Layers, Zap, Award, Sparkles, ExternalLink } from 'lucide-react';
import './App.css';
import Home from './pages/Home.jsx';
import Stl from './pages/Stl.jsx';
import Concepts from './pages/Concepts.jsx';
import Modern from './pages/Modern.jsx';
import Leetcode from './pages/Leetcode.jsx';
import { CppMasteryWorkspace } from './pages/CppMasteryWorkspace.jsx';

function NavigationBar({ userXp }) {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Overview', icon: Zap },
    { path: '/concepts', label: 'Mastery Hub & CTCI', icon: Terminal },
    { path: '/leetcode', label: 'LeetCode & BUD', icon: Code2 },
    { path: '/stl', label: 'STL Reference', icon: Layers },
    { path: '/modern', label: 'Modern C++20/23', icon: Sparkles }
  ];

  return (
    <header style={{
      height: '64px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(10, 15, 30, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      flexShrink: 0,
      zIndex: 50
    }}>
      {/* Brand */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
        }}>
          <Terminal style={{ width: '20px', height: '20px', color: '#fff' }} />
        </div>
        <div>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            C++ <span style={{ color: '#38bdf8' }}>Mastery</span> Hub
          </span>
          <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ISO Core + CTCI Anti-Rote
          </span>
        </div>
      </Link>

      {/* Nav items */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {navLinks.map(link => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 0.9rem',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 700,
                textDecoration: 'none',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(56, 189, 248, 0.25))' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(56, 189, 248, 0.4)' : 'transparent'}`,
                transition: 'all 0.2s ease'
              }}
            >
              <Icon style={{ width: '15px', height: '15px', color: isActive ? '#38bdf8' : 'currentColor' }} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Stats pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px',
          padding: '0.35rem 0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: '#38bdf8'
        }}>
          <Award style={{ width: '15px', height: '15px', color: '#a855f7' }} />
          <span>{userXp} XP</span>
        </div>
      </div>
    </header>
  );
}

function App() {
  const [userXp, setUserXp] = useState(1250);

  return (
    <Router>
      <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-primary)' }}>
        <NavigationBar userXp={userXp} />
        
        <main style={{ flex: 1, minHeight: 0, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/concepts" element={<CppMasteryWorkspace userXp={userXp} onGainXp={(xp) => setUserXp(prev => prev + xp)} />} />
            <Route path="/stl" element={<Stl />} />
            <Route path="/modern" element={<Modern />} />
            <Route path="/leetcode" element={<Leetcode />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
