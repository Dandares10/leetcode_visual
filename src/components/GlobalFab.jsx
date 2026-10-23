import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, Terminal, X } from 'lucide-react';

export function GlobalFab() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
      
      {/* Expanding Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: 'absolute',
              bottom: '4rem',
              right: '0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
              alignItems: 'flex-end',
              marginBottom: '1rem'
            }}
          >
            <motion.button 
              onClick={() => {
                setIsOpen(false);
                alert('Quick Terminal: The integrated developer console will be available in the next release phase.');
              }}
              whileHover={{ scale: 1.05 }} 
              className="btn-secondary" 
              style={{ padding: '0.7rem 1.2rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}
            >
              <Terminal style={{ width: '16px', height: '16px' }} /> Quick Terminal
            </motion.button>
            <motion.button 
              onClick={() => {
                setIsOpen(false);
                const input = document.getElementById('ai-search-input');
                if (input) {
                  input.focus();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              whileHover={{ scale: 1.05 }} 
              className="btn-secondary" 
              style={{ padding: '0.7rem 1.2rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}
            >
              <MessageSquare style={{ width: '16px', height: '16px' }} /> Ask AI Anything
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '28px',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          color: 'white',
          border: 'none',
          boxShadow: '0 10px 25px rgba(168, 85, 247, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        {isOpen ? <X style={{ width: '24px', height: '24px' }} /> : <Sparkles style={{ width: '24px', height: '24px' }} />}
      </motion.button>
    </div>
  );
}
