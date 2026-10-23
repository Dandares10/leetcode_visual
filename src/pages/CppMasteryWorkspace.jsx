import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  BookOpen, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Bot, 
  ExternalLink, 
  Code2, 
  Award, 
  HelpCircle,
  RefreshCw,
  Flame,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CPP_BOOKS, CPP_CONCEPTS, CPP_ANTI_ROTE_QUIZ_BANK } from '../data/cppCurriculum';
import { CppAarAgentModal } from '../components/CppAarAgentModal';

export function CppMasteryWorkspace({ userXp, onGainXp }) {
  const [selectedConceptId, setSelectedConceptId] = useState('all');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [aarModalOpen, setAarModalOpen] = useState(false);
  const [activeQuestionForAar, setActiveQuestionForAar] = useState(null);
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz' | 'books' | 'concepts'
  const [bookCategoryFilter, setBookCategoryFilter] = useState('All');

  // Filter questions based on selected concept
  const filteredQuestions = selectedConceptId === 'all'
    ? CPP_ANTI_ROTE_QUIZ_BANK
    : CPP_ANTI_ROTE_QUIZ_BANK.filter(q => q.conceptId === selectedConceptId);

  const currentQ = filteredQuestions[currentQuizIndex % filteredQuestions.length];

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      if (onGainXp) onGainXp(150);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentQuizIndex(prev => (prev + 1) % filteredQuestions.length);
  };

  const handleOpenAar = (question) => {
    setActiveQuestionForAar(question);
    setAarModalOpen(true);
  };

  return (
    <div style={{ flex: 1, minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column', padding: '1.5rem 2.5rem', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      
      {/* Top Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexShrink: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '8px',
              textTransform: 'uppercase'
            }}>
              C++ Metacognitive Hub
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ISO C++20 / C++23 Standards
            </span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.4rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff' }}>
            <Terminal style={{ color: '#38bdf8', width: '30px', height: '30px' }} />
            Modern C++ Anti-Rote Mastery
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '750px', margin: 0, lineHeight: '1.4' }}>
            Stop memorizing syntax fragments. Train on real-world memory traps, undefined behavior, and RAII invariants grounded in peer-reviewed open textbooks and ISO Core Guidelines.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.4rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', flexShrink: 0 }}>
          {[
            { id: 'quiz', label: 'Anti-Rote Quizzes', icon: ShieldAlert },
            { id: 'books', label: 'Open Book Shelf', icon: BookOpen },
            { id: 'concepts', label: 'Core Concepts & Diffs', icon: Code2 }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isActive ? 'linear-gradient(135deg, #6366f1, #38bdf8)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.6rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon style={{ width: '16px', height: '16px' }} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW 1: ANTI-ROTE QUIZ GENERATOR */}
      {activeTab === 'quiz' && (
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', overflow: 'hidden' }}>
          
          {/* Concept Filter Sidebar */}
          <div style={{ height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', paddingRight: '0.5rem', overscrollBehavior: 'contain' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
              Filter by Concept Module
            </div>

            <button
              onClick={() => { setSelectedConceptId('all'); setSelectedOption(null); setIsAnswered(false); }}
              style={{
                textAlign: 'left',
                padding: '0.8rem 1rem',
                borderRadius: '12px',
                background: selectedConceptId === 'all' ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-tertiary)',
                border: `1px solid ${selectedConceptId === 'all' ? '#38bdf8' : 'var(--border-subtle)'}`,
                color: selectedConceptId === 'all' ? '#38bdf8' : 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              All Anti-Rote Scenarios ({CPP_ANTI_ROTE_QUIZ_BANK.length})
            </button>

            {CPP_CONCEPTS.map(c => (
              <button
                key={c.id}
                onClick={() => { setSelectedConceptId(c.id); setSelectedOption(null); setIsAnswered(false); }}
                style={{
                  textAlign: 'left',
                  padding: '0.8rem 1rem',
                  borderRadius: '12px',
                  background: selectedConceptId === c.id ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-tertiary)',
                  border: `1px solid ${selectedConceptId === c.id ? '#38bdf8' : 'var(--border-subtle)'}`,
                  color: selectedConceptId === c.id ? '#38bdf8' : 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  lineHeight: '1.4'
                }}
              >
                {c.name}
              </button>
            ))}

            {/* Quick Launch Agent Card */}
            <div style={{
              marginTop: '1rem',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(56, 189, 248, 0.1) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: '16px',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#38bdf8', fontWeight: 800, fontSize: '0.9rem' }}>
                <Bot style={{ width: '18px', height: '18px' }} />
                AAR Reading Agent
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: '0 0 1rem 0' }}>
                Stuck on a mental model? Let the AAR Agent cross-reference your question directly with ISO Core Guidelines and Modern C++ Tutorial.
              </p>
              <button
                onClick={() => handleOpenAar(currentQ)}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.6rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <Sparkles style={{ width: '14px', height: '14px' }} /> Open AAR Agent
              </button>
            </div>
          </div>

          {/* Quiz Card */}
          <div className="glass-panel" style={{ height: '100%', minHeight: 0, padding: '2rem', display: 'flex', flexDirection: 'column', overflowY: 'auto', overscrollBehavior: 'contain' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <div>
                <span className="badge-purple" style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '10px', fontWeight: 700, textTransform: 'uppercase' }}>
                  Scenario Challenge {currentQuizIndex + 1} of {filteredQuestions.length}
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: '0.5rem 0 0 0' }}>
                  {currentQ.title}
                </h2>
              </div>

              <button
                onClick={handleNextQuestion}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '0.5rem 1rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <RefreshCw style={{ width: '14px', height: '14px' }} /> Next Scenario
              </button>
            </div>

            {/* Markdown Question Prompt with Code Block */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              lineHeight: '1.6',
              color: 'var(--text-primary)',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap'
            }}>
              {currentQ.question}
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let bg = 'var(--bg-tertiary)';
                let border = '1px solid var(--border-subtle)';
                let textColor = 'var(--text-primary)';

                if (isAnswered) {
                  if (isCorrect) {
                    bg = 'rgba(16, 185, 129, 0.15)';
                    border = '1px solid #10b981';
                    textColor = '#10b981';
                  } else if (isSelected) {
                    bg = 'rgba(244, 63, 94, 0.15)';
                    border = '1px solid #f43f5e';
                    textColor = '#f43f5e';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    style={{
                      textAlign: 'left',
                      background: bg,
                      border: border,
                      color: textColor,
                      borderRadius: '12px',
                      padding: '1rem 1.25rem',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: isAnswered ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                      lineHeight: '1.5'
                    }}
                  >
                    <span>{opt}</span>
                    {isAnswered && isCorrect && <CheckCircle2 style={{ color: '#10b981', width: '20px', height: '20px', flexShrink: 0, marginLeft: '1rem' }} />}
                    {isAnswered && isSelected && !isCorrect && <XCircle style={{ color: '#f43f5e', width: '20px', height: '20px', flexShrink: 0, marginLeft: '1rem' }} />}
                  </button>
                );
              })}
            </div>

            {/* Post-Answer AAR Callout */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 800, fontSize: '0.95rem' }}>
                    <BookOpen style={{ width: '18px', height: '18px' }} />
                    {currentQ.bookCitation.book} Citation: {currentQ.bookCitation.rule}
                  </div>

                  <button
                    onClick={() => handleOpenAar(currentQ)}
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.4rem 0.8rem',
                      color: '#fff',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Bot style={{ width: '14px', height: '14px' }} /> Run Full AAR Debrief
                  </button>
                </div>

                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {currentQ.bookCitation.explanation}
                </p>
              </motion.div>
            )}

          </div>

        </div>
      )}

      {/* VIEW 2: OPEN BOOK SHELF */}
      {activeTab === 'books' && (
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', paddingRight: '0.5rem', overscrollBehavior: 'contain' }}>
          
          {/* Book Categories Filter */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {['All', 'CLRS & Algorithms', 'CPDS (C & Data Structures)', 'Competitive Programming (CP3/CPH)', 'Interview Prep (CTCI)', 'Modern C++', 'CPDC & Concurrency', 'Distributed Systems'].map(cat => (
              <button
                key={cat}
                onClick={() => setBookCategoryFilter(cat)}
                style={{
                  background: bookCategoryFilter === cat ? 'linear-gradient(135deg, #6366f1, #38bdf8)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${bookCategoryFilter === cat ? '#38bdf8' : 'var(--border-subtle)'}`,
                  color: bookCategoryFilter === cat ? '#fff' : 'var(--text-secondary)',
                  borderRadius: '10px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {CPP_BOOKS
              .filter(book => bookCategoryFilter === 'All' || book.category === bookCategoryFilter)
              .map(book => (
              <motion.div
                key={book.id}
                whileHover={{ y: -5 }}
                style={{
                  background: 'var(--bg-tertiary)',
                  borderRadius: '20px',
                  border: '1px solid var(--border-subtle)',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span className="badge-cyan" style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '10px', fontWeight: 800 }}>
                      {book.category}
                    </span>
                    <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                      {book.license.split(' ')[0]}
                    </span>
                  </div>

                  <a
                    href={book.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      color: '#38bdf8',
                      fontSize: '0.8rem',
                      textDecoration: 'none',
                      fontWeight: 700
                    }}
                  >
                    Read Online <ExternalLink style={{ width: '13px', height: '13px' }} />
                  </a>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '0 0 0.3rem 0' }}>
                  {book.title}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  By {book.author}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', flex: 1, marginBottom: '1.25rem' }}>
                  {book.description}
                </p>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Recommended In-Depth Chapters:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {book.keyChapters.slice(0, 3).map((ch, i) => (
                      <div key={i} style={{ fontSize: '0.78rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ color: '#a855f7', fontWeight: 800 }}>§{ch.number}</span>
                        <span>{ch.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveQuestionForAar({
                      title: `In-Depth Study: ${book.title}`,
                      aarDebrief: {
                        mentalModelMistake: "Relying on scattered blog posts rather than the textbook's formal definitions.",
                        authoritativeTruth: `Consulting ${book.title} provides full theoretical guarantees, invariants, and proofs.`
                      },
                      bookCitation: {
                        book: book.title,
                        rule: "Comprehensive Text",
                        explanation: book.description
                      }
                    });
                    setAarModalOpen(true);
                  }}
                  style={{
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: '10px',
                    padding: '0.6rem 1rem',
                    color: '#38bdf8',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    marginTop: 'auto'
                  }}
                >
                  <Bot style={{ width: '15px', height: '15px' }} /> Consult with AAR Agent
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: CORE CONCEPTS & ANTI-PATTERNS DIFF */}
      {activeTab === 'concepts' && (
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto', paddingRight: '0.5rem', overscrollBehavior: 'contain' }}>
          {CPP_CONCEPTS.map(concept => (
            <div key={concept.id} className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <span className="badge-purple" style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '10px', fontWeight: 800, textTransform: 'uppercase' }}>
                    {concept.category} • {concept.difficulty}
                  </span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0.5rem 0 0.2rem 0' }}>
                    {concept.name}
                  </h2>
                  <p style={{ fontSize: '0.9rem', color: '#38bdf8', margin: 0, fontWeight: 600 }}>
                    {concept.tagline}
                  </p>
                </div>

                <a
                  href={concept.bookReference.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.78rem',
                    color: '#38bdf8',
                    textDecoration: 'none',
                    fontWeight: 700,
                    background: 'rgba(56, 189, 248, 0.1)',
                    padding: '0.5rem 0.9rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(56, 189, 248, 0.2)'
                  }}
                >
                  <BookOpen style={{ width: '14px', height: '14px' }} />
                  {concept.bookReference.section}
                </a>
              </div>

              {/* Core Principles */}
              <div style={{ marginBottom: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', padding: '1rem 1.25rem', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Core Theoretical Invariants (ISO Core Standards):
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {concept.corePrinciples.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>

              {/* Side-by-side Diffs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Anti-Pattern */}
                <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f43f5e', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                    <XCircle style={{ width: '16px', height: '16px' }} />
                    Anti-Pattern (Rote Intuition Trap)
                  </div>
                  <pre style={{ margin: 0, fontSize: '0.8rem', color: '#ffb4b4', fontFamily: 'monospace', overflowX: 'auto', lineHeight: '1.5' }}>
                    {concept.antiPatternCode}
                  </pre>
                </div>

                {/* Idiomatic Modern C++ */}
                <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                    <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                    Idiomatic Modern C++ (ISO RAII Standard)
                  </div>
                  <pre style={{ margin: 0, fontSize: '0.8rem', color: '#bbf7d0', fontFamily: 'monospace', overflowX: 'auto', lineHeight: '1.5' }}>
                    {concept.idiomaticCode}
                  </pre>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* AAR Agent Modal */}
      <CppAarAgentModal
        isOpen={aarModalOpen}
        onClose={() => setAarModalOpen(false)}
        activeQuestion={activeQuestionForAar}
      />

    </div>
  );
}
