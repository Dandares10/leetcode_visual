require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Ollama } = require('ollama');
const { initRAG, queryContext } = require('./rag');
const { gateway } = require('./gateway');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Ollama client connecting to local instance (default: http://localhost:11434)
const ollama = new Ollama();

// ============================================================================
// 🌟 MULTI-MODEL ORCHESTRATION: GEMINI PRO / FLASH CLOUD INTEGRATION
// ============================================================================
async function callGeminiAPI(apiKey, model, systemPrompt, userMessage, jsonMode = false) {
  const modelName = model || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const payload = {
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    contents: [
      { role: 'user', parts: [{ text: userMessage }] }
    ],
    generationConfig: {
      temperature: 0.25,
      topP: 0.9,
      maxOutputTokens: 3500
    }
  };

  if (jsonMode) {
    payload.generationConfig.responseMimeType = "application/json";
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('No content returned by Gemini API');
  }
  return text.trim();
}

// ============================================================================
// 🚀 MULTI-PROVIDER GATEWAY: OPENROUTER / DEEPSEEK / GROQ / OPENAI COMPATIBLE
// ============================================================================
async function callOpenAICompatibleAPI(apiKey, baseUrl, model, systemPrompt, userMessage, jsonMode = false) {
  const endpoint = baseUrl || 'https://openrouter.ai/api/v1/chat/completions';
  const modelName = model || 'deepseek/deepseek-coder';

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'HTTP-Referer': 'http://localhost:5174',
    'X-Title': 'Metacognitive C++ Learning Platform'
  };

  const payload = {
    model: modelName,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.2,
    max_tokens: 3500
  };

  if (jsonMode) {
    payload.response_format = { type: 'json_object' };
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Universal Provider error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('No content returned by provider API');
  }
  return text.trim();
}

