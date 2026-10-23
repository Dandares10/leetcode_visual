import React, { useState } from 'react';
import { CheckSquare, Award, CheckCircle2, XCircle, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export function ConceptQuizModal({ quiz, onCompleteQuiz }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!quiz || quiz.length === 0) return null;

  const currentQ = quiz[currentQuestionIndex];

  const handleSelectOption = (idx) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    
    if (idx === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < quiz.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setIsCompleted(true);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      onCompleteQuiz(100);
    }
  };

  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '1.25rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckSquare style={{ width: '18px', height: '18px', color: '#f59e0b' }} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', margin: 0 }}>
            Conceptual Checkpoint Quiz
          </h3>
        </div>

        <span className="badge-amber" style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
          Question {currentQuestionIndex + 1} of {quiz.length}
        </span>
      </div>

      {!isCompleted ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#fff', marginBottom: '1.25rem', lineHeight: '1.4' }}>
            {currentQ.question}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;
              let bg = 'var(--bg-tertiary)';
              let border = '1px solid var(--border-subtle)';
              let color = 'var(--text-primary)';

              if (selectedOption !== null) {
                if (isCorrect) {
                  bg = 'rgba(16, 185, 129, 0.15)';
                  border = '1px solid #10b981';
                  color = '#10b981';
                } else if (isSelected) {
                  bg = 'rgba(244, 63, 94, 0.15)';
                  border = '1px solid #f43f5e';
                  color = '#f43f5e';
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
                    color: color,
                    borderRadius: '8px',
                    padding: '0.8rem 1rem',
                    fontSize: '0.82rem',
                    fontWeight: '500',
                    cursor: selectedOption === null ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{opt}</span>
                  {selectedOption !== null && isCorrect && (
                    <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10b981' }} />
                  )}
                  {selectedOption !== null && isSelected && !isCorrect && (
                    <XCircle style={{ width: '16px', height: '16px', color: '#f43f5e' }} />
                  )}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div style={{ background: 'rgba(255, 255, 255, )', border: '1px solid rgba(255, 255, 255, )', borderRadius: '8px', padding: '0.85rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.7rem', color: '#ffffff', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                EXPLANATION RATIONALE
              </span>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-primary)', margin: 0, lineHeight: '1.45' }}>
                {currentQ.explanation}
              </p>
            </div>
          )}

          {selectedOption !== null && (
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleNext}
                className="btn-primary"
                style={{ padding: '0.55rem 1.2rem', fontSize: '0.82rem' }}
              >
                {currentQuestionIndex + 1 < quiz.length ? "Next Question" : "Complete Quiz"} <ArrowRight style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          )}

        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Award style={{ width: '32px', height: '32px', color: '#10b981' }} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', margin: '0 0 0.4rem 0' }}>
            Checkpoint Mastery Achieved!
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            You scored {score} / {quiz.length} and earned +100 XP!
          </p>
          <button
            onClick={() => { setCurrentQuestionIndex(0); setSelectedOption(null); setIsCompleted(false); setScore(0); }}
            className="btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            Retake Quiz
          </button>
        </div>
      )}

    </div>
  );
}
