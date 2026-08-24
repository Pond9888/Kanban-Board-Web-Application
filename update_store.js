const fs = require('fs');
const content = fs.readFileSync('lib/store.ts', 'utf-8');

const newStore = `export const useBoardStore = create<BoardState>((set, get) => ({
  columns: initialColumns,
  cards: initialCards,

  fetchBoardData: async () => {
    const { data: columnsData, error: colError } = await supabase.from('columns').select('*').order('position')
    const { data: cardsData, error: cardError } = await supabase.from('cards').select('*, ai_agents(*), chat_messages(*)').order('position')
    
    if (!colError && !cardError && columnsData && cardsData) {
      const newColumns: Column[] = columnsData.map(c => ({
        id: c.id,
        title: c.title,
        color: c.color,
        cardIds: cardsData.filter(card => card.column_id === c.id).map(card => card.id)
      }))

      const newCards: Record<string, Card> = {}
      cardsData.forEach(c => {
        newCards[c.id] = {
          id: c.id,
          title: c.title,
          description: c.description || '',
          priority: c.priority,
          assignees: c.assignees || [],
          tags: c.tags || [],
          columnId: c.column_id,
          createdAt: new Date(c.created_at).getTime(),
          aiAgents: (c.ai_agents || []).map((a: any) => ({
            id: a.id,
            name: a.name,
            type: a.type,
            status: a.status,
            statusMessage: a.status_message,
            result: a.result,
            assignedAt: new Date(a.assigned_at).getTime()
          })),
          chatHistory: (c.chat_messages || []).map((m: any) => ({
            role: m.role,
            content: m.content,
            timestamp: new Date(m.timestamp).getTime()
          }))
        }
      })
      set({ columns: newColumns, cards: newCards })
    }
  },

  addCard: (columnId, title) => {
    const id = \`card-\${generateId()}\`
    const newCard: Card = { id, title, description: '', priority: 'medium', assignees: [], aiAgents: [], chatHistory: [], tags: [], createdAt: Date.now(), columnId }
    
    set((state) => ({
      cards: { ...state.cards, [id]: newCard },
      columns: state.columns.map((col) => col.id === columnId ? { ...col, cardIds: [...col.cardIds, id] } : col),
    }))
    
    supabase.from('cards').insert({ id, column_id: columnId, title, description: '', priority: 'medium', position: get().columns.find(c => c.id === columnId)?.cardIds.length || 0 }).then()
    
    const column = get().columns.find((c) => c.id === columnId)
    fireAutomation('card.created', { card: cardSummary(newCard), column: column?.title })
  },

  updateCard: (cardId, updates) => {
    const wasCritical = get().cards[cardId]?.priority === 'critical'
    set((state) => ({ cards: { ...state.cards, [cardId]: { ...state.cards[cardId], ...updates } } }))
    
    const dbUpdates: any = {}
    if (updates.title !== undefined) dbUpdates.title = updates.title
    if (updates.description !== undefined) dbUpdates.description = updates.description
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags
    if (updates.assignees !== undefined) dbUpdates.assignees = updates.assignees
    if (Object.keys(dbUpdates).length > 0) supabase.from('cards').update(dbUpdates).eq('id', cardId).then()

    if (updates.priority === 'critical' && !wasCritical) fireAutomation('card.critical', { card: cardSummary(get().cards[cardId]) })
  },

  deleteCard: (cardId) => {
    set((state) => {
      const card = state.cards[cardId]
      const newCards = { ...state.cards }
      delete newCards[cardId]
      return { cards: newCards, columns: state.columns.map((col) => col.id === card?.columnId ? { ...col, cardIds: col.cardIds.filter((id) => id !== cardId) } : col) }
    })
    supabase.from('cards').delete().eq('id', cardId).then()
  },

  moveCard: (cardId, sourceColumnId, destColumnId, sourceIndex, destIndex) => {
    set((state) => {
      const newColumns = state.columns.map((col) => {
        if (col.id === sourceColumnId && col.id === destColumnId) {
          const newCardIds = [...col.cardIds]; newCardIds.splice(sourceIndex, 1); newCardIds.splice(destIndex, 0, cardId); return { ...col, cardIds: newCardIds }
        }
        if (col.id === sourceColumnId) { return { ...col, cardIds: col.cardIds.filter((_, i) => i !== sourceIndex) } }
        if (col.id === destColumnId) {
          const newCardIds = [...col.cardIds]; newCardIds.splice(destIndex, 0, cardId); return { ...col, cardIds: newCardIds }
        }
        return col
      })
      return { columns: newColumns, cards: { ...state.cards, [cardId]: { ...state.cards[cardId], columnId: destColumnId } } }
    })
    
    supabase.from('cards').update({ column_id: destColumnId }).eq('id', cardId).then()
    const destCol = get().columns.find(c => c.id === destColumnId)
    if (destCol) destCol.cardIds.forEach((id, idx) => supabase.from('cards').update({ position: idx }).eq('id', id).then())

    if (sourceColumnId !== destColumnId) {
      const { cards, columns } = get()
      fireAutomation('card.moved', { card: cardSummary(cards[cardId]), from: columns.find((c) => c.id === sourceColumnId)?.title, to: columns.find((c) => c.id === destColumnId)?.title })
    }
  },

  addAIAgent: (cardId, agentType) => {
    const agentNames: Record<AIAgentType, string> = { summarizer: 'Summarizer', researcher: 'Researcher', coder: 'Code Writer', reviewer: 'Reviewer', tester: 'Test Writer' }
    const newAgent: AIAgent = { id: \`agent-\${generateId()}\`, name: agentNames[agentType], type: agentType, status: 'idle', assignedAt: Date.now() }
    
    set((state) => ({ cards: { ...state.cards, [cardId]: { ...state.cards[cardId], aiAgents: [...state.cards[cardId].aiAgents, newAgent] } } }))
    supabase.from('ai_agents').insert({ id: newAgent.id, card_id: cardId, name: newAgent.name, type: newAgent.type, status: newAgent.status }).then()
  },

  updateAIAgent: (cardId, agentId, updates) => {
    const wasDone = get().cards[cardId]?.aiAgents.find((a) => a.id === agentId)?.status === 'done'
    set((state) => ({ cards: { ...state.cards, [cardId]: { ...state.cards[cardId], aiAgents: state.cards[cardId].aiAgents.map((agent) => agent.id === agentId ? { ...agent, ...updates } : agent) } } }))
    
    const dbUpdates: any = {}
    if (updates.status !== undefined) dbUpdates.status = updates.status
    if (updates.statusMessage !== undefined) dbUpdates.status_message = updates.statusMessage
    if (updates.result !== undefined) dbUpdates.result = updates.result
    if (Object.keys(dbUpdates).length > 0) supabase.from('ai_agents').update(dbUpdates).eq('id', agentId).then()

    if (updates.status === 'done' && !wasDone) {
      const card = get().cards[cardId]
      const agent = card.aiAgents.find((a) => a.id === agentId)
      fireAutomation('agent.done', { card: cardSummary(card), agent: agent ? { name: agent.name, type: agent.type, result: agent.result } : undefined })
    }
  },

  removeAIAgent: (cardId, agentId) => {
    set((state) => ({ cards: { ...state.cards, [cardId]: { ...state.cards[cardId], aiAgents: state.cards[cardId].aiAgents.filter((a) => a.id !== agentId) } } }))
    supabase.from('ai_agents').delete().eq('id', agentId).then()
  },

  addChatMessage: (cardId, message) => {
    set((state) => ({ cards: { ...state.cards, [cardId]: { ...state.cards[cardId], chatHistory: [...state.cards[cardId].chatHistory, message] } } }))
    supabase.from('chat_messages').insert({ card_id: cardId, role: message.role, content: message.content }).then()
  },
}))`;

const startIndex = content.indexOf('export const useBoardStore = create<BoardState>((set, get) => ({');
if (startIndex !== -1) {
  const newContent = content.substring(0, startIndex) + newStore;
  fs.writeFileSync('lib/store.ts', newContent);
  console.log('Successfully updated lib/store.ts');
} else {
  console.log('Could not find store definition');
}