app.post('/api/analyze-code', async (req, res) => {
  const { code, prompt } = req.body;

  if (!code && !prompt) {
    return res.status(400).json({ error: 'Code or prompt is required.' });
  }

  console.log(`\n🤖 Received analysis request for prompt: "${prompt ? prompt.slice(0, 50) + '...' : 'N/A'}"`);
  
  // We will instruct the model to return ONLY JSON matching our schema
  const systemPrompt = `You are a Metacognitive AI Coding Tutor. 
Your primary goal is to analyze code and explain architectural tradeoffs and the "why" behind the code.
CRITICAL: To PREVENT ROTE LEARNING, your quiz questions MUST NOT test simple syntax memorization or definitions (e.g. do NOT ask "What is X?" or "What parameter is first?").
Instead, ask situational, scenario-based questions that test understanding of:
- Subtle failure modes and edge cases (e.g. race conditions, unhandled rejections)
- Architectural trade-offs (e.g. fail-fast vs graceful degradation, security vs convenience)
- Performance and resource implications (e.g. memory leaks, TCP socket teardown)
You MUST output your response strictly as a valid JSON object matching this schema exactly, with NO markdown formatting around the JSON and NO extra text:

=== EXACT JSON SCHEMA AND EXAMPLE ===
{
  "id": "generated-id",
  "title": "Optimizing Async Operations: Sequential vs Parallel",
  "category": "Performance & Concurrency",
  "difficulty": "Intermediate",
  "prompt": "The original user prompt here",
  "intentBreakdown": [
    { "step": 1, "title": "Identify Waterfall", "details": "Sequential awaits add cumulative delay." }
  ],
  "tradeoffs": [
    { 
      "approach": "Promise.allSettled", 
      "pros": ["Parallel execution", "Partial failures okay"], 
      "cons": ["Slightly more code"], 
      "recommended": true
    }
  ],
  "code": "export async function load(userId) {\\n  // Code here\\n}",
  "chatResponse": "I've analyzed your code. Here is a breakdown of why Promise.allSettled is more efficient for this use case.",
  "whyAnnotations": {
    "2": {
      "title": "Why Promise.allSettled?",
      "badge": "Concurrency Performance",
      "type": "performance",
      "summary": "Dispatches requests simultaneously",
      "rationale": "Sequential awaits turn 300ms + 300ms into a 600ms delay."
    }
  },
  "quiz": [
    {
      "question": "What is the key advantage?",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 1,
      "explanation": "Because it doesn't fail the batch."
    }
  ]
}
=======================================

DO NOT wrap the output in \`\`\`json. Return ONLY the raw JSON object.`;

  // Retrieve relevant RAG context from local Vector DB
  const ragContext = await queryContext(prompt || "");

  const userMessage = `User Prompt: ${prompt}\n\nCode snippet:\n${code}
  
${ragContext ? `\n=== Relevant Architectural Context ===\n${ragContext}\n====================================\n\nEnsure your recommendations align with this known context if applicable.` : ''}
  
Please analyze this and provide the metacognitive JSON output.`;

  const apiKey = req.body.apiKey || process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      console.log(`🌟 Generating metacognitive code analysis with Gemini 1.5 Flash...`);
      const rawText = await callGeminiAPI(apiKey, 'gemini-1.5-flash', systemPrompt, userMessage, true);
      let cleanJson = rawText.trim();
      if (cleanJson.startsWith('```json')) cleanJson = cleanJson.slice(7, -3).trim();
      else if (cleanJson.startsWith('```')) cleanJson = cleanJson.slice(3, -3).trim();
      const parsedData = JSON.parse(cleanJson);
      return res.json(parsedData);
    } catch (geminiErr) {
      console.warn("Gemini code analysis error, falling back to local Ollama:", geminiErr.message);
    }
  }

  try {
    const response = await ollama.chat({
      model: 'qwen2.5-coder:0.5b', // Using the fast lightweight fallback model
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      format: 'json', // Force JSON output if supported by model
      stream: false
    });

    let rawJsonText = response.message.content.trim();
    
    // In case the model wrapped it in markdown despite instructions
    if (rawJsonText.startsWith('\`\`\`json')) {
      rawJsonText = rawJsonText.slice(7, -3).trim();
    } else if (rawJsonText.startsWith('\`\`\`')) {
      rawJsonText = rawJsonText.slice(3, -3).trim();
    }

    let parsedData = {};
    try {
      parsedData = JSON.parse(rawJsonText);
    } catch (parseError) {
      console.warn('Model did not return valid JSON. Fallback to raw text mapping.', rawJsonText);
      // Fallback: If JSON parsing fails, wrap the raw text into our schema.
      parsedData = {
        id: "fallback-ai-" + Date.now(),
        title: "AI Analysis",
        category: "General",
        difficulty: "Varies",
        prompt: prompt,
        intentBreakdown: [{ step: 1, title: "Analysis", details: "Model generated a free-text response." }],
        tradeoffs: [],
        code: code,
        chatResponse: rawJsonText,
        whyAnnotations: {},
        quiz: []
      };
    }
    
    // Ensure chatResponse exists even if model mapped it to another key
    if (!parsedData.chatResponse) {
      if (parsedData.text) parsedData.chatResponse = parsedData.text;
      else if (parsedData.explanation) parsedData.chatResponse = parsedData.explanation;
      else if (parsedData.response) parsedData.chatResponse = parsedData.response;
    }

    res.json(parsedData);
  } catch (error) {
    console.error('Error connecting to Ollama:', error);
    res.status(500).json({ error: 'Failed to generate analysis', details: error.message });
  }
});

