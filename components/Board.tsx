'use client'

import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { useBoardStore } from '@/lib/store'
import { Column } from './Column'

export function Board() {
  const { columns, cards, moveCard } = useBoardStore()

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    moveCard(draggableId, source.droppableId, destination.droppableId, source.index, destination.index)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 px-6 pb-8 overflow-x-auto min-h-full">
        {columns.map((column) => {
          const columnCards = column.cardIds.map((id) => cards[id]).filter(Boolean)
          return <Column key={column.id} column={column} cards={columnCards} />
        })}
      </div>
    </DragDropContext>
  )
}
