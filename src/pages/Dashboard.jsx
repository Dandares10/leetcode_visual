import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Play, GitBranch, ArrowRight, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Dashboard({ scenarios, userXp, onSelectScenario }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const nextSlide = () => setCurrentIndex((prev) => (prev === scenarios.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? scenarios.length - 1 : prev - 1));

  return (
    <div style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto', background: '#ffffff', color: '#0f172a', borderRadius: '24px 0 0 0' }}>
      
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(248, 250, 252, 1) 0%, rgba(241, 245, 249, 1) 100%)',
          borderRadius: '24px',
          padding: '3rem',
          border: '1px solid rgba(226, 232, 240, 1)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '3rem'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#0f172a' }}>
            Welcome back, <span style={{ color: '#0284c7' }}>Developer</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', marginBottom: '1.5rem' }}>
            You've mastered {userXp} XP points of conceptual understanding. Ready to tackle today's architectural challenges?
          </p>
          <button 
            onClick={() => navigate('/tutor')}
            className="btn-primary"
            style={{ padding: '0.8rem 1.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Zap style={{ width: '18px', height: '18px' }} /> Enter AI Tutor
          </button>
        </div>
        
      {/* Abstract background graphics */}
        <div style={{ position: 'absolute', right: '-50px', top: '-50px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', zIndex: 1 }} />
      </motion.div>

      {/* Scenarios Carousel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
          <Code2 style={{ color: '#a855f7' }} /> Recommended Scenarios
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={prevSlide} style={{ padding: '0.5rem', borderRadius: '50%', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>
            <ChevronLeft style={{ width: '20px', height: '20px', color: '#64748b' }} />
          </button>
          <button onClick={nextSlide} style={{ padding: '0.5rem', borderRadius: '50%', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>
            <ChevronRight style={{ width: '20px', height: '20px', color: '#64748b' }} />
          </button>
        </div>
      </div>
      
      <div style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)', transform: `translateX(-${currentIndex * 340}px)`, gap: '1.5rem', position: 'absolute', left: 0 }}>
          {scenarios.map((scenario, idx) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              style={{
                width: '320px',
                height: '240px',
                background: '#ffffff',
                borderRadius: '20px',
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.12)' }}
              onClick={() => {
                if (onSelectScenario) onSelectScenario(scenario);
                navigate('/tutor');
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0) 50%, rgba(99, 102, 241, 0.05) 100%)', zIndex: 0 }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', zIndex: 1 }}>
                <span style={{ fontSize: '0.7rem', padding: '4px 12px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{scenario.category}</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>{scenario.difficulty}</span>
              </div>
              
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#0f172a', zIndex: 1, fontWeight: 800 }}>{scenario.title}</h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.5', zIndex: 1, flex: 1 }}>
                {scenario.description}
              </p>
              
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', color: '#4f46e5', fontSize: '0.9rem', fontWeight: 800, zIndex: 1 }}>
                Start Challenge <ArrowRight style={{ width: '16px', height: '16px', marginLeft: '6px' }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
