/**
 * Modern C++, Data Structures & CPDC (Concurrent Programming & Distributed Computing) Curriculum
 * Sourced from free, authoritative, peer-reviewed open resources:
 * 1. "Modern C++ Tutorial: C++11/14/17/20 On the Fly" by Changkun Ou (https://changkun.de/modern-cpp/)
 * 2. "C++ Annotations" (C++20/C++23) by Prof. Frank B. Brokken (https://fbb-git.gitlab.io/cppannotations/)
 * 3. "ISO C++ Core Guidelines" by Bjarne Stroustrup and Herb Sutter (https://isocpp.github.io/CppCoreGuidelines/)
 * 4. "Open Data Structures (in C++)" by Pat Morin (https://opendatastructures.org/)
 * 5. "Operating Systems: Three Easy Pieces (OSTEP)" by Remzi & Andrea Arpaci-Dusseau (https://pages.cs.wisc.edu/~remzi/OSTEP/)
 * 6. "Distributed Systems (4th Ed)" by Maarten van Steen & Andrew S. Tanenbaum (https://www.distributed-systems.net/)
 * 7. "Competitive Programmer's Handbook" by Antti Laaksonen (https://cses.fi/book/book.pdf)
 * 8. "LearnCpp" by Alex (https://www.learncpp.com/)
 */

export const CPP_BOOKS = [
  {
    id: "modern-cpp-tutorial",
    title: "Modern C++ Tutorial: C++11/14/17/20 On the Fly",
    category: "Modern C++",
    author: "Changkun Ou",
    license: "CC BY-NC-ND 4.0 (Open Access)",
    url: "https://changkun.de/modern-cpp/",
    githubUrl: "https://github.com/changkun/modern-cpp-tutorial",
    description: "Fast-paced deep dive into modern C++ mechanics, memory models, smart pointers, and runtime enhancements.",
    keyChapters: [
      { number: "02", title: "Language Usability (nullptr, constexpr, structured binding)" },
      { number: "03", title: "Language Runtime Enhancements (lambdas, std::function)" },
      { number: "04", title: "Smart Pointers & Memory Management (unique_ptr, shared_ptr, weak_ptr)" },
      { number: "05", title: "Pointers & Rvalue References (std::move, std::forward, perfect forwarding)" },
      { number: "07", title: "Concurrency & Memory Model (std::atomic, memory orders, condition_variable)" }
    ]
  },
  {
    id: "open-data-structures",
    title: "Open Data Structures (in C++)",
    category: "Data Structures",
    author: "Prof. Pat Morin (Carleton University)",
    license: "Creative Commons Attribution (Free / Libre)",
    url: "https://opendatastructures.org/",
    githubUrl: "https://github.com/patmorin/ods",
    description: "Rigorous mathematical analysis and idiomatic C++ implementations of arrays, skiplists, hash tables, treaps, scapegoat trees, red-black trees, and B-trees.",
    keyChapters: [
      { number: "02", title: "Array-Based Lists: DualArrayDeque and RootishArrayStack (Amortized Analysis)" },
      { number: "04", title: "Skiplists: Randomized Search and Space-Efficient Indexing" },
      { number: "05", title: "Hash Tables: ChainedHashTable and LinearHashTable (Universal Hashing)" },
      { number: "07", title: "Treaps and Scapegoat Trees: Randomized Balancing vs Rebuilding" },
      { number: "09", title: "Red-Black Trees: Invariants, Rotations, and Logarithmic Bounds" }
    ]
  },
  {
    id: "cpdc-ostep",
    title: "Operating Systems: Three Easy Pieces (Concurrency & CPDC)",
    category: "CPDC & Concurrency",
    author: "Prof. Remzi Arpaci-Dusseau & Prof. Andrea Arpaci-Dusseau (UW-Madison)",
    license: "Free Online Digital Edition",
    url: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
    description: "The premier modern textbook covering threads, locks, condition variables, semaphores, concurrency bugs (deadlock, livelock, atomicity violations), and event-based concurrency.",
    keyChapters: [
      { number: "26", title: "Concurrency: An Introduction (Race conditions, Shared data)" },
      { number: "28", title: "Locks: Spinlocks, Test-and-Set, Compare-and-Swap, Ticket Locks" },
      { number: "30", title: "Condition Variables: Producer-Consumer, Mes-Queue synchronization" },
      { number: "31", title: "Semaphores: Binary semaphores, Ordering, Reader-Writer Locks" },
      { number: "32", title: "Common Concurrency Bugs: Atomicity violations, Order violations, Deadlock" }
    ]
  },
  {
    id: "cpdc-distributed-systems",
    title: "Distributed Systems (4th Edition)",
    category: "Distributed Systems",
    author: "Prof. Maarten van Steen & Prof. Andrew S. Tanenbaum",
    license: "Free Digital Download (distributed-systems.net)",
    url: "https://www.distributed-systems.net/",
    description: "The authoritative textbook for distributed architecture, RPC, Lamport logical clocks, vector timestamps, linearizability, Byzantine fault tolerance, and Raft/Paxos consensus.",
    keyChapters: [
      { number: "02", title: "Architectures: Layered, Object-based, Event-based, and Peer-to-Peer" },
      { number: "04", title: "Communication: Remote Procedure Call (RPC), Message-Oriented Middleware" },
      { number: "06", title: "Synchronization: Physical Clocks, Lamport Timestamps, Mutual Exclusion" },
      { number: "07", title: "Consistency & Replication: Data-Centric, Linearizability, Sequential Consistency" },
      { number: "08", title: "Fault Tolerance: Process Resilience, Reliable Multicast, Consensus (Paxos/Raft)" }
    ]
  },
  {
    id: "isocpp-core-guidelines",
    title: "ISO C++ Core Guidelines",
    category: "Modern C++",
    author: "Bjarne Stroustrup & Herb Sutter",
    license: "Open Source / Community Standard",
    url: "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines.html",
    githubUrl: "https://github.com/isocpp/CppCoreGuidelines",
    description: "The authoritative rulebook for modern C++ safety, resource management, and architecture authored by the creator of C++ and the ISO Committee Chair.",
    keyChapters: [
      { number: "P", title: "Philosophy: Express intent, compile-time checking, don't leak resources" },
      { number: "R", title: "Resource Management: RAII, owning raw pointers are forbidden, smart pointer policies" },
      { number: "F", title: "Functions: Parameter passing (pass-by-value vs const-ref vs rvalue-ref)" },
      { number: "C", title: "Classes: The Rule of Zero/Three/Five, virtual destructors, slicing prevention" },
      { number: "CP", title: "Concurrency: Avoid data races, lock hierarchies, atomic memory ordering" }
    ]
  },
  {
    id: "cpp-annotations",
    title: "C++ Annotations (Version 12.x / C++20 & C++23)",
    category: "Modern C++",
    author: "Prof. Frank B. Brokken (University of Groningen)",
    license: "GPL / Free Online Distribution",
    url: "https://fbb-git.gitlab.io/cppannotations/",
    githubUrl: "https://gitlab.com/fbb-git/cppannotations",
    description: "Extensive university-level guide covering the complete semantic nuances of classes, templates, memory management, and modern language features.",
    keyChapters: [
      { number: "07", title: "Static data and functions, nested classes, and memory allocation" },
      { number: "09", title: "Exceptions and Exception Safety Guarantees" },
      { number: "10", title: "The Standard Template Library & Custom Allocators" },
      { number: "14", title: "Polymorphism, Virtual Tables (vtables), and Dynamic Binding" },
      { number: "21", title: "Advanced Template Metaprogramming & Concepts" }
    ]
  },
  {
    id: "competitive-programmers-handbook",
    title: "Competitive Programmer's Handbook",
    category: "Data Structures",
    author: "Antti Laaksonen (University of Helsinki / CSES)",
    license: "Free Community Book (cses.fi)",
    url: "https://cses.fi/book/book.pdf",
    description: "Practical algorithms and data structures guide: Segment Trees, Fenwick Trees (BIT), Disjoint Set Union (Union-Find), and dynamic programming.",
    keyChapters: [
      { number: "04", title: "Data Structures: Dynamic arrays, sets, maps, iterators, priority queues" },
      { number: "09", title: "Range Queries: Static array queries, Binary Indexed Trees, Segment Trees" },
      { number: "11", title: "Basics of Graphs: Representation, Traversals (DFS/BFS), Shortest Paths" },
      { number: "15", title: "Spanning Trees: Kruskal's algorithm, Disjoint Set Union" }
    ]
  },
  {
    id: "cp3-cp4-halim",
    title: "Competitive Programming (CP3 / CP4)",
    category: "Competitive Programming (CP3/CPH)",
    author: "Dr. Steven Halim & Dr. Felix Halim (NUS / IOI & ICPC Coaches)",
    license: "CPbook.net Community Reference",
    url: "https://cpbook.net/",
    githubUrl: "https://github.com/stevenhalim/cpbook-code",
    description: "The global competitive programming bible. Master advanced contest data structures: Disjoint Set Union (Union-Find) with rank & path compression, Fenwick Trees (BIT), Segment Trees with lazy propagation, and bitmask DP.",
    keyChapters: [
      { number: "02", title: "Data Structures with Built-in Libraries & Contest Specials (DSU, Fenwick Tree)" },
      { number: "03", title: "Problem Solving Paradigms: Complete Search, Divide & Conquer, Greedy, DP" },
      { number: "04", title: "Graph: Traversal (Bipartite, Articulation points, Bridges), MST (Kruskal/Prim)" },
      { number: "05", title: "Mathematics: Fast Exponentiation, Modular Arithmetic, Prime Sieve of Eratosthenes" }
    ]
  },
  {
    id: "clrs-introduction-to-algorithms",
    title: "CLRS: Introduction to Algorithms (4th Edition)",
    category: "CLRS & Algorithms",
    author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein (MIT Press)",
    license: "MIT OpenCourseWare (6.006 / 6.046J) Open Reference",
    url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
    githubUrl: "https://github.com/gzc/CLRS",
    description: "The universally revered algorithms bible. Rigorous loop invariants, Master Theorem recurrence bounds, Lomuto vs Hoare partitioning, Red-Black tree rotation proofs, dynamic programming optimal substructure, and max flow.",
    keyChapters: [
      { number: "02", title: "Getting Started: Formal Loop Invariants, Insertion Sort vs Merge Sort Recurrences" },
      { number: "04", title: "Divide-and-Conquer: The Master Method for Recurrences (T(n) = aT(n/b) + f(n))" },
      { number: "07", title: "Quicksort: Hoare vs Lomuto Partitioning, Worst-Case Analysis on Equal Keys" },
      { number: "15", title: "Dynamic Programming: Optimal Substructure, Overlapping Subproblems, Memoization" },
      { number: "22", title: "Elementary Graph Algorithms: Representations, BFS, DFS, Topological Sort, SCC" }
    ]
  },
  {
    id: "cpds-balagurusamy-thareja",
    title: "CPDS: C Programming and Data Structures",
    category: "CPDS (C & Data Structures)",
    author: "E. Balagurusamy / Reema Thareja / B.A. Forouzan & R.F. Gilberg",
    license: "Prescribed University Engineering Standard (Anna Univ / JNTU / VTU)",
    url: "https://www.geeksforgeeks.org/c-programming-language/",
    description: "The core foundational undergraduate textbook curriculum across Indian engineering universities. Teaches raw pointer mechanics, address arithmetic, memory alignment padding, heap management (malloc/free), and linked representations.",
    keyChapters: [
      { number: "05", title: "Pointers & Address Arithmetic: (*p)++ vs *p++, Double Pointers, Function Pointers" },
      { number: "07", title: "Structures & Memory Alignment: Struct padding, Boundary alignment, Bit-fields" },
      { number: "09", title: "Dynamic Memory Management: malloc, calloc, realloc, free, Memory leaks & Dangling pointers" },
      { number: "11", title: "Linear Structures: Singly, Doubly, Circular Linked Lists, Stacks, Queues (Array vs Linked)" },
      { number: "14", title: "Non-Linear Structures: Binary Trees, Traversal recursions, Searching & Sorting complexity" }
    ]
  },
  {
    id: "ctci-cracking-the-coding-interview",
    title: "Cracking the Coding Interview (6th Edition)",
    category: "Interview Prep (CTCI)",
    author: "Gayle Laakmann McDowell (CareerCup)",
    license: "Open Source Solutions (careercup/CtCI-6th-Edition-cpp)",
    url: "https://github.com/careercup/CtCI-6th-Edition-cpp",
    githubUrl: "https://github.com/careercup/CtCI-6th-Edition-cpp",
    description: "The gold-standard reference for technical problem-solving, featuring the 7-Step Method, BUD (Bottlenecks, Unnecessary Work, Duplicated Work) bottleneck diagnosis, Space/Time trade-offs, and modern C++ solutions.",
    keyChapters: [
      { number: "VII", title: "Technical Questions: The 7-Step Method & BUD (Bottlenecks, Unnecessary Work, Duplicated Work)" },
      { number: "01", title: "Arrays & Strings: Hash Tables, Amortized Dynamic Vectors, Bit Vectors, In-Place Swaps" },
      { number: "02", title: "Linked Lists: The Runner Technique (Fast & Slow Pointers), Pad & Recurse" },
      { number: "04", title: "Trees & Graphs: Minimal BST, In-Order Successor, Lowest Common Ancestor, Topological Sort" },
      { number: "08", title: "Recursion & DP: Base Cases and Build, Memoization vs Bottom-Up Tabulation" }
    ]
  }
];

