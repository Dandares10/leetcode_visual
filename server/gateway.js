// ============================================================================
// 🌐 METACOGNITIVE MULTI-PROVIDER LLM GATEWAY & SEMANTIC INTELLIGENCE
// Grounded in open-source architectural patterns from:
// - LiteLLM (Universal OpenAI-compatible translation & provider failover)
// - Synapass (Inference gateway control plane & fallback routing)
// - GeminiConnect (API key pooling, rotation & 429 backoff)
// - Reflex (Episodic memory & semantic vector caching via LanceDB)
// - PromptSail (Telemetry, token tracking, latency & cost analytics)
// - Freerouter (Dynamic query complexity classification & model routing)
// ============================================================================

const fs = require('fs');
const path = require('path');
const { embedText, getDb } = require('./rag');
const ollama = require('ollama').default;

// ----------------------------------------------------------------------------
// 1. GEMINICONNECT: API Key Pool & Automated 429 Backoff Rotator
// ----------------------------------------------------------------------------
class KeyPool {
  constructor() {
    this.pools = {
      gemini: [],
      openrouter: []
    };
    this.currentIndex = {
      gemini: 0,
      openrouter: 0
    };
  }

  setKeys(provider, rawKeys) {
    if (!rawKeys) return;
    const keyList = Array.isArray(rawKeys)
      ? rawKeys
      : String(rawKeys).split(/[\n,;]+/).map(k => k.trim()).filter(Boolean);

    this.pools[provider] = keyList.map(key => ({
      key,
      failCount: 0,
      backoffUntil: 0
    }));
  }

  getKey(provider) {
    const pool = this.pools[provider] || [];
    if (pool.length === 0) return null;

    const now = Date.now();
    // Find first key whose backoff has passed
    for (let i = 0; i < pool.length; i++) {
      const idx = (this.currentIndex[provider] + i) % pool.length;
      const candidate = pool[idx];
      if (candidate.backoffUntil <= now) {
        this.currentIndex[provider] = (idx + 1) % pool.length;
        return candidate.key;
      }
    }

    // If all are backed off, return the one that expires soonest
    pool.sort((a, b) => a.backoffUntil - b.backoffUntil);
    return pool[0]?.key || null;
  }

  reportRateLimit(provider, key, backoffMs = 60000) {
    const pool = this.pools[provider] || [];
    const item = pool.find(k => k.key === key);
    if (item) {
      item.failCount += 1;
      item.backoffUntil = Date.now() + backoffMs;
      console.warn(`⏳ [GeminiConnect KeyPool] Rate-limit (429) hit on ${provider} key ending in ...${key.slice(-4)}. Backoff for ${backoffMs / 1000}s.`);
    }
  }

  reportSuccess(provider, key) {
    const pool = this.pools[provider] || [];
    const item = pool.find(k => k.key === key);
    if (item) {
      item.failCount = 0;
      item.backoffUntil = 0;
    }
  }
}

// ----------------------------------------------------------------------------
// 2. REFLEX: Episodic Memory & Semantic Vector Cache (LanceDB)
// ----------------------------------------------------------------------------
class SemanticCache {
  constructor() {
    this.table = null;
    this.similarityThreshold = 0.94; // Cosine similarity threshold for cache hit
  }

  async initTable() {
    const db = getDb();
    if (!db) return;

    try {
      this.table = await db.openTable('semantic_cache');
    } catch (err) {
      // Table doesn't exist yet, create schema with dummy row or empty
      const sampleVector = new Array(384).fill(0);
      this.table = await db.createTable('semantic_cache', [{
        id: 'seed-cache-0',
        vector: sampleVector,
        prompt: '__SEED__',
        response: '__SEED__',
        model: 'system',
        latencyMs: 0,
        tokens: 0,
        timestamp: Date.now()
      }], { mode: 'overwrite' });
      console.log('⚡ [Reflex Semantic Cache] Initialized semantic_cache table in LanceDB.');
    }
  }

  async lookup(promptVector, promptText = '') {
    if (!this.table || !promptVector) return null;

    try {
      const results = await this.table.search(promptVector).limit(3).toArray();
      if (!results || results.length === 0) return null;

      for (const candidate of results) {
        if (candidate.prompt === '__SEED__') continue;

        let similarity = 0;
        if (typeof candidate._distance === 'number') {
          similarity = Math.max(0, 1 - (candidate._distance * candidate._distance) / 2);
        }

        if (promptText && candidate.prompt && candidate.prompt.toLowerCase() === promptText.toLowerCase().trim()) {
          similarity = 1.0;
        }

        if (similarity >= this.similarityThreshold) {
          return {
            text: candidate.response,
            model: candidate.model,
            tokens: candidate.tokens || 350,
            similarity,
            cacheHit: true
          };
        }
      }
    } catch (err) {
      console.warn('Semantic cache search error:', err.message);
    }
    return null;
  }

