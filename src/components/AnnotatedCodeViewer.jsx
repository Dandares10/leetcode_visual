import React from 'react';
import { 
  Code2, 
  HelpCircle, 
  Play, 
  GitCompare, 
  CheckSquare, 
  HelpCircle as QuestionIcon,
  Sparkles,
  Info
} from 'lucide-react';

export function AnnotatedCodeViewer({ 
  scenario, 
  activeViewTab, 
  onSelectViewTab, 
  onOpenWhyDrawer,
  selectedLineNumber,
  isAiThinking,
  onTextSelected
}) {
  const codeLines = scenario.code.split('\n');

  const handleMouseUp = () => {
    if (!onTextSelected) return;
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      onTextSelected(selection.toString().trim());
    } else {
      onTextSelected("");
    }
  };

  return (
    <div className="glass-panel" style={{ height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      


      {/* Code Display Area */}
      <div 
        onMouseUp={handleMouseUp}
        style={{ 
          flex: 1, 
          minHeight: 0,
          overflowY: 'auto', 
          overscrollBehavior: 'contain',
          padding: '0.75rem', 
          background: '#ffffff', // Light mode base
          backgroundImage: 'url("https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1200&auto=format&fit=crop")', // subtle jungle/leaves image
          backgroundSize: 'cover',
          backgroundPosition: '0% 0%',
          backgroundBlendMode: 'overlay', // Blend with white
          backgroundColor: 'rgba(255, 255, 255, 0.93)', // High opacity white to make the image subtle
          animation: 'panBackground 120s linear infinite',
          fontFamily: 'var(--font-mono)', 
          position: 'relative',
          color: '#0f172a' // Dark text for light mode
        }}
      >
        
        {isAiThinking ? (
          <div style={{ padding: '1rem' }}>
            <div className="skeleton-pulse" style={{ width: '40%', height: '14px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.15)', marginBottom: '1rem' }} />
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <div style={{ width: '15px', height: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '2px' }} />
                <div className="skeleton-pulse" style={{ width: `${Math.random() * 40 + 20}%`, height: '12px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', marginLeft: `${Math.random() * 2}rem` }} />
              </div>
            ))}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', lineHeight: '1.6' }}>
          <tbody>
            {codeLines.map((lineText, idx) => {
              const lineNum = idx + 1;
              const annotation = scenario.whyAnnotations[lineNum];
              const isSelected = selectedLineNumber === lineNum;

              return (
                <tr 
                  key={lineNum} 
                  style={{ 
                    background: isSelected 
                      ? 'rgba(99, 102, 241, 0.15)' 
                      : annotation 
                      ? 'rgba(99, 102, 241, 0.05)' 
                      : 'transparent',
                    transition: 'background 0.15s ease'
                  }}
                >
                  {/* Line Number */}
                  <td style={{ 
                    width: '38px', 
                    textAlign: 'right', 
                    paddingRight: '0.75rem', 
                    color: '#94a3b8', 
                    userSelect: 'none',
                    borderRight: '1px solid rgba(0,0,0,0.05)'
                  }}>
                    {lineNum}
                  </td>

                  {/* Line Content */}
                  <td style={{ paddingLeft: '0.75rem', color: '#0f172a', whiteSpace: 'pre', fontWeight: 500 }}>
                    {lineText}
                  </td>

                  {/* Interactive Why Badge */}
                  <td style={{ width: '160px', textAlign: 'right', paddingRight: '0.5rem' }}>
                    {annotation && (
                      <button
                        onClick={() => onOpenWhyDrawer(lineNum, annotation)}
                        className="badge-cyan"
                        style={{
                          background: annotation.type === 'safety' 
                            ? 'rgba(244,63,94,0.15)' 
                            : annotation.type === 'performance' 
                            ? 'rgba(16,185,129,0.15)' 
                            : 'rgba(99, 102, 241, 0.15)',
                          color: annotation.type === 'safety' 
                            ? '#f43f5e' 
                            : annotation.type === 'performance' 
                            ? '#10b981' 
                            : 'var(--accent-indigo)',
                          border: '1px solid rgba(99, 102, 241, 0.3)',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '0.68rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          boxShadow: '0 0 10px rgba(99, 102, 241, 0.2)'
                        }}
                      >
                        <QuestionIcon style={{ width: '11px', height: '11px' }} />
                        Why Line {lineNum}?
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}
