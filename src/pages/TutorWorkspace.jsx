import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MetacognitiveThoughtPanel } from '../components/MetacognitiveThoughtPanel';
import { AnnotatedCodeViewer } from '../components/AnnotatedCodeViewer';
import { SimulatorSandbox } from '../components/SimulatorSandbox';
import { CodeDiffInspector } from '../components/CodeDiffInspector';
import { ConceptQuizModal } from '../components/ConceptQuizModal';
import { RightPaneTabs } from '../components/RightPaneTabs';
import { WhyDrawer } from '../components/WhyDrawer';

export function TutorWorkspace({ 
  selectedScenario, 
  socraticMode, 
  selectedApproachIndex, 
  setSelectedApproachIndex,
  handleSocraticAnswer,
  isAiThinking,
  activeViewTab,
  setActiveViewTab,
  handleOpenWhyDrawer,
  selectedLineNum,
  handleCompleteQuiz,
  setHighlightedText,
  whyDrawerOpen,
  setWhyDrawerOpen,
  selectedAnnotation,
  chatHistory
}) {
  return (
    <main style={{ flex: 1, padding: '0 1.5rem 1.5rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', minHeight: '0' }}>
      
      {/* LEFT PANE: Metacognitive Reasoning Engine */}
      <MetacognitiveThoughtPanel
        scenario={selectedScenario}
        socraticMode={socraticMode}
        onSelectApproach={setSelectedApproachIndex}
        selectedApproachIndex={selectedApproachIndex}
        onSocraticAnswer={handleSocraticAnswer}
        isAiThinking={isAiThinking}
        chatHistory={chatHistory}
      />

      {/* RIGHT PANE: Code View / Simulator / Diff / Quiz */}
      <div className="glass-panel" style={{ height: '100%', minHeight: '0', display: 'flex', flexDirection: 'column' }}>
        
        <RightPaneTabs 
          activeViewTab={activeViewTab} 
          onSelectViewTab={setActiveViewTab} 
        />

        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>
          <AnimatePresence mode="wait">
            {activeViewTab === 'code' && (
              <motion.div
                key="code"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                style={{ height: '100%' }}
              >
                <AnnotatedCodeViewer
                  scenario={selectedScenario}
                  onOpenWhyDrawer={handleOpenWhyDrawer}
                  selectedLineNumber={selectedLineNum}
                  isAiThinking={isAiThinking}
                  onTextSelected={setHighlightedText}
                />
              </motion.div>
            )}

            {activeViewTab === 'simulator' && (
              <motion.div
                key="simulator"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                style={{ height: '100%' }}
              >
                <SimulatorSandbox scenario={selectedScenario} />
              </motion.div>
            )}

            {activeViewTab === 'diff' && (
              <motion.div
                key="diff"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                style={{ height: '100%' }}
              >
                <CodeDiffInspector diffView={selectedScenario.diffView} />
              </motion.div>
            )}

            {activeViewTab === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                style={{ height: '100%' }}
              >
                <ConceptQuizModal quiz={selectedScenario.quiz} onCompleteQuiz={handleCompleteQuiz} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Slide-out Why Drawer */}
      <WhyDrawer
        isOpen={whyDrawerOpen}
        lineNum={selectedLineNum}
        annotation={selectedAnnotation}
        onClose={() => setWhyDrawerOpen(false)}
      />
    </main>
  );
}