// ============================================================================
// 🧠 DYNAMIC MULTI-PROVIDER AAR LITERATURE & SOCRATIC TUTOR AGENT
// (Integrates LiteLLM, Synapass, GeminiConnect, Reflex, PromptSail, Freerouter)
// ============================================================================
app.post('/api/aar-agent', async (req, res) => {
  const { prompt, currentBook, activeQuestion, activeConcept, mode, model, apiKey, openRouterApiKey } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  console.log(`\n📚 [AAR Agent] Received custom question: "${prompt.slice(0, 75)}..."`);
  console.log(`📖 Context Book: "${currentBook?.title || 'General CS/C++'}" | Mode: "${mode || 'socratic-literature'}"`);

  // 1. Update Gateway with any client/runtime keys (GeminiConnect pooling)
  gateway.setClientKeys({
    geminiKey: apiKey || process.env.GEMINI_API_KEY,
    openRouterKey: openRouterApiKey || process.env.OPENROUTER_API_KEY
  });

  // 2. Authoritative Literature Grounding as RAG context (NOT static override)
  const canonicalTheorem = getDirectCanonicalDebrief(prompt, currentBook, activeQuestion);
  const ragSearchQuery = `${prompt} ${activeConcept?.title || ''} ${currentBook?.title || ''} ${activeQuestion?.title || ''}`;
  const ragVectorMatches = await queryContext(ragSearchQuery, 2);

  const combinedRagContext = [
    canonicalTheorem ? `=== CURATED TEXTBOOK INVARIANT ===\n${canonicalTheorem}` : '',
    ragVectorMatches ? `=== VECTOR LITERATURE CONTEXT ===\n${ragVectorMatches}` : ''
  ].filter(Boolean).join('\n\n');

  // 3. Fine-tuned persona system prompt calibrated for deep literature reading & anti-rote learning
  const fineTunedSystemPrompt = `You are the Metacognitive Literature & After-Action Review (AAR) Agent.
Your role: Ground computer science concepts in peer-reviewed textbooks (CTCI, CLRS, CPDS, CP3/CP4, Modern C++, OSTEP).
Target textbook: ${currentBook?.title || 'Canonical CS Literature'}

Answer the user's specific custom question directly with these 4 phases:
### 🔍 1. Mental Model Breakdown & Rote Trap
Identify the exact flawed assumption or rote trap in naive thinking for the user's specific question.

### 📖 2. Authoritative Literature Citation & Invariant
Cite the specific textbook chapter, rule, theorem, or invariant that governs this exact scenario.

### ⚙️ 3. Mechanical Sympathy & Hardware Reality
Explain the low-level CPU cache, memory representation, compiler assembly, or time/space lower bounds.

### ❓ 4. Socratic Mastery Probe
Ask one targeted question or counter-example to test if the learner truly understands the invariant.`;

  const questionContextBlock = activeQuestion ? `
=== ACTIVE QUIZ QUESTION BEING REVIEWED ===
Title: ${activeQuestion.title || 'N/A'}
Scenario: ${activeQuestion.scenario || activeQuestion.question || 'N/A'}
Rote Misconception: ${activeQuestion.aarDebrief?.mentalModelMistake || 'N/A'}
Authoritative Standard Truth: ${activeQuestion.aarDebrief?.authoritativeTruth || 'N/A'}
Book Citation: ${activeQuestion.bookCitation ? `${activeQuestion.bookCitation.book} (${activeQuestion.bookCitation.rule || activeQuestion.bookCitation.chapter})` : 'N/A'}
===========================================` : '';

  const userMessage = `${questionContextBlock}

=== SELECTED TEXTBOOK CONTEXT ===
Title: ${currentBook?.title || 'General CS/C++'}
Author: ${currentBook?.author || 'Standard'}
License: ${currentBook?.license || 'Open'}
=================================

${combinedRagContext ? `=== GROUNDED RAG KNOWLEDGE BASE ===\n${combinedRagContext}\n===================================\n` : ''}

Learner's Specific Question:
"${prompt}"

Please generate a tailor-made, non-templated 4-phase Socratic debrief answering the exact nuances of the learner's question now.`;

  try {
    const result = await gateway.execute({
      prompt,
      systemPrompt: fineTunedSystemPrompt,
      userMessage,
      requestedModel: model || 'auto',
      ragContext: combinedRagContext
    });

    return res.json({
      text: result.text,
      model: result.model,
      groundedRag: result.groundedRag,
      cacheHit: result.cacheHit,
      latencyMs: result.latencyMs,
      tokens: result.tokens,
      book: currentBook?.title
    });
  } catch (error) {
    console.error('Gateway execution error:', error);
    return res.status(500).json({ error: 'Failed to process inquiry', details: error.message });
  }
});

// ============================================================================
// 🧩 MIXTURE-OF-SOLUTIONS (MoA) DYNAMIC & CURATED PARADIGMS
// ============================================================================
app.post('/api/multi-solution', async (req, res) => {
  const { query, concept, currentBook, apiKey, openRouterApiKey } = req.body;
  const q = (query || concept?.title || '').toLowerCase();

  console.log(`\n🧩 [Multi-Solution MoA] Generating comparative approaches for: "${(query || concept?.title || '').slice(0, 50)}..."`);

  // 1. If query matches a curated benchmark, return instant canonical data
  const curated = getComparativeSolutions(q, currentBook);
  if (curated) {
    return res.json(curated);
  }

  // 2. Otherwise, dynamically generate 4 paradigms via Multi-Provider Gateway!
  gateway.setClientKeys({
    geminiKey: apiKey || process.env.GEMINI_API_KEY,
    openRouterKey: openRouterApiKey || process.env.OPENROUTER_API_KEY
  });

  const prompt = `Analyze this algorithmic problem: "${query || concept?.title}".
Generate a comparative multi-solution analysis with 3 to 4 distinct algorithmic paradigms (e.g. Brute Force, Hash Map / Frequency Array, Two-Pointer / Sliding Window, and Hardware/Bitmask).
Format strictly as JSON with this schema:
{
  "title": "Problem Title",
  "category": "Algorithmic Category",
  "githubReferences": [{"name": "TheAlgorithms/C-Plus-Plus", "url": "https://github.com/TheAlgorithms/C-Plus-Plus"}],
  "approaches": [
    {
      "id": "approach-id",
      "name": "Approach 1: Name",
      "timeComplexity": "O(...)",
      "spaceComplexity": "O(...)",
      "mechanicalSympathy": "Detailed CPU cache, heap vs stack, and register analysis",
      "invariantTruth": "Theoretical invariant and textbook citation",
      "code": "// Clean C++ implementation"
    }
  ]
}`;

  try {
    const result = await gateway.execute({
      prompt: query || concept?.title,
      systemPrompt: "You are a Senior Systems & Algorithms Engineer. Output strictly valid JSON matching the requested schema.",
      userMessage: prompt,
      requestedModel: 'gemini-1.5-pro',
      jsonMode: true
    });

    const parsed = JSON.parse(result.text);
    return res.json(parsed);
  } catch (err) {
    console.warn("Dynamic multi-solution fallback to default complement search:", err.message);
    return res.json(getDefaultSolutions(query || concept?.title));
  }
});

