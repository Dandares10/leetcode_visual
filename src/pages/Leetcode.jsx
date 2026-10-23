import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, GitCompare, Sparkles, CheckCircle2, XCircle, ArrowRight, BookOpen, Layers } from 'lucide-react';

const CTCI_LEETCODE_CHALLENGES = [
  {
    id: "two-sum-bud",
    title: "1. Two Sum: Eliminating Duplicated Lookups",
    ctciRef: "CTCI Chapter VII: Optimize & Solve Technique #1 (BUD)",
    problem: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    budDiagnosis: {
      bottleneck: "The nested O(N^2) loop scanning every pair of elements.",
      unnecessary: "Calculating (nums[i] + nums[j]) for pairs whose sum is already known to be irrelevant.",
      duplicated: "Re-scanning the same array numbers across every outer iteration instead of remembering numbers already inspected."
    },
    bruteCode: `// ❌ BRUTE FORCE: O(N^2) Time, O(1) Space
bool hasTwoSum(const std::vector<int>& nums, int target) {
  for (size_t i = 0; i < nums.size(); ++i) {
    for (size_t j = i + 1; j < nums.size(); ++j) {
      if (nums[i] + nums[j] == target) return true; // Duplicated work!
    }
  }
  return false;
}`,
    optimizedCode: `// ✅ CTCI BUD OPTIMIZATION: O(N) Time, O(N) Space
bool hasTwoSum(const std::vector<int>& nums, int target) {
  std::unordered_set<int> seen;
  seen.reserve(nums.size()); // Pre-allocate buckets to eliminate rehashing!
  for (int num : nums) {
    int complement = target - num;
    if (seen.find(complement) != seen.end()) return true; // O(1) lookup
    seen.insert(num);
  }
  return false;
}`
  },

  {
    id: "runner-cycle",
    title: "2. Linked List Loop Detection (Runner Technique)",
    ctciRef: "CTCI Chapter 2: Linked Lists — Problem 2.8",
    problem: "Given a linked list which may contain a loop, implement an algorithm that returns the node at the beginning of the loop.",
    budDiagnosis: {
      bottleneck: "Storing every visited pointer in a hash table takes O(N) auxiliary heap memory.",
      unnecessary: "Allocating dynamically sized hash nodes when pointer speeds can encode relative positions.",
      duplicated: "Using two pointers moving at 1 step/turn and 2 steps/turn (The Runner Technique) detects collisions in O(N) time with O(1) space."
    },
    bruteCode: `// ❌ HASH SET APPROACH: O(N) Time, O(N) Heap Space
ListNode* detectCycle(ListNode* head) {
  std::unordered_set<ListNode*> visited;
  while (head) {
    if (visited.count(head)) return head;
    visited.insert(head);
    head = head->next;
  }
  return nullptr;
}`,
    optimizedCode: `// ✅ RUNNER TECHNIQUE: O(N) Time, O(1) Space (Floyd's Cycle Finding)
ListNode* detectCycle(ListNode* head) {
  if (!head || !head->next) return nullptr;
  ListNode *slow = head, *fast = head;
  while (fast && fast->next) {
    slow = slow->next;
    fast = fast->next->next;
    if (slow == fast) break; // Collision point!
  }
  if (!fast || !fast->next) return nullptr; // No loop
  
  // Mathematical Invariant: Head and Collision are congruent mod C
  slow = head;
  while (slow != fast) {
    slow = slow->next;
    fast = fast->next;
  }
  return slow; // Exact entrance to the cycle!
}`
  },

  {
    id: "bit-vector-unique",
    title: "3. Is Unique: Single-Register Bit Vector",
    ctciRef: "CTCI Chapter 1: Arrays & Strings — Problem 1.1",
    problem: "Determine if a string has all unique lowercase ASCII characters without allocating external data structures.",
    budDiagnosis: {
      bottleneck: "Instantiating a std::unordered_set incurs memory allocator lock overhead, hashing function execution, and cache misses.",
      unnecessary: "A 26-character lowercase alphabet fits entirely within the 32 bits of a single CPU integer register.",
      duplicated: "Bitwise AND checks presence and bitwise OR records presence in a single hardware cycle."
    },
    bruteCode: `// ❌ HEAVY DATA STRUCTURE: O(N) Time, O(N) Heap Space
bool isUnique(const std::string& str) {
  std::unordered_set<char> seen;
  for (char c : str) {
    if (seen.count(c)) return false;
    seen.insert(c); // Heap allocations & pointer dereferencing!
  }
  return true;
}`,
    optimizedCode: `// ✅ 32-BIT INTEGER BIT VECTOR: O(N) Time, O(1) Register Space
bool isUnique(const std::string& str) {
  int checker = 0; // 32-bit register holds 26 bits
  for (char c : str) {
    int val = c - 'a';
    if ((checker & (1 << val)) > 0) return false; // Single-cycle check!
    checker |= (1 << val); // Single-cycle toggle!
  }
  return true;
}`
  }
];

