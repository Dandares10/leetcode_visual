const lancedb = require('@lancedb/lancedb');
const { pipeline } = require('@xenova/transformers');
const path = require('path');
const fs = require('fs');

let db;
let table;
let extractor;

// Pre-seed comprehensive metacognitive architectural patterns for RAG
const initialPatterns = [
  {
    title: "React Race Conditions in useEffect",
    text: "When fetching data in useEffect based on props, rapid changes can cause earlier requests to resolve after newer ones. Use AbortController to cancel stale requests.",
    category: "Architecture"
  },
  {
    title: "Secure Auth Token Storage",
    text: "Do not store JWT access tokens in LocalStorage due to XSS vulnerability. Store access tokens in memory and refresh tokens in HttpOnly, SameSite=Strict cookies.",
    category: "Security"
  },
  {
    title: "Parallel Async Execution",
    text: "Sequential awaits cause waterfall latency. Use Promise.allSettled to execute independent asynchronous calls concurrently without failing the entire batch on a single error.",
    category: "Performance"
  },
  {
    title: "Detached DOM and Event Listener Memory Leaks",
    text: "Uncleaned event listeners on global objects (window, document) close over DOM elements, keeping detached DOM trees alive in the V8 heap. Use AbortController signal or matching removeEventListener references on component unmount.",
    category: "Memory Hygiene"
  },
  {
    title: "GraphQL N+1 Query Problem Mitigation",
    text: "Field resolvers executing independent database queries create the N+1 problem. Use DataLoader to batch IDs across an event loop microtask tick into a single query and cache results per-request.",
    category: "System Design"
  },
  {
    title: "CTCI BUD Bottleneck Diagnosis (Gayle McDowell)",
    text: "To eliminate O(N^2) brute force, diagnose BUD: 1. Bottlenecks (the single step dominating runtime complexity), 2. Unnecessary work (operations computed that never impact the final answer), 3. Duplicated work (re-computing states instead of memoizing or indexing in a hash table or bitmask).",
    category: "Interview Prep (CTCI)"
  },
  {
    title: "CTCI Runner Technique & Loop Detection",
    text: "Maintaining two pointers moving at 1 step/turn and 2 steps/turn detects cycles in O(N) time with O(1) space. When slow and fast collide inside a cycle of length C at distance M, resetting slow to head and stepping both at 1x collides precisely at the cycle entrance because K = pC - M = (p-1)C + (C - M).",
    category: "Interview Prep (CTCI)"
  },
  {
    title: "CTCI Single-Register Bit Vector vs Hash Set",
    text: "For bounded alphabets (e.g. 26 lowercase English letters), avoid heap-allocated hash tables. A single 32-bit integer register enables single-cycle bitwise checks ((checker & (1 << val)) > 0) and toggles (checker |= (1 << val)) with zero allocation overhead.",
    category: "Interview Prep (CTCI)"
  },
  {
    title: "CLRS Quicksort Hoare vs Lomuto Partitioning Invariant",
    text: "Lomuto partition uses arr[j] < pivot, never stopping on elements equal to pivot. On arrays of identical keys [5,5,5], Lomuto creates pathological (N-1, 0) splits, collapsing to O(N^2) time. Hoare bidirectional scan stops on elements equal to pivot, swapping them across the center to guarantee balanced N/2 splits.",
    category: "CLRS & Algorithms"
  },
  {
    title: "CLRS Master Theorem Recurrence Analysis",
    text: "For divide-and-conquer recurrences T(n) = aT(n/b) + f(n), compare f(n) with n^(log_b a). Case 1: f(n) polynomially smaller yields T(n) = Theta(n^(log_b a)). Case 2: f(n) = Theta(n^(log_b a)) yields T(n) = Theta(n^(log_b a) log n). Case 3: f(n) polynomially larger with regularity condition yields T(n) = Theta(f(n)).",
    category: "CLRS & Algorithms"
  },
  {
    title: "CPDS Pointer Operator Precedence (*p++ vs (*p)++)",
    text: "Postfix ++ has higher precedence than unary dereference *. *p++ evaluates as *(p++): it fetches the initial value and advances the pointer address p by sizeof(T), leaving the value pointed to untouched. To mutate the integer behind the pointer, explicit parentheses (*p)++ are mandatory.",
    category: "CPDS (C & Data Structures)"
  },
  {
    title: "CPDS Structure Memory Alignment & Padding",
    text: "Compilers insert silent padding bytes into structs so that N-byte data types align to memory addresses divisible by N. Arranging struct members in descending order of size (double -> int -> char) packs memory tightly and eliminates alignment padding waste.",
    category: "CPDS (C & Data Structures)"
  },
  {
    title: "CP3 / CP4 Contest DSU Inverse Ackermann Invariant",
    text: "In Disjoint Set Union (Union-Find), Path Compression flattens trees during find, but adversarial graphs can build linear O(N) vines during union. Combining Union by Rank (keeping tree heights bounded by O(log N)) with Path Compression guarantees an amortized time complexity of O(alpha(N)), where alpha(N) <= 4 for all practical universe sizes.",
    category: "Competitive Programming (CP3/CPH)"
  },
  {
    title: "CP3 / CP4 Fenwick Tree (Binary Indexed Tree)",
    text: "Fenwick trees store cumulative frequency ranges in an array using the two's complement bit trick (i & (-i)) to isolate the least significant bit (LSB). Point updates and prefix queries both execute in O(log N) time with zero extra pointer indirection overhead.",
    category: "Competitive Programming (CP3/CPH)"
  },
  {
    title: "Modern C++ Move Semantics on Const Objects",
    text: "std::move does not move; it is an unconditional static_cast to an rvalue reference (xvalue). Calling std::move on a const object yields const T&&, which cannot bind to non-const move constructors T(T&&). The compiler silently falls back to copy constructor T(const T&), defeating move optimization without warnings.",
    category: "Modern C++"
  },
  {
    title: "Modern C++ Virtual Destructors & Slicing",
    text: "Deleting a derived class instance through a base class pointer without a virtual destructor triggers static binding (§8.3.5 / ISO C++). Base::~Base() executes but Derived::~Derived() is bypassed, leaking derived heap resources and causing undefined behavior.",
    category: "Modern C++"
  },
  {
    title: "CPDC Lock-Free ABA Trap & Memory Reclamation",
    text: "Atomic Compare-and-Swap (CAS) only verifies that a pointer address equals expected value A; it cannot detect that node A was deallocated, mutated, and reallocated at the same virtual address. Tagged pointers (double-word CAS with mutation counter) or hazard pointers are required to prevent use-after-free corruption.",
    category: "CPDC & Concurrency"
  }
];