// ============================================================================
// 🔬 GATEWAY MODEL PREVIEW & DIFFERENTIAL INSPECTOR ENDPOINT
// ============================================================================
app.post('/api/gateway/preview', async (req, res) => {
  const { prompt, currentBook, activeQuestion, model, apiKey, openRouterApiKey } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  gateway.setClientKeys({
    geminiKey: apiKey || process.env.GEMINI_API_KEY,
    openRouterKey: openRouterApiKey || process.env.OPENROUTER_API_KEY
  });

  // 1. Baseline Expectation (Generic static template)
  const baselineText = getDirectCanonicalDebrief(prompt, currentBook, activeQuestion) || 
    generateAuthoritativeFallback(prompt, currentBook, activeQuestion);

  // 2. Dynamic Multi-Provider Preview
  const canonicalTheorem = getDirectCanonicalDebrief(prompt, currentBook, activeQuestion);
  const ragSearchQuery = `${prompt} ${currentBook?.title || ''}`;
  const ragVectorMatches = await queryContext(ragSearchQuery, 2);

  const combinedRagContext = [
    canonicalTheorem ? `=== CURATED TEXTBOOK INVARIANT ===\n${canonicalTheorem}` : '',
    ragVectorMatches ? `=== VECTOR LITERATURE CONTEXT ===\n${ragVectorMatches}` : ''
  ].filter(Boolean).join('\n\n');

  const fineTunedSystemPrompt = `You are the Metacognitive Literature & After-Action Review (AAR) Agent.
Answer the user's specific custom question directly with 4 phases:
### 🔍 1. Mental Model Breakdown & Rote Trap
### 📖 2. Authoritative Literature Citation & Invariant
### ⚙️ 3. Mechanical Sympathy & Hardware Reality
### ❓ 4. Socratic Mastery Probe`;

  const userMessage = `Textbook: ${currentBook?.title || 'General CS'}
${combinedRagContext ? `Literature Context:\n${combinedRagContext}\n` : ''}
Learner's Specific Question: "${prompt}"`;

  const dynamicResult = await gateway.execute({
    prompt,
    systemPrompt: fineTunedSystemPrompt,
    userMessage,
    requestedModel: model || 'auto',
    ragContext: combinedRagContext
  });

  // 3. Differential Metrics
  const promptWords = prompt.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const baselineLower = baselineText.toLowerCase();
  const dynamicLower = dynamicResult.text.toLowerCase();

  const promptWordsInBaseline = promptWords.filter(w => baselineLower.includes(w)).length;
  const promptWordsInDynamic = promptWords.filter(w => dynamicLower.includes(w)).length;
  
  const specificityScore = promptWords.length > 0
    ? Math.round((promptWordsInDynamic / promptWords.length) * 100)
    : 90;

  return res.json({
    baseline: {
      text: baselineText,
      model: 'Original Baseline (Static Heuristic Template)',
      tokens: Math.round(baselineText.length / 4)
    },
    dynamic: {
      text: dynamicResult.text,
      model: dynamicResult.model,
      tokens: dynamicResult.tokens,
      latencyMs: dynamicResult.latencyMs,
      cacheHit: dynamicResult.cacheHit
    },
    metrics: {
      specificityScore,
      tokenDelta: dynamicResult.tokens - Math.round(baselineText.length / 4),
      latencyMs: dynamicResult.latencyMs,
      cacheHit: dynamicResult.cacheHit,
      model: dynamicResult.model
    }
  });
});

