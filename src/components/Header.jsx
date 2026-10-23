import React, { useState } from 'react';
import { 
  Brain, 
  Sparkles, 
  HelpCircle, 
  Layers, 
  Play, 
  Award, 
  Lightbulb, 
  Search,
  BookOpen,
  Code2,
  Mic,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VoiceAgent } from './VoiceAgent';

export function Header({ 
  scenarios, 
  selectedScenario, 
  onSelectScenario, 
  onCustomPromptSubmit,
  socraticMode, 
  onToggleSocratic,
  onOpenMatrix,
  userXp,
  isAiThinking,
  selectedLineNum,
  highlightedText,
  onClearSelection
}) {
  const [customInput, setCustomInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    let finalPrompt = customInput.trim();
    
    // If the user hasn't typed anything but HAS highlighted text or a line, provide a default prompt
    if (!finalPrompt && (highlightedText || selectedLineNum)) {
      finalPrompt = "Please analyze this code context.";
    }

    if (!finalPrompt) return;
    
    onCustomPromptSubmit(finalPrompt);
    setCustomInput('');
  };

  const handleVoiceInput = (transcript) => {
    setCustomInput(transcript);
    // Auto submit after small delay
    setTimeout(() => {
      onCustomPromptSubmit(transcript);
      setCustomInput('');
    }, 500);
  };

  return (
    <header className="glass-panel" style={{ borderRadius: '0 0 16px 16px', padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand & AI Engine Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '46px', 
            height: '46px', 
            borderRadius: '14px', 
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(255, 255, 255, 0.8) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.15)'
          }}>
            <Brain style={{ color: 'var(--accent-indigo)', width: '26px', height: '26px' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                Metacognitive<span style={{ color: 'var(--accent-indigo)' }}>Tutor</span>
              </h1>
              <span className="badge-cyan" style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                v2.4
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '2px 0 0 0', fontWeight: '500' }}>
              Premium Code Reasoning Engine
            </p>
          </div>
        </div>

        {/* Preset Selector & Custom Input Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1', maxWidth: '560px', margin: '0 1rem' }}>
          <select
            value={selectedScenario.id}
            onChange={(e) => {
              const found = scenarios.find(s => s.id === e.target.value);
              if (found) onSelectScenario(found);
            }}
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              padding: '0.55rem 0.8rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer',
              maxWidth: '220px'
            }}
          >
            {scenarios.map(s => (
              <option key={s.id} value={s.id}>
                {s.category}: {s.title}
              </option>
            ))}
          </select>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flex: '1', gap: '0.4rem' }}>
            <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)', transition: 'border 0.2s ease', ':focusWithin': { borderColor: '#ffffff' } }}>
              <Search style={{ position: 'absolute', left: '0.75rem', width: '14px', height: '14px', color: 'var(--text-muted)' }} />
              
              {/* Analyzer Awareness Badge */}
              {(highlightedText || selectedLineNum) && (
                <div style={{ 
                  position: 'absolute', 
                  left: '2.2rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  background: 'rgba(255, 255, 255, 0.2)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)', 
                  padding: '2px 6px', 
                  borderRadius: '4px', 
                  fontSize: '0.7rem', 
                  color: '#ffffff', 
                  fontWeight: '600', 
                  maxWidth: '120px', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  pointerEvents: 'auto'
                }}>
                  <Code2 style={{ width: '10px', height: '10px', flexShrink: 0 }} /> 
                  {highlightedText ? "Selection" : `Line ${selectedLineNum}`}
                  <X 
                    onClick={onClearSelection} 
                    style={{ width: '10px', height: '10px', cursor: 'pointer', marginLeft: '2px' }} 
                    title="Clear Selection"
                  />
                </div>
              )}

              <input
                id="ai-search-input"
                type="text"
                placeholder={(highlightedText || selectedLineNum) ? "             Ask about this context..." : "Ask any code or architecture question..."}
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                disabled={isAiThinking}
                style={{
                  width: '100%',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  border: 'none',
                  padding: '0.65rem 0.75rem 0.65rem 2.2rem',
                  paddingLeft: (highlightedText || selectedLineNum) ? '7rem' : '2.2rem', // Make room for badge
                  fontSize: '0.85rem',
                  outline: 'none',
                  opacity: isAiThinking ? 0.6 : 1,
                  transition: 'padding-left 0.2s ease'
                }}
              />
            </div>
            
            <VoiceAgent onVoiceInput={handleVoiceInput} />
            
            <button type="submit" disabled={isAiThinking} className="btn-primary" style={{ padding: '0.55rem 0.9rem', fontSize: '0.8rem', opacity: isAiThinking ? 0.7 : 1, cursor: isAiThinking ? 'wait' : 'pointer', borderRadius: '8px' }}>
              <Sparkles style={{ width: '14px', height: '14px' }} /> {isAiThinking ? 'Analyzing...' : 'Analyze'}
            </button>
          </form>
        </div>

        {/* Right Controls: Socratic Toggle & Concept Matrix */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
          {/* Socratic Guidance Mode Toggle */}
          <button
            onClick={onToggleSocratic}
            className={socraticMode ? "badge-purple" : "btn-secondary"}
            title={socraticMode ? "Socratic Mode ON: Agent will ask targeted questions to guide your discovery" : "Direct Mode: Gives immediate full explanation"}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: socraticMode ? '1px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
              cursor: 'pointer'
            }}
          >
            <Lightbulb style={{ width: '15px', height: '15px', color: socraticMode ? '#a855f7' : 'var(--text-secondary)' }} />
            <span>{socraticMode ? "Socratic Mode: Active" : "Direct Mode"}</span>
          </button>

          {/* Mastery Matrix Dashboard Trigger */}
          <button
            onClick={() => navigate('/mastery')}
            className="btn-secondary"
            style={{
              padding: '0.5rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)',
              borderColor: 'rgba(168, 85, 247, 0.3)',
              boxShadow: '0 0 15px rgba(168, 85, 247, 0.15)'
            }}
          >
            <Award style={{ width: '16px', height: '16px', color: '#e9d5ff' }} />
            <span>Mastery Matrix</span>
            <span className="badge-purple" style={{ marginLeft: '2px', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', border: 'none', background: 'rgba(168, 85, 247, 0.3)' }}>
              {userXp} XP
            </span>
          </button>

        </div>
      </div>
    </header>
  );
}