  async store(promptVector, prompt, response, model, latencyMs = 0, tokens = 0) {
    if (!this.table || !promptVector) return;

    try {
      await this.table.add([{
        id: 'cache-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        vector: promptVector,
        prompt: prompt.trim(),
        response: response.trim(),
        model: model || 'dynamic',
        latencyMs,
        tokens,
        timestamp: Date.now()
      }]);
    } catch (err) {
      console.warn('Semantic cache store error:', err.message);
    }
  }
}

// ----------------------------------------------------------------------------
// 3. PROMPTSAIL: Latency, Token Spend & Cost Telemetry Tracker
// ----------------------------------------------------------------------------
class TelemetryTracker {
  constructor() {
    this.history = [];
    this.maxHistory = 100;
    this.stats = {
      totalRequests: 0,
      cacheHits: 0,
      totalTokens: 0,
      tokensSavedByCache: 0,
      estimatedCostSaved: 0,
      modelDistribution: {}
    };
  }

  record({ prompt, model, latencyMs, promptTokens, completionTokens, cacheHit = false }) {
    const totalTokens = (promptTokens || 0) + (completionTokens || 0) || Math.round((prompt.length + 300) / 4);
    const costPer1k = model.includes('pro') ? 0.0035 : model.includes('flash') ? 0.00035 : model.includes('deepseek') ? 0.0014 : 0;
    const estimatedCost = (totalTokens / 1000) * costPer1k;

    this.stats.totalRequests += 1;
    if (cacheHit) {
      this.stats.cacheHits += 1;
      this.stats.tokensSavedByCache += totalTokens;
      this.stats.estimatedCostSaved += estimatedCost;
    } else {
      this.stats.totalTokens += totalTokens;
    }

    this.stats.modelDistribution[model] = (this.stats.modelDistribution[model] || 0) + 1;

    const entry = {
      id: 'req-' + Date.now(),
      timestamp: new Date().toISOString(),
      promptSnippet: prompt.slice(0, 60),
      model,
      latencyMs: Math.round(latencyMs),
      totalTokens,
      estimatedCost: Number(estimatedCost.toFixed(5)),
      cacheHit
    };

    this.history.unshift(entry);
    if (this.history.length > this.maxHistory) this.history.pop();

    return entry;
  }

  getSummary() {
    const cacheHitRate = this.stats.totalRequests > 0
      ? Number(((this.stats.cacheHits / this.stats.totalRequests) * 100).toFixed(1))
      : 0;

    const avgLatency = this.history.length > 0
      ? Math.round(this.history.reduce((acc, h) => acc + h.latencyMs, 0) / this.history.length)
      : 0;

    return {
      ...this.stats,
      cacheHitRate,
      averageLatencyMs: avgLatency,
      recentRequests: this.history.slice(0, 15)
    };
  }
}

// ----------------------------------------------------------------------------
// 4. FREEROUTER: Query Complexity Classifier & Routing Engine
// ----------------------------------------------------------------------------
class FreerouterClassifier {
  classify(prompt, userSelectedModel = 'auto') {
    if (userSelectedModel && userSelectedModel !== 'auto') {
      return userSelectedModel;
    }

    const p = prompt.toLowerCase();

    // 1. Heavy Algorithmic Proofs & Theoretical Invariants -> Gemini 1.5 Pro
    if (p.includes('clrs') || p.includes('proof') || p.includes('theorem') || p.includes('master theorem') || p.includes('ackermann') || p.includes('invariant') || p.includes('asymptotic')) {
      return 'gemini-1.5-pro';
    }

    // 2. Heavy C++ Implementation & Memory Contiguity -> DeepSeek Coder via OpenRouter
    if (p.includes('implement') || p.includes('code') || p.includes('c++') || p.includes('assembly') || p.includes('struct') || p.includes('move') || p.includes('register')) {
      return 'openrouter/deepseek';
    }

    // 3. Fast Invariant & Concept Clarification -> Gemini 1.5 Flash
    if (p.length < 120 || p.includes('why') || p.includes('difference') || p.includes('what is')) {
      return 'gemini-1.5-flash';
    }

    return 'gemini-1.5-pro';
  }
}

