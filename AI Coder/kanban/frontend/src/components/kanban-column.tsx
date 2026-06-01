"use client";

import { FormEvent, useState } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import type { Column } from "@/lib/kanban";
import { KanbanCard } from "@/components/kanban-card";

type KanbanColumnProps = {
  column: Column;
  onRenameColumn: (columnId: string, nextName: string) => void;
  onAddCard: (columnId: string, title: string, details: string) => void;
  onDeleteCard: (cardId: string) => void;
};

export function KanbanColumn({ column, onRenameColumn, onAddCard, onDeleteCard }: KanbanColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "column",
    },
  });

  const handleCreateCard = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !details.trim()) {
      return;
    }

    onAddCard(column.id, title, details);
    setTitle("");
    setDetails("");
    setIsAdding(false);
  };

  return (
    <section
      ref={setNodeRef}
      className={`min-h-[420px] rounded-2xl border p-4 backdrop-blur-sm transition ${
        isOver ? "border-[#ecad0a] bg-[#fff7df]/95" : "border-white/70 bg-white/70"
      }`}
      data-testid={`column-${column.id}`}
    >
      <div className="flex items-center justify-between gap-3">
        <input
          aria-label={`Column name ${column.name}`}
          value={column.name}
          onChange={(event) => onRenameColumn(column.id, event.target.value)}
          className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-base font-semibold text-[#032147] outline-none transition focus:border-[#209dd7] focus:bg-white"
          data-testid={`column-name-${column.id}`}
        />
        <span className="rounded-full bg-[#032147] px-2.5 py-1 text-xs font-medium text-white">
          {column.cards.length}
        </span>
      </div>

      <SortableContext items={column.cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
        <div className="mt-4 space-y-3">
          {column.cards.map((card) => (
            <KanbanCard key={card.id} card={card} columnName={column.name} onDelete={onDeleteCard} />
          ))}
        </div>
      </SortableContext>

      {isAdding ? (
        <form className="mt-4 space-y-2 rounded-xl border border-[#d9e3f4] bg-white p-3" onSubmit={handleCreateCard}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Card title"
            className="w-full rounded-md border border-[#cfdbf0] px-3 py-2 text-sm text-[#032147] outline-none transition focus:border-[#209dd7]"
            data-testid={`card-title-${column.id}`}
          />
          <textarea
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            placeholder="Card details"
            rows={3}
            className="w-full resize-none rounded-md border border-[#cfdbf0] px-3 py-2 text-sm text-[#032147] outline-none transition focus:border-[#209dd7]"
            data-testid={`card-details-${column.id}`}
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="rounded-md bg-[#753991] px-3 py-2 text-sm font-medium text-white transition hover:brightness-110"
              data-testid={`save-card-${column.id}`}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded-md border border-[#d1d9e8] px-3 py-2 text-sm text-[#51607e] transition hover:border-[#209dd7] hover:text-[#032147]"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="mt-4 w-full rounded-lg border border-dashed border-[#b7c7e4] bg-white/70 px-3 py-2 text-left text-sm font-medium text-[#209dd7] transition hover:border-[#ecad0a] hover:text-[#032147]"
          data-testid={`add-card-${column.id}`}
        >
          + Add card
        </button>
      )}
    </section>
  );
}
