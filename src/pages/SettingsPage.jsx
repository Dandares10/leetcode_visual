import React from 'react';
import { Settings as SettingsIcon, Shield, Bell, Key } from 'lucide-react';
import { motion } from 'framer-motion';

export function SettingsPage() {
  return (
    <div style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <SettingsIcon style={{ color: '#a855f7', width: '32px', height: '32px' }} /> Settings
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
        <motion.div whileHover={{ scale: 1.01 }} style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#fff' }}>
            <Shield style={{ width: '20px', height: '20px', color: '#3b82f6' }} /> Privacy & Security
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Your voice and text inputs are processed entirely within the browser natively where possible. Local execution sandbox ensures code snippets do not leak.
          </p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.01 }} style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#fff' }}>
            <Key style={{ width: '20px', height: '20px', color: '#10b981' }} /> AI Model Providers
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            You are currently using the default Metacognitive engine. Connect external providers in the next phase.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
