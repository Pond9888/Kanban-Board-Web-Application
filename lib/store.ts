import { create } from 'zustand'
import { BoardState, Card, Column, AIAgent, ChatMessage, AIAgentType } from './types'

const generateId = () => Math.random().toString(36).substr(2, 9)

const initialCards: Record<string, Card> = {
  'card-1': {
    id: 'card-1',
    title: 'Design new dashboard UI',
    description: 'Create a modern, intuitive dashboard layout with dark mode support. Focus on data visualization components and user experience improvements.',
    priority: 'high',
    assignees: ['Alice', 'Bob'],
    tags: ['design', 'ui/ux', 'frontend'],
    aiAgents: [
      {
        id: 'agent-1',
        name: 'UI Reviewer',
        type: 'reviewer',
        status: 'done',
        statusMessage: 'Review complete',
        result: 'Design looks great! Consider adding micro-animations for better UX.',
        assignedAt: Date.now() - 3600000,
      }
    ],
    chatHistory: [],
    createdAt: Date.now() - 86400000,
    columnId: 'todo',
  },
  'card-2': {
    id: 'card-2',
    title: 'Implement authentication system',
    description: 'Set up JWT-based authentication with refresh tokens, OAuth2 integration for Google/GitHub, and secure session management.',
    priority: 'critical',
    assignees: ['Charlie'],
    tags: ['backend', 'security', 'auth'],
    aiAgents: [
      {
        id: 'agent-2',
        name: 'Security Analyst',
        type: 'researcher',
        status: 'thinking',
        statusMessage: 'Analyzing security requirements...',
        assignedAt: Date.now() - 1800000,
      }
    ],
    chatHistory: [],
    createdAt: Date.now() - 172800000,
    columnId: 'todo',
  },
  'card-3': {
    id: 'card-3',
    title: 'API performance optimization',
    description: 'Profile and optimize slow API endpoints. Implement caching strategies, database query optimization, and load balancing.',
    priority: 'high',
    assignees: ['Diana', 'Eve'],
    tags: ['performance', 'backend', 'optimization'],
    aiAgents: [
      {
        id: 'agent-3',
        name: 'Code Optimizer',
        type: 'coder',
        status: 'working',
        statusMessage: 'Writing optimized query patterns...',
        assignedAt: Date.now() - 900000,
      }
    ],
    chatHistory: [],
    createdAt: Date.now() - 259200000,
    columnId: 'in-progress',
  },
  'card-4': {
    id: 'card-4',
    title: 'Write unit tests for payment module',
    description: 'Comprehensive test coverage for the payment processing module including edge cases, error handling, and integration tests.',
    priority: 'medium',
    assignees: ['Frank'],
    tags: ['testing', 'payments', 'quality'],
    aiAgents: [
      {
        id: 'agent-4',
        name: 'Test Generator',
        type: 'tester',
        status: 'done',
        statusMessage: 'Tests generated',
        result: 'Generated 47 test cases covering happy paths and edge cases.',
        assignedAt: Date.now() - 7200000,
      }
    ],
    chatHistory: [],
    createdAt: Date.now() - 345600000,
    columnId: 'in-progress',
  },
  'card-5': {
    id: 'card-5',
    title: 'Database schema migration',
    description: 'Migrate legacy database schema to new normalized structure. Ensure zero downtime deployment with rollback capability.',
    priority: 'critical',
    assignees: ['Grace', 'Henry'],
    tags: ['database', 'migration', 'backend'],
    aiAgents: [
      {
        id: 'agent-5',
        name: 'DB Analyzer',
        type: 'reviewer',
        status: 'working',
        statusMessage: 'Reviewing migration scripts...',
        assignedAt: Date.now() - 600000,
      }
    ],
    chatHistory: [],
    createdAt: Date.now() - 432000000,
    columnId: 'in-review',
  },
  'card-6': {
    id: 'card-6',
    title: 'Documentation update',
    description: 'Update API documentation, add code examples, and create getting started guides for new developers joining the project.',
    priority: 'low',
    assignees: ['Iris'],
    tags: ['docs', 'developer-experience'],
    aiAgents: [
      {
        id: 'agent-6',
        name: 'Doc Writer',
        type: 'summarizer',
        status: 'idle',
        assignedAt: Date.now() - 14400000,
      }
    ],
    chatHistory: [],
    createdAt: Date.now() - 518400000,
    columnId: 'in-review',
  },
  'card-7': {
    id: 'card-7',
    title: 'Deploy v2.0 to production',
    description: 'Successfully deployed version 2.0 with all new features including real-time collaboration, AI assistance, and performance improvements.',
    priority: 'high',
    assignees: ['Jack', 'Kate'],
    tags: ['deployment', 'production', 'release'],
    aiAgents: [
      {
        id: 'agent-7',
        name: 'Deploy Checker',
        type: 'tester',
        status: 'done',
        statusMessage: 'All checks passed',
        result: 'Deployment successful. All health checks passing. 99.9% uptime maintained.',
        assignedAt: Date.now() - 28800000,
      }
    ],
    chatHistory: [],
    createdAt: Date.now() - 604800000,
    columnId: 'done',
  },
  'card-8': {
    id: 'card-8',
    title: 'User feedback analysis',
    description: 'Analyzed 500+ user feedback submissions. Key insights: users want better mobile experience, faster load times, and more keyboard shortcuts.',
    priority: 'medium',
    assignees: ['Liam'],
    tags: ['research', 'ux', 'analytics'],
    aiAgents: [
      {
        id: 'agent-8',
        name: 'Insight Extractor',
        type: 'researcher',
        status: 'done',
        statusMessage: 'Analysis complete',
        result: 'Top 3 requests: mobile optimization (68%), performance (54%), keyboard shortcuts (41%).',
        assignedAt: Date.now() - 57600000,
      }
    ],
    chatHistory: [],
    createdAt: Date.now() - 691200000,
    columnId: 'done',
  },
}

