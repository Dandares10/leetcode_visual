---
name: emil-kowalski-motion
description: Masterclass skill for implementing world-class UI animations, micro-interactions, layout transitions, and spring physics in React and Framer Motion based on Emil Kowalski's animation principles (animations.dev, Sonner, Vaul).
---

# Emil Kowalski Motion & Micro-Interactions Guide

Based on Emil Kowalski's craftsmanship (*Animations on the Web*, *Sonner*, *Vaul*), motion is never mere decoration. It is an intuitive communication layer that provides spatial orientation, tactile responsiveness, and structural meaning to user interfaces.

---

## 1. Core Philosophy: The Golden Rules

1. **Springs Over Duration Curves**:
   - Never use static `ease-in-out` with fixed durations for interactive elements.
   - Fixed durations cannot be interrupted naturally: if a user clicks mid-transition, easing curves abruptly snap or reverse at unnatural speeds.
   - Springs inherently preserve momentum, velocity, and state, allowing natural interruption.
2. **Hardware Acceleration (Composite Only)**:
   - Animate strictly **`transform`** (`x`, `y`, `scale`, `rotate`) and **`opacity`**.
   - **Never animate `width`, `height`, `top`, `left`, `margin`, or `padding` directly** because they force browser layout recalculation and paint reflows. Use Framer Motion's `layout` prop instead.
3. **Subtle & Tactile**:
   - Micro-interactions should feel physical, like a mechanical keyboard switch or tactile click.
   - Scale variations should be minute (`scale: 0.97` or `0.98` on tap, `1.01` or `1.02` on hover). Exaggerated scaling looks amateurish.
4. **Spatial Continuity**:
   - Use `layoutId` so active states, highlights, and morphing badges transition continuously across items rather than blinking in and out.

---

## 2. Tested Spring Archetypes & Presets

Export and reuse these standardized spring presets across your application:

```javascript
export const SPRINGS = {
  // 1. Snappy: Buttons, tabs, switches, toggles, badges (instant, zero sluggishness)
  snappy: {
    type: "spring",
    stiffness: 400,
    damping: 30,
    mass: 0.8
  },

  // 2. Smooth: Modals, dialogs, drawers, expanding cards
  smooth: {
    type: "spring",
    stiffness: 300,
    damping: 30
  },

  // 3. Gentle: Floating orbs, backdrop fades, ambient lighting
  gentle: {
    type: "spring",
    stiffness: 120,
    damping: 20
  },

  // 4. Bouncy: Celebratory badges, success checkmarks, error shakes
  bouncy: {
    type: "spring",
    stiffness: 400,
    damping: 15
  }
};
```

---

## 3. Essential Patterns & Implementations

### Pattern A: The Sliding Active Tab Pill (`layoutId`)
The hallmark Emil Kowalski navigation component. Instead of rendering individual active backgrounds that abruptly appear, a single shared pill smoothly glides beneath the active tab:

```jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function SlidingTabs({ tabs, activeTab, onChange }) {
  return (
    <div style={{
      display: 'inline-flex',
      background: 'rgba(255, 255, 255, 0.05)',
      padding: '4px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              position: 'relative',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 600,
              color: isActive ? '#ffffff' : '#94a3b8',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              zIndex: 1,
              transition: 'color 0.15s ease'
            }}
          >
            {/* The sliding pill */}
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
                  borderRadius: '8px',
                  zIndex: -1,
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
                }}
              />
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
```

---

### Pattern B: Tactile Interactive Button
A button that feels real under mouse click and finger press:

```jsx
import { motion } from 'framer-motion';

export function TactileButton({ children, onClick, variant = 'primary' }) {
  return (
    <motion.button
      whileHover={{ y: -1, scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 450, damping: 25 }}
      onClick={onClick}
      style={{
        padding: '10px 20px',
        borderRadius: '10px',
        fontWeight: 700,
        fontSize: '14px',
        cursor: 'pointer',
        border: 'none',
        background: variant === 'primary' 
          ? 'linear-gradient(135deg, #6366f1, #38bdf8)' 
          : 'rgba(255, 255, 255, 0.08)',
        color: '#ffffff',
        boxShadow: variant === 'primary' 
          ? '0 4px 14px rgba(99, 102, 241, 0.3)' 
          : 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      {children}
    </motion.button>
  );
}
```

---

### Pattern C: Morphing Card Expansion without Layout Shift
Expanding a card or container without text distortion by applying `layout="position"` to text children:

```jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ExpandableCard({ title, details }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      onClick={() => setIsOpen(!isOpen)}
      style={{
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '20px',
        cursor: 'pointer',
        overflow: 'hidden'
      }}
    >
      <motion.h3 layout="position" style={{ margin: 0, color: '#fff', fontSize: '18px' }}>
        {title}
      </motion.h3>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            style={{ marginTop: '12px', color: '#94a3b8', lineHeight: '1.6' }}
          >
            {details}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

---

### Pattern D: Orchestrated Staggered List
Staggering list items so content enters in a coherent wave rather than jarring pop-ins:

```jsx
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 28
    }
  }
};

export function StaggeredList({ items }) {
  return (
    <motion.div variants={listVariants} initial="hidden" animate="visible">
      {items.map(item => (
        <motion.div key={item.id} variants={itemVariants}>
          {item.name}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

---

## 4. Anti-Patterns (What NOT to do)

| Bad Practice | Why It Fails | Emil Kowalski Alternative |
|---|---|---|
| `transition: all 0.5s ease-in-out` | Snaps or accelerates abruptly if interrupted. | `type: "spring", stiffness: 400, damping: 30` |
| Animating `width` / `height` directly | Triggers expensive browser reflow and drops below 60fps. | Use `layout` or `scaleX` / `scaleY` |
| Overly high bounce / wobble (`damping: 5`) | Feels childish and makes reading difficult. | Keep `damping: 25-35` for controlled settling. |
| Neglecting `layout="position"` on text | Expanding parent stretches and blurs typography. | Attach `layout="position"` to inner text headers. |
| Forgetting `mode="popLayout"` or `mode="wait"` | Exiting and entering elements collide in the layout. | Use `<AnimatePresence mode="popLayout">` for list deletions. |

---

## 5. Reduced Motion Accessibility

Always check and honor user system preferences:

```jsx
import { useReducedMotion } from 'framer-motion';

export function AccessibleComponent() {
  const shouldReduceMotion = useReducedMotion();

  const transition = shouldReduceMotion
    ? { duration: 0.01 }
    : { type: "spring", stiffness: 350, damping: 30 };

  return <motion.div animate={{ opacity: 1, y: 0 }} transition={transition} />;
}
```
