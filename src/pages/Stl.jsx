import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Database, ArrowRight, Check, Zap, Cpu } from 'lucide-react';

const STL_CONTAINERS = [
  {
    name: "std::vector",
    type: "Sequence",
    memoryLayout: "Contiguous Heap Buffer",
    access: "O(1)",
    insertEnd: "Amortized O(1)",
    insertMid: "O(N)",
    cacheLocality: "Excellent (Direct SIMD/L1-L3 prefetching)",
    bestFor: "Default go-to container. Unbeatable cache locality due to contiguous elements."
  },
  {
    name: "std::deque",
    type: "Sequence",
    memoryLayout: "Array of Fixed-Size Chunks",
    access: "O(1)",
    insertEnd: "O(1)",
    insertMid: "O(N)",
    cacheLocality: "Good (Segmented chunk buffers)",
    bestFor: "Pushing and popping at both ends without full reallocation of existing chunks."
  },
  {
    name: "std::list",
    type: "Sequence (Doubly Linked)",
    memoryLayout: "Individually Allocated Nodes",
    access: "O(N)",
    insertEnd: "O(1)",
    insertMid: "O(1) (given iterator)",
    cacheLocality: "Terrible (Heavy pointer chasing & heap fragmentation)",
    bestFor: "Guaranteed iterator validity during splices and frequent middle deletions."
  },
  {
    name: "std::unordered_map",
    type: "Unordered Associative",
    memoryLayout: "Hash Table with Chained Buckets",
    access: "N/A",
    insertEnd: "Average O(1), Worst O(N)",
    insertMid: "N/A",
    cacheLocality: "Poor (Pointer-linked bucket nodes)",
    bestFor: "Key-value lookups when ordering is irrelevant. Remember to reserve() to prevent rehashing!"
  },
  {
    name: "std::map",
    type: "Ordered Associative",
    memoryLayout: "Red-Black Tree (Self-balancing BST)",
    access: "N/A",
    insertEnd: "O(log N)",
    insertMid: "O(log N)",
    cacheLocality: "Poor (Node-based tree traversal)",
    bestFor: "Strictly sorted traversal, range queries (lower_bound, upper_bound), and predecessor/successor searches."
  }
];

export default function Stl() {
  const [selectedContainer, setSelectedContainer] = useState(STL_CONTAINERS[0]);

  return (
    <div className="custom-scroll" style={{
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      overscrollBehavior: 'contain',
      padding: '2rem 3rem',
      background: 'var(--bg-primary)'
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '3px 10px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Standard Template Library Mechanics
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem 0' }}>
          STL Containers & Time Complexity Matrix
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '800px', margin: 0, lineHeight: '1.5' }}>
          Understand the physical memory layouts, amortized complexities, and hardware cache trade-offs of the C++ Standard Template Library.
        </p>
      </div>

      {/* Grid of containers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {STL_CONTAINERS.map(c => (
          <button
            key={c.name}
            onClick={() => setSelectedContainer(c)}
            style={{
              padding: '1rem',
              borderRadius: '12px',
              textAlign: 'left',
              background: selectedContainer.name === c.name ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(56, 189, 248, 0.25))' : 'var(--bg-tertiary)',
              border: `1px solid ${selectedContainer.name === c.name ? '#38bdf8' : 'var(--border-subtle)'}`,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              {c.type}
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: selectedContainer.name === c.name ? '#38bdf8' : '#fff' }}>
              {c.name}
            </div>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              {selectedContainer.name}
            </h2>
            <span style={{ fontSize: '0.85rem', color: '#38bdf8' }}>
              Memory Layout: {selectedContainer.memoryLayout}
            </span>
          </div>
          <span className="badge-cyan" style={{ fontSize: '0.78rem', padding: '4px 12px', borderRadius: '12px', fontWeight: 800 }}>
            {selectedContainer.type}
          </span>
        </div>

        {/* Complexity stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Random Access</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981', marginTop: '0.3rem' }}>{selectedContainer.access}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Insert End</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.3rem' }}>{selectedContainer.insertEnd}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Insert Middle</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.3rem' }}>{selectedContainer.insertMid}</div>
          </div>
        </div>

        <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
            Cache Locality & Architectural Recommendation:
          </div>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
            <strong>Locality:</strong> {selectedContainer.cacheLocality}
          </p>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            <strong>Rule of Thumb:</strong> {selectedContainer.bestFor}
          </p>
        </div>
      </div>
    </div>
  );
}
