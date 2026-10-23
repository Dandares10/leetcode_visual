import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--text-primary)', flexDirection: 'column' }}>
          
          {/* Sloth / Zzz Animation */}
          <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              style={{ fontSize: '6rem' }}
            >
              🦥
            </motion.div>
            
            {/* Zzz floating */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5, x: 20, y: -20 }}
                animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 1.2], x: [20, 40, 60], y: [-20, -50, -80] }}
                transition={{ repeat: Infinity, duration: 3, delay: i * 1, ease: "easeOut" }}
                style={{ position: 'absolute', right: '30px', top: '40px', fontSize: '1.5rem', fontWeight: 800, color: '#a855f7' }}
              >
                z
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', maxWidth: '500px' }}
          >
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <AlertTriangle style={{ color: '#f43f5e' }} /> Oops, the app took a nap!
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
              We encountered an unexpected crash. Don't worry, your personal file paths have been kept safe from the screen.
            </p>
            
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
              style={{ padding: '0.8rem 1.5rem', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RefreshCw style={{ width: '18px', height: '18px' }} /> Wake up and Reload
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