// ============================================================================
// 📊 PROMPTSAIL TELEMETRY & OBSERVABILITY ENDPOINT
// ============================================================================
app.get('/api/gateway/telemetry', (req, res) => {
  return res.json(gateway.telemetry.getSummary());
});

function getComparativeSolutions(query, currentBook) {
  const q = query.toLowerCase();

  if (q.includes('cycle') || q.includes('runner') || q.includes('linked list') || q.includes('tortoise')) {
    return {
      title: "Linked List Cycle Detection & Interception",
      category: "Pointers & Graph Invariants",
      githubReferences: [
        { name: "TheAlgorithms/C-Plus-Plus: floyds_cycle_detection.cpp", url: "https://github.com/TheAlgorithms/C-Plus-Plus" },
        { name: "CP-Algorithms: Cycle Finding in Graphs", url: "https://cp-algorithms.com/" }
      ],
      approaches: [
        {
          id: "brute-set",
          name: "Approach A: Hash Set Address Tracking",
          timeComplexity: "O(N)",
          spaceComplexity: "O(N) Heap",
          mechanicalSympathy: "Allocates std::unordered_set<ListNode*> on the heap. Triggers pointer hashing, virtual page lookups, and cache line misses per node.",
          invariantTruth: "Guarantees detection at the cost of O(N) auxiliary memory overhead.",
          code: `bool hasCycle(ListNode* head) {
    std::unordered_set<ListNode*> visited;
    for (ListNode* curr = head; curr; curr = curr->next) {
        if (visited.count(curr)) return true;
        visited.insert(curr);
    }
    return false;
}`
        },
        {
          id: "floyd-runner",
          name: "Approach B: Floyd's Two-Pointer Runner",
          timeComplexity: "O(N)",
          spaceComplexity: "O(1) Memory",
          mechanicalSympathy: "Zero heap allocations. Only two CPU pointer registers (rdi/rsi). Streaming memory prefetcher traces contiguous node pointers in L1 cache.",
          invariantTruth: "CTCI Ch. 2.2 / McDowell: Congruence K = pC - M guarantees collision inside cycle and collision at cycle entrance when reset to 1x.",
          code: `bool hasCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`
        }
      ]
    };
  }

  if (q.includes('partition') || q.includes('lomuto') || q.includes('hoare') || q.includes('quicksort')) {
    return {
      title: "Partitioning Invariants: Lomuto vs Hoare vs 3-Way DNF",
      category: "Sorting & Invariant Maintenance",
      githubReferences: [
        { name: "TheAlgorithms/C-Plus-Plus: quick_sort.cpp", url: "https://github.com/TheAlgorithms/C-Plus-Plus/blob/master/sorting/quick_sort.cpp" },
        { name: "TheAlgorithms/C-Plus-Plus: 3_way_quick_sort.cpp", url: "https://github.com/TheAlgorithms/C-Plus-Plus/blob/master/sorting/3_way_quick_sort.cpp" },
        { name: "CP-Algorithms: Quicksort Invariants", url: "https://cp-algorithms.com/sequences/rmq.html" }
      ],
      approaches: [
        {
          id: "lomuto-unidirectional",
          name: "Approach 1: Lomuto Unidirectional Partition",
          timeComplexity: "O(N²) Worst Case (Duplicates)",
          spaceComplexity: "O(N) Call Stack Frames",
          mechanicalSympathy: "Simpler loop branch structure. However, on arrays of identical elements, branch predictor is bypassed, predicate fails universally, causing full quadratic stack explosion.",
          invariantTruth: "CLRS Ch. 7 / Prob 7-1: Predicate A[j] < x fails when all elements equal pivot. No swaps occur, producing 0 / N-1 unbalanced partitions.",
          code: `// Lomuto Partition (Catastrophic on duplicate elements)
int lomutoPartition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; ++j) {
        if (arr[j] < pivot) {
            ++i;
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return i + 1;
}`
        },
        {
          id: "hoare-bidirectional",
          name: "Approach 2: Hoare Bidirectional Partition",
          timeComplexity: "O(N log N) Average",
          spaceComplexity: "O(log N) Call Stack",
          mechanicalSympathy: "Two pointers converge from opposing ends. Halts on elements equal to pivot, forcing equal distribution across midpoint and preventing stack blowouts.",
          invariantTruth: "CLRS Problem 7-1: Invariant guarantees elements to left are <= pivot and elements to right are >= pivot. Balances equal elements evenly.",
          code: `// Hoare Partition (Preserves balance on duplicates)
int hoarePartition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[low + (high - low) / 2];
    int i = low - 1, j = high + 1;
    while (true) {
        do { ++i; } while (arr[i] < pivot);
        do { --j; } while (arr[j] > pivot);
        if (i >= j) return j;
        std::swap(arr[i], arr[j]);
    }
}`
        },
        {
          id: "dutch-national-flag",
          name: "Approach 3: Dijkstra's 3-Way DNF Partition",
          timeComplexity: "O(N) on Duplicates / O(N log N)",
          spaceComplexity: "O(log N) Call Stack",
          mechanicalSympathy: "Partitions vector into 3 contiguous slices: [< pivot], [== pivot], [> pivot]. Completely skips recursion on duplicate middle elements.",
          invariantTruth: "Sedgewick & Dijkstra: Solves the duplicate element problem optimally. Runs in strictly linear O(N) time when unique keys are bounded.",
          code: `// Dijkstra 3-Way Partitioning (Optimal for heavy duplicates)
void threeWayPartition(std::vector<int>& arr, int low, int high, int& lt, int& gt) {
    int pivot = arr[low];
    lt = low;
    gt = high;
    int i = low + 1;
    while (i <= gt) {
        if (arr[i] < pivot) std::swap(arr[lt++], arr[i++]);
        else if (arr[i] > pivot) std::swap(arr[i], arr[gt--]);
        else ++i;
    }
}`
        }
      ]
    };
  }

  if (q.includes('unique') || q.includes('bitmask') || q.includes('ascii')) {
    return {
      title: "String Character Uniqueness & Register Minimization",
      category: "Bit Manipulation & Memory Alignment",
      githubReferences: [
        { name: "TheAlgorithms/C-Plus-Plus: is_unique.cpp", url: "https://github.com/TheAlgorithms/C-Plus-Plus" },
        { name: "CTCI Chapter 1.1 / Gayle McDowell", url: "https://github.com/careercup/ctci" }
      ],
      approaches: [
        {
          id: "hash-set-unique",
          name: "Approach 1: std::unordered_set<char>",
          timeComplexity: "O(N) Time",
          spaceComplexity: "O(N) Heap Overhead",
          mechanicalSympathy: "Allocates bucket arrays and dynamic nodes on the heap. Multiple cache line misses per character due to pointer chasing.",
          invariantTruth: "Rote implementation. Correct mathematically but heavyweight and unnecessary for finite alphabet sizes.",
          code: `bool isUniqueSet(const std::string& str) {
    std::unordered_set<char> seen;
    for (char c : str) {
        if (seen.count(c)) return false;
        seen.insert(c);
    }
    return true;
}`
        },
        {
          id: "boolean-vector-unique",
          name: "Approach 2: Direct ASCII Array / std::bitset<128>",
          timeComplexity: "O(N) Time (or O(1) if N > 128)",
          spaceComplexity: "O(1) Stack Memory (16 bytes)",
          mechanicalSympathy: "Allocates 128 bits (16 bytes) on stack. Fits entirely within a single 64-byte L1 data cache line.",
          invariantTruth: "Pigeonhole Principle: If string length > 128 for ASCII, an immediate collision is mathematically guaranteed in O(1) time.",
          code: `bool isUniqueBitset(const std::string& str) {
    if (str.length() > 128) return false; // Pigeonhole Principle
    std::bitset<128> charSet;
    for (char c : str) {
        if (charSet.test(static_cast<unsigned char>(c))) return false;
        charSet.set(static_cast<unsigned char>(c));
    }
    return true;
}`
        },
        {
          id: "cpu-register-bitmask",
          name: "Approach 3: Single 32-bit Register Bitmask",
          timeComplexity: "O(N) Time",
          spaceComplexity: "0 Bytes Heap/Stack (1 CPU Register)",
          mechanicalSympathy: "State kept exclusively inside register eax. Single-cycle bitwise shifts and AND tests with zero memory bus transactions.",
          invariantTruth: "CTCI 1.1: For lowercase English letters ('a'-'z'), 26 bits map directly to the lower bits of an integer register.",
          code: `bool isUniqueRegister(const std::string& str) {
    uint32_t checker = 0;
    for (char c : str) {
        int bitAtIndex = c - 'a';
        if ((checker & (1U << bitAtIndex)) > 0) return false;
        checker |= (1U << bitAtIndex);
    }
    return true;
}`
        }
      ]
    };
  }


  if (q.includes('two sum') || q.includes('complement') || q.includes('bud') || q.includes('pair')) {
    return getDefaultSolutions();
  }

  return null;
}

