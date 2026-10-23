import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  CheckCircle2, 
  Layers, 
  HelpCircle, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  Cpu,
  Compass,
  MessageSquare,
  User,
  Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function MetacognitiveThoughtPanel({ 
  scenario, 
  socraticMode, 
  onSelectApproach, 
  selectedApproachIndex,
  onSocraticAnswer,
  isAiThinking,
  chatHistory
}) {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'thinking' | 'tradeoffs' | 'socratic'
  const [activeStep, setActiveStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [userSocraticChoice, setUserSocraticChoice] = useState(null);

  // Auto-play thought steps animation
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStep(prev => (prev < scenario.intentBreakdown.length ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(timer);
  }, [isPlaying, scenario]);

  // Reset steps when scenario changes
  useEffect(() => {
    setActiveStep(1);
    setIsPlaying(true);
    setUserSocraticChoice(null);
  }, [scenario]);

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      
      {/* Panel Top Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cpu style={{ width: '18px', height: '18px', color: '#ffffff' }} />
          <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', margin: 0 }}>
            Metacognitive Reasoning Engine
          </h2>
        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', background: 'var(--bg-primary)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setActiveTab('chat')}
            style={{ 
              padding: '0.4rem 0.8rem', 
              fontSize: '0.75rem', 
              fontWeight: '600',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'chat' ? 'var(--bg-tertiary)' : 'transparent',
              color: activeTab === 'chat' ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Chat History
          </button>
          <button
            onClick={() => setActiveTab('thinking')}
            style={{
              background: activeTab === 'thinking' ? 'var(--bg-tertiary)' : 'transparent',
              color: activeTab === 'thinking' ? '#ffffff' : 'var(--text-secondary)',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <GitBranch style={{ width: '13px', height: '13px' }} /> Thought Log
          </button>
          
          <button
            onClick={() => setActiveTab('tradeoffs')}
            style={{
              background: activeTab === 'tradeoffs' ? 'var(--bg-tertiary)' : 'transparent',
              color: activeTab === 'tradeoffs' ? '#a855f7' : 'var(--text-secondary)',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Compass style={{ width: '13px', height: '13px' }} /> Tradeoff Analysis
          </button>

          {socraticMode && (
            <button
              onClick={() => setActiveTab('socratic')}
              style={{
                background: activeTab === 'socratic' ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                color: activeTab === 'socratic' ? '#e9d5ff' : '#c084fc',
                border: 'none',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <HelpCircle style={{ width: '13px', height: '13px' }} /> Socratic Scaffolding
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: '4px', position: 'relative', overscrollBehavior: 'contain' }}>
        
        {isAiThinking ? (
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div className="skeleton-pulse" style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)' }} />
              <div className="skeleton-pulse" style={{ width: '140px', height: '14px', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.1)' }} />
            </div>
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-panel skeleton-pulse" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(255, 255, 255, 0.02)' }}>
                <div style={{ width: '60%', height: '12px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', marginBottom: '0.75rem' }} />
                <div style={{ width: '90%', height: '8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)', marginBottom: '0.5rem' }} />
                <div style={{ width: '75%', height: '8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)' }} />
              </div>
            ))}
          </div>
        ) : (
          <>
            
            {/* TAB 0: CHAT HISTORY */}
            {activeTab === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem' }}
              >
                {chatHistory?.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                      display: 'flex', 
                      gap: '1rem', 
                      alignItems: 'flex-start',
                      flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                    }}
                  >
                    <div style={{ 
                      width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                      background: msg.sender === 'user' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(168, 85, 247, 0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${msg.sender === 'user' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(168, 85, 247, 0.3)'}`
                    }}>
                      {msg.sender === 'user' ? <User size={16} color="var(--accent-indigo)" /> : <Brain size={16} color="#a855f7" />}
                    </div>
                    
                    <div style={{ 
                      maxWidth: '85%', 
                      background: msg.sender === 'user' ? 'rgba(241, 245, 249, 0.9)' : 'var(--bg-tertiary)',
                      border: msg.sender === 'user' ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid var(--border-subtle)',
                      padding: '1rem', 
                      borderRadius: '12px',
                      borderTopRightRadius: msg.sender === 'user' ? '0px' : '12px',
                      borderTopLeftRadius: msg.sender === 'ai' ? '0px' : '12px',
                    }}>
                      {msg.context && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', padding: '0.4rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '4px', borderLeft: '2px solid var(--accent-indigo)' }}>
                          {msg.context}
                        </div>
                      )}
                      <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>
                        {msg.text}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* TAB 1: STEP-BY-STEP THOUGHT LOG */}
        {activeTab === 'thinking' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
                Intent & Architecture Decomposition
              </span>
              <button 
                onClick={() => { setActiveStep(1); setIsPlaying(true); }}
                style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
              >
                <RotateCcw style={{ width: '12px', height: '12px' }} /> Replay Reasoning
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {scenario.intentBreakdown.map((item) => {
                const isActive = activeStep === item.step;
                const isPassed = activeStep > item.step;

                return (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: item.step * 0.1 }}
                    style={{
                      background: isActive 
                        ? 'rgba(99, 102, 241, 0.1)' 
                        : isPassed 
                        ? 'rgba(16, 185, 129, 0.05)' 
                        : 'transparent',
                      border: isActive 
                        ? '1px solid rgba(99, 102, 241, 0.3)' 
                        : '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      padding: '0.85rem 1rem',
                      cursor: 'pointer'
                    }}
                    onClick={() => { setActiveStep(item.step); setIsPlaying(false); }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: isActive ? '#ffffff' : isPassed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                          color: isActive ? '#090d16' : isPassed ? '#10b981' : 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: '700'
                        }}>
                          {isPassed ? <CheckCircle2 style={{ width: '14px', height: '14px' }} /> : item.step}
                        </div>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: '700', color: isActive ? '#fff' : 'var(--text-primary)', margin: 0 }}>
                          {item.title}
                        </h3>
                      </div>
                      {isActive && (
                        <span className="pulse-glow badge-cyan" style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '4px' }}>
                          Analyzing...
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4', paddingLeft: '1.8rem' }}>
                      {item.details}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Self-Correction & Why Analysis Callout */}
            <div style={{ marginTop: '1rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '10px', padding: '0.85rem 1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                <Sparkles style={{ width: '15px', height: '15px', color: '#a855f7' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#e0e7ff' }}>
                  Metacognitive Reflection & Why Check
                </span>
              </div>
              <p style={{ fontSize: '0.76rem', color: '#c7d2fe', lineHeight: '1.45' }}>
                Instead of jumping directly to code generation, the agent evaluated async boundary hazards and memory leaks. Hover over line annotations in the code view to see detailed trade-off explanations!
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: ARCHITECTURAL TRADEOFF ENGINE */}
        {activeTab === 'tradeoffs' && (
          <div>
            <div style={{ marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
                Comparative Architectural Tradeoffs
              </span>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Evaluating potential design choices for your specific requirements.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {scenario.tradeoffs.map((item, idx) => {
                const isSelected = selectedApproachIndex === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => onSelectApproach(idx)}
                    style={{
                      background: item.recommended 
                        ? 'rgba(16, 185, 129, 0.06)' 
                        : 'rgba(255, 255, 255, 0.02)',
                      border: item.recommended 
                        ? '1px solid rgba(16, 185, 129, 0.4)' 
                        : '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff', margin: 0 }}>
                        {item.approach}
                      </h4>
                      {item.recommended ? (
                        <span className="badge-emerald" style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
                          RECOMMENDED
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                          ALTERNATIVE
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '700', display: 'block', marginBottom: '0.2rem' }}>
                          PROS
                        </span>
                        <ul style={{ paddingLeft: '1rem', margin: 0, fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                          {item.pros.map((p, i) => (
                            <li key={i} style={{ marginBottom: '2px' }}>{p}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#f43f5e', fontWeight: '700', display: 'block', marginBottom: '0.2rem' }}>
                          CONS & TRADE-OFFS
                        </span>
                        <ul style={{ paddingLeft: '1rem', margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {item.cons.map((c, i) => (
                            <li key={i} style={{ marginBottom: '2px' }}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: SOCRATIC GUIDANCE */}
        {activeTab === 'socratic' && socraticMode && (
          <div>
            <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#e9d5ff', margin: '0 0 0.3rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <HelpCircle style={{ width: '16px', height: '16px', color: '#a855f7' }} /> Socratic Guided Discovery
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#c084fc', lineHeight: '1.4' }}>
                Before inspecting the complete solution, let's test your architectural intuition.
              </p>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1rem' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#fff', marginBottom: '0.75rem' }}>
                🤔 Question: What happens if a slow initial network response resolves after the user has already clicked on a new tab?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  "The browser discards the first request automatically.",
                  "Stale response overwrites fresh state in React, causing UI flickering and invalid data.",
                  "React throws an unhandled Promise rejection warning.",
                  "The server cancels the HTTP request on its end."
                ].map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setUserSocraticChoice(idx);
                      onSocraticAnswer(idx === 1);
                    }}
                    style={{
                      textAlign: 'left',
                      background: userSocraticChoice === idx 
                        ? (idx === 1 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)')
                        : 'var(--bg-primary)',
                      border: userSocraticChoice === idx
                        ? (idx === 1 ? '1px solid #10b981' : '1px solid #f43f5e')
                        : '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {userSocraticChoice !== null && (
                <div style={{ marginTop: '0.85rem', padding: '0.65rem 0.85rem', borderRadius: '8px', background: userSocraticChoice === 1 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', border: userSocraticChoice === 1 ? '1px solid #10b981' : '1px solid #f59e0b' }}>
                  <p style={{ fontSize: '0.78rem', color: userSocraticChoice === 1 ? '#10b981' : '#f59e0b', fontWeight: '600', margin: 0 }}>
                    {userSocraticChoice === 1 
                      ? "🎉 Spot on! This classic race condition is why we implement AbortController cleanup in useEffect." 
                      : "💡 Close! In standard JS/React, asynchronous network calls return whenever they complete without auto-cancelling, causing race conditions."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

          </>
        )}
      </div>
    </div>
  );
}