export const CPP_CONCEPTS = [
  {
    id: "raii-smart-pointers",
    name: "RAII & Smart Pointer Ownership",
    tagline: "Resource Acquisition Is Initialization: Eliminating manual delete forever",
    category: "Memory Architecture",
    difficulty: "Intermediate",
    bookReference: {
      bookId: "isocpp-core-guidelines",
      bookTitle: "ISO C++ Core Guidelines",
      section: "R.1: Manage resources automatically using resource handles and RAII",
      url: "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines.html#Rr-raii"
    },
    corePrinciples: [
      "Every resource (heap memory, file descriptors, mutex locks, sockets) must be tied to the lifetime of an automatic (stack) object.",
      "Destructors run deterministically upon scope exit, even during unexpected stack unwinding caused by thrown exceptions.",
      "std::unique_ptr represents exclusive ownership: zero memory overhead, cannot be copied, only moved.",
      "std::shared_ptr represents shared ownership via atomic reference counting; circular dependencies require std::weak_ptr to break retention cycles."
    ],
    antiPatternCode: `// ❌ CRITICAL ANTI-PATTERN: Manual new/delete with early returns
void processFile(const char* filename) {
  int* buffer = new int[1024];
  FILE* fp = fopen(filename, "r");
  if (!fp) {
    // BUG: Leaks 'buffer' because delete[] is skipped on early exit!
    return;
  }
  
  if (ferror(fp)) {
    fclose(fp);
    // BUG: Leaks 'buffer' if file reading errors occur!
    return;
  }
  
  delete[] buffer;
  fclose(fp);
}`,
    idiomaticCode: `// ✅ MODERN C++ RAII: Deterministic, leak-free cleanup
#include <memory>
#include <vector>
#include <fstream>

void processFile(const std::string& filename) {
  // Vector automatically cleans up heap memory upon function exit
  std::vector<int> buffer(1024);
  
  // std::ifstream closes file descriptor automatically in its destructor
  std::ifstream file(filename);
  if (!file.is_open()) {
    return; // Safely returns; buffer and file are cleanly destroyed
  }
}`
  },

  {
    id: "move-semantics",
    name: "Move Semantics & Rvalue References",
    tagline: "Eliminating expensive deep copies via resource pilfering (std::move vs std::forward)",
    category: "Performance Engineering",
    difficulty: "Advanced",
    bookReference: {
      bookId: "modern-cpp-tutorial",
      bookTitle: "Modern C++ Tutorial",
      section: "Chapter 5: Pointers & Rvalue References",
      url: "https://changkun.de/modern-cpp/05-pointers/#52-move-semantics"
    },
    corePrinciples: [
      "Lvalues have an identifiable memory address and persistent identity; Rvalues are temporary expressions about to be discarded.",
      "std::move does NOT move anything at runtime; it is an unconditional static_cast converting an lvalue into an rvalue reference (xvalue).",
      "A moved-from object is left in a 'valid but unspecified state'. Reading from it before re-initialization is an antipattern.",
      "std::forward<T> preserves the value category (lvalue vs rvalue) of a forwarding reference, enabling perfect forwarding in templates."
    ],
    antiPatternCode: `// ❌ ANTI-PATTERN: Accidental deep copy in loop + using moved-from object
std::vector<std::string> pool;

void registerUser(std::string name) {
  pool.push_back(name); // 1. Pass-by-value copies into 'name'
                        // 2. push_back(name) copies 'name' again into vector!
  
  // Using 'name' after std::move(name) is dangerous:
  std::string archived = std::move(name);
  std::cout << name.length(); // ⚠️ Name is in an unspecified state!
}`,
    idiomaticCode: `// ✅ IDIOMATIC MOVE SEMANTICS
std::vector<std::string> pool;

void registerUser(std::string name) {
  // Transfer buffer ownership directly into vector storage
  pool.push_back(std::move(name));
  // 'name' is now hollowed out; do NOT access its contents.
}`
  },

  {
    id: "memory-safety-ub",
    name: "Memory Safety & Undefined Behavior (UB)",
    tagline: "Dangling pointers, lifetime traps, and compiler optimization illusions",
    category: "Safety & Compilers",
    difficulty: "Advanced",
    bookReference: {
      bookId: "cpp-annotations",
      bookTitle: "C++ Annotations",
      section: "Chapter 7 & 9: Static data, lifetimes, and exceptions",
      url: "https://fbb-git.gitlab.io/cppannotations/cppannotations/html/cplusplus07.html"
    },
    corePrinciples: [
      "Undefined Behavior (UB) means the ISO C++ standard imposes no requirements: the program may crash, produce garbage values, or appear to work until -O3 optimization reorders code.",
      "Returning references or pointers to local stack variables creates an immediate dangling pointer upon scope return.",
      "Iterators are invalidated when a container resizes or reallocates internal storage (e.g., push_back on std::vector).",
      "Strict aliasing rule: Reading a memory location through a pointer of an incompatible type causes UB (use std::bit_cast in C++20)."
    ],
    antiPatternCode: `// ❌ ANTI-PATTERN: Returning reference to local temporary stack memory
const std::string& getFormattedGreeting(const std::string& user) {
  std::string greeting = "Hello, " + user + "!";
  return greeting; // 💥 CRITICAL UB: 'greeting' is destroyed when function returns!
                   // Caller receives a dangling reference to deallocated stack memory!
}`,
    idiomaticCode: `// ✅ IDIOMATIC: Return by value (Compilers perform Return Value Optimization - RVO)
std::string getFormattedGreeting(const std::string& user) {
  std::string greeting = "Hello, " + user + "!";
  return greeting; // RVO constructs string directly in the caller's stack frame with 0 copies!
}`
  },

  {
    id: "cpdc-lock-free-aba",
    name: "CPDC: Lock-Free Concurrency & The ABA Problem",
    tagline: "Atomic Compare-And-Swap (CAS), Hazard Pointers, and Memory Reclamation Traps",
    category: "CPDC & Concurrency",
    difficulty: "Advanced",
    bookReference: {
      bookId: "cpdc-ostep",
      bookTitle: "Operating Systems: Three Easy Pieces",
      section: "Chapter 28: Locks (Atomic Compare-and-Swap Mechanics)",
      url: "https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks.pdf"
    },
    corePrinciples: [
      "Lock-free algorithms guarantee that at least one thread makes progress in a finite number of steps, avoiding thread sleep context switches.",
      "Compare-and-Swap (CAS) verifies that a memory location holds an expected value before updating it atomically.",
      "The ABA Problem occurs when a pointer changes from A to B and back to A; a naive CAS succeeds even though underlying data was modified and freed.",
      "Mitigations include Tagged Pointers / Versioned Counters (Double-Word CAS) or Hazard Pointers / Epoch-Based Reclamation."
    ],
    antiPatternCode: `// ❌ CRITICAL CPDC BUG: Naive Lock-Free Treiber Stack with ABA Trap
struct Node { int val; Node* next; };
std::atomic<Node*> top;

int pop() {
  Node* oldTop = top.load();
  // If Thread 1 is preempted HERE:
  // Thread 2 pops oldTop (A), pops B, and pushes a new node that reuses memory address A!
  // When Thread 1 wakes up, top is still 'A', so CAS succeeds, but top->next is corrupted!
  while (oldTop && !top.compare_exchange_weak(oldTop, oldTop->next)) {
    // Retry loop
  }
  return oldTop ? oldTop->val : -1;
}`,
    idiomaticCode: `// ✅ IDIOMATIC CPDC: Tagged Pointer / Versioned Counter (Double CAS)
struct TaggedNode {
  Node* ptr;
  uintptr_t tag; // Incremented on every mutation to detect reuse
};
std::atomic<TaggedNode> top;
// Now if address A is reused, tag will be tag+2, causing CAS to correctly reject the stale swap!`
  },

  {
    id: "cpdc-memory-model",
    name: "CPDC: Acquire-Release Semantics & Memory Fences",
    tagline: "Preventing hardware CPU instruction reordering without global lock contention",
    category: "CPDC & Concurrency",
    difficulty: "Advanced",
    bookReference: {
      bookId: "modern-cpp-tutorial",
      bookTitle: "Modern C++ Tutorial",
      section: "Chapter 7: Concurrency & Memory Orders",
      url: "https://changkun.de/modern-cpp/07-concurrency/#72-memory-model"
    },
    corePrinciples: [
      "Modern out-of-order CPUs and optimizing compilers aggressively reorder independent memory reads and writes.",
      "std::memory_order_seq_cst enforces globally synchronized execution across all cores but incurs bus synchronization costs.",
      "std::memory_order_release guarantees all prior writes are visible before the flag is stored.",
      "std::memory_order_acquire guarantees subsequent reads cannot be reordered before the flag is loaded, establishing a happens-before relationship."
    ],
    antiPatternCode: `// ❌ ANTI-PATTERN: Data Race under std::memory_order_relaxed
std::atomic<bool> ready{false};
int payload = 0;

void producer() {
  payload = 42; 
  // BUG: Relaxed memory order permits CPU to publish 'ready' BEFORE 'payload' is written!
  ready.store(true, std::memory_order_relaxed);
}

void consumer() {
  while (!ready.load(std::memory_order_relaxed));
  // May print 0 or garbage because 'payload = 42' was reordered or not yet flushed to cache!
  std::cout << payload << std::endl;
}`,
    idiomaticCode: `// ✅ IDIOMATIC CPDC: Acquire-Release Synchronization
void producer() {
  payload = 42; 
  // Release fence: Guarantees 'payload = 42' is globally committed before 'ready' becomes true
  ready.store(true, std::memory_order_release);
}

void consumer() {
  // Acquire fence: Guarantees reads of 'payload' cannot occur before 'ready' is loaded as true
  while (!ready.load(std::memory_order_acquire));
  std::cout << payload << std::endl; // Guaranteed to be 42!
}`
  },

  {
    id: "data-structures-amortized-trees",
    name: "Data Structures: Amortized Growth & Self-Balancing",
    tagline: "Why constant vector growth degrades to O(N^2) and how Treaps maintain O(log N)",
    category: "Data Structures",
    difficulty: "Intermediate",
    bookReference: {
      bookId: "open-data-structures",
      bookTitle: "Open Data Structures",
      section: "Chapter 2: Array-Based Lists & Chapter 7: Treaps",
      url: "https://opendatastructures.org/ods-cpp/2_Array_Based_Lists.html"
    },
    corePrinciples: [
      "Dynamic array resizing requires geometric scaling ($2\\times$ or $1.5\\times$) to achieve $O(1)$ amortized append time.",
      "Growing by a fixed constant size ($+100$ items) causes each append to copy all existing items, degrading $N$ appends to $O(N^2)$ quadratic work.",
      "Naive Binary Search Trees degenerate into $O(N)$ linked lists when inserted in sorted order.",
      "Treaps assign a uniform random priority to every node and maintain heap order via tree rotations, achieving $O(\\log N)$ expected search time."
    ],
    antiPatternCode: `// ❌ ANTI-PATTERN: Fixed-step reallocation in dynamic arrays
struct LeakyArray {
  int* data;
  int capacity;
  int size;

  void push_back(int val) {
    if (size == capacity) {
      // 💥 DISASTROUS: Increasing by fixed step of +10 elements!
      capacity += 10;
      int* next = new int[capacity];
      for (int i = 0; i < size; ++i) next[i] = data[i]; // Copies all elements!
      delete[] data;
      data = next;
    }
    data[size++] = val; // Appending N elements takes O(N^2) total copy steps!
  }
};`,
    idiomaticCode: `// ✅ IDIOMATIC DATA STRUCTURES: Geometric Growth (std::vector pattern)
void push_back(int val) {
  if (size == capacity) {
    // Geometric growth doubles capacity (amortized O(1) appends!)
    capacity = capacity == 0 ? 1 : capacity * 2;
    int* next = new int[capacity];
    // Amortized total copies across N insertions is sum(N/2 + N/4 + ...) <= 2N = O(N)!
    for (int i = 0; i < size; ++i) next[i] = std::move(data[i]);
    delete[] data;
    data = next;
  }
  data[size++] = val;
}`
  },

  {
    id: "ctci-7-steps-bud",
    name: "CTCI 7-Step Method & BUD Bottleneck Diagnosis",
    tagline: "Gayle McDowell's systematic framework to eliminate rote memorization and diagnose algorithmic friction",
    category: "Data Structures",
    difficulty: "Advanced",
    bookReference: {
      bookId: "ctci-cracking-the-coding-interview",
      bookTitle: "Cracking the Coding Interview (6th Edition)",
      section: "Chapter VII: Technical Questions — Optimize & Solve Technique #1: Look for BUD",
      url: "https://github.com/careercup/CtCI-6th-Edition-cpp"
    },
    corePrinciples: [
      "BUD Framework: 1. Bottlenecks (the single step dominating runtime complexity), 2. Unnecessary work (operations computed that never impact the final answer), 3. Duplicated work (re-computing states instead of memoizing or pre-indexing).",
      "The 7-Step Problem Solving Sequence: Listen carefully to details -> Draw a large, unique, non-trivial example -> State brute force baseline immediately -> Optimize via BUD -> Walk through optimal steps on paper -> Modular implementation -> Test corner cases.",
      "The Runner Technique: Maintaining two pointers moving at different speeds (e.g. 1 step vs 2 steps) to detect cycles or find list midpoints in O(N) time with O(1) space.",
      "Space-Time Trade-offs: Using bit vectors (32-bit or 64-bit integer bitmasks) to achieve O(1) auxiliary space instead of dynamic memory allocation for hash sets."
    ],
    antiPatternCode: `// ❌ ANTI-PATTERN: Rote brute force with Duplicated Work & Unnecessary Work (O(N^2))
// Problem: Find two elements in array that sum to Target
#include <vector>

bool hasTwoSumBruteForce(const std::vector<int>& nums, int target) {
  // Bottleneck: Nested loops checking pairs redundantly
  for (size_t i = 0; i < nums.size(); ++i) {
    for (size_t j = i + 1; j < nums.size(); ++j) {
      // Unnecessary work: Computes (nums[i] + nums[j]) repeatedly
      // Duplicated work: Re-examines numbers already checked in previous outer iterations
      if (nums[i] + nums[j] == target) {
        return true;
      }
    }
  }
  return false;
}`,
    idiomaticCode: `// ✅ IDIOMATIC CTCI BUD OPTIMIZATION: Hash Map / Bit Vector O(N) Time, O(N) Space
#include <vector>
#include <unordered_set>

bool hasTwoSumOptimized(const std::vector<int>& nums, int target) {
  // Diagnosing BUD: Rather than searching for (target - x) in O(N) via inner loop,
  // we eliminate Duplicated Work by caching previously seen numbers in a Hash Set for O(1) lookups!
  std::unordered_set<int> seen;
  seen.reserve(nums.size()); // Pre-allocate bucket capacity to prevent rehashing overhead

  for (int num : nums) {
    int complement = target - num;
    if (seen.find(complement) != seen.end()) {
      return true; // Found matching pair in O(1) amortized lookup!
    }
    seen.insert(num);
  }
  return false;
}`
  },

  {
    id: "clrs-loop-invariants-divide",
    name: "CLRS Invariants, Master Theorem & Hoare Partitioning",
    tagline: "Mathematical correctness proofs: Loop Invariants, Recurrence Bounds, and Lomuto vs Hoare Traps",
    category: "CLRS & Algorithms",
    difficulty: "Advanced",
    bookReference: {
      bookId: "clrs-introduction-to-algorithms",
      bookTitle: "CLRS: Introduction to Algorithms (4th Edition)",
      section: "Chapter 2: Getting Started (Loop Invariants) & Chapter 7: Quicksort",
      url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/"
    },
    corePrinciples: [
      "Loop Invariant Methodology: Three mandatory mathematical checkpoints: 1. Initialization (true prior to the first iteration), 2. Maintenance (if true before an iteration, remains true before the next), 3. Termination (at loop exit, gives a useful property proving algorithmic correctness).",
      "The Master Method: For divide-and-conquer recurrences T(n) = aT(n/b) + f(n), compares f(n) with the watershed function n^(log_b a) to instantly determine asymptotic bounds.",
      "Lomuto vs Hoare Partitioning: Lomuto's partition scheme does not halt on elements equal to the pivot, causing quadratic O(N^2) degradation on arrays of identical values. Hoare's two-pointer scheme stops at equal elements, maintaining balanced partitions.",
      "Optimal Substructure & Overlapping Subproblems: The two indispensable criteria for Dynamic Programming over Greedy heuristics."
    ],
    antiPatternCode: `// ❌ LOMUTO PARTITION TRAP: Degrades to O(N^2) on identical keys!
int lomutoPartition(std::vector<int>& arr, int low, int high) {
  int pivot = arr[high];
  int i = low - 1;
  for (int j = low; j < high; ++j) {
    // 💥 CRITICAL TRAP: Strictly less-than skips equal elements,
    // causing an array like [5, 5, 5, 5, 5] to produce unbalanced (N-1, 0) splits!
    if (arr[j] < pivot) {
      ++i;
      std::swap(arr[i], arr[j]);
    }
  }
  std::swap(arr[i + 1], arr[high]);
  return i + 1;
}`,
    idiomaticCode: `// ✅ CLRS HOARE PARTITIONING: Maintains O(N log N) on equal keys
int hoarePartition(std::vector<int>& arr, int low, int high) {
  int pivot = arr[low + (high - low) / 2]; // Midpoint pivot
  int i = low - 1;
  int j = high + 1;
  while (true) {
    do { ++i; } while (arr[i] < pivot); // Stops ONCE element >= pivot
    do { --j; } while (arr[j] > pivot); // Stops ONCE element <= pivot
    if (i >= j) return j;
    std::swap(arr[i], arr[j]); // Balances equal elements evenly across both sides!
  }
}`
  },

  {
    id: "cpds-pointer-memory-traps",
    name: "CPDS Pointer Mechanics & Memory Alignment",
    tagline: "Balagurusamy & Reema Thareja foundations: Pointer operator precedence, struct padding, and free() hygiene",
    category: "CPDS (C & Data Structures)",
    difficulty: "Core University",
    bookReference: {
      bookId: "cpds-balagurusamy-thareja",
      bookTitle: "CPDS: C Programming & Data Structures",
      section: "Chapter 5: Pointers & Address Arithmetic, Chapter 7: Structures",
      url: "https://www.geeksforgeeks.org/c-programming-language/"
    },
    corePrinciples: [
      "Operator Precedence in Pointer Arithmetic: Postfix '++' has higher precedence than unary dereference '*'. Therefore, *p++ fetches the value at *p and then increments the pointer address 'p'; it does NOT increment the value pointed to! (*p)++ is required to mutate the value.",
      "Structure Memory Padding & Word Alignment: Compilers insert silent padding bytes into structs so that N-byte primitives align to addresses divisible by N. Ordering struct members from largest to smallest minimizes padding waste.",
      "Heap Hygiene: Calling free(ptr) relinquishes the heap block but leaves 'ptr' pointing to the deallocated virtual address. Accessing it is a catastrophic Use-After-Free; immediately setting ptr = NULL prevents accidental reuse."
    ],
    antiPatternCode: `// ❌ CPDS PRECEDENCE TRAP & STRUCT PADDING WASTE
struct BadStudent {
  char grade;   // 1 byte + 3 bytes SILENT COMPILER PADDING!
  int rollNo;   // 4 bytes
  char section; // 1 byte + 7 bytes SILENT COMPILER PADDING!
  double gpa;   // 8 bytes
  // Total sizeof(BadStudent) = 24 bytes! (10 bytes wasted on padding)
};

void incrementScore(int* pScore) {
  *pScore++; // 💥 BUG: Increments the pointer address, NOT the score value!
}`,
    idiomaticCode: `// ✅ CPDS MEMORY-OPTIMIZED ALIGNMENT & DEREFERENCE
struct OptimizedStudent {
  double gpa;   // 8 bytes (aligned to 8)
  int rollNo;   // 4 bytes
  char grade;   // 1 byte
  char section; // 1 byte + 2 bytes padding to align to 8-byte boundary
  // Total sizeof(OptimizedStudent) = 16 bytes! (Saved 33% memory footprint)
};

void incrementScore(int* pScore) {
  (*pScore)++; // ✅ Correctly dereferences first, then increments pointed value!
}`
  },

  {
    id: "cp-contest-dsu-bit",
    name: "CP3/CP4 & CPH: Disjoint Set Union & Fenwick Tree",
    tagline: "Contest-grade data structures: O(alpha(N)) DSU and O(log N) Binary Indexed Trees (BIT)",
    category: "Competitive Programming (CP3/CPH)",
    difficulty: "Advanced Contest",
    bookReference: {
      bookId: "cp3-cp4-halim",
      bookTitle: "Competitive Programming (CP3/CP4) by Steven & Felix Halim",
      section: "Chapter 2: Data Structures with Built-in Libraries & Contest Specials",
      url: "https://cpbook.net/"
    },
    corePrinciples: [
      "Disjoint Set Union (DSU) Invariants: Naive union chains create O(N) linked lists. Combining Path Compression (flattening tree during find) with Union by Rank (attaching shallower tree under deeper root) crushes amortized query complexity down to O(alpha(N)), the inverse Ackermann function (<= 4 for N <= 10^80).",
      "Fenwick Tree (Binary Indexed Tree): Uses two's complement bit trick (i & (-i)) to isolate the least significant set bit (LSB), updating and querying prefix sums in O(log N) time with zero extra pointer overhead (just an array of size N+1)."
    ],
    antiPatternCode: `// ❌ NAIVE UNION-FIND: Degrades to O(N) linear linked list
struct NaiveDSU {
  std::vector<int> parent;
  NaiveDSU(int n) : parent(n) { for(int i=0; i<n; ++i) parent[i] = i; }
  
  int find(int i) {
    // 💥 NO PATH COMPRESSION: Recursive tree walk is O(N)!
    if (parent[i] == i) return i;
    return find(parent[i]);
  }
  void unite(int i, int j) {
    // 💥 NO UNION BY RANK: Blindly attaches parent[root_i] = root_j
    parent[find(i)] = find(j);
  }
};`,
    idiomaticCode: `// ✅ CONTEST-GRADE DSU (CP3 / CP4): O(alpha(N)) with Path Compression & Rank
struct DSU {
  std::vector<int> parent, rank;
  DSU(int n) : parent(n), rank(n, 0) {
    for (int i = 0; i < n; ++i) parent[i] = i;
  }
  int find(int i) {
    // Path compression: Flattens the entire tree directly to the representative root!
    if (parent[i] != i) parent[i] = find(parent[i]);
    return parent[i];
  }
  bool unite(int i, int j) {
    int root_i = find(i), root_j = find(j);
    if (root_i == root_j) return false;
    // Union by rank: Attach shorter tree under taller tree
    if (rank[root_i] < rank[root_j]) std::swap(root_i, root_j);
    parent[root_j] = root_i;
    if (rank[root_i] == rank[root_j]) rank[root_i]++;
    return true;
  }
};`
  }
];

