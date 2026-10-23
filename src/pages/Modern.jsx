import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Code2, CheckCircle2, ShieldAlert, BookOpen, Layers } from 'lucide-react';

const MODERN_FEATURES = [
  {
    standard: "C++20",
    name: "Concepts & Constraints",
    summary: "Replaces unreadable SFINAE template boilerplate with expressive compile-time predicates.",
    code: `// C++20: Clean compile-time constraints
template <typename T>
requires std::integral<T>
T gcd(T a, T b) {
  while (b != 0) {
    T t = b;
    b = a % b;
    a = t;
  }
  return a;
}`
  },
  {
    standard: "C++20",
    name: "Ranges & Pipeline Views",
    summary: "Composable, lazy evaluation of algorithms without intermediate temporary allocations.",
    code: `// C++20: Pipeable composable ranges
#include <vector>
#include <ranges>
#include <iostream>

void processEvenSquares(const std::vector<int>& nums) {
  auto result = nums 
    | std::views::filter([](int n) { return n % 2 == 0; })
    | std::views::transform([](int n) { return n * n; })
    | std::views::take(3);

  for (int v : result) std::cout << v << " ";
}`
  },
  {
    standard: "C++17/20",
    name: "std::unique_ptr & Zero-Cost RAII",
    summary: "Guaranteed single ownership with zero runtime memory overhead compared to raw pointers.",
    code: `// Zero-overhead RAII ownership
#include <memory>

struct SocketHandle {
  int fd;
  ~SocketHandle() { /* Closes file descriptor automatically */ }
};

void runServer() {
  // Heap allocation cleanly freed on scope exit or exception unwinding
  auto sock = std::make_unique<SocketHandle>();
}`
  },
  {
    standard: "C++11/14",
    name: "Move Semantics & Rvalue References",
    summary: "Resource pilfering to eliminate expensive deep copies on temporary expressions.",
    code: `// Pilfering buffer ownership via rvalue static cast
#include <string>
#include <vector>

std::vector<std::string> registry;
void registerUser(std::string name) {
  // Transfers the inner char* buffer without copying a single character!
  registry.push_back(std::move(name));
}`
  }
];

export default function Modern() {
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
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '3px 10px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          ISO C++ Evolution & Best Practices
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem 0' }}>
          Modern C++ (C++11 / 17 / 20 / 23)
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '800px', margin: 0, lineHeight: '1.5' }}>
          Explore key language milestones that turned C++ into a safer, more expressive, and performant systems language.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {MODERN_FEATURES.map(feat => (
          <div key={feat.name} className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="badge-purple" style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '8px', fontWeight: 800 }}>
                {feat.standard}
              </span>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem 0' }}>
              {feat.name}
            </h3>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              {feat.summary}
            </p>

            <pre style={{
              margin: 'auto 0 0 0',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '1rem',
              fontSize: '0.78rem',
              fontFamily: 'monospace',
              color: '#38bdf8',
              overflowX: 'auto',
              lineHeight: '1.5'
            }}>
              {feat.code}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