function getDefaultSolutions(customTitle) {
  return {
    title: customTitle ? `Algorithmic Transformation: ${customTitle}` : "Complement Search & BUD Invariant Transformation",
    category: "Array & Algorithmic Optimization",
    githubReferences: [
      { name: "TheAlgorithms/C-Plus-Plus: two_sum.cpp", url: "https://github.com/TheAlgorithms/C-Plus-Plus" },
      { name: "CP-Algorithms: Two Pointers Technique", url: "https://cp-algorithms.com/" },
      { name: "Together AI: Mixture-of-Agents (MoA)", url: "https://github.com/togethercomputer/MoA" }
    ],
    approaches: [
      {
        id: "brute-force",
        name: "Approach 1: Naive Nested Iteration",
        timeComplexity: "O(N²)",
        spaceComplexity: "O(1)",
        mechanicalSympathy: "High branch mispredictions. Scans N-1 elements repeatedly, evicting L1/L2 cache lines continuously on large arrays.",
        invariantTruth: "Violates BUD (Bottlenecks, Unnecessary work). Recomputes complements instead of indexing.",
        code: `// Naive O(N²) Quadratic Search
std::vector<int> twoSum(const std::vector<int>& arr, int target) {
    int n = arr.size();
    for (int i = 0; i < n; ++i) {
        for (int j = i + 1; j < n; ++j) {
            if (arr[i] + arr[j] == target) return {i, j};
        }
    }
    return {};
}`
      },
      {
        id: "hash-map",
        name: "Approach 2: Space-for-Time Hash Map",
        timeComplexity: "O(N) amortized",
        spaceComplexity: "O(N) Heap",
        mechanicalSympathy: "Reduces iterations to 1 pass. However, std::unordered_map incurs heap node allocations and hash bucket pointer indirection.",
        invariantTruth: "CTCI Ch. 1: Trades O(N) memory to eliminate the inner search bottleneck in O(1) amortized lookup.",
        code: `// Hash Map O(N) Space Tradeoff
std::vector<int> twoSum(const std::vector<int>& arr, int target) {
    std::unordered_map<int, int> seen;
    for (int i = 0; i < arr.size(); ++i) {
        int complement = target - arr[i];
        if (seen.count(complement)) return {seen[complement], i};
        seen[arr[i]] = i;
    }
    return {};
}`
      },
      {
        id: "two-pointers",
        name: "Approach 3: Sorted Two-Pointer Invariant",
        timeComplexity: "O(N log N) / O(N)",
        spaceComplexity: "O(1)",
        mechanicalSympathy: "Contiguous vector traversal from both ends. High L1 cache line spatial locality with zero heap allocation overhead.",
        invariantTruth: "CP-Algorithms: Preserves monotonicity. Left increment increases sum; right decrement decreases sum deterministically.",
        code: `// Two-Pointer Invariant (Sorted Input)
std::vector<int> twoSumSorted(const std::vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return {left, right};
        else if (sum < target) ++left;
        else --right;
    }
    return {};
}`
      },
      {
        id: "register-bitmask",
        name: "Approach 4: Single-Register Bit Vector",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1) Register",
        mechanicalSympathy: "Zero heap overhead. The entire state resides in a single 32/64-bit general-purpose CPU register (eax/rax), executing in 1 CPU clock cycle.",
        invariantTruth: "CTCI Ch. 1.1: When universe is bounded (e.g. 26 letters or ASCII), bitmask operations eliminate all memory allocations.",
        code: `// Hardware Sympathy: 32-bit CPU Register Bitmask
bool isUniqueChars(const std::string& str) {
    uint32_t checker = 0;
    for (char c : str) {
        int val = c - 'a';
        if (checker & (1 << val)) return false; // Collision in 1 CPU cycle
        checker |= (1 << val);
    }
    return true;
}`
      }
    ]
  };
}

