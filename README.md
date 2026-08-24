# Kanban AI — Next-Generation Project Management System

> An advanced, AI-driven Kanban board where autonomous AI agents collaborate alongside your team, backed by a robust RAG (Retrieval-Augmented Generation) Knowledge Base and Supabase pgvector.

🔗 **Live Demo:** [kanban-board-web-application.vercel.app](https://kanban-board-web-application.vercel.app)

---

## ✨ Core Features

### 🧠 1. Advanced RAG & Knowledge Base System
Upload project documents (PDFs) to create a centralized AI brain. The system features a **Zero-Cost Serverless RAG Pipeline**:
- **Client-Side Processing:** Extracts text and generates vector embeddings (`Xenova/all-MiniLM-L6-v2`) entirely within the user's browser using Web Workers.
- **Supabase pgvector:** Stores high-dimensional document vectors for instant semantic search.
- **Global AI Board Chat:** Ask questions about your project; the AI analyzes the current board state and searches the Knowledge Base to provide grounded, accurate answers.

### 🤖 2. Card-Specific Chat with Cross-Referencing
Each task card features a dedicated AI assistant. It doesn't just know the immediate task context—it actively queries the global Knowledge Base.
- **Context-Aware:** Understands the specific task requirements, priority, and tags.
- **Cross-Referencing:** Autonomously retrieves relevant documentation and data from other cards to solve complex, domain-specific problems right inside the task.

### 💾 3. Card Memory Tracker (Automated Knowledge Retention)
The system learns as you work. We implemented a background tracker that monitors board activity.
- **Automated Archiving:** The moment a task is dragged into the **"Done"** column, the tracker extracts its title, description, AI agent results, and chat history.
- **Self-Improving AI:** The completed task is instantly vectorized and embedded into the Knowledge Base.
- **Result:** If a similar issue arises in the future, the AI can instantly recall the solution from the archived task (e.g., *"This issue was previously resolved in Task #102 by using X method..."*).

### 🦾 4. Autonomous AI Agents
Assign specialized AI agents to any task card to automate workflows. Agents operate autonomously and report live status (Thinking → Working → Done).
- **Summarizer:** Refines and structures task descriptions.
- **Researcher:** Finds best practices and solutions.
- **Coder:** Writes relevant code snippets and implementation guides.
- **Reviewer:** Identifies potential edge cases and missing requirements.
- **Tester:** Generates comprehensive testing scenarios.

### 🗄️ 5. Real-Time Database & ERP-Style Navigation
- **Supabase (PostgreSQL):** All cards, columns, chat messages, and AI Agent statuses are synced in real-time.
- **Comprehensive UI:** Includes a Dashboard, Kanban Board, My Tasks, AI Agents overview, and Analytics pages.
- **Premium Dark UI:** Glassmorphism, animated status badges, and smooth drag-and-drop transitions (inspired by Linear).

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Database** | Supabase (PostgreSQL + **pgvector**) |
| **Styling** | Tailwind CSS |
| **State Management** | Zustand (Optimistic Updates) |
| **Drag & Drop** | @hello-pangea/dnd |
| **AI Model** | Google Gemini (gemini-3.5-flash) via Google Generative AI SDK |
| **Embeddings** | `Xenova/all-MiniLM-L6-v2` (Web Worker) |
| **PDF Parser** | `pdfjs-dist` (Client-side) |
| **Deployment** | Vercel (Edge Runtime) |

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/Pond9888/Kanban-Board-Web-Application.git
cd Kanban-Board-Web-Application
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file:
```bash
cp .env.local.example .env.local
```
Add your Gemini API key and Supabase credentials:
```env
GEMINI_API_KEY=AIza...

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

### 4. Set up the Database
1. Open your Supabase Dashboard -> SQL Editor.
2. Run the provided schema scripts to create tables and the `knowledge_base` vector database.
3. *Important:* Ensure the `pgvector` extension is enabled in Supabase.

### 5. Run the dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 📄 License

MIT — free to use and modify.