async function initRAG() {
  console.log("Initialize RAG (Vector DB & Embeddings)...");
  
  // 1. Load HuggingFace embedding model locally
  try {
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      quantized: true, // Uses very little RAM
    });
  } catch (err) {
    console.error("Failed to load local embedding model:", err);
    return;
  }

  // 2. Initialize local LanceDB
  const dbPath = path.join(__dirname, 'lancedb-data');
  db = await lancedb.connect(dbPath);

  // 3. Create table and embed initial data if it doesn't exist or if count differs
  let shouldRecreate = true;
  if (fs.existsSync(path.join(dbPath, 'metacognitive_patterns.lance'))) {
    try {
      table = await db.openTable('metacognitive_patterns');
      const count = await table.countRows();
      if (count >= initialPatterns.length) {
        shouldRecreate = false;
        console.log(`RAG Vector DB loaded successfully (${count} patterns indexed).`);
      }
    } catch (e) {
      shouldRecreate = true;
    }
  }
  
  if (shouldRecreate) {
    console.log(`Vector DB needs seeding. Embedding all ${initialPatterns.length} canonical patterns...`);
    const dataToInsert = [];
    
    for (const item of initialPatterns) {
      // Generate embeddings
      const output = await extractor(item.text, { pooling: 'mean', normalize: true });
      const vector = Array.from(output.data);
      
      dataToInsert.push({
        vector,
        title: item.title,
        text: item.text,
        category: item.category
      });
    }
    
    // Overwrite / create table
    table = await db.createTable('metacognitive_patterns', dataToInsert, { mode: 'overwrite' });
    console.log(`RAG Vector DB initialized with ${dataToInsert.length} canonical patterns!`);
  }
}

// Function to query the vector DB
async function queryContext(userPrompt, limit = 2) {
  if (!table || !extractor || !userPrompt) return "";
  
  try {
    const output = await extractor(userPrompt, { pooling: 'mean', normalize: true });
    const queryVector = Array.from(output.data);
    
    const results = await table.search(queryVector).limit(limit).toArray();
    
    if (results && results.length > 0) {
      return results.map(r => `[Authoritative Textbook Invariant: ${r.title}] - ${r.text}`).join('\n\n');
    }
  } catch (err) {
    console.warn("RAG query failed:", err.message);
  }
  return "";
}

module.exports = { initRAG, queryContext };
