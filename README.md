# Kanban AI — AI-Powered Project Management

> A modern Kanban board where AI agents work **alongside your team** in real-time.

🔗 **Live Demo:** [kanban-board-web-application.vercel.app](https://kanban-board-web-application.vercel.app)

---

## ✨ Features

### 🤖 AI Agents per Card
Assign AI agents to any task card. Each agent runs autonomously and reports back with live status:
- **Thinking** → **Working** → **Done / Failed**
- 5 agent types: Summarizer, Researcher, Code Writer, Reviewer, Test Writer

### 💬 AI Chat
Chat with an AI assistant inside every card. The AI understands the task context and answers instantly with streaming responses.

### ✨ AI Summarize & Priority
- One-click AI rewrite of task descriptions
- AI analyzes the task and suggests the right priority (Low / Medium / High / Critical) with reasoning

### 📋 ERP-Style Navigation
Full sidebar navigation with working pages:
- **Dashboard** — live stats, active agents, recent activity
- **Kanban Board** — drag-and-drop cards across columns
- **My Tasks** — all cards grouped by priority
- **AI Agents** — overview of every agent across the board
- **Analytics** — cards by column, priority, and agent usage

### 🎨 Premium Dark UI
Glassmorphism cards, gradient column headers, animated status badges, and smooth transitions — inspired by Linear and Vercel.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Drag & Drop | @hello-pangea/dnd |
| AI | Claude API (claude-haiku-4-5) via Anthropic SDK |
| Deployment | Vercel |

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

### 3. Set up environment
```bash
cp .env.local.example .env.local
```
Edit `.env.local` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-...
```
Get a key at [console.anthropic.com](https://console.anthropic.com)

### 4. Run the dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
app/
├── page.tsx              # Dashboard
├── board/page.tsx        # Kanban Board
├── tasks/page.tsx        # My Tasks
├── ai-agents/page.tsx    # AI Agents overview
├── analytics/page.tsx    # Analytics
├── api/ai/               # AI API routes (Edge Runtime)
│   ├── chat/             # Streaming chat
│   ├── agent/            # Agent task runner
│   ├── summarize/        # Description summarizer
│   └── priority/         # Priority suggester
components/
├── Board.tsx             # Kanban board with DnD
├── Column.tsx            # Board column
├── Card.tsx              # Card with AI status
├── CardModal.tsx         # Card detail modal
├── AIAgentPanel.tsx      # Agent management
├── AIChat.tsx            # Chat interface
├── AIStatusBadge.tsx     # Animated status dot
└── Sidebar.tsx           # ERP navigation sidebar
lib/
├── store.ts              # Zustand store
└── types.ts              # TypeScript types
```

---

## 📸 Screenshots

| Dashboard | Kanban Board | AI Agents |
|---|---|---|
| Live stats & activity | Drag-and-drop cards | Real-time agent status |

---

## 📄 License

MIT — free to use and modify.
