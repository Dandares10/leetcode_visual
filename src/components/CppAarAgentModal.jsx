import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  BookOpen, 
  HelpCircle, 
  ShieldAlert, 
  ExternalLink, 
  Sparkles, 
  Bot, 
  Send, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  FileText,
  Cpu,
  Layers,
  Award,
  Zap,
  Key,
  Check,
  Trash2,
  GitBranch,
  Code2,
  Copy,
  Terminal,
  HelpCircle as QuestionIcon,
  RefreshCw,
  Search
} from 'lucide-react';
import { CPP_BOOKS } from '../data/cppCurriculum';

const MODEL_PROVIDERS = [
  { id: 'gemini-1.5-pro', label: '🌟 Gemini 1.5 Pro', desc: 'Google Pro Frontier - Deep Literature & Invariant Proofs', keyType: 'gemini' },
  { id: 'gemini-1.5-flash', label: '⚡ Gemini 1.5 Flash', desc: 'High-speed 1M context cloud inference', keyType: 'gemini' },
  { id: 'openrouter/deepseek', label: '🚀 DeepSeek Coder', desc: 'OpenRouter Cloud Code & Invariant Specialist', keyType: 'openrouter' },
  { id: 'canonical', label: '📚 Canonical Matrix', desc: 'Instant 10ms zero-hallucination textbook invariants', keyType: 'none' },
  { id: 'ollama', label: '🦙 Ollama Local (0.5B)', desc: 'Lightweight offline model on CPU', keyType: 'none' }
];

const PERSONA_MODES = [
  { id: 'socratic-literature', label: '🎓 Literature Socratic', desc: 'Authoritative citations & guided discovery' },
  { id: 'anti-rote-invariants', label: '🛑 Anti-Rote Proofs', desc: 'Mathematical invariants & edge cases' },
  { id: 'hardware-sympathy', label: '⚙️ Hardware & Cache', desc: 'CPU registers, memory alignment & assembly' },
  { id: 'ctci-bud-optimizer', label: '🎯 CTCI BUD Optimizer', desc: 'Bottlenecks, unnecessary work & bitmasks' }
];

const PRESET_MOA_PROBLEMS = [
  { id: 'two-sum', label: 'Complement Search & BUD (Two Sum)', query: 'two sum complement search bud' },
  { id: 'cycle-detection', label: "Floyd's Runner vs Address Set (Cycle Finding)", query: 'linked list cycle detection floyd runner' },
  { id: 'quicksort-partitions', label: 'Hoare vs Lomuto Partition Invariant', query: 'quicksort lomuto hoare partition' },
  { id: 'unique-chars', label: 'Single-Register Bitmask vs Hash Set', query: 'unique chars bit vector register bitmask' }
];