function getDirectCanonicalDebrief(prompt, currentBook, activeQuestion) {
  const p = prompt.toLowerCase();

  if (p.includes('bud') || p.includes('cracking') || p.includes('ctci') || p.includes('mcdowell') || p.includes('runner') || p.includes('bit vector')) {
    return `*Cracking the Coding Interview (6th Ed, Gayle Laakmann McDowell, Chapter VII)*:
- Bottlenecks: The O(N²) nested loop dominates your runtime. Optimizing a separate O(N) step does not reduce overall complexity.
- Unnecessary Work: Searching for target pairs by scanning remaining elements repeatedly computes values lookable in O(1) amortized time.
- The Runner Technique (Ch. 2.2): Advancing two pointers at differing speeds (1x and 2x) guarantees collision inside cycle in O(N) time with O(1) auxiliary memory.`;
  }

  if (p.includes('clrs') || p.includes('lomuto') || p.includes('hoare') || p.includes('quicksort') || p.includes('master theorem') || p.includes('loop invariant') || p.includes('cormen')) {
    return `*Introduction to Algorithms (CLRS, 4th Edition, Chapter 7 & Problem 7-1)*:
- Lomuto Partition: Predicate A[j] < x is universally FALSE on identical elements. No swaps occur, collapsing recurrence to T(N) = T(N-1) + Θ(N), yielding quadratic O(N²) execution.
- Hoare Partition Invariant: Halts on elements equal to pivot (A[i] >= x and A[j] <= x), forcing equal elements to swap across the midpoint and guaranteeing balanced ⌊N/2⌋ subproblems.`;
  }

  if (p.includes('cpds') || p.includes('*p++') || p.includes('pointer') || p.includes('balagurusamy') || p.includes('thareja') || p.includes('padding') || p.includes('precedence')) {
    return `*C Programming & Data Structures (E. Balagurusamy, Ch. 11 / Reema Thareja, Ch. 7)*:
- Operator Precedence Invariant: Postfix increment (++) has Level 2 precedence; dereference (*) has Level 3. *p++ parses as *(p++), returning current value and incrementing pointer address by sizeof(*p). Mutating value requires (*p)++.`;
  }

  if (p.includes('cp3') || p.includes('cp4') || p.includes('dsu') || p.includes('fenwick') || p.includes('halim') || p.includes('ackermann') || p.includes('union-find')) {
    return `*Competitive Programming 3 / 4 (Steven & Felix Halim, Ch. 2.4)*:
- Inverse Ackermann Invariant: Union by Rank combined with Path Compression bounds any sequence of M operations on N elements to O(M α(N)), where α(N) <= 4.`;
  }

  if (p.includes('move') || p.includes('rvalue') || p.includes('const') || p.includes('copy')) {
    return `*Modern C++ Tutorial (Changkun Ou, §5.2) & ISO C++ Core Guidelines (F.18)*:
- Move Semantics Invariant: std::move(x) casts to rvalue reference. If object is const T, std::move(obj) produces const T&&, which cannot bind to non-const T(T&&). Compiler silently falls back to copy constructor T(const T&).`;
  }

  return null;
}

