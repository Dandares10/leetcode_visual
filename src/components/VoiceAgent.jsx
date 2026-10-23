import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

export function VoiceAgent({ onVoiceInput }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  
  // Speech Recognition Setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (!recognition) {
      setSupported(false);
      return;
    }
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onVoiceInput) onVoiceInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
  }, [recognition, onVoiceInput]);

  const toggleListening = () => {
    if (!supported) return alert('Voice recognition is not supported in this browser.');
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Listen to speech synthesis state globally
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking(window.speechSynthesis.speaking);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  if (!supported) return null;

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {isSpeaking && (
        <motion.button
          onClick={stopSpeaking}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#ef4444'
          }}
          title="Stop AI Voice"
        >
          <VolumeX style={{ width: '18px', height: '18px' }} />
        </motion.button>
      )}
      
      <motion.button
        onClick={toggleListening}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isListening ? { scale: [1, 1.1, 1], boxShadow: ['0 0 0 rgba(16, 185, 129, 0)', '0 0 15px rgba(16, 185, 129, 0.5)', '0 0 0 rgba(16, 185, 129, 0)'] } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
        style={{
          background: isListening ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)',
          border: isListening ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255,255,255,0.1)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: isListening ? '#10b981' : 'var(--text-secondary)'
        }}
        title="Voice Agent (Free Browser Native)"
      >
        {isListening ? <Mic style={{ width: '18px', height: '18px' }} /> : <MicOff style={{ width: '18px', height: '18px' }} />}
      </motion.button>
    </div>
  );
}
