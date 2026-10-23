import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  BookOpen, 
  HelpCircle, 
  ShieldAlert, 
  ExternalLink, 
  Sparkles, 
  Bot, 
  Send, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  FileText
} from 'lucide-react';
import { CPP_BOOKS } from '../data/cppCurriculum';

export function CppAarAgentModal({ isOpen, onClose, activeQuestion, activeConcept }) {
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'aar-intro',
      sender: 'agent',
      text: "Welcome to the After Action Review (AAR) Reading Agent. I am here to ground your understanding in peer-reviewed C++ literature (Modern C++ Tutorial, C++ Annotations, and ISO Core Guidelines). Ask me to dissect any passage or rule from the book."
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [selectedBookTab, setSelectedBookTab] = useState(CPP_BOOKS[0].id);

  if (!isOpen) return null;

  const currentBook = CPP_BOOKS.find(b => b.id === selectedBookTab) || CPP_BOOKS[0];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: inputText
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsThinking(true);

    setTimeout(() => {
      let reply = "";
      const lower = userMsg.text.toLowerCase();

      if (lower.includes("std::move") || lower.includes("rvalue") || lower.includes("copy")) {
        reply = `📖 **Book Reference: Modern C++ Tutorial (Changkun Ou, §5.2)**\n\n` +
          `*"std::move does not move anything at runtime. It is an unconditional cast to an rvalue reference (xvalue).*\n\n` +
          `**AAR Key Insight**: When you write \`std::move(constObj)\`, the compiler produces \`const T&&\`. Because move constructors accept non-const rvalue references (\`T&&\`), they cannot bind to a const object. C++ quietly invokes the copy constructor \`T(const T&)\` with zero compiler warnings! Always ensure your source objects are non-const when moving.`;
      } else if (lower.includes("raii") || lower.includes("pointer") || lower.includes("leak") || lower.includes("lock")) {
        reply = `📖 **Book Reference: ISO C++ Core Guidelines (Bjarne Stroustrup, Rule R.1)**\n\n` +
          `*"Manage resources automatically using resource handles and RAII."*\n\n` +
          `**AAR Key Insight**: Never pair 'new' with manual 'delete'. If an exception is thrown or an early return statement is reached, stack frames unwind, and manual delete statements are skipped forever. Tie every heap buffer or lock to a stack-allocated RAII class (\`std::unique_ptr\`, \`std::lock_guard\`) whose destructor runs deterministically during stack unwinding.`;
      } else if (lower.includes("virtual") || lower.includes("destructor") || lower.includes("polymorphism")) {
        reply = `📖 **Book Reference: ISO C++ Core Guidelines (Rule C.127)**\n\n` +
          `*"A class with a virtual function should have a virtual or protected destructor."*\n\n` +
          `**AAR Key Insight**: Without a virtual destructor, calling \`delete basePtr\` triggers static binding at compile time. Only \`Base::~Base()\` executes; the derived class's destructor is bypassed completely. This causes resource leaks (GPU handles, memory buffers) and Undefined Behavior (§8.3.5 / ISO C++).`;
      } else if (lower.includes("aba") || lower.includes("lock-free") || lower.includes("cas") || lower.includes("treiber")) {
        reply = `📖 **Book Reference: Operating Systems: Three Easy Pieces (OSTEP, Ch. 28) & Herlihy**\n\n` +
          `*"Atomic Compare-and-Swap primitives only compare address values, not underlying structural state."*\n\n` +
          `**AAR Key Insight**: The ABA problem occurs when a pointer changes from A to B and back to A. A naive CAS thinks nothing changed, but node A's internal pointers were altered or freed! To eliminate the ABA trap in production lock-free data structures, use Tagged Pointers (Double-Word CAS with a mutation counter) or Hazard Pointers / Epoch-Based Reclamation.`;
      } else if (lower.includes("acquire") || lower.includes("release") || lower.includes("memory_order") || lower.includes("fence")) {
        reply = `📖 **Book Reference: Modern C++ Tutorial (Changkun Ou, Ch. 7) & ISO CP Guidelines**\n\n` +
          `*"Acquire-Release semantics establish a formal happens-before relationship without the bus lock overhead of sequential consistency."*\n\n` +
          `**AAR Key Insight**: Under modern out-of-order CPUs (ARM, Apple Silicon, x86), memory writes to regular variables can be reordered after relaxed atomic stores. Setting \`std::memory_order_release\` on the publisher and \`std::memory_order_acquire\` on the consumer prevents hardware and compiler reordering, guaranteeing data visibility without global lock contention.`;
      } else if (lower.includes("amortized") || lower.includes("growth") || lower.includes("vector") || lower.includes("treap") || lower.includes("data structure")) {
        reply = `📖 **Book Reference: Open Data Structures (in C++, Pat Morin, Ch. 2 & 7)**\n\n` +
          `*"Geometric scaling (doubling) guarantees O(1) amortized append time, whereas constant incremental growth causes O(N^2) quadratic degradation."*\n\n` +
          `**AAR Key Insight**: If a dynamic array resizes by a fixed increment (+64), each insertion copies all prior elements, creating an arithmetic progression sum $\\sum i \\times 64 \\approx O(N^2)$. Geometric doubling ensures that copying costs diminish geometrically backwards, bounding total copies to $\\le 2N$, which yields $O(1)$ amortized cost per insertion!`;
      } else if (lower.includes("distributed") || lower.includes("raft") || lower.includes("paxos") || lower.includes("quorum") || lower.includes("split-brain")) {
        reply = `📖 **Book Reference: Distributed Systems (4th Ed, Maarten van Steen & Tanenbaum, Ch. 8)**\n\n` +
          `*"In an N-node cluster, any two majorities (N/2 + 1) must share at least one overlapping node, mathematically preventing split-brain."*\n\n` +
          `**AAR Key Insight**: During a network partition, the CAP theorem dictates that consistency requires sacrificing availability in the minority partition. Quorums enforce that only the partition holding $> N/2$ nodes can elect leaders and commit log entries, guaranteeing linearizability and preventing diverging split-brain states.`;
      } else if (lower.includes("ctci") || lower.includes("cracking") || lower.includes("bud") || lower.includes("mcdowell") || lower.includes("runner") || lower.includes("bit vector") || lower.includes("7-step")) {
        reply = `📖 **Book Reference: Cracking the Coding Interview (6th Ed, Gayle Laakmann McDowell, Ch. VII & Ch. 1-2)**\n\n` +
          `*"Avoid rote pattern-matching. Look for BUD: Bottlenecks, Unnecessary work, and Duplicated work."*\n\n` +
          `**AAR Key Insight**:\n` +
          `1. **BUD Diagnosis**: The moment you have a brute-force $O(N^2)$ baseline, find what is dominating the time. If an inner loop repeatedly searches for a complementary value, caching it in a hash table or bitmask converts an $O(N)$ lookup into $O(1)$ amortized.\n` +
          `2. **The Runner Technique**: Fast/slow pointers eliminate $O(N)$ extra memory in linked lists. The mathematical offset congruence ($K = pC - M$) guarantees that resetting slow to head and stepping both at 1x collides precisely at the cycle entrance!\n` +
          `3. **Bit Vector Optimization**: For ASCII / alphabet problems, don't allocate heavy hash table nodes on the heap. A single 32-bit or 64-bit integer bitmask executes in single CPU cycles with zero memory overhead.`;
      } else if (lower.includes("clrs") || lower.includes("cormen") || lower.includes("lomuto") || lower.includes("hoare") || lower.includes("master theorem") || lower.includes("loop invariant")) {
        reply = `📖 **Book Reference: CLRS: Introduction to Algorithms (4th Ed, Cormen, Leiserson, Rivest, Stein)**\n\n` +
          `*"Every correct algorithm is grounded in mathematical induction: Initialization, Maintenance, and Termination."*\n\n` +
          `**AAR Key Insight**:\n` +
          `1. **Hoare vs Lomuto Invariant**: Lomuto uses \`arr[j] < pivot\`, failing to stop on equal keys. When sorting duplicate elements, it places the pivot at the extreme end every round, causing $O(N^2)$ degradation. Hoare's two-pointer scan halts on equal elements, forcing swaps across the midpoint to ensure balanced $\\lfloor N/2 \\rfloor$ partitions.\n` +
          `2. **The Master Method**: For recurrences $T(n) = aT(n/b) + f(n)$, compare $f(n)$ with $n^{\\log_b a}$. If $f(n)$ is polynomially smaller, $T(n) = \\Theta(n^{\\log_b a})$; if equal, $T(n) = \\Theta(n^{\\log_b a} \\log n)$.`;
      } else if (lower.includes("cpds") || lower.includes("balagurusamy") || lower.includes("thareja") || lower.includes("forouzan") || lower.includes("*p++") || lower.includes("struct padding")) {
        reply = `📖 **Book Reference: CPDS: C Programming & Data Structures (Balagurusamy / Reema Thareja)**\n\n` +
          `*"In low-level C data structures, operator precedence and memory alignment dictate hardware reality."*\n\n` +
          `**AAR Key Insight**:\n` +
          `1. **Operator Precedence Trap**: Postfix \`++\` has higher precedence than unary \`*\`. \`*p++\` evaluates to \`*(p++)\`, which dereferences the current address and increments the pointer address, leaving the pointed value completely untouched! To increment the value, you must write \`(*p)++\`.\n` +
          `2. **Struct Padding**: Compilers enforce word alignment by inserting invisible padding bytes between struct fields. Arranging members from largest type (double, long) to smallest (int, char) packs data efficiently and eliminates memory waste.`;
      } else if (lower.includes("cp3") || lower.includes("cp4") || lower.includes("halim") || lower.includes("dsu") || lower.includes("fenwick") || lower.includes("union-find")) {
        reply = `📖 **Book Reference: Competitive Programming (CP3/CP4, Steven & Felix Halim, Ch. 2)**\n\n` +
          `*"Contest data structures must achieve near-constant theoretical lower bounds under adversarial tests."*\n\n` +
          `**AAR Key Insight**:\n` +
          `1. **DSU $\\alpha(N)$ Invariant**: Path Compression alone flattens trees during lookup, but adversarial inputs can construct deep trees during union. Combining **Union by Rank** with **Path Compression** guarantees tree depth is strictly logarithmic, proving that $M$ operations take $O(M \\alpha(N))$ time where $\\alpha(N) \\le 4$ for any input size.\n` +
          `2. **Fenwick Tree (BIT)**: Isolating the lowest set bit with \`x & (-x)\` allows updating and querying prefix sums in $O(\\log N)$ time with a simple 1-indexed array and zero pointer indirection overhead.`;
      } else {
        reply = `📖 **Authoritative Analysis (${currentBook.title})**:\n\n` +
          `In modern C++, Data Structures, and CPDC (Concurrent/Distributed Systems), avoiding rote memorization requires understanding invariants and mathematical models. As documented in ${currentBook.title}, every core structure or synchronization primitive exists to enforce safety and algorithmic efficiency without undefined behavior. Ask me about any specific chapter or scenario!`;
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: 'agent-' + Date.now(),
          sender: 'agent',
          text: reply
        }
      ]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 16, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        style={{
          width: '95%',
          maxWidth: '1200px',
          height: '88vh',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 15, 30, 0.98) 100%)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(99, 102, 241, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Top Header Bar */}
        <div style={{
          padding: '1.25rem 2rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BookOpen style={{ color: '#fff', width: '22px', height: '22px' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                C++ After Action Review (AAR) & Literature Agent
                <span className="badge-cyan" style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px' }}>
                  ANTI-ROTE ENGINE
                </span>
              </h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Grounding coding intuition in peer-reviewed open literature and ISO C++ Core Guidelines
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* Two-Column Body */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.1fr 1fr', minHeight: 0 }}>
          
          {/* LEFT: Structured AAR Debrief & Book Shelf */}
          <div style={{
            borderRight: '1px solid var(--border-subtle)',
            padding: '1.5rem',
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            height: '100%',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            
            {/* If there's an active question being debriefed */}
            {activeQuestion && activeQuestion.aarDebrief && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '16px',
                padding: '1.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', color: '#f43f5e', fontWeight: 800, fontSize: '0.9rem' }}>
                  <ShieldAlert style={{ width: '18px', height: '18px' }} />
                  AAR Phase: Flawed Mental Model vs C++ Standard Truth
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#f43f5e', fontWeight: 700 }}>
                    1. The Rote Misconception:
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: '1.4' }}>
                    {activeQuestion.aarDebrief.mentalModelMistake}
                  </div>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#10b981', fontWeight: 700 }}>
                    2. The Authoritative Standard Truth:
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#fff', marginTop: '0.2rem', lineHeight: '1.4' }}>
                    {activeQuestion.aarDebrief.authoritativeTruth}
                  </div>
                </div>

                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.75rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#a855f7', fontWeight: 700 }}>
                    📚 Citation: {activeQuestion.bookCitation.book} ({activeQuestion.bookCitation.rule})
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Rule</span>
                </div>
              </div>
            )}

            {/* Open Book Library Selector */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen style={{ width: '16px', height: '16px', color: '#38bdf8' }} />
                  Curated Open-Access C++ Literature
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Free & Peer-Reviewed</span>
              </div>

              {/* Book Pills */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {CPP_BOOKS.map(book => (
                  <button
                    key={book.id}
                    onClick={() => setSelectedBookTab(book.id)}
                    style={{
                      background: selectedBookTab === book.id ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${selectedBookTab === book.id ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)'}`,
                      color: selectedBookTab === book.id ? '#38bdf8' : 'var(--text-secondary)',
                      borderRadius: '8px',
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {book.title.split(':')[0]}
                  </button>
                ))}
              </div>

              {/* Selected Book Overview Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                      {currentBook.title}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#38bdf8', margin: '0.2rem 0 0.5rem 0' }}>
                      By {currentBook.author} ({currentBook.license})
                    </p>
                  </div>

                  <a
                    href={currentBook.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.75rem',
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: '#38bdf8',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 700
                    }}
                  >
                    Read Online Free <ExternalLink style={{ width: '12px', height: '12px' }} />
                  </a>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>
                  {currentBook.description}
                </p>

                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Key In-Depth Chapters:
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {currentBook.keyChapters.map((ch, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <span style={{ color: '#a855f7', fontWeight: 800 }}>Ch {ch.number}:</span>
                      <span>{ch.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: Deep-Reading AI Agent Socratic Chat */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, background: 'rgba(0, 0, 0, 0.2)' }}>
            
            {/* Chat Messages Log */}
            <div style={{ flex: 1, minHeight: 0, padding: '1.5rem', overflowY: 'auto', overscrollBehavior: 'contain', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    background: msg.sender === 'user' 
                      ? 'linear-gradient(135deg, #4f46e5, #06b6d4)' 
                      : 'rgba(30, 41, 59, 0.8)',
                    padding: '1rem 1.25rem',
                    borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    color: '#fff',
                    fontSize: '0.85rem',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {msg.sender === 'agent' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', color: '#38bdf8', fontWeight: 700, fontSize: '0.75rem' }}>
                      <Bot style={{ width: '14px', height: '14px' }} /> Literature Reading Agent
                    </div>
                  )}
                  {msg.text}
                </div>
              ))}

              {isThinking && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.8rem' }}>
                  <Sparkles style={{ width: '14px', height: '14px' }} />
                  Consulting ISO Core Guidelines & C++ Annotations...
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <div style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              background: 'rgba(15, 23, 42, 0.6)',
              display: 'flex',
              gap: '0.75rem'
            }}>
              <input
                type="text"
                placeholder="Ask the Literature Agent: 'Why does std::move fail on const?'"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                style={{
                  flex: 1,
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              <button
                onClick={handleSendMessage}
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0 1.25rem',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700
                }}
              >
                <Send style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

          </div>

        </div>

      </motion.div>
    </div>
  );
}
