import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause,
  RotateCcw, 
  SkipForward, 
  SkipBack,
  Cpu, 
  Layers, 
  Code2, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Bug, 
  ArrowRight,
  Database
} from 'lucide-react';

export function SimulatorSandbox({ scenario }) {
  // Simulator Modes: 'partition' | 'runner' | 'pointers' | 'bitmask'
  const [mode, setMode] = useState(() => {
    const title = (scenario?.title || '').toLowerCase();
    if (title.includes('partition') || title.includes('quicksort') || title.includes('lomuto') || title.includes('hoare')) return 'partition';
    if (title.includes('cycle') || title.includes('runner') || title.includes('linked list')) return 'runner';
    if (title.includes('unique') || title.includes('bitmask') || title.includes('register')) return 'bitmask';
    return 'partition';
  });

  // Custom User Inputs
  const [customArrayInput, setCustomArrayInput] = useState('10, 80, 30, 90, 40, 50, 70');
  const [customStringInput, setCustomStringInput] = useState('metacognition');

  // Simulation Step States
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 0.5x, 1x, 2x
  const [activeTab, setActiveTab] = useState('visual'); // 'visual' | 'code' | 'trace'
  const [challengeActive, setChallengeActive] = useState(false);

  const timerRef = useRef(null);

  // Re-generate steps when mode or custom inputs change
  useEffect(() => {
    generateSimulationSteps();
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [mode, customArrayInput, customStringInput, challengeActive]);

  // Handle Playback Timer
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = Math.round(1000 / playbackSpeed);
    timerRef.current = setInterval(() => {
      setCurrentStepIdx(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, steps.length]);

  // Step Generators
  const generateSimulationSteps = () => {
    if (mode === 'partition') {
      generatePartitionSteps();
    } else if (mode === 'runner') {
      generateRunnerSteps();
    } else if (mode === 'pointers') {
      generatePointerReversalSteps();
    } else if (mode === 'bitmask') {
      generateBitmaskSteps();
    }
  };

  // 1. Lomuto & Invariant Partition Step Generator
  const generatePartitionSteps = () => {
    const raw = customArrayInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    const arr = raw.length >= 3 ? [...raw] : [10, 80, 30, 90, 40, 50, 70];
    const generated = [];

    const low = 0;
    const high = arr.length - 1;
    const pivot = arr[high];
    let i = low - 1;

    generated.push({
      step: 0,
      title: "Initialize Partition Invariant",
      arr: [...arr],
      i: i,
      j: low,
      pivotIdx: high,
      pivotVal: pivot,
      highlight: [],
      swapped: [],
      invariant: `Pivot selected: ${pivot} at index ${high}. Loop invariant [low..i] contains elements <= pivot.`,
      activeCodeLine: 1
    });

    for (let j = low; j < high; ++j) {
      const isSmaller = challengeActive ? arr[j] > pivot : arr[j] <= pivot; // Bug toggle
      generated.push({
        step: generated.length,
        title: `Compare arr[${j}] (${arr[j]}) with Pivot (${pivot})`,
        arr: [...arr],
        i: i,
        j: j,
        pivotIdx: high,
        pivotVal: pivot,
        highlight: [j, high],
        swapped: [],
        invariant: isSmaller 
          ? `arr[${j}] <= ${pivot}: Invariant requires placing this in the <= partition. Advance i and swap.` 
          : `arr[${j}] > ${pivot}: Belongs in > partition. No swap required, continue scan.`,
        activeCodeLine: 4
      });

      if (isSmaller) {
        i++;
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;

        generated.push({
          step: generated.length,
          title: `Swap arr[${i}] and arr[${j}]`,
          arr: [...arr],
          i: i,
          j: j,
          pivotIdx: high,
          pivotVal: pivot,
          highlight: [i, j],
          swapped: [i, j],
          invariant: `Swapped! Boundary i moved to ${i}. Elements in [0..${i}] now strictly <= ${pivot}.`,
          activeCodeLine: 6
        });
      }
    }

    // Place pivot in correct final position
    const finalI = i + 1;
    const temp = arr[finalI];
    arr[finalI] = arr[high];
    arr[high] = temp;

    generated.push({
      step: generated.length,
      title: `Final Pivot Placement at Index ${finalI}`,
      arr: [...arr],
      i: finalI,
      j: high,
      pivotIdx: finalI,
      pivotVal: pivot,
      highlight: [finalI],
      swapped: [finalI, high],
      invariant: `Partition Invariant Guaranteed: All elements left of index ${finalI} are <= ${pivot}, and all elements right are >= ${pivot}. Complete in O(N) time with O(1) auxiliary space!`,
      activeCodeLine: 8
    });

    setSteps(generated);
  };

  // 2. Floyd's Two-Pointer Runner Step Generator
  const generateRunnerSteps = () => {
    // 6-node list with cycle from node 5 -> node 2
    const nodes = [
      { id: 0, val: 12, addr: '0x100' },
      { id: 1, val: 99, addr: '0x110' },
      { id: 2, val: 37, addr: '0x120' }, // cycle entry
      { id: 3, val: 45, addr: '0x130' },
      { id: 4, val: 88, addr: '0x140' },
      { id: 5, val: 21, addr: '0x150' }  // points back to id 2
    ];

    const generated = [];
    let slow = 0;
    let fast = 0;

    const nextNode = (idx) => {
      if (idx === 5) return 2; // cycle
      return idx + 1;
    };

    generated.push({
      step: 0,
      title: "Initialize Runner Pointers",
      nodes,
      slow: 0,
      fast: 0,
      collided: false,
      cycleFound: false,
      invariant: "Both Slow (1x) and Fast (2x) start at head node (0x100). Congruence theorem guarantees collision inside loop.",
      activeCodeLine: 1
    });

    for (let round = 1; round <= 7; ++round) {
      slow = nextNode(slow);
      fast = nextNode(nextNode(fast));
      const isCollision = slow === fast;

      generated.push({
        step: generated.length,
        title: `Round ${round}: Advance Slow (1x) to Node ${slow}, Fast (2x) to Node ${fast}`,
        nodes,
        slow,
        fast,
        collided: isCollision,
        cycleFound: isCollision,
        invariant: isCollision 
          ? `COLLISION DETECTED at Node ${slow} (${nodes[slow].addr})! Fast caught Slow because relative speed is 1 step/iteration. Distance gap modulo cycle length collapsed to 0.`
          : `Relative distance closing by 1 node per iteration. Slow is at ${nodes[slow].addr}, Fast is at ${nodes[fast].addr}.`,
        activeCodeLine: isCollision ? 7 : 4
      });

      if (isCollision) break;
    }

    setSteps(generated);
  };

  // 3. Pointer Reversal Steps
  const generatePointerReversalSteps = () => {
    const nodes = [
      { id: 0, val: 10, next: 1 },
      { id: 1, val: 20, next: 2 },
      { id: 2, val: 30, next: 3 },
      { id: 3, val: 40, next: null }
    ];

    const generated = [
      {
        step: 0,
        title: "Initialize 3 Pointers",
        nodes: JSON.parse(JSON.stringify(nodes)),
        prev: null,
        curr: 0,
        next: null,
        invariant: "prev = nullptr, curr = head. We will reverse pointers in-place without allocating dynamic memory.",
        activeCodeLine: 1
      },
      {
        step: 1,
        title: "Store next = curr->next (Node 1)",
        nodes: JSON.parse(JSON.stringify(nodes)),
        prev: null,
        curr: 0,
        next: 1,
        invariant: "Crucial Invariant: Saving next pointer reference prevents losing remaining list in memory before overwriting curr->next.",
        activeCodeLine: 3
      },
      {
        step: 2,
        title: "Reverse Pointer: curr->next = prev",
        nodes: [{ id: 0, val: 10, next: null }, nodes[1], nodes[2], nodes[3]],
        prev: null,
        curr: 0,
        next: 1,
        invariant: "Node 0 now points to nullptr (new tail). Invariant preserved with O(1) space.",
        activeCodeLine: 4
      },
      {
        step: 3,
        title: "Advance prev = curr, curr = next",
        nodes: [{ id: 0, val: 10, next: null }, nodes[1], nodes[2], nodes[3]],
        prev: 0,
        curr: 1,
        next: 1,
        invariant: "prev advanced to 0, curr advanced to 1. Invariant ready for iteration 2.",
        activeCodeLine: 5
      }
    ];

    setSteps(generated);
  };

  // 4. 32-Bit CPU Register Bitmask Steps
  const generateBitmaskSteps = () => {
    const str = (customStringInput || 'unique').toLowerCase().replace(/[^a-z]/g, '');
    const generated = [];
    let checker = 0;

    generated.push({
      step: 0,
      title: "Initialize 32-bit CPU Register",
      str,
      charIdx: -1,
      currentChar: '',
      bitVal: -1,
      checker: 0,
      collision: false,
      invariant: "checker = 0 in CPU register eax. 26 lowercase alphabet letters fit directly within 32 bits.",
      activeCodeLine: 1
    });

    for (let idx = 0; idx < str.length; ++idx) {
      const char = str[idx];
      const val = char.charCodeAt(0) - 97; // 'a' = 0
      const mask = 1 << val;
      const isCollision = (checker & mask) !== 0;

      generated.push({
        step: generated.length,
        title: `Inspect '${char}' -> Bit Index ${val}`,
        str,
        charIdx: idx,
        currentChar: char,
        bitVal: val,
        checker,
        collision: isCollision,
        invariant: isCollision
          ? `COLLISION DETECTED: Bit ${val} is already 1 in register! '${char}' is duplicated. Return false in 1 CPU cycle with 0 memory allocations.`
          : `Bit ${val} is currently 0. Shift 1U << ${val} and OR with register to record presence.`,
        activeCodeLine: 4
      });

      checker |= mask;

      if (isCollision) break;
    }

    setSteps(generated);
  };

  const activeStep = steps[currentStepIdx] || steps[0] || {};

  return (
    <div className="glass-panel" style={{ height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* Top Header & Simulation Selector */}
      <div style={{
        padding: '0.75rem 1.25rem',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(56, 189, 248, 0.25))',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Cpu style={{ width: '16px', height: '16px', color: '#38bdf8' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              C++ Algorithmic & Memory Step Simulator
            </h3>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Physical Stack, Heap, Pointer Invariants & CPU Registers
            </span>
          </div>
        </div>

        {/* Paradigm Buttons */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(0,0,0,0.3)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          {[
            { id: 'partition', label: 'Partition Invariant', icon: Layers },
            { id: 'runner', label: "Floyd's Runner", icon: Play },
            { id: 'pointers', label: 'Pointer Reversal', icon: Code2 },
            { id: 'bitmask', label: 'Register Bitmask', icon: Database }
          ].map(p => {
            const Icon = p.icon;
            const isSelected = mode === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setMode(p.id)}
                style={{
                  background: isSelected ? 'linear-gradient(135deg, #6366f1, #38bdf8)' : 'transparent',
                  color: isSelected ? '#fff' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon style={{ width: '12px', height: '12px' }} />
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Control & Custom Input Bar */}
      <div style={{
        padding: '0.6rem 1.25rem',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(255, 255, 255, 0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        flexShrink: 0
      }}>
        {/* Step Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => setCurrentStepIdx(0)}
            disabled={currentStepIdx === 0}
            className="btn-secondary"
            style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem' }}
            title="Reset to Start"
          >
            <RotateCcw style={{ width: '13px', height: '13px' }} />
          </button>
          <button
            onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
            disabled={currentStepIdx === 0}
            className="btn-secondary"
            style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem' }}
            title="Step Back"
          >
            <SkipBack style={{ width: '13px', height: '13px' }} />
          </button>
          <button
            onClick={() => setIsPlaying(prev => !prev)}
            className="btn-primary"
            style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}
          >
            {isPlaying ? <Pause style={{ width: '13px', height: '13px' }} /> : <Play style={{ width: '13px', height: '13px' }} />}
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={() => setCurrentStepIdx(prev => Math.min(steps.length - 1, prev + 1))}
            disabled={currentStepIdx >= steps.length - 1}
            className="btn-secondary"
            style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem' }}
            title="Step Forward"
          >
            <SkipForward style={{ width: '13px', height: '13px' }} />
          </button>

          {/* Speed Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginLeft: '0.4rem' }}>
            {[0.5, 1, 2].map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                style={{
                  background: playbackSpeed === speed ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                  color: playbackSpeed === speed ? '#38bdf8' : 'var(--text-muted)',
                  border: `1px solid ${playbackSpeed === speed ? '#38bdf8' : 'transparent'}`,
                  borderRadius: '4px',
                  padding: '2px 6px',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input Field */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, maxWidth: '380px' }}>
          {mode === 'partition' ? (
            <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>Array:</span>
              <input
                type="text"
                value={customArrayInput}
                onChange={(e) => setCustomArrayInput(e.target.value)}
                placeholder="10, 80, 30, 90, 40, 50, 70"
                style={{
                  flex: 1,
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '0.3rem 0.5rem',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)'
                }}
              />
            </div>
          ) : mode === 'bitmask' ? (
            <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>Word:</span>
              <input
                type="text"
                value={customStringInput}
                onChange={(e) => setCustomStringInput(e.target.value)}
                placeholder="metacognition"
                style={{
                  flex: 1,
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '0.3rem 0.5rem',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)'
                }}
              />
            </div>
          ) : (
            <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>
              Physical memory graph stepping active
            </div>
          )}

          {/* Micro Challenge Toggle */}
          {mode === 'partition' && (
            <button
              onClick={() => setChallengeActive(prev => !prev)}
              style={{
                background: challengeActive ? 'rgba(244, 63, 94, 0.2)' : 'rgba(245, 158, 11, 0.15)',
                color: challengeActive ? '#f43f5e' : '#f59e0b',
                border: `1px solid ${challengeActive ? '#f43f5e' : 'rgba(245, 158, 11, 0.3)'}`,
                borderRadius: '6px',
                padding: '0.3rem 0.6rem',
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                whiteSpace: 'nowrap'
              }}
            >
              <Bug style={{ width: '12px', height: '12px' }} />
              {challengeActive ? "Bug Injected" : "Test Fault"}
            </button>
          )}
        </div>
      </div>

      {/* Invariant Truth Banner */}
      <div style={{
        padding: '0.65rem 1.25rem',
        background: activeStep.collision 
          ? 'rgba(244, 63, 94, 0.15)' 
          : 'linear-gradient(90deg, rgba(99, 102, 241, 0.12), rgba(56, 189, 248, 0.12))',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {activeStep.collision ? (
            <AlertTriangle style={{ width: '16px', height: '16px', color: '#f43f5e', flexShrink: 0 }} />
          ) : (
            <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10b981', flexShrink: 0 }} />
          )}
          <span style={{ fontSize: '0.8rem', color: activeStep.collision ? '#fda4af' : '#e2e8f0', fontWeight: 600 }}>
            {activeStep.invariant || "Stepping through algorithmic execution..."}
          </span>
        </div>
        <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800, whiteSpace: 'nowrap' }}>
          Step {currentStepIdx + 1} / {steps.length}
        </span>
      </div>

      {/* Simulation Stage Body */}
      <div className="custom-scroll" style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        
        {/* =================================================================== */}
        {/* MODE A: PARTITION INVARIANT VISUALIZER                             */}
        {/* =================================================================== */}
        {mode === 'partition' && activeStep.arr && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
              {activeStep.arr.map((val, idx) => {
                const isPivot = idx === activeStep.pivotIdx;
                const isI = idx === activeStep.i;
                const isJ = idx === activeStep.j;
                const isSwapped = activeStep.swapped?.includes(idx);
                const isSmallerPartition = idx <= activeStep.i;

                let border = '1px solid rgba(255, 255, 255, 0.15)';
                let bg = 'rgba(255, 255, 255, 0.04)';
                let textColor = '#fff';

                if (isPivot) {
                  border = '2px solid #38bdf8';
                  bg = 'rgba(56, 189, 248, 0.2)';
                  textColor = '#38bdf8';
                } else if (isSwapped) {
                  border = '2px solid #a855f7';
                  bg = 'rgba(168, 85, 247, 0.25)';
                } else if (isSmallerPartition) {
                  border = '1px solid #10b981';
                  bg = 'rgba(16, 185, 129, 0.12)';
                  textColor = '#10b981';
                }

                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                    {/* Pointer Indicator */}
                    <div style={{ minHeight: '18px', fontSize: '0.68rem', fontWeight: 800 }}>
                      {isI && isJ ? (
                        <span style={{ color: '#f59e0b' }}>i, j</span>
                      ) : isI ? (
                        <span style={{ color: '#10b981' }}>i →</span>
                      ) : isJ ? (
                        <span style={{ color: '#38bdf8' }}>j ↓</span>
                      ) : isPivot ? (
                        <span style={{ color: '#38bdf8' }}>PIVOT</span>
                      ) : null}
                    </div>

                    {/* Array Box */}
                    <div style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '12px',
                      background: bg,
                      border: border,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: textColor,
                      boxShadow: isPivot ? '0 0 15px rgba(56, 189, 248, 0.3)' : 'none',
                      transition: 'all 0.25s ease'
                    }}>
                      {val}
                    </div>

                    {/* Index Label */}
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      [{idx}]
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Invariant Legend */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(16, 185, 129, 0.4)', border: '1px solid #10b981' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Partition &lt;= Pivot [0..i]</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(56, 189, 248, 0.4)', border: '1px solid #38bdf8' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Selected Pivot Element</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(168, 85, 247, 0.4)', border: '1px solid #a855f7' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Active Swap Pair</span>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* MODE B: FLOYD'S RUNNER (CYCLE DETECTION)                          */}
        {/* =================================================================== */}
        {mode === 'runner' && activeStep.nodes && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
              {activeStep.nodes.map((node, idx) => {
                const isSlow = idx === activeStep.slow;
                const isFast = idx === activeStep.fast;
                const isCollision = activeStep.collided && isSlow && isFast;

                return (
                  <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                      
                      {/* Pointer Badge */}
                      <div style={{ minHeight: '18px', fontSize: '0.7rem', fontWeight: 800 }}>
                        {isCollision ? (
                          <span style={{ color: '#f43f5e', background: 'rgba(244, 63, 94, 0.2)', padding: '2px 6px', borderRadius: '4px' }}>COLLISION!</span>
                        ) : isSlow && isFast ? (
                          <span style={{ color: '#a855f7' }}>Slow & Fast</span>
                        ) : isSlow ? (
                          <span style={{ color: '#10b981' }}>Slow (1x)</span>
                        ) : isFast ? (
                          <span style={{ color: '#38bdf8' }}>Fast (2x)</span>
                        ) : null}
                      </div>

                      {/* Node Box */}
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        background: isCollision 
                          ? 'rgba(244, 63, 94, 0.25)' 
                          : isSlow 
                          ? 'rgba(16, 185, 129, 0.2)' 
                          : isFast 
                          ? 'rgba(56, 189, 248, 0.2)' 
                          : 'rgba(255, 255, 255, 0.04)',
                        border: isCollision 
                          ? '2px solid #f43f5e' 
                          : isSlow 
                          ? '2px solid #10b981' 
                          : isFast 
                          ? '2px solid #38bdf8' 
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px',
                        boxShadow: isCollision ? '0 0 20px rgba(244, 63, 94, 0.4)' : 'none'
                      }}>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
                          {node.val}
                        </span>
                        <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {node.addr}
                        </span>
                      </div>

                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        Node {node.id} {idx === 2 ? '(Loop Entry)' : ''}
                      </span>
                    </div>

                    {/* Arrow */}
                    {idx < activeStep.nodes.length - 1 && (
                      <ArrowRight style={{ width: '18px', height: '18px', color: 'rgba(255,255,255,0.2)' }} />
                    )}
                    {idx === activeStep.nodes.length - 1 && (
                      <div style={{ fontSize: '0.72rem', color: '#a855f7', fontWeight: 700, paddingLeft: '0.5rem' }}>
                        ↪ loops to Node 2
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* MODE C: POINTER REVERSAL                                            */}
        {/* =================================================================== */}
        {mode === 'pointers' && activeStep.nodes && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
              {activeStep.nodes.map((node) => {
                const isCurr = activeStep.curr === node.id;
                const isPrev = activeStep.prev === node.id;
                const isNext = activeStep.next === node.id;

                return (
                  <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ minHeight: '18px', fontSize: '0.72rem', fontWeight: 800 }}>
                      {isCurr ? <span style={{ color: '#38bdf8' }}>curr</span> : isPrev ? <span style={{ color: '#10b981' }}>prev</span> : isNext ? <span style={{ color: '#a855f7' }}>next</span> : null}
                    </div>

                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '14px',
                      background: isCurr ? 'rgba(56, 189, 248, 0.2)' : isPrev ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.04)',
                      border: isCurr ? '2px solid #38bdf8' : isPrev ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: '#fff'
                    }}>
                      {node.val}
                    </div>

                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      next: {node.next !== null ? `Node ${node.next}` : 'nullptr'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* MODE D: 32-BIT CPU REGISTER BITMASK (CTCI 1.1)                     */}
        {/* =================================================================== */}
        {mode === 'bitmask' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.4)', borderRadius: '16px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8' }}>
                  General Purpose Register `eax` (32 Bits)
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Value: 0x{activeStep.checker.toString(16).toUpperCase().padStart(8, '0')}
                </span>
              </div>

              {/* 32 Bits Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '6px' }}>
                {Array.from({ length: 32 }).map((_, idx) => {
                  const bitPos = 31 - idx;
                  const isSet = (activeStep.checker & (1 << bitPos)) !== 0;
                  const isCurrentActive = activeStep.bitVal === bitPos;

                  return (
                    <div
                      key={bitPos}
                      style={{
                        padding: '6px 2px',
                        borderRadius: '6px',
                        background: isCurrentActive && activeStep.collision 
                          ? 'rgba(244, 63, 94, 0.4)'
                          : isCurrentActive 
                          ? 'rgba(56, 189, 248, 0.4)' 
                          : isSet 
                          ? 'rgba(16, 185, 129, 0.25)' 
                          : 'rgba(255, 255, 255, 0.04)',
                        border: isCurrentActive 
                          ? '1px solid #38bdf8' 
                          : isSet 
                          ? '1px solid #10b981' 
                          : '1px solid rgba(255, 255, 255, 0.08)',
                        textAlign: 'center',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: isSet ? '#10b981' : 'var(--text-muted)'
                      }}
                      title={`Bit ${bitPos} ('${String.fromCharCode(97 + bitPos)}')`}
                    >
                      <div>{isSet ? '1' : '0'}</div>
                      <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{bitPos}</div>
                    </div>
                  );
                })}
              </div>

              {/* Scanned characters display */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Input Stream:</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {activeStep.str?.split('').map((c, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        background: i === activeStep.charIdx ? (activeStep.collision ? 'rgba(244, 63, 94, 0.3)' : 'rgba(56, 189, 248, 0.3)') : 'rgba(255,255,255,0.05)',
                        border: i === activeStep.charIdx ? (activeStep.collision ? '1px solid #f43f5e' : '1px solid #38bdf8') : '1px solid transparent',
                        color: i === activeStep.charIdx ? '#fff' : 'var(--text-muted)'
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