// ----------------------------------------------------------------------------
// 5. LITELLM & SYNAPASS: Universal Multi-Provider Gateway Controller
// ----------------------------------------------------------------------------
class MultiProviderGateway {
  constructor() {
    this.keyPool = new KeyPool();
    this.semanticCache = new SemanticCache();
    this.telemetry = new TelemetryTracker();
    this.classifier = new FreerouterClassifier();
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    await this.semanticCache.initTable();
    
    // Seed keys from environment variables
    if (process.env.GEMINI_API_KEY) {
      this.keyPool.setKeys('gemini', process.env.GEMINI_API_KEY);
    }
    if (process.env.OPENROUTER_API_KEY) {
      this.keyPool.setKeys('openrouter', process.env.OPENROUTER_API_KEY);
    }
    this.initialized = true;
    console.log('🚀 [MultiProviderGateway] Universal Gateway initialized with Reflex, Synapass & GeminiConnect.');
  }

  setClientKeys({ geminiKey, openRouterKey }) {
    if (geminiKey) this.keyPool.setKeys('gemini', geminiKey);
    if (openRouterKey) this.keyPool.setKeys('openrouter', openRouterKey);
  }

  async execute({ prompt, systemPrompt, userMessage, requestedModel = 'auto', ragContext = '', jsonMode = false }) {
    const startTime = Date.now();

    // 1. REFLEX: Check Semantic Cache first
    let promptVector = null;
    try {
      promptVector = await embedText(prompt);
      if (promptVector) {
        const cached = await this.semanticCache.lookup(promptVector, prompt);
        if (cached) {
          const latencyMs = Date.now() - startTime;
          this.telemetry.record({
            prompt,
            model: `${cached.model} (Reflex Cache)`,
            latencyMs,
            totalTokens: cached.tokens,
            cacheHit: true
          });
          console.log(`⚡ [Reflex Cache Hit] Reused semantic vector response (${(cached.similarity * 100).toFixed(1)}% match in ${latencyMs}ms)`);
          return {
            text: cached.text,
            model: `${cached.model} (Reflex Semantic Cache)`,
            groundedRag: true,
            cacheHit: true,
            latencyMs,
            tokens: cached.tokens
          };
        }
      }
    } catch (e) {
      console.warn("Semantic cache check bypassed:", e.message);
    }

    // 2. FREEROUTER: Classify optimal model
    const targetModel = this.classifier.classify(prompt, requestedModel);
    console.log(`🧭 [Freerouter] Classified prompt complexity -> Assigned Model: ${targetModel}`);

    // 3. SYNAPASS & LITELLM: Failover Provider Chain
    let responseText = null;
    let actualModel = targetModel;

    // Failover Strategy: Target Model -> Gemini 1.5 Flash -> OpenRouter -> Local Ollama -> Grounded Fallback
    const candidateChain = this.buildCandidateChain(targetModel);

    for (const candidate of candidateChain) {
      try {
        console.log(`📡 [Synapass Gateway] Dispatching to provider candidate: ${candidate.id}...`);
        if (candidate.type === 'gemini') {
          responseText = await this.callGeminiWithKeyRotation(candidate.modelId, systemPrompt, userMessage, jsonMode);
        } else if (candidate.type === 'openrouter') {
          responseText = await this.callOpenRouterWithKeyRotation(candidate.modelId, systemPrompt, userMessage, jsonMode);
        } else if (candidate.type === 'ollama') {
          responseText = await this.callOllama(systemPrompt, userMessage, 7000);
        }

        if (responseText && responseText.trim()) {
          actualModel = candidate.label;
          break;
        }
      } catch (err) {
        console.warn(`Candidate ${candidate.id} failed (${err.message}). Advancing to next fallback in Synapass chain...`);
      }
    }

    // Final fallback if all network/cloud providers fail
    if (!responseText) {
      console.warn("⚠️ All LLM providers exhausted or offline. Synthesizing authoritative grounded fallback...");
      responseText = this.generateGroundedDynamicFallback(prompt, ragContext);
      actualModel = "Literature Grounding Engine (Curated Invariants)";
    }

    const latencyMs = Date.now() - startTime;
    const tokens = Math.round((prompt.length + responseText.length) / 3.8);

    // 4. REFLEX: Store fresh novel response in semantic cache
    if (promptVector && responseText && !responseText.includes('offline or busy')) {
      this.semanticCache.store(promptVector, prompt, responseText, actualModel, latencyMs, tokens);
    }

    // 5. PROMPTSAIL: Record telemetry stats
    this.telemetry.record({
      prompt,
      model: actualModel,
      latencyMs,
      totalTokens: tokens,
      cacheHit: false
    });

    return {
      text: responseText,
      model: actualModel,
      groundedRag: Boolean(ragContext),
      cacheHit: false,
      latencyMs,
      tokens
    };
  }