const initialColumns: Column[] = [
  { id: 'todo', title: 'Todo', color: 'from-purple-500 to-indigo-500', cardIds: ['card-1', 'card-2'] },
  { id: 'in-progress', title: 'In Progress', color: 'from-blue-500 to-cyan-500', cardIds: ['card-3', 'card-4'] },
  { id: 'in-review', title: 'In Review', color: 'from-amber-500 to-orange-500', cardIds: ['card-5', 'card-6'] },
  { id: 'done', title: 'Done', color: 'from-emerald-500 to-teal-500', cardIds: ['card-7', 'card-8'] },
]

export const useBoardStore = create<BoardState>((set) => ({
  columns: initialColumns,
  cards: initialCards,

  addCard: (columnId, title) => {
    const id = `card-${generateId()}`
    const newCard: Card = {
      id,
      title,
      description: '',
      priority: 'medium',
      assignees: [],
      aiAgents: [],
      chatHistory: [],
      tags: [],
      createdAt: Date.now(),
      columnId,
    }
    set((state) => ({
      cards: { ...state.cards, [id]: newCard },
      columns: state.columns.map((col) =>
        col.id === columnId
          ? { ...col, cardIds: [...col.cardIds, id] }
          : col
      ),
    }))
  },

  updateCard: (cardId, updates) => {
    set((state) => ({
      cards: {
        ...state.cards,
        [cardId]: { ...state.cards[cardId], ...updates },
      },
    }))
  },

  deleteCard: (cardId) => {
    set((state) => {
      const card = state.cards[cardId]
      const newCards = { ...state.cards }
      delete newCards[cardId]
      return {
        cards: newCards,
        columns: state.columns.map((col) =>
          col.id === card.columnId
            ? { ...col, cardIds: col.cardIds.filter((id) => id !== cardId) }
            : col
        ),
      }
    })
  },

  moveCard: (cardId, sourceColumnId, destColumnId, sourceIndex, destIndex) => {
    set((state) => {
      const newColumns = state.columns.map((col) => {
        if (col.id === sourceColumnId && col.id === destColumnId) {
          const newCardIds = [...col.cardIds]
          newCardIds.splice(sourceIndex, 1)
          newCardIds.splice(destIndex, 0, cardId)
          return { ...col, cardIds: newCardIds }
        }
        if (col.id === sourceColumnId) {
          const newCardIds = col.cardIds.filter((_, i) => i !== sourceIndex)
          return { ...col, cardIds: newCardIds }
        }
        if (col.id === destColumnId) {
          const newCardIds = [...col.cardIds]
          newCardIds.splice(destIndex, 0, cardId)
          return { ...col, cardIds: newCardIds }
        }
        return col
      })
      return {
        columns: newColumns,
        cards: {
          ...state.cards,
          [cardId]: { ...state.cards[cardId], columnId: destColumnId },
        },
      }
    })
  },

  addAIAgent: (cardId, agentType) => {
    const agentNames: Record<AIAgentType, string> = {
      summarizer: 'Summarizer',
      researcher: 'Researcher',
      coder: 'Code Writer',
      reviewer: 'Reviewer',
      tester: 'Test Writer',
    }
    const newAgent: AIAgent = {
      id: `agent-${generateId()}`,
      name: agentNames[agentType],
      type: agentType,
      status: 'idle',
      assignedAt: Date.now(),
    }
    set((state) => ({
      cards: {
        ...state.cards,
        [cardId]: {
          ...state.cards[cardId],
          aiAgents: [...state.cards[cardId].aiAgents, newAgent],
        },
      },
    }))
  },

  updateAIAgent: (cardId, agentId, updates) => {
    set((state) => ({
      cards: {
        ...state.cards,
        [cardId]: {
          ...state.cards[cardId],
          aiAgents: state.cards[cardId].aiAgents.map((agent) =>
            agent.id === agentId ? { ...agent, ...updates } : agent
          ),
        },
      },
    }))
  },

  removeAIAgent: (cardId, agentId) => {
    set((state) => ({
      cards: {
        ...state.cards,
        [cardId]: {
          ...state.cards[cardId],
          aiAgents: state.cards[cardId].aiAgents.filter((a) => a.id !== agentId),
        },
      },
    }))
  },

  addChatMessage: (cardId, message) => {
    set((state) => ({
      cards: {
        ...state.cards,
        [cardId]: {
          ...state.cards[cardId],
          chatHistory: [...state.cards[cardId].chatHistory, message],
        },
      },
    }))
  },
}))
