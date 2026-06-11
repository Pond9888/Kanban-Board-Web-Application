export type Priority = 'low' | 'medium' | 'high' | 'critical'
export type AIAgentStatus = 'idle' | 'thinking' | 'working' | 'done' | 'failed'
export type AIAgentType = 'summarizer' | 'researcher' | 'coder' | 'reviewer' | 'tester'

export interface AIAgent {
  id: string
  name: string
  type: AIAgentType
  status: AIAgentStatus
  statusMessage?: string
  result?: string
  assignedAt?: number
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface Card {
  id: string
  title: string
  description: string
  priority: Priority
  assignees: string[]
  aiAgents: AIAgent[]
  chatHistory: ChatMessage[]
  tags: string[]
  createdAt: number
  columnId: string
}

export interface Column {
  id: string
  title: string
  color: string
  cardIds: string[]
}

export interface BoardState {
  columns: Column[]
  cards: Record<string, Card>
  addCard: (columnId: string, title: string) => void
  updateCard: (cardId: string, updates: Partial<Card>) => void
  deleteCard: (cardId: string) => void
  moveCard: (cardId: string, sourceColumnId: string, destColumnId: string, sourceIndex: number, destIndex: number) => void
  addAIAgent: (cardId: string, agentType: AIAgentType) => void
  updateAIAgent: (cardId: string, agentId: string, updates: Partial<AIAgent>) => void
  removeAIAgent: (cardId: string, agentId: string) => void
  addChatMessage: (cardId: string, message: ChatMessage) => void
}