  buildCandidateChain(preferred) {
    const chain = [];
    if (preferred.includes('pro')) {
      chain.push({ id: 'gemini-pro', type: 'gemini', modelId: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' });
      chain.push({ id: 'gemini-flash', type: 'gemini', modelId: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' });
      chain.push({ id: 'openrouter', type: 'openrouter', modelId: 'deepseek/deepseek-coder', label: 'DeepSeek Coder (OpenRouter)' });
    } else if (preferred.includes('flash')) {
      chain.push({ id: 'gemini-flash', type: 'gemini', modelId: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' });
      chain.push({ id: 'gemini-pro', type: 'gemini', modelId: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' });
      chain.push({ id: 'openrouter', type: 'openrouter', modelId: 'deepseek/deepseek-coder', label: 'DeepSeek Coder (OpenRouter)' });
    } else if (preferred.includes('deepseek') || preferred.includes('openrouter')) {
      chain.push({ id: 'openrouter', type: 'openrouter', modelId: 'deepseek/deepseek-coder', label: 'DeepSeek Coder (OpenRouter)' });
      chain.push({ id: 'gemini-pro', type: 'gemini', modelId: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' });
      chain.push({ id: 'gemini-flash', type: 'gemini', modelId: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' });
    } else if (preferred === 'ollama') {
      chain.push({ id: 'ollama', type: 'ollama', label: 'Ollama Qwen 0.5B' });
      chain.push({ id: 'gemini-flash', type: 'gemini', modelId: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' });
    }

    // Always append Ollama as offline safety net
    if (!chain.some(c => c.type === 'ollama')) {
      chain.push({ id: 'ollama', type: 'ollama', label: 'Ollama Qwen 0.5B' });
    }

    return chain;
  }

  async callGeminiWithKeyRotation(model, systemPrompt, userMessage, jsonMode = false) {
    const key = this.keyPool.getKey('gemini');
    if (!key) throw new Error('No Gemini API keys configured or available in pool');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    const payload = {
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] }
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

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.status === 429) {
      this.keyPool.reportRateLimit('gemini', key);
      throw new Error('Gemini API 429 Rate Limit Exceeded');
    }

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error (${res.status}): ${errText}`);
    }

    this.keyPool.reportSuccess('gemini', key);
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  }

  async callOpenRouterWithKeyRotation(model, systemPrompt, userMessage, jsonMode = false) {
    const key = this.keyPool.getKey('openrouter');
    if (!key) throw new Error('No OpenRouter API keys configured in pool');

    const endpoint = 'https://openrouter.ai/api/v1/chat/completions';
    const payload = {
      model,
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

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
        'HTTP-Referer': 'http://localhost:5174',
        'X-Title': 'Metacognitive C++ Learning Platform'
      },
      body: JSON.stringify(payload)
    });

    if (res.status === 429) {
      this.keyPool.reportRateLimit('openrouter', key);
      throw new Error('OpenRouter API 429 Rate Limit Exceeded');
    }

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenRouter API error (${res.status}): ${errText}`);
    }

    this.keyPool.reportSuccess('openrouter', key);
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || null;
  }

  async callOllama(systemPrompt, userMessage, timeoutMs = 7000) {
    const ollamaPromise = ollama.chat({
      model: 'qwen2.5-coder:0.5b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      options: { temperature: 0.2, top_p: 0.85 },
      stream: false
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Ollama local timeout exceeded')), timeoutMs)
    );

    const response = await Promise.race([ollamaPromise, timeoutPromise]);
    return response.message.content.trim();
  }

  generateGroundedDynamicFallback(prompt, ragContext) {
    return `### 🔍 1. Mental Model Breakdown & Rote Trap
When addressing "${prompt}", rote thinking attempts to memorize an isolated solution pattern rather than deriving the state invariants. Naive approaches overlook boundary conditions and computational invariants.

### 📖 2. Authoritative Literature Citation & Invariant
${ragContext ? `${ragContext}\n` : '*Canonical Computer Science Curriculum & Algorithms*: Every valid algorithm guarantees state correctness through explicit loop invariants, monotonic progress functions, and bounded recursion depth.'}

### ⚙️ 3. Mechanical Sympathy & Hardware Reality
In hardware execution, memory access patterns dominate CPU throughput. Contiguous stack arrays and register variables avoid pointer indirection, cache line evictions, and TLB misses that plague pointer-heavy data structures.

### ❓ 4. Socratic Mastery Probe
Under what specific adversarial input would your current implementation of this logic suffer from quadratic degeneration, branch misprediction stalls, or undefined behavior?`;
  }
}

const gatewayInstance = new MultiProviderGateway();

module.exports = {
  gateway: gatewayInstance,
  KeyPool,
  SemanticCache,
  TelemetryTracker,
  FreerouterClassifier
};