export default function Leetcode() {
  const [activeChallengeId, setActiveChallengeId] = useState(CTCI_LEETCODE_CHALLENGES[0].id);
  const activeChallenge = CTCI_LEETCODE_CHALLENGES.find(c => c.id === activeChallengeId);

  return (
    <div className="custom-scroll" style={{
      flex: 1,
      minHeight: 0,
      height: '100%',
      overflowY: 'auto',
      overscrollBehavior: 'contain',
      padding: '2rem 3rem',
      background: 'var(--bg-primary)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '3px 10px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Gayle McDowell's Problem-Solving Methodology
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem 0' }}>
          LeetCode & CTCI BUD Optimization
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '800px', margin: 0, lineHeight: '1.5' }}>
          Master technical interviews by diagnosing algorithmic friction instead of memorizing code snippets. Understand how Bottlenecks (B), Unnecessary work (U), and Duplicated work (D) transform quadratic algorithms into optimal linear time.
        </p>
      </div>

      {/* Challenge Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        {CTCI_LEETCODE_CHALLENGES.map(ch => (
          <button
            key={ch.id}
            onClick={() => setActiveChallengeId(ch.id)}
            style={{
              background: activeChallengeId === ch.id ? 'linear-gradient(135deg, #6366f1, #38bdf8)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${activeChallengeId === ch.id ? '#38bdf8' : 'var(--border-subtle)'}`,
              color: activeChallengeId === ch.id ? '#fff' : 'var(--text-secondary)',
              borderRadius: '10px',
              padding: '0.6rem 1.2rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {ch.title.split(':')[0]}
          </button>
        ))}
      </div>

      {/* Main Challenge Analysis Card */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 800, textTransform: 'uppercase' }}>
              {activeChallenge.ctciRef}
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0.3rem 0 0 0' }}>
              {activeChallenge.title}
            </h2>
          </div>
        </div>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.6', marginBottom: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <strong>Problem Formulation:</strong> {activeChallenge.problem}
        </p>

        {/* BUD Diagnostic Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
          <div style={{ background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.25)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ color: '#f43f5e', fontWeight: 800, fontSize: '0.82rem', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              🔴 B: Bottleneck
            </div>
            <p style={{ fontSize: '0.82rem', color: '#fecdd3', margin: 0, lineHeight: '1.4' }}>
              {activeChallenge.budDiagnosis.bottleneck}
            </p>
          </div>

          <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: '0.82rem', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              🟡 U: Unnecessary Work
            </div>
            <p style={{ fontSize: '0.82rem', color: '#fde68a', margin: 0, lineHeight: '1.4' }}>
              {activeChallenge.budDiagnosis.unnecessary}
            </p>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ color: '#10b981', fontWeight: 800, fontSize: '0.82rem', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              🟢 D: Duplicated Work
            </div>
            <p style={{ fontSize: '0.82rem', color: '#a7f3d0', margin: 0, lineHeight: '1.4' }}>
              {activeChallenge.budDiagnosis.duplicated}
            </p>
          </div>
        </div>

        {/* Code Comparison Diffs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f43f5e', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              <XCircle style={{ width: '16px', height: '16px' }} />
              Brute-Force Rote Baseline
            </div>
            <pre style={{ margin: 0, fontSize: '0.8rem', color: '#ffb4b4', fontFamily: 'monospace', overflowX: 'auto', lineHeight: '1.5' }}>
              {activeChallenge.bruteCode}
            </pre>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              <CheckCircle2 style={{ width: '16px', height: '16px' }} />
              CTCI BUD Optimal Solution
            </div>
            <pre style={{ margin: 0, fontSize: '0.8rem', color: '#bbf7d0', fontFamily: 'monospace', overflowX: 'auto', lineHeight: '1.5' }}>
              {activeChallenge.optimizedCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
