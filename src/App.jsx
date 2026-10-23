import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain } from 'lucide-react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { GlobalFab } from './components/GlobalFab';
import { TutorWorkspace } from './pages/TutorWorkspace';
import { Dashboard } from './pages/Dashboard';
import { MasteryPage } from './pages/MasteryPage';
import { SettingsPage } from './pages/SettingsPage';
import { CppMasteryWorkspace } from './pages/CppMasteryWorkspace';
import Home from './pages/Home';
import Leetcode from './pages/Leetcode';
import Stl from './pages/Stl';
import Modern from './pages/Modern';
import Concepts from './pages/Concepts';

import { SCENARIOS } from './data/scenarios';
import { TOPICS } from './data/topics';

export default function App() {
  const [scenariosList, setScenariosList] = useState(SCENARIOS);
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
  const [socraticMode, setSocraticMode] = useState(false);
  const [userXp, setUserXp] = useState(1320);

  // Active View Tab on Right Pane ('code' | 'simulator' | 'diff' | 'quiz')
  const [activeViewTab, setActiveViewTab] = useState('code');
  
  // Selected Approach in Architectural Tradeoffs
  const [selectedApproachIndex, setSelectedApproachIndex] = useState(0);

  // Why Drawer state
  const [whyDrawerOpen, setWhyDrawerOpen] = useState(false);
  const [selectedLineNum, setSelectedLineNum] = useState(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);

  // Concept Matrix Modal State
  const [matrixOpen, setMatrixOpen] = useState(false);

  // Text Selection Highlight state
  const [highlightedText, setHighlightedText] = useState("");

  // Loading state for local AI
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Chat History for Left Pane
  const [chatHistory, setChatHistory] = useState([
    {
      id: "welcome-msg",
      sender: "ai",
      text: "Hello! I am your Metacognitive Tutor. Select a code snippet or ask me a question to begin.",
      timestamp: new Date().toISOString()
    }
  ]);

  // App Initial Dashboard Load
  const [isAppLoading, setIsAppLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    // Smooth transition
    const timer = setTimeout(() => setIsAppLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleCustomPromptSubmit = async (customPrompt, codeSnippet = "") => {
    setIsAiThinking(true);
    
    // Automatically include the highlighted text or selected line's code if no snippet is provided
    let finalCode = codeSnippet;
    if (!finalCode && highlightedText) {
      finalCode = `Highlighted Context: ${highlightedText}`;
    } else if (!finalCode && selectedLineNum && selectedScenario?.code) {
      const codeLines = selectedScenario.code.split('\n');
      finalCode = `Line ${selectedLineNum}: ${codeLines[selectedLineNum - 1]}`;
    }
    
    const userMsg = {
      id: "user-" + Date.now(),
      sender: "user",
      text: customPrompt,
      context: finalCode,
      timestamp: new Date().toISOString()
    };
    setChatHistory(prev => [...prev, userMsg]);
    
    try {
      const response = await fetch('/api/analyze-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: customPrompt, code: finalCode })
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      
      const newScenario = await response.json();
      
      // Give it a unique ID if not present
      if (!newScenario.id) newScenario.id = "local-ai-" + Date.now();
      
      const aiMsg = {
        id: "ai-" + Date.now(),
        sender: "ai",
        text: newScenario.chatResponse || newScenario.description || "I've analyzed the code and updated the architectural view.",
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, aiMsg]);

      // Speak response if supported
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiMsg.text);
        window.speechSynthesis.speak(utterance);
      }
      
      setScenariosList(prev => [newScenario, ...prev]);
      setSelectedScenario(newScenario);
      setActiveViewTab('code');
    } catch (err) {
      console.warn("Local AI Generation notice:", err.message);
      const errorAiMsg = {
        id: "ai-err-" + Date.now(),
        sender: "ai",
        text: "⚠️ Note: The analysis service reported an issue. Your prompt has been preserved. If running locally, please ensure Ollama or your backend gateway is active.",
        timestamp: new Date().toISOString(),
        isError: true
      };
      setChatHistory(prev => [...prev, errorAiMsg]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleOpenWhyDrawer = (lineNum, annotation) => {
    setSelectedLineNum(lineNum);
    setSelectedAnnotation(annotation);
    setWhyDrawerOpen(true);
  };

  const handleSocraticAnswer = (isCorrect) => {
    if (isCorrect) {
      setUserXp(prev => prev + 50);
    }
  };

  const handleCompleteQuiz = (xpGained) => {
    setUserXp(prev => prev + xpGained);
  };

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Bachinsky-style Intro Loading Screen */}
      <AnimatePresence>
        {isAppLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999, background: 'var(--bg-primary)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{
                width: '84px', height: '84px', borderRadius: '24px', 
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(56, 189, 248, 0.2) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                boxShadow: '0 0 35px rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.5rem'
              }}
            >
              <Brain style={{ color: '#38bdf8', width: '42px', height: '42px', filter: 'drop-shadow(0 0 10px rgba(56,189,248,0.5))' }} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              style={{ color: '#fff', fontSize: '1.35rem', fontWeight: 800, letterSpacing: '0.08em' }}
            >
              C++ <span style={{ color: '#38bdf8' }}>METACOGNITIVE</span> HUB
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '160px' }}
              transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
              style={{ height: '3px', background: 'linear-gradient(90deg, #6366f1, #38bdf8)', marginTop: '0.85rem', borderRadius: '3px' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Sidebar />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isAppLoading ? 0 : 1 }}
        transition={{ delay: 0.9, duration: 0.5, ease: "easeOut" }}
        style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        <Header
          scenarios={scenariosList}
          selectedScenario={selectedScenario}
          onSelectScenario={setSelectedScenario}
          onCustomPromptSubmit={handleCustomPromptSubmit}
          socraticMode={socraticMode}
          onToggleSocratic={() => setSocraticMode(prev => !prev)}
          onOpenMatrix={() => setMatrixOpen(true)}
          userXp={userXp}
          isAiThinking={isAiThinking}
          selectedLineNum={selectedLineNum}
          highlightedText={highlightedText}
          onClearSelection={() => {
            setHighlightedText("");
            setSelectedLineNum(null);
          }}
        />

        {/* Unified Page Routing */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Overview / Home Page */}
            <Route path="/" element={
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Home />
              </motion.div>
            } />

            {/* Concepts & Anti-Rote Hub */}
            <Route path="/concepts" element={
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Concepts userXp={userXp} onGainXp={(xp) => setUserXp(prev => prev + xp)} />
              </motion.div>
            } />
            <Route path="/cpp" element={
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <CppMasteryWorkspace userXp={userXp} onGainXp={(xp) => setUserXp(prev => prev + xp)} />
              </motion.div>
            } />

            {/* LeetCode & BUD Optimizations */}
            <Route path="/leetcode" element={
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Leetcode />
              </motion.div>
            } />

            {/* STL Memory & Complexity Mechanics */}
            <Route path="/stl" element={
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Stl />
              </motion.div>
            } />

            {/* Modern C++20 / C++23 */}
            <Route path="/modern" element={
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Modern />
              </motion.div>
            } />

            {/* Socratic AI Tutor Workspace */}
            <Route path="/tutor" element={
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <TutorWorkspace 
                  selectedScenario={selectedScenario}
                  socraticMode={socraticMode}
                  selectedApproachIndex={selectedApproachIndex}
                  setSelectedApproachIndex={setSelectedApproachIndex}
                  handleSocraticAnswer={handleSocraticAnswer}
                  isAiThinking={isAiThinking}
                  activeViewTab={activeViewTab}
                  setActiveViewTab={setActiveViewTab}
                  handleOpenWhyDrawer={handleOpenWhyDrawer}
                  selectedLineNum={selectedLineNum}
                  handleCompleteQuiz={handleCompleteQuiz}
                  setHighlightedText={setHighlightedText}
                  whyDrawerOpen={whyDrawerOpen}
                  setWhyDrawerOpen={setWhyDrawerOpen}
                  selectedAnnotation={selectedAnnotation}
                  chatHistory={chatHistory}
                />
              </motion.div>
            } />

            {/* Scenario Learning Dashboard */}
            <Route path="/dashboard" element={
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Dashboard scenarios={scenariosList} userXp={userXp} onSelectScenario={setSelectedScenario} />
              </motion.div>
            } />

            {/* Topic Mastery Matrix */}
            <Route path="/mastery" element={
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <MasteryPage topics={TOPICS} userXp={userXp} />
              </motion.div>
            } />

            {/* Settings & Telemetry */}
            <Route path="/settings" element={
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <SettingsPage />
              </motion.div>
            } />
          </Routes>
        </AnimatePresence>
      </motion.div>

      <GlobalFab />
    </div>
  );
}
