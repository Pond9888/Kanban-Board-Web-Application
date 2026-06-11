import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface KBEntry {
  id: string
  title: string
  content: string
}

const seedKB: KBEntry[] = [
  {
    id: 'kb-1',
    title: 'AI Agents',
    content:
      'Each card on the Kanban board can have AI agents assigned to it. There are 5 agent types: Summarizer, Researcher, Coder, Reviewer, and Tester. Open a card, go to the Agents tab, pick an agent type and click Run Agent. The agent works in real-time with live status updates: Thinking → Working → Done (or Failed). Results appear directly in the card when finished.',
  },
  {
    id: 'kb-2',
    title: 'Moving Cards (Drag & Drop)',
    content:
      'The Kanban board has 4 columns: Backlog, Todo, In Progress, and Done. To move a card between columns, simply click and hold the card, then drag it to the target column and release. Changes are saved automatically. You can also reorder cards within the same column the same way.',
  },
  {
    id: 'kb-3',
    title: 'Priority Levels',
    content:
      'Cards support 4 priority levels: Low (gray), Medium (blue), High (orange), and Critical (red). You can set the priority manually when creating or editing a card. Alternatively, click the Suggest Priority button inside a card and the AI will analyze the task and recommend a priority level with a short explanation of its reasoning.',
  },
  {
    id: 'kb-4',
    title: 'AI Chat in Cards',
    content:
      'Every card has a built-in AI chat assistant. Open a card and switch to the Chat tab to ask questions about the task. The assistant understands the card context (title, description, priority, tags) and streams its responses in real-time without page reloads.',
  },
  {
    id: 'kb-5',
    title: 'AI Rewrite (Summarize Description)',
    content:
      'Inside a card, the AI Rewrite button improves the task description with one click. The AI rewrites the text to be clearer and more actionable while keeping the original meaning. The updated description replaces the old one immediately and can be edited further by hand.',
  },
  {
    id: 'kb-6',
    title: 'Pages & Navigation',
    content:
      'The left sidebar gives access to all pages: Dashboard (live stats and recent activity), Kanban Board (drag-and-drop board), My Tasks (tasks grouped by priority), AI Agents (overview of all running agents), Analytics (charts), and Knowledge Bot (this assistant). The sidebar can be collapsed with the arrow button at the bottom.',
  },
]

interface KBState {
  entries: KBEntry[]
  addEntry: (title: string, content: string) => void
  updateEntry: (id: string, title: string, content: string) => void
  removeEntry: (id: string) => void
}

export const useKBStore = create<KBState>()(
  persist(
    (set) => ({
      entries: seedKB,
      addEntry: (title, content) =>
        set((state) => ({
          entries: [...state.entries, { id: 'kb-' + Date.now(), title, content }],
        })),
      updateEntry: (id, title, content) =>
        set((state) => ({
          entries: state.entries.map((e) => (e.id === id ? { ...e, title, content } : e)),
        })),
      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),
    }),
    { name: 'kanban-kb-v1' }
  )
)