function generateAuthoritativeFallback(prompt, currentBook, activeQuestion) {
  const specific = getDirectCanonicalDebrief(prompt, currentBook, activeQuestion);
  if (specific) return specific;

  return `### 🔍 1. Mental Model Breakdown & Rote Trap
Rote memorization focuses on superficial syntax. High-performance algorithmic mastery requires understanding mathematical invariants.

### 📖 2. Authoritative Literature Citation & Invariant
*Curated Literature Reference: ${currentBook?.title || 'Canonical Computer Science Curriculum'}*:
Every reliable data structure exists to resolve physical asymptotic complexity, cache alignment, or memory hardware bounds.

### ⚙️ 3. Mechanical Sympathy & Hardware Reality
CPUs execute instruction streams interacting with hierarchical cache lines. Memory locality and branch predictability dominate runtime.

### ❓ 4. Socratic Mastery Probe
Under what specific input distribution does your current algorithm degenerate into worst-case time or cache thrashing?`;
}

// Initialize RAG DB, Multi-Provider Gateway, and then start server
initRAG().then(() => gateway.init()).then(() => {
  app.listen(port, () => {
    console.log(`🧠 Metacognitive AI API running at http://localhost:${port}`);
    console.log(`🚀 Multi-Provider Gateway active: LiteLLM, Synapass, GeminiConnect, Reflex, PromptSail, Freerouter`);
    console.log(`📚 Local Vector DB (LanceDB) is active for RAG context.`);
    console.log(`🎓 Dynamic Socratic Literature AAR Agent endpoint active at /api/aar-agent`);
    console.log(`🔬 Model Preview & Differential Inspector active at /api/gateway/preview`);
  });
}).catch(err => {
  console.error("Failed to initialize RAG and Gateway:", err);
});