export const CPP_ANTI_ROTE_QUIZ_BANK = [
  {
    id: "cpp-q1-raii",
    conceptId: "raii-smart-pointers",
    category: "Modern C++",
    title: "Stack Unwinding Under Exception",
    question: `Consider the following function execution in a production banking microservice:

\`\`\`cpp
void transferFunds(Account& from, Account& to, double amount) {
  TransactionLock* lock = new TransactionLock("TXN_1092");
  lock->acquire();

  if (from.getBalance() < amount) {
    throw InsufficientFundsException();
  }

  from.debit(amount);
  to.credit(amount);

  lock->release();
  delete lock;
}
\`\`\`

When \`from.getBalance() < amount\` evaluates to true, what is the exact system failure that occurs?`,
    options: [
      "The C++ compiler catches the InsufficientFundsException and automatically invokes 'delete lock'",
      "The exception causes stack unwinding; because 'lock' is a raw pointer on the heap, its destructor is never called, leaving the global TransactionLock permanently acquired and causing a system deadlock",
      "The program terminates with a SIGSEGV segmentation fault before the exception can be handled",
      "The TransactionLock object is moved to the global garbage collection pool"
    ],
    correctIndex: 1,
    bookCitation: {
      book: "ISO C++ Core Guidelines",
      rule: "R.1 & E.6: Use RAII to prevent leaks on exception paths",
      explanation: "Raw pointers are NOT destroyed when stack frames unwind during exceptions. Only automatic (stack) objects have their destructors invoked. Using std::lock_guard or std::unique_ptr ensures deterministic cleanup during stack unwinding."
    },
    aarDebrief: {
      mentalModelMistake: "Assuming that exception handlers clean up dynamic resources allocated before the throw statement.",
      authoritativeTruth: "C++ only unwinds local automatic variables. Raw heap pointers allocated with 'new' are completely ignored by the exception handler, causing permanent resource leaks or deadlocks unless wrapped in RAII wrappers (std::unique_ptr, std::lock_guard)."
    }
  },

  {
    id: "cpp-q2-move",
    conceptId: "move-semantics",
    category: "Modern C++",
    title: "The std::move Runtime Misconception",
    question: `A junior engineer writes the following code expecting high-performance optimization:

\`\`\`cpp
void processBigData(const std::vector<int>& source) {
  std::vector<int> destination = std::move(source);
}
\`\`\`

Why does this code STILL perform an expensive $O(N)$ deep copy of the vector rather than moving the internal heap buffer?`,
    options: [
      "std::move only works on primitive types like int and float, not STL containers",
      "'source' is declared as 'const std::vector<int>&'. std::move produces a 'const std::vector<int>&&', which cannot bind to the vector move constructor (vector(vector&&)), causing it to silently fall back to the copy constructor",
      "std::vector requires calling .move() explicitly instead of using the std::move cast",
      "The compiler automatically disables move semantics when vector elements are integers"
    ],
    correctIndex: 1,
    bookCitation: {
      book: "Modern C++ Tutorial (Changkun Ou)",
      rule: "Chapter 5: std::move does not move anything; it is a type cast",
      explanation: "std::move only casts an expression to an rvalue reference. If the object was const, it becomes a const rvalue reference (const T&&). Moving requires modifying the source to hollow it out, which const prohibits. Hence, C++ silently selects the copy constructor vector(const vector&)."
    },
    aarDebrief: {
      mentalModelMistake: "Believing std::move physically forces byte movement or ignores const qualifiers.",
      authoritativeTruth: "std::move is merely a static_cast to an rvalue reference. If you pass a const object, the move constructor cannot bind to it, and C++ silently falls back to a deep copy with ZERO compiler warnings."
    }
  },

  {
    id: "cpdc-q1-aba",
    conceptId: "cpdc-lock-free-aba",
    category: "CPDC & Concurrency",
    title: "The ABA Problem in Lock-Free Data Structures",
    question: `In a lock-free Treiber stack, Thread 1 attempts to pop an element:
1. Thread 1 reads top pointer \`A\` (which points to \`B\`).
2. Before Thread 1 can execute \`compare_exchange_weak(top, A, B)\`, it is preempted.
3. Thread 2 runs, pops \`A\`, pops \`B\`, and frees both nodes.
4. Thread 2 then pushes a newly allocated node which the memory allocator happens to place at the exact same virtual address \`A\`.
5. Thread 1 resumes and executes \`compare_exchange_weak(top, A, B)\`.

What catastrophic failure occurs?`,
    options: [
      "The CAS operation fails because Thread 1 detects that the contents of node A have changed",
      "The CAS succeeds because the memory pointer is still equal to 'A'; 'top' is set to 'B' (which was already freed!), corrupting the stack and leading to use-after-free crashes",
      "The operating system detects the concurrent reallocation and aborts both threads with SIGBUS",
      "The stack automatically locks itself using mutex backoff"
    ],
    correctIndex: 1,
    bookCitation: {
      book: "Operating Systems: Three Easy Pieces (OSTEP)",
      rule: "Chapter 28: Hardware Atomic Primitives and Lock-Free Pitfalls",
      explanation: "This is the classic ABA problem. CAS only verifies that the address stored in 'top' equals 'A'. It cannot detect that node A was destroyed, its sub-pointers altered, and reincarnated. Setting top = B sets top to deallocated memory."
    },
    aarDebrief: {
      mentalModelMistake: "Equating pointer address equality with data identity in concurrent algorithms.",
      authoritativeTruth: "Memory allocators frequently recycle recently freed pointer addresses. In lock-free data structures, address equality does not mean state constancy. Tagged pointers or hazard pointers are required to prevent premature reclamation."
    }
  },

  {
    id: "cpdc-q2-memory-order",
    conceptId: "cpdc-memory-model",
    category: "CPDC & Concurrency",
    title: "Relaxed Memory Ordering & CPU Store Buffering",
    question: `Two threads communicate using an atomic flag without locks:

\`\`\`cpp
int data = 0;
std::atomic<bool> flag{false};

// Thread 1 (Producer)
data = 100;
flag.store(true, std::memory_order_relaxed);

// Thread 2 (Consumer)
while (!flag.load(std::memory_order_relaxed));
assert(data == 100);
\`\`\`

Why can the assertion \`assert(data == 100)\` FAIL on modern multi-core ARM or x86 processors?`,
    options: [
      "std::atomic cannot be used with boolean types in modern C++",
      "std::memory_order_relaxed only guarantees atomicity of the flag itself; it permits the CPU and compiler to reorder 'data = 100' after 'flag.store' or delay store-buffer flushes, causing Thread 2 to read stale data",
      "The while-loop creates a deadlock that freezes CPU core 0",
      "The assert macro is stripped in Release builds"
    ],
    correctIndex: 1,
    bookCitation: {
      book: "Modern C++ Tutorial (Changkun Ou)",
      rule: "Chapter 7: C++11 Memory Model & Happens-Before Relationships",
      explanation: "Relaxed ordering provides no synchronization or happens-before ordering between threads. To guarantee that writes to 'data' are visible when 'flag' becomes true, Thread 1 must use memory_order_release and Thread 2 must use memory_order_acquire."
    },
    aarDebrief: {
      mentalModelMistake: "Assuming atomic operations automatically flush all surrounding memory writes to other CPU caches.",
      authoritativeTruth: "Atomics only protect the single atomic variable unless configured with acquire/release memory orders, which insert CPU memory barriers ensuring prior writes are committed before subsequent reads."
    }
  },

  {
    id: "ds-q1-growth",
    conceptId: "data-structures-amortized-trees",
    category: "Data Structures",
    title: "Amortized Analysis of Dynamic Arrays",
    question: `A developer implements a custom vector that increases internal capacity by a fixed constant (\`capacity += 64\`) whenever full, instead of doubling (\`capacity *= 2\`).

If $N = 100,000$ elements are appended to this vector, what is the asymptotic total time complexity of all insertions?`,
    options: [
      "$O(N)$ linear time",
      "$O(N \\log N)$ linearithmic time",
      "$O(N^2)$ quadratic time, because copying data during reallocation occurs $N / 64$ times, leading to an arithmetic progression sum $\\sum i \\times 64 \\approx O(N^2)$",
      "$O(1)$ constant time"
    ],
    correctIndex: 2,
    bookCitation: {
      book: "Open Data Structures (in C++) by Pat Morin",
      rule: "Chapter 2: Array-Based Lists & Amortized Bound Proofs",
      explanation: "With a constant increment, reallocation occurs every 64 items, copying 64, 128, 192... elements. The total copies equal $64 \\times \\frac{(N/64)(N/64 + 1)}{2} \\approx O(N^2)$. Geometric scaling (doubling) is mathematically required to achieve $O(1)$ amortized append time."
    },
    aarDebrief: {
      mentalModelMistake: "Believing that smaller, more frequent allocations save time compared to occasional large reallocations.",
      authoritativeTruth: "Linear reallocation yields quadratic work $O(N^2)$ due to repeated copying. Geometric progression ensures the cost of past copies is amortized over exponentially increasing insertions, yielding $O(1)$ average time."
    }
  },

  {
    id: "cpdc-q3-distributed-quorum",
    conceptId: "cpdc-distributed-consensus",
    category: "Distributed Systems",
    title: "Split-Brain & Quorum Intersections in Raft/Paxos",
    question: `A distributed database cluster has 5 replica nodes. During a network partition, the cluster splits into two isolated partitions: Partition Alpha with 3 nodes, and Partition Beta with 2 nodes.

Why can Partition Alpha continue committing transactions while Partition Beta must reject all write requests?`,
    options: [
      "Partition Alpha contains nodes with lower IP addresses which have higher priority",
      "Raft/Paxos consensus requires a strict majority quorum ($Q > N/2 = 3$ nodes); because Alpha has 3 nodes ($3 > 2.5$), it can achieve quorum consensus, whereas Beta (2 nodes) cannot, mathematically preventing split-brain conflicting state updates",
      "Partition Beta automatically powers off its network interfaces when partitioned",
      "Distributed databases allow writes in both partitions and reconcile conflicts via Git merge"
    ],
    correctIndex: 1,
    bookCitation: {
      book: "Distributed Systems (4th Ed) by Maarten van Steen & Andrew S. Tanenbaum",
      rule: "Chapter 8: Fault Tolerance & Quorum-Based Consensus Protocols",
      explanation: "In an N-node system, any two quorums of size $\\lfloor N/2 \\rfloor + 1$ must overlap by at least one node. With N=5, quorum is 3. Only Partition Alpha has 3 nodes, guaranteeing that only one partition can commit state transitions and preventing split-brain data corruption."
    },
    aarDebrief: {
      mentalModelMistake: "Assuming distributed systems can maintain both 100% availability and linearizable consistency during network splits.",
      authoritativeTruth: "By the CAP theorem, during a network partition you must sacrifice either availability or consistency. Quorum systems choose consistency by requiring majority consensus ($> N/2$), rejecting writes in the minority partition to preserve data integrity."
    }
  },

  {
    id: "ctci-q1-runner-technique",
    conceptId: "ctci-7-steps-bud",
    category: "Data Structures",
    title: "The Runner Technique: Cycle Start Invariant Proof",
    question: `In Cracking the Coding Interview (Ch. 2), Gayle McDowell describes the Runner Technique (Fast & Slow pointers) for detecting the start of a loop in a linked list.

When Slow (1 step/turn) and Fast (2 steps/turn) collide inside a loop of length $C$ at distance $k$ from the loop entrance, we reset \`slow = head\` while leaving \`fast\` at the collision point. We then advance both pointers at 1 step per turn until they meet.

Why does this guarantee they collide exactly at the entrance node of the loop?`,
    options: [
      "Because the fast pointer reverses its direction inside the cycle upon collision",
      "Let $K$ be steps from head to loop start, and $M$ steps from start to collision. Fast traveled $K + pC + M$ and Slow traveled $K + M$. Since $2(K+M) = K + pC + M$, we derive $K = pC - M = (p-1)C + (C - M)$. Thus head and collision are both exactly $K$ steps away from the loop entrance!",
      "Because linked list nodes are laid out contiguously in virtual address space",
      "The algorithm only works if the cycle length is an even power of 2"
    ],
    correctIndex: 1,
    bookCitation: {
      book: "Cracking the Coding Interview (6th Edition)",
      rule: "Chapter 2: Linked Lists — Problem 2.8: Loop Detection",
      explanation: "When Slow enters the loop after K steps, Fast is at (K mod C). Fast catches Slow at a rate of 1 step/turn. When they collide at distance M, K and (C - M) are congruent mod C. Resetting Slow to Head and stepping both at 1x moves them both K steps, meeting precisely at the loop entrance."
    },
    aarDebrief: {
      mentalModelMistake: "Rote memorization of 'reset one pointer to head' without understanding modular arithmetic offsets.",
      authoritativeTruth: "The collision point is offset from the loop start by exactly the same distance that the loop start is offset from the head of the list (modulo C). Stepping both at 1 step/iteration synchronizes their arrival at the cycle origin."
    }
  },

  {
    id: "ctci-q2-bud-memoization",
    conceptId: "ctci-7-steps-bud",
    category: "Data Structures",
    title: "BUD Diagnostic: Eliminating Duplicated Work in Recursion",
    question: `A candidate is asked to generate all unique permutations of a string with potential duplicate letters (e.g. "aabc").

The candidate proposes: "Generate all $4! = 24$ permutations using standard recursive backtracking, insert every string into a \`std::set<std::string>\` to filter duplicates, and return the set."

Applying Gayle McDowell's BUD framework (Bottlenecks, Unnecessary Work, Duplicated Work), what is the primary architectural flaw?`,
    options: [
      "The recursion stack will overflow because C++ cannot handle recursion depths of 4",
      "It violates BUD by performing massive Unnecessary and Duplicated Work: it generates $O(N!)$ full permutations only to discard them in a set ($O(N! \\log(N!))$), instead of tracking character frequencies to branch only once per distinct character ($O(\\frac{N!}{\\prod k_i!})$)",
      "std::set cannot store strings longer than 3 characters in modern C++",
      "std::string cannot be passed to recursive functions"
    ],
    correctIndex: 1,
    bookCitation: {
      book: "Cracking the Coding Interview (6th Edition)",
      rule: "Chapter VII: Optimize & Solve Technique #1 (BUD) & Ch. 8: Recursion",
      explanation: "Brute-force generation followed by deduplication is classic BUD failure. The bottleneck is generating redundant permutations. Building a character count hash map and recursing only over available distinct characters prunes duplicate subtrees before they are ever traversed."
    },
    aarDebrief: {
      mentalModelMistake: "Relying on post-hoc filtering (e.g. std::set / sort+unique) rather than algorithmic pruning during generation.",
      authoritativeTruth: "Whenever you find yourself writing code that generates invalid or duplicate candidates only to filter them at the end, stop and diagnose BUD. Prune duplicate decision branches at the root."
    }
  },

  {
    id: "ctci-q3-bit-vector-space",
    conceptId: "ctci-7-steps-bud",
    category: "Data Structures",
    title: "Space-Time Invariant: Bit Vector vs Hash Set",
    question: `Problem 1.1 in CTCI: "Implement an algorithm to determine if an ASCII string of lowercase letters ('a'-'z') has all unique characters without additional data structures."

\`\`\`cpp
bool isUnique(const std::string& str) {
  int checker = 0;
  for (char c : str) {
    int val = c - 'a';
    if ((checker & (1 << val)) > 0) return false;
    checker |= (1 << val);
  }
  return true;
}
\`\`\`

Why is this bit-vector technique mathematically and hardware superior to \`std::unordered_set<char>\`?`,
    options: [
      "std::unordered_set has undefined behavior for ASCII character types",
      "It eliminates heap allocation, hash hashing overhead, and pointer indirection, maintaining state in a single 32-bit CPU register with single-cycle bitwise AND/OR operations ($O(1)$ auxiliary space)",
      "Bitwise operations prevent integer overflow on 64-bit systems",
      "It reduces time complexity from $O(N)$ to $O(1/N)$"
    ],
    correctIndex: 1,
    bookCitation: {
      book: "Cracking the Coding Interview (6th Edition)",
      rule: "Chapter 1: Arrays and Strings — Problem 1.1: Is Unique",
      explanation: "A 32-bit integer provides 32 bit slots, which easily accommodates the 26 lowercase English letters. Each bit represents presence/absence. Toggling and checking takes a single CPU instruction without allocating heap memory or calculating hash bucket indices."
    },
    aarDebrief: {
      mentalModelMistake: "Defaulting to high-level collections like std::unordered_set when the state space is small and bounded.",
      authoritativeTruth: "For small alphabets (<= 64 elements), an integer bitmask provides the fastest, zero-allocation O(1) set possible, fitting entirely in a CPU register without memory access penalties."
    }
  },

  {
    id: "clrs-q1-hoare-vs-lomuto",
    conceptId: "clrs-loop-invariants-divide",
    category: "CLRS & Algorithms",
    title: "Quicksort Partitioning Invariant: Lomuto vs Hoare Degeneracy",
    question: `Consider sorting an array of size $N = 100,000$ where every single element is identical (e.g. $[7, 7, 7, \\dots, 7]$).

A developer tests two partitioning schemes: Lomuto Partitioning and Hoare Partitioning.

Why does Lomuto's scheme degrade to disastrous $O(N^2)$ quadratic time with stack overflow risk, while Hoare's scheme runs smoothly in $O(N \\log N)$?`,
    options: [
      "Lomuto partitioning only works on floating point numbers, triggering floating point exceptions on integers",
      "Lomuto uses a strict less-than comparison (arr[j] < pivot); because no element is strictly less than 7, index i never advances. The pivot is placed at the end every time, producing pathological (N-1, 0) splits. In contrast, Hoare's pointers stop on elements equal to pivot, swapping them across the center and forcing an optimal balanced split around N/2",
      "Hoare partitioning uses multithreading internally to divide the work across CPU cores",
      "Lomuto partitioning is an in-place algorithm while Hoare requires O(N) heap allocations"
    ],
    correctIndex: 1,
    bookCitation: {
      book: "CLRS: Introduction to Algorithms (4th Edition)",
      rule: "Chapter 7: Quicksort — Section 7.1 vs Problem 7-1 (Hoare Partition)",
      explanation: "In Lomuto's scheme, elements equal to pivot are all treated as greater-than-or-equal, putting all duplicates into a single partition. In Hoare's scheme, both indices stop when encountering an element equal to the pivot, causing equal elements to be exchanged across the midpoint and preserving balanced recursion subtrees."
    },
    aarDebrief: {
      mentalModelMistake: "Assuming that simpler partitioning schemes like Lomuto are always equivalent in performance to two-pointer schemes.",
      authoritativeTruth: "Lomuto's partition is easier to implement but fragile on duplicate inputs. Hoare's bidirectional scan stops on equal elements, which is the mathematically required invariant to prevent O(N^2) collapse on arrays with duplicate keys."
    }
  },

  {
    id: "cpds-q1-pointer-arithmetic",
    conceptId: "cpds-pointer-memory-traps",
    category: "CPDS (C & Data Structures)",
    title: "CPDS Precedence Trap: *balance++ vs (*balance)++",
    question: `A student writes the following C function in an engineering college lab exam (Anna University / JNTU curriculum) to credit interest into an account balance:

\`\`\`c
void addBonus(int *balance) {
    *balance++;
}
\`\`\`

What is the exact execution result according to ANSI C operator precedence, and what fatal bug occurs?`,
    options: [
      "The C compiler throws a compile-time syntax error because dereference and increment cannot be combined",
      "Postfix '++' has higher precedence than unary dereference '*'. The expression evaluates as *(balance++): it dereferences the initial address, and then advances the pointer address 'balance' by sizeof(int) bytes. The balance integer value is NEVER modified, and 'balance' now points to unallocated stack memory!",
      "The value pointed to by balance is incremented twice due to operator associativity",
      "The operating system immediately aborts the process with SIGKILL"
    ],
    correctIndex: 1,
    bookCitation: {
      book: "CPDS: C Programming & Data Structures (Balagurusamy / Reema Thareja)",
      rule: "Chapter 5: Pointers & Address Arithmetic — Operator Precedence",
      explanation: "Postfix operators (++, --) bind tighter than unary prefix operators (*, &, -). Therefore *ptr++ increments the pointer variable itself, not the pointed value. To increment the actual value, parentheses are mandatory: (*ptr)++."
    },
    aarDebrief: {
      mentalModelMistake: "Confusing pointer incrementation with pointed-value mutation due to ambiguous operator precedence.",
      authoritativeTruth: "Always use explicit parentheses (*ptr)++ when mutating the value behind a pointer. Never rely on naked *ptr++ unless intentionally iterating through an array buffer in a loop."
    }
  },

  {
    id: "cp3-q1-dsu-ackermann",
    conceptId: "cp-contest-dsu-bit",
    category: "Competitive Programming (CP3/CPH)",
    title: "Contest Invariant: Why DSU Achieves O(alpha(N)) Time",
    question: `In competitive programming contests (ICPC / Codeforces / Steven Halim CP3/CP4), Disjoint Set Union (Union-Find) is used to track connected components and Kruskal's MST.

If a contestant implements Path Compression without Union by Rank, what is the worst-case degradation, and why does combining BOTH techniques achieve near-constant $O(\\alpha(N))$ time?`,
    options: [
      "Path compression without rank causes a stack overflow because recursion depth exceeds 10,000",
      "Without rank/size balancing, an adversary can create a degenerate linear chain of length N before queries compress it (O(N) per find). Combining Union by Rank (keeping tree heights logarithmic) with Path Compression guarantees that parent ranks strictly grow exponentially during traversals, bounding M operations to O(M alpha(N)), where alpha(N) <= 4 for all N <= 10^80",
      "Union by rank enables multi-threading on modern GPU architectures",
      "Path compression alone reduces complexity to O(1/N)"
    ],
    correctIndex: 1,
    bookCitation: {
      book: "Competitive Programming (CP3/CP4) by Steven & Felix Halim",
      rule: "Chapter 2: Data Structures — Section 2.4.2 (Union-Find Disjoint Sets)",
      explanation: "Path compression flattens trees during find(), but does not prevent deep trees from being constructed during union(). Union by Rank guarantees tree depth never exceeds O(log N). When combined, Tarjan proved that amortized cost per operation is O(alpha(N)), the inverse Ackermann function."
    },
    aarDebrief: {
      mentalModelMistake: "Thinking path compression alone is sufficient to guarantee O(1) amortized performance in contest data structures.",
      authoritativeTruth: "Both Path Compression AND Union by Rank are required to achieve the theoretical lower bound O(alpha(N)). Omitting rank balancing allows adversarial graphs to force O(N) chains."
    }
  }
];
