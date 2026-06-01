"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import type { Card } from "@/lib/kanban";

type KanbanCardProps = {
  card: Card;
  columnName: string;
  onDelete: (cardId: string) => void;
};

export function KanbanCard({ card, columnName, onDelete }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: {
      type: "card",
      columnName,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`group rounded-xl border border-white/70 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition ${
        isDragging ? "z-20 scale-[1.02] opacity-80 shadow-xl" : "hover:-translate-y-0.5 hover:shadow-md"
      }`}
      data-testid={`card-${card.id}`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-[#032147]">{card.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#5d6782]">{card.details}</p>
        </div>
        <button
          type="button"
          onClick={() => onDelete(card.id)}
          className="h-7 w-7 shrink-0 rounded-full border border-[#d7deea] text-[#7a8197] transition hover:border-[#ecad0a] hover:text-[#032147]"
          aria-label={`Delete ${card.title}`}
        >
          ×
        </button>
      </div>
    </article>
  );
}
