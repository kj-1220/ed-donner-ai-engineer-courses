"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { KanbanColumn } from "@/components/kanban-column";
import {
  addCard,
  createInitialBoard,
  deleteCard,
  findColumnIdByCard,
  moveCard,
  renameColumn,
} from "@/lib/kanban";

export function KanbanBoard() {
  const [board, setBoard] = useState(createInitialBoard);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const allCards = useMemo(() => board.columns.flatMap((column) => column.cards), [board]);
  const activeCard = allCards.find((card) => card.id === activeCardId) ?? null;

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCardId(null);

    if (!over) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) {
      return;
    }

    setBoard((current) => moveCard(current, activeId, overId));
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(236,173,10,0.34),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(117,57,145,0.24),_transparent_38%),linear-gradient(180deg,_#f5fbff_0%,_#eaf2fb_100%)]" />

      <main className="relative mx-auto max-w-[1600px]">
        <header className="mb-6 rounded-2xl border border-white/60 bg-white/65 p-6 shadow-lg backdrop-blur-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-[#209dd7]">Single Board MVP</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#032147] sm:text-4xl">Team Delivery Board</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#56627d] sm:text-base">
            Rename any column, create cards with title and details, drag cards between columns, and delete when complete.
          </p>
        </header>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={(event) => setActiveCardId(String(event.active.id))}
          onDragEnd={onDragEnd}
        >
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5" data-testid="board-columns">
            {board.columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                onRenameColumn={(columnId, nextName) => {
                  setBoard((current) => renameColumn(current, columnId, nextName));
                }}
                onAddCard={(columnId, title, details) => {
                  setBoard((current) => addCard(current, columnId, title, details));
                }}
                onDeleteCard={(cardId) => {
                  setBoard((current) => deleteCard(current, cardId));
                }}
              />
            ))}
          </section>

          <DragOverlay>
            {activeCard ? (
              <article className="w-[260px] rounded-xl border border-white bg-white p-4 shadow-2xl">
                <h3 className="font-medium text-[#032147]">{activeCard.title}</h3>
                <p className="mt-2 text-sm text-[#5d6782]">{activeCard.details}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#888888]">
                  {findColumnIdByCard(board, activeCard.id)}
                </p>
              </article>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
}