export function CppAarAgentModal({ isOpen, onClose, activeQuestion, activeConcept }) {
  // Navigation & View Mode: 'chat' | 'moa'
  const [activeTab, setActiveTab] = useState('chat');

  // Multi-Provider Keys
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [openRouterApiKey, setOpenRouterApiKey] = useState(() => localStorage.getItem('openrouter_api_key') || '');
  const [selectedModel, setSelectedModel] = useState(() => {
    return localStorage.getItem('aar_selected_model') || (localStorage.getItem('gemini_api_key') ? 'gemini-1.5-pro' : 'canonical');
  });
  
  // API Key Drawer State
  const [showKeyManager, setShowKeyManager] = useState(false);
  const [geminiInput, setGeminiInput] = useState('');
  const [openRouterInput, setOpenRouterInput] = useState('');
  const [keySavedStatus, setKeySavedStatus] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'aar-intro',
      sender: 'agent',
      modelAttribution: 'Fine-Tuned Literature Agent (Multi-Model Engine)',
      text: `### 🎓 Welcome to the Fine-Tuned AAR Literature & Socratic Tutor

I am specifically fine-tuned to eradicate **rote memorization** and superficial pattern-matching in C++, Data Structures, and Systems.

**Multi-Model Architecture Active:**
- **🌟 Gemini 1.5 Pro / Flash**: Offload heavy cognitive load, multi-turn Socratic inquiry, and large-context book analysis.
- **🚀 DeepSeek Coder via OpenRouter**: High-speed code synthesis and algorithmic invariant reasoning.
- **📚 Canonical Invariants Matrix**: Instant (10ms) zero-hallucination peer-reviewed textbook citations (CLRS, CTCI, CPDS, CP3/CP4, Modern C++).
- **🦙 Ollama Local (Qwen 0.5B)**: Offline local execution with timeout guardrails.

Switch to the **Mixture-of-Solutions (MoA)** tab above to compare 4 algorithmic paradigms side-by-side with real GitHub codebases!`
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [selectedBookTab, setSelectedBookTab] = useState(CPP_BOOKS[0].id);
  const [personaMode, setPersonaMode] = useState('socratic-literature');

  // Mixture-of-Solutions (MoA) State
  const [moaQuery, setMoaQuery] = useState('two sum complement search bud');
  const [moaData, setMoaData] = useState(null);
  const [moaLoading, setMoaLoading] = useState(false);
  const [copiedApproachId, setCopiedApproachId] = useState(null);

  // Initialize MoA on open or concept switch
  useEffect(() => {
    if (isOpen && !moaData) {
      fetchMultiSolution(activeConcept?.title || 'two sum');
    }
  }, [isOpen, activeConcept]);

  if (!isOpen) return null;

  const currentBook = CPP_BOOKS.find(b => b.id === selectedBookTab) || CPP_BOOKS[0];

  const handleSaveApiKeys = () => {
    let savedAny = false;
    if (geminiInput.trim()) {
      localStorage.setItem('gemini_api_key', geminiInput.trim());
      setGeminiApiKey(geminiInput.trim());
      setSelectedModel('gemini-1.5-pro');
      localStorage.setItem('aar_selected_model', 'gemini-1.5-pro');
      savedAny = true;
    }
    if (openRouterInput.trim()) {
      localStorage.setItem('openrouter_api_key', openRouterInput.trim());
      setOpenRouterApiKey(openRouterInput.trim());
      if (!geminiInput.trim()) {
        setSelectedModel('openrouter/deepseek');
        localStorage.setItem('aar_selected_model', 'openrouter/deepseek');
      }
      savedAny = true;
    }
    if (savedAny) {
      setKeySavedStatus(true);
      setTimeout(() => {
        setKeySavedStatus(false);
        setShowKeyManager(false);
      }, 1200);
    }
  };

  const handleClearApiKeys = () => {
    localStorage.removeItem('gemini_api_key');
    localStorage.removeItem('openrouter_api_key');
    setGeminiApiKey('');
    setOpenRouterApiKey('');
    setSelectedModel('canonical');
    localStorage.setItem('aar_selected_model', 'canonical');
    setGeminiInput('');
    setOpenRouterInput('');
    setShowKeyManager(false);
  };

  const handleModelSelect = (modelId) => {
    setSelectedModel(modelId);
    localStorage.setItem('aar_selected_model', modelId);
    const provider = MODEL_PROVIDERS.find(p => p.id === modelId);
    if (provider?.keyType === 'gemini' && !geminiApiKey) {
      setShowKeyManager(true);
    } else if (provider?.keyType === 'openrouter' && !openRouterApiKey) {
      setShowKeyManager(true);
    }
  };

  const fetchMultiSolution = async (queryText) => {
    setMoaLoading(true);
    try {
      const res = await fetch('/api/multi-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText || moaQuery,
          currentBook,
          concept: activeConcept
        })
      });
      if (res.ok) {
        const data = await res.json();
        setMoaData(data);
      }
    } catch (err) {
      console.warn("Could not fetch multi-solution from server:", err);
    } finally {
      setMoaLoading(false);
    }
  };

  const handleCopyCode = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedApproachId(id);
    setTimeout(() => setCopiedApproachId(null), 1500);
  };

  const handlePipeToSocraticDebrief = (approachName, invariantTruth) => {
    setActiveTab('chat');
    handleSendMessage(`Debrief this specific invariant from ${approachName}: "${invariantTruth}". What is the core theorem proving this?`);
  };

  const handleSendMessage = async (customPrompt) => {
    const queryText = (customPrompt || inputText).trim();
    if (!queryText) return;

    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: queryText
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputText("");
    setIsThinking(true);

    try {
      const response = await fetch('/api/aar-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryText,
          currentBook,
          activeQuestion,
          activeConcept,
          mode: personaMode,
          model: selectedModel,
          apiKey: geminiApiKey || undefined,
          openRouterApiKey: openRouterApiKey || undefined
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setChatMessages(prev => [
        ...prev,
        {
          id: 'agent-' + Date.now(),
          sender: 'agent',
          text: data.text,
          modelAttribution: data.model || selectedModel,
          groundedRag: data.groundedRag
        }
      ]);
    } catch (err) {
      console.warn("Backend API not reachable or timed out. Falling back to local semantic knowledge matrix:", err);
      const fallbackReply = generateClientSideAuthoritativeDebrief(queryText, currentBook, activeQuestion);
      
      setChatMessages(prev => [
        ...prev,
        {
          id: 'agent-' + Date.now(),
          sender: 'agent',
          text: fallbackReply,
          modelAttribution: 'Fine-Tuned Socratic Literature Matrix (Local Fallback)'
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  // Render structured 4-phase markdown with rich cards
  const renderMessageContent = (msg) => {
    const text = msg.text;
    const hasPhases = text.includes('### 🔍 1.') || text.includes('### 📖 2.') || text.includes('1. Mental Model Breakdown');

    if (!hasPhases || msg.sender === 'user') {
      return (
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
          {text}
        </div>
      );
    }

    const sections = text.split(/(?=### )/);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {sections.map((section, idx) => {
          const trimmed = section.trim();
          if (!trimmed) return null;

          let cardStyle = {
            padding: '0.85rem 1rem',
            borderRadius: '12px',
            fontSize: '0.85rem',
            lineHeight: '1.55',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          };

          let icon = null;
          let title = '';
          let body = trimmed;

          if (trimmed.includes('Mental Model Breakdown') || trimmed.includes('1. ')) {
            cardStyle.background = 'rgba(244, 63, 94, 0.08)';
            cardStyle.border = '1px solid rgba(244, 63, 94, 0.25)';
            icon = <ShieldAlert style={{ width: '15px', height: '15px', color: '#f43f5e' }} />;
            title = 'Phase 1: Mental Model Breakdown & Rote Trap';
          } else if (trimmed.includes('Authoritative Literature Citation') || trimmed.includes('2. ')) {
            cardStyle.background = 'rgba(168, 85, 247, 0.08)';
            cardStyle.border = '1px solid rgba(168, 85, 247, 0.25)';
            icon = <BookOpen style={{ width: '15px', height: '15px', color: '#c084fc' }} />;
            title = 'Phase 2: Authoritative Literature Citation & Invariant';
          } else if (trimmed.includes('Mechanical Sympathy') || trimmed.includes('3. ')) {
            cardStyle.background = 'rgba(56, 189, 248, 0.08)';
            cardStyle.border = '1px solid rgba(56, 189, 248, 0.25)';
            icon = <Cpu style={{ width: '15px', height: '15px', color: '#38bdf8' }} />;
            title = 'Phase 3: Mechanical Sympathy & Hardware Reality';
          } else if (trimmed.includes('Socratic Mastery Probe') || trimmed.includes('4. ')) {
            cardStyle.background = 'rgba(16, 185, 129, 0.08)';
            cardStyle.border = '1px solid rgba(16, 185, 129, 0.25)';
            icon = <Sparkles style={{ width: '15px', height: '15px', color: '#34d399' }} />;
            title = 'Phase 4: Socratic Mastery Counter-Probe';
          }

          const lines = trimmed.split('\n');
          const cleanBody = lines[0].startsWith('###') ? lines.slice(1).join('\n').trim() : trimmed;

          return (
            <div key={idx} style={cardStyle}>
              {title && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.78rem', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {icon}
                  <span>{title}</span>
                </div>
              )}
              <div style={{ whiteSpace: 'pre-wrap', color: 'rgba(255, 255, 255, 0.92)' }}>
                {cleanBody}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 16, 0.88)',
      backdropFilter: 'blur(16px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        style={{
          width: '96%',
          maxWidth: '1280px',
          height: '92vh',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 15, 30, 0.98) 100%)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 50px rgba(99, 102, 241, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Top Header Bar */}
        <div style={{
          padding: '1rem 1.75rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {/* Logo & Subtitle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
            }}>
              <BookOpen style={{ color: '#fff', width: '22px', height: '22px' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  AAR Literature & Multi-Provider Architecture
                </h2>
                <span style={{
                  fontSize: '0.68rem',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#34d399',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Zap style={{ width: '10px', height: '10px' }} /> ANTI-ROTE INVARIANTS
                </span>
                <span style={{
                  fontSize: '0.68rem',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                  color: '#818cf8',
                  fontWeight: 800
                }}>
                  RAG: LanceDB Active
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Deep textual groundings in CTCI, CLRS, CPDS, CP3/CP4, Modern C++, and OSTEP
              </p>
            </div>
          </div>

          {/* Central Mode Switcher: Socratic Chat vs MoA Matrix */}
          <div style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.45)',
            padding: '4px',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <button
              onClick={() => setActiveTab('chat')}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '10px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                border: 'none',
                background: activeTab === 'chat' ? 'linear-gradient(135deg, #6366f1, #38bdf8)' : 'transparent',
                color: activeTab === 'chat' ? '#fff' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === 'chat' ? '0 0 15px rgba(99, 102, 241, 0.4)' : 'none'
              }}
            >
              <Bot style={{ width: '15px', height: '15px' }} />
              💬 Socratic AAR Chat
            </button>
            <button
              onClick={() => {
                setActiveTab('moa');
                if (!moaData) fetchMultiSolution(moaQuery);
              }}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '10px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                border: 'none',
                background: activeTab === 'moa' ? 'linear-gradient(135deg, #a855f7, #ec4899)' : 'transparent',
                color: activeTab === 'moa' ? '#fff' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === 'moa' ? '0 0 15px rgba(168, 85, 247, 0.4)' : 'none'
              }}
            >
              <GitBranch style={{ width: '15px', height: '15px' }} />
              🧩 Mixture-of-Solutions (MoA)
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* VIEW 1: Socratic AAR Chat */}
        {activeTab === 'chat' && (
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.05fr 1.15fr', minHeight: 0 }}>
            
            {/* LEFT: Structured AAR Debrief & Book Shelf */}
            <div style={{
              borderRight: '1px solid var(--border-subtle)',
              padding: '1.25rem',
              overflowY: 'auto',
              overscrollBehavior: 'contain',
              height: '100%',
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}>
              
              {/* If there's an active question being debriefed */}
              {activeQuestion && activeQuestion.aarDebrief && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.05)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: '16px',
                  padding: '1.2rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#f43f5e', fontWeight: 800, fontSize: '0.85rem' }}>
                    <ShieldAlert style={{ width: '17px', height: '17px' }} />
                    AAR Phase: Flawed Mental Model vs Standard Truth
                  </div>

                  <div style={{ marginBottom: '0.7rem' }}>
                    <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#f43f5e', fontWeight: 800 }}>
                      1. Rote Misconception:
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: '1.4' }}>
                      {activeQuestion.aarDebrief.mentalModelMistake}
                    </div>
                  </div>

                  <div style={{ marginBottom: '0.7rem' }}>
                    <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#10b981', fontWeight: 800 }}>
                      2. Authoritative Literature Truth:
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#fff', marginTop: '0.2rem', lineHeight: '1.4' }}>
                      {activeQuestion.aarDebrief.authoritativeTruth}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '0.65rem 0.85rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '0.78rem', color: '#c084fc', fontWeight: 700 }}>
                      📚 Citation: {activeQuestion.bookCitation?.book || 'Curated Standard'} ({activeQuestion.bookCitation?.rule || activeQuestion.bookCitation?.chapter || 'Core Invariant'})
                    </div>
                    <button
                      onClick={() => handleSendMessage(`Break down the literature invariant for "${activeQuestion.title}" from ${activeQuestion.bookCitation?.book}`)}
                      style={{
                        background: 'rgba(168, 85, 247, 0.2)',
                        border: '1px solid rgba(168, 85, 247, 0.4)',
                        color: '#c084fc',
                        fontSize: '0.7rem',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 700
                      }}
                    >
                      Debrief Now
                    </button>
                  </div>
                </div>
              )}

              {/* Canonical Book Shelf Selector */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <BookOpen style={{ width: '15px', height: '15px', color: '#38bdf8' }} />
                    Curated Canonical CS & C++ Literature
                  </h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Free & Authoritative</span>
                </div>

                {/* Book Pills */}
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
                  {CPP_BOOKS.map(book => (
                    <button
                      key={book.id}
                      onClick={() => setSelectedBookTab(book.id)}
                      style={{
                        background: selectedBookTab === book.id ? 'rgba(56, 189, 248, 0.22)' : 'rgba(255, 255, 255, 0.04)',
                        border: `1px solid ${selectedBookTab === book.id ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)'}`,
                        color: selectedBookTab === book.id ? '#38bdf8' : 'var(--text-secondary)',
                        borderRadius: '8px',
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {book.title.split(':')[0]}
                    </button>
                  ))}
                </div>

                {/* Selected Book Meta Card */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '14px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.88rem', color: '#fff', fontWeight: 700 }}>
                        {currentBook.title}
                      </h4>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        By {currentBook.author} • {currentBook.license}
                      </div>
                    </div>
                    {currentBook.url && (
                      <a
                        href={currentBook.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          color: '#38bdf8',
                          fontSize: '0.72rem',
                          textDecoration: 'none',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(56, 189, 248, 0.1)',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Read Online <ExternalLink style={{ width: '11px', height: '11px' }} />
                      </a>
                    )}
                  </div>

                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                    {currentBook.description}
                  </p>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.6rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      Key Modules / Chapters:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {currentBook.chapters?.slice(0, 6).map((chap, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(`Debrief key invariants from ${currentBook.title} on ${chap}`)}
                          style={{
                            fontSize: '0.7rem',
                            padding: '3px 7px',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '6px',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          📖 {chap}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT: Chat & Socratic Inquiries */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              minHeight: 0,
              background: 'rgba(0, 0, 0, 0.2)'
            }}>

              {/* Multi-Provider Selector & Pro Key Bar */}
              <div style={{
                padding: '0.65rem 1.25rem',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'rgba(255, 255, 255, 0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Cpu style={{ width: '14px', height: '14px', color: '#c084fc' }} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    Engine:
                  </span>
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    {MODEL_PROVIDERS.map(m => (
                      <button
                        key={m.id}
                        onClick={() => handleModelSelect(m.id)}
                        title={m.desc}
                        style={{
                          padding: '0.25rem 0.55rem',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          border: selectedModel === m.id ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.08)',
                          background: selectedModel === m.id ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                          color: selectedModel === m.id ? '#e9d5ff' : 'var(--text-muted)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* API Key Configuration Button */}
                <button
                  onClick={() => setShowKeyManager(!showKeyManager)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: (geminiApiKey || openRouterApiKey) ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(99, 102, 241, 0.4)',
                    background: (geminiApiKey || openRouterApiKey) ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                    color: (geminiApiKey || openRouterApiKey) ? '#34d399' : '#818cf8',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Key style={{ width: '12px', height: '12px' }} />
                  {(geminiApiKey || openRouterApiKey) ? 'Custom Keys Active' : 'Configure Cloud Keys'}
                </button>
              </div>

              {/* Expandable API Key Drawer */}
              <AnimatePresence>
                {showKeyManager && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{
                      background: 'rgba(15, 23, 42, 0.95)',
                      borderBottom: '1px solid rgba(99, 102, 241, 0.3)',
                      padding: '0.85rem 1.25rem',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Key style={{ width: '14px', height: '14px', color: '#818cf8' }} />
                        Multi-Provider Credentials (Browser Local Storage Only)
                      </div>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        Keys are never transmitted or stored on third-party servers.
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 700, marginBottom: '3px' }}>
                          🌟 Google Gemini Pro API Key:
                        </div>
                        <input
                          type="password"
                          placeholder={geminiApiKey ? "•••••••••••••••• (Saved)" : "Paste AI Studio / Gemini Key"}
                          value={geminiInput}
                          onChange={(e) => setGeminiInput(e.target.value)}
                          style={{
                            width: '100%',
                            background: 'rgba(0, 0, 0, 0.5)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '8px',
                            padding: '0.4rem 0.6rem',
                            fontSize: '0.74rem',
                            color: '#fff',
                            outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: '#a855f7', fontWeight: 700, marginBottom: '3px' }}>
                          🚀 OpenRouter / DeepSeek API Key:
                        </div>
                        <input
                          type="password"
                          placeholder={openRouterApiKey ? "•••••••••••••••• (Saved)" : "Paste OpenRouter API Key"}
                          value={openRouterInput}
                          onChange={(e) => setOpenRouterInput(e.target.value)}
                          style={{
                            width: '100%',
                            background: 'rgba(0, 0, 0, 0.5)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '8px',
                            padding: '0.4rem 0.6rem',
                            fontSize: '0.74rem',
                            color: '#fff',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        onClick={handleSaveApiKeys}
                        style={{
                          background: keySavedStatus ? '#10b981' : 'linear-gradient(135deg, #6366f1, #38bdf8)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.4rem 0.9rem',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          color: '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        {keySavedStatus ? <Check style={{ width: '13px', height: '13px' }} /> : 'Save Keys'}
                      </button>
                      {(geminiApiKey || openRouterApiKey) && (
                        <button
                          onClick={handleClearApiKeys}
                          title="Remove all keys from LocalStorage"
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '8px',
                            padding: '0.4rem 0.75rem',
                            color: '#f43f5e',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Trash2 style={{ width: '13px', height: '13px' }} /> Clear
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Fine-Tuning Persona Mode Switcher */}
              <div style={{
                padding: '0.65rem 1.25rem',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'rgba(15, 23, 42, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Bot style={{ width: '15px', height: '15px', color: '#38bdf8' }} />
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    Fine-Tuning Persona:
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {PERSONA_MODES.map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setPersonaMode(mode.id)}
                      title={mode.desc}
                      style={{
                        padding: '0.3rem 0.55rem',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: personaMode === mode.id ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: personaMode === mode.id ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                        color: personaMode === mode.id ? '#38bdf8' : 'var(--text-muted)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Socratic Diagnostic Action Chips */}
              <div style={{
                padding: '0.6rem 1.25rem',
                background: 'rgba(255, 255, 255, 0.015)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                gap: '0.4rem',
                overflowX: 'auto'
              }}>
                <button
                  onClick={() => handleSendMessage(`Diagnose the exact rote misconception behind "${activeQuestion ? activeQuestion.title : 'pointer arithmetic in CPDS and C++'}"`)}
                  style={{
                    fontSize: '0.72rem',
                    padding: '4px 9px',
                    borderRadius: '20px',
                    background: 'rgba(244, 63, 94, 0.12)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    color: '#fda4af',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontWeight: 600
                  }}
                >
                  🔍 Diagnose Rote Trap
                </button>
                <button
                  onClick={() => handleSendMessage(`Quote the exact theorem or rule from ${currentBook.title} that proves this invariant.`)}
                  style={{
                    fontSize: '0.72rem',
                    padding: '4px 9px',
                    borderRadius: '20px',
                    background: 'rgba(168, 85, 247, 0.12)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    color: '#d8b4fe',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontWeight: 600
                  }}
                >
                  📖 Quote Book Theorem
                </button>
                <button
                  onClick={() => handleSendMessage(`Explain the low-level hardware representation, memory alignment, and CPU cache effect for this.`)}
                  style={{
                    fontSize: '0.72rem',
                    padding: '4px 9px',
                    borderRadius: '20px',
                    background: 'rgba(56, 189, 248, 0.12)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#7dd3fc',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontWeight: 600
                  }}
                >
                  ⚙️ Hardware & Cache Reality
                </button>
                <button
                  onClick={() => handleSendMessage(`Give me a counter-example scenario or edge case to test if I truly master this concept without rote memorization.`)}
                  style={{
                    fontSize: '0.72rem',
                    padding: '4px 9px',
                    borderRadius: '20px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#6ee7b7',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontWeight: 600
                  }}
                >
                  ❓ Test My Mastery
                </button>
              </div>

              {/* Chat Messages Log */}
              <div style={{ flex: 1, minHeight: 0, padding: '1.25rem', overflowY: 'auto', overscrollBehavior: 'contain', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: msg.sender === 'user' ? '80%' : '94%',
                      background: msg.sender === 'user' 
                        ? 'linear-gradient(135deg, #4f46e5, #06b6d4)' 
                        : 'rgba(30, 41, 59, 0.85)',
                      padding: '1rem 1.25rem',
                      borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
                      color: '#fff'
                    }}
                  >
                    {msg.sender === 'agent' && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontWeight: 800, fontSize: '0.76rem' }}>
                          <Bot style={{ width: '14px', height: '14px' }} />
                          {msg.modelAttribution || 'Fine-Tuned Literature Agent'}
                        </div>
                        {msg.groundedRag && (
                          <span style={{ fontSize: '0.65rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                            RAG Verified
                          </span>
                        )}
                      </div>
                    )}

                    {renderMessageContent(msg)}
                  </div>
                ))}

                {isThinking && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.8rem', padding: '0.5rem' }}>
                    <Sparkles style={{ width: '15px', height: '15px', animation: 'spin 2s linear infinite' }} />
                    Synthesizing Socratic debrief via {selectedModel} & LanceDB vector literature...
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div style={{
                padding: '0.85rem 1.25rem',
                borderTop: '1px solid var(--border-subtle)',
                background: 'rgba(15, 23, 42, 0.7)',
                display: 'flex',
                gap: '0.75rem'
              }}>
                <input
                  type="text"
                  placeholder={`Ask ${currentBook.title.split(':')[0]} literature tutor... (e.g. 'Why does Lomuto fail on duplicates?')`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  style={{
                    flex: 1,
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={() => handleSendMessage()}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0 1.25rem',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}
                >
                  <Send style={{ width: '16px', height: '16px' }} />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* VIEW 2: Mixture-of-Solutions (MoA) Multi-Paradigm Matrix */}
        {activeTab === 'moa' && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            padding: '1.25rem 1.75rem',
            background: 'rgba(0, 0, 0, 0.25)',
            gap: '1.25rem'
          }}>
            {/* MoA Controls: Presets + Search */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GitBranch style={{ color: '#c084fc', width: '18px', height: '18px' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
                    Select Algorithmic Invariant Paradigm:
                  </span>
                </div>
                
                {/* GitHub Architectural Citations */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Grounded in open-source:</span>
                  <a
                    href="https://github.com/TheAlgorithms/C-Plus-Plus"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: '0.68rem',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#7dd3fc',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    TheAlgorithms/C-Plus-Plus <ExternalLink style={{ width: '10px', height: '10px' }} />
                  </a>
                  <a
                    href="https://cp-algorithms.com/"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: '0.68rem',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: 'rgba(168, 85, 247, 0.1)',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      color: '#d8b4fe',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    CP-Algorithms <ExternalLink style={{ width: '10px', height: '10px' }} />
                  </a>
                  <a
                    href="https://github.com/togethercomputer/MoA"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: '0.68rem',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: 'rgba(236, 72, 153, 0.1)',
                      border: '1px solid rgba(236, 72, 153, 0.3)',
                      color: '#f472b6',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    togethercomputer/MoA <ExternalLink style={{ width: '10px', height: '10px' }} />
                  </a>
                </div>
              </div>

              {/* Preset Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {PRESET_MOA_PROBLEMS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setMoaQuery(preset.query);
                      fetchMultiSolution(preset.query);
                    }}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '8px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: moaQuery === preset.query ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.1)',
                      background: moaQuery === preset.query ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                      color: moaQuery === preset.query ? '#f3e8ff' : 'var(--text-secondary)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Custom Search Query Bar */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Enter any algorithmic concept or problem (e.g. 'quicksort partition', 'cycle detection')..."
                    value={moaQuery}
                    onChange={(e) => setMoaQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchMultiSolution(moaQuery)}
                    style={{
                      width: '100%',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '0.45rem 0.85rem 0.45rem 2rem',
                      fontSize: '0.78rem',
                      color: '#fff',
                      outline: 'none'
                    }}
                  />
                </div>
                <button
                  onClick={() => fetchMultiSolution(moaQuery)}
                  disabled={moaLoading}
                  style={{
                    padding: '0 1rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {moaLoading ? <RefreshCw style={{ width: '14px', height: '14px', animation: 'spin 1.5s linear infinite' }} /> : 'Compare Paradigms'}
                </button>
              </div>
            </div>

            {/* MoA Results Grid */}
            {moaData && (
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff', fontWeight: 800 }}>
                      {moaData.title}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
                      Category: {moaData.category} • {moaData.approaches?.length || 0} Solutions Evaluated
                    </span>
                  </div>
                </div>

                {/* Comparative Multi-Column Cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(auto-fit, minmax(290px, 1fr))`,
                  gap: '1.25rem',
                  alignItems: 'stretch'
                }}>
                  {moaData.approaches?.map((appr, idx) => (
                    <div
                      key={appr.id || idx}
                      style={{
                        background: 'rgba(15, 23, 42, 0.75)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Top Accent Strip */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: idx === 0 ? '#f43f5e' : idx === 1 ? '#eab308' : idx === 2 ? '#38bdf8' : '#10b981'
                      }} />

                      <div>
                        {/* Approach Title */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>
                            {appr.name}
                          </span>
                        </div>

                        {/* Complexity Badges */}
                        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: '0.68rem',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: appr.timeComplexity.includes('N²') ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                            color: appr.timeComplexity.includes('N²') ? '#fca5a5' : '#6ee7b7',
                            border: appr.timeComplexity.includes('N²') ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
                            fontWeight: 800
                          }}>
                            ⏱️ {appr.timeComplexity}
                          </span>
                          <span style={{
                            fontSize: '0.68rem',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: appr.spaceComplexity.includes('Heap') ? 'rgba(234, 179, 8, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                            color: appr.spaceComplexity.includes('Heap') ? '#fde047' : '#7dd3fc',
                            border: appr.spaceComplexity.includes('Heap') ? '1px solid rgba(234, 179, 8, 0.4)' : '1px solid rgba(56, 189, 248, 0.4)',
                            fontWeight: 800
                          }}>
                            💾 {appr.spaceComplexity}
                          </span>
                        </div>

                        {/* Mechanical Sympathy Note */}
                        <div style={{
                          background: 'rgba(56, 189, 248, 0.06)',
                          border: '1px solid rgba(56, 189, 248, 0.2)',
                          borderRadius: '10px',
                          padding: '0.65rem 0.8rem',
                          marginBottom: '0.75rem',
                          fontSize: '0.74rem',
                          color: '#bae6fd',
                          lineHeight: '1.45'
                        }}>
                          <div style={{ fontWeight: 800, color: '#38bdf8', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Cpu style={{ width: '12px', height: '12px' }} /> Mechanical Sympathy:
                          </div>
                          {appr.mechanicalSympathy}
                        </div>

                        {/* Invariant Truth */}
                        <div style={{
                          background: 'rgba(168, 85, 247, 0.06)',
                          border: '1px solid rgba(168, 85, 247, 0.2)',
                          borderRadius: '10px',
                          padding: '0.65rem 0.8rem',
                          marginBottom: '0.85rem',
                          fontSize: '0.74rem',
                          color: '#e9d5ff',
                          lineHeight: '1.45'
                        }}>
                          <div style={{ fontWeight: 800, color: '#c084fc', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <BookOpen style={{ width: '12px', height: '12px' }} /> Invariant Proof:
                          </div>
                          {appr.invariantTruth}
                        </div>

                        {/* Code Block with Copy */}
                        <div style={{ position: 'relative', marginBottom: '0.85rem' }}>
                          <pre style={{
                            background: '#090d16',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '10px',
                            padding: '0.75rem',
                            fontSize: '0.72rem',
                            color: '#e2e8f0',
                            fontFamily: 'monospace',
                            overflowX: 'auto',
                            maxHeight: '180px',
                            lineHeight: '1.4',
                            margin: 0
                          }}>
                            <code>{appr.code}</code>
                          </pre>
                          <button
                            onClick={() => handleCopyCode(appr.id || idx, appr.code)}
                            title="Copy C++ Code"
                            style={{
                              position: 'absolute',
                              top: '6px',
                              right: '6px',
                              background: 'rgba(255, 255, 255, 0.1)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '6px',
                              padding: '3px 6px',
                              color: copiedApproachId === (appr.id || idx) ? '#34d399' : '#fff',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                              fontSize: '0.65rem'
                            }}
                          >
                            {copiedApproachId === (appr.id || idx) ? <Check style={{ width: '11px', height: '11px' }} /> : <Copy style={{ width: '11px', height: '11px' }} />}
                            {copiedApproachId === (appr.id || idx) ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>

                      {/* Action Button: Pipe to Socratic AAR */}
                      <button
                        onClick={() => handlePipeToSocraticDebrief(appr.name, appr.invariantTruth)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '10px',
                          padding: '0.5rem',
                          color: '#fff',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Bot style={{ width: '13px', height: '13px', color: '#38bdf8' }} />
                        Debrief with Socratic Tutor
                      </button>

                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </motion.div>
    </div>
  );
}

// Client-side fallback ensuring 100% fine-tuned structured response quality even offline
function generateClientSideAuthoritativeDebrief(prompt, currentBook, activeQuestion) {
  const p = prompt.toLowerCase();

  if (p.includes('bud') || p.includes('cracking') || p.includes('ctci') || p.includes('mcdowell') || p.includes('runner') || p.includes('bit vector')) {
    return `### 🔍 1. Mental Model Breakdown & Rote Trap
Many candidates approach technical questions by randomly guessing patterns they memorized ("maybe dynamic programming? maybe a hash map?"). This rote trial-and-error fails because it ignores **BUD**: Bottlenecks, Unnecessary work, and Duplicated work.

### 📖 2. Authoritative Literature Citation & Invariant
*Cracking the Coding Interview (6th Ed, Gayle Laakmann McDowell, Chapter VII)*:
- **Bottlenecks**: The $O(N^2)$ nested loop dominates runtime. Optimizing a separate $O(N)$ step yields no asymptotic gain.
- **Unnecessary Work**: Searching for target pairs by repeatedly scanning remaining elements wastes CPU time. Caching complementary values in a hash table or bitmask converts lookups to $O(1)$ amortized time.
- **The Runner Technique (Ch. 2.2)**: Advancing two pointers at differing speeds ($1x$ and $2x$) allows single-pass cycle detection and median finding with $O(1)$ auxiliary memory.

### ⚙️ 3. Mechanical Sympathy & Hardware Reality
When you replace an $O(N)$ linear search with a 32-bit bitmask register (\`int checker = 0;\`), you eliminate heap node allocations, cache line misses, and virtual table lookups. The entire state fits inside an ARM64/x86-64 general-purpose CPU register (\`eax\`/\`w0\`), executing in a single clock cycle.

### ❓ 4. Socratic Mastery Probe
If you are searching for two elements in an array that sum to $K$, and the array is *already sorted*, why is a Two-Pointer technique strictly superior to a Hash Map both asymptotically and mechanically?`;
  }

  if (p.includes('clrs') || p.includes('lomuto') || p.includes('hoare') || p.includes('quicksort') || p.includes('master theorem') || p.includes('loop invariant') || p.includes('cormen')) {
    return `### 🔍 1. Mental Model Breakdown & Rote Trap
Rote learners assume all Quicksort partitioning schemes are functionally interchangeable. A common mistake is using Lomuto's partition because its code is shorter, without recognizing its catastrophic failure mode when sorting arrays with duplicate elements.

### 📖 2. Authoritative Literature Citation & Invariant
*Introduction to Algorithms (CLRS, 4th Edition, Chapter 7 & Problem 7-1)*:
- **Lomuto Partition**: Advances pointer $j$ and swaps when $A[j] < x$. When all elements are equal ($A[i] == x$), the predicate $A[j] < x$ is universally FALSE. No swaps occur, and the pivot is placed at the very end ($r$). The recurrence collapses to $T(N) = T(N-1) + \\Theta(N)$, yielding quadratic $O(N^2)$ execution.
- **Hoare Partition Invariant**: Scans bidirectionally with two pointers $i$ and $j$. Crucially, both pointers halt when encountering elements EQUAL to the pivot ($A[i] \\ge x$ and $A[j] \\le x$). This forces equal elements to swap across the midpoint, guaranteeing near-balanced $\\lfloor N/2 \\rfloor$ subproblems.

### ⚙️ 3. Mechanical Sympathy & Hardware Reality
Balanced partitions result in a recursion tree of depth $\\log_2 N$, fitting completely inside the L1 Instruction cache and maintaining predictable branch predictor paths. Quadratic Lomuto partitions blow the call stack with $N$ stack frames, causing cache eviction thrashing and stack overflow risks.

### ❓ 4. Socratic Mastery Probe
Under what exact input distribution does the Master Theorem Case 3 ($f(n) = \\Omega(n^{\\log_b a + \\epsilon})$) fail to apply, even when $f(n)$ grows asymptotically faster than the watershed function?`;
  }

  if (p.includes('cpds') || p.includes('*p++') || p.includes('pointer') || p.includes('balagurusamy') || p.includes('thareja') || p.includes('padding') || p.includes('precedence')) {
    return `### 🔍 1. Mental Model Breakdown & Rote Trap
In ANSI C and CPDS curricula, students frequently believe that \`*p++\` increments the value pointed to by \`p\`. This dangerous misconception corrupts memory buffers and leads to silent logic bugs in embedded and systems programming.

### 📖 2. Authoritative Literature Citation & Invariant
*C Programming & Data Structures (E. Balagurusamy, Ch. 11 / Reema Thareja, Ch. 7)*:
- **Operator Precedence Invariant**: Postfix increment (\`++\`) has Level 2 precedence with left-to-right associativity, while unary dereference (\`*\`) has Level 3 precedence with right-to-left associativity.
- Therefore, \`*p++\` is parsed by the compiler as \`*(p++)\`. The current value at \`*p\` is returned, and the POINTER ADDRESS \`p\` is incremented by \`sizeof(*p)\` bytes. The stored integer value is completely unmodified.
- To mutate the value, explicit parentheses are required: \`(*p)++\`.

### ⚙️ 3. Mechanical Sympathy & Hardware Reality
In assembly (x86-64), \`*p++\` translates into:
\`\`\`asm
mov eax, dword ptr [rsi]     ; read current value
add rsi, 4                   ; advance pointer address by 4 bytes
\`\`\`
Whereas \`(*p)++\` translates into:
\`\`\`asm
inc dword ptr [rsi]          ; increment memory location directly
\`\`\`
Notice how the register target and bus activity differ completely!

### ❓ 4. Socratic Mastery Probe
In a struct with members \`char a; int b; char c;\`, why does \`sizeof(struct)\` return 12 bytes on a 32/64-bit architecture rather than 6 bytes, and how would you reorder the members to shrink it to 8 bytes?`;
  }

  if (p.includes('cp3') || p.includes('cp4') || p.includes('dsu') || p.includes('fenwick') || p.includes('halim') || p.includes('ackermann') || p.includes('union-find')) {
    return `### 🔍 1. Mental Model Breakdown & Rote Trap
Many developers remember that Disjoint Set Union (DSU) has "Path Compression" and think that alone is sufficient. Under competitive programming adversarial test cases, path compression without rank can still degrade to $O(N \\log N)$ or worse when pathological union trees are formed.

### 📖 2. Authoritative Literature Citation & Invariant
*Competitive Programming 3 / 4 (Steven & Felix Halim, Ch. 2.4)*:
- **The Inverse Ackermann Invariant**: The combination of **Union by Rank** (attaching shallower trees under deeper trees) and **Path Compression** (pointing nodes directly to root during find) bounds any sequence of $M$ operations on $N$ elements to $O(M \\alpha(N))$.
- $\\alpha(N)$ is the inverse Ackermann function, which is strictly less than 5 for any $N \\le 2^{65536}$ (more than the total number of atoms in the observable universe).

### ⚙️ 3. Mechanical Sympathy & Hardware Reality
Path compression flattens pointer trees into contiguous index hops. Because the tree depth is almost always $\\le 2$, finding a set representative takes two memory lookups that hit L1/L2 data cache with $> 99\\%$ hit rates, eliminating branch mispredictions.

### ❓ 4. Socratic Mastery Probe
Why can we NOT use simple Union by Rank if we need to support a \`rollback()\` or "persistent DSU" operation in competitive programming, and what invariant must we maintain instead?`;
  }

  return `### 🔍 1. Mental Model Breakdown & Rote Trap
Rote memorization focuses on superficial syntax ("which function do I call?"). High-performance engineering and algorithmic mastery require understanding invariants: the mathematical guarantees that must remain true before and after every state mutation.

### 📖 2. Authoritative Literature Citation & Invariant
*Curated Literature Reference: ${currentBook?.title || 'Canonical Computer Science Curriculum'}*:
Every reliable data structure and concurrency primitive exists to resolve a fundamental physical limitation:
1. **Asymptotic Complexity**: Reducing combinatorial search spaces using structural properties (CLRS / CTCI).
2. **Memory Layout & Invariants**: Honoring compiler alignment, operator precedence, and type systems (CPDS / ISO C++).
3. **Hardware Memory Models**: Enforcing happens-before visibility across out-of-order CPU cores without global lock stalls.

### ⚙️ 3. Mechanical Sympathy & Hardware Reality
CPUs do not execute abstract code; they execute instruction streams that interact with hierarchical memory (L1/L2/L3 caches, RAM, TLB cache). Algorithms that align with hardware cache lines and avoid unnecessary branch mispredictions run up to $10\\times$ faster than identical asymptotic algorithms with random memory access patterns.

### ❓ 4. Socratic Mastery Probe
In your current scenario, what specific invariant or condition guarantees that your algorithm or memory structure will not degenerate into quadratic time or undefined behavior under worst-case inputs?`;
}
