export type Card = {
  id: string;
  title: string;
  details: string;
};

export type Column = {
  id: string;
  name: string;
  cards: Card[];
};

export type BoardState = {
  columns: Column[];
};

const STARTER_COLUMNS: Column[] = [
  {
    id: "col-1",
    name: "Backlog",
    cards: [
      {
        id: "card-col-1-1",
        title: "Finalize onboarding flow",
        details: "Map the happy path and error states for first-time users.",
      },
      {
        id: "card-col-1-2",
        title: "Collect stakeholder notes",
        details: "Consolidate product and design feedback into one place.",
      },
    ],
  },
  {
    id: "col-2",
    name: "Ready",
    cards: [
      {
        id: "card-col-2-1",
        title: "Polish pricing copy",
        details: "Shorten value statements and tighten CTA language.",
      },
    ],
  },
  {
    id: "col-3",
    name: "In Progress",
    cards: [
      {
        id: "card-col-3-1",
        title: "Build Kanban interactions",
        details: "Implement drag and drop with smooth transitions.",
      },
    ],
  },
  {
    id: "col-4",
    name: "Review",
    cards: [
      {
        id: "card-col-4-1",
        title: "QA responsive behavior",
        details: "Verify card composition and interactions on mobile widths.",
      },
    ],
  },
  {
    id: "col-5",
    name: "Done",
    cards: [
      {
        id: "card-col-5-1",
        title: "Create visual direction",
        details: "Approved color system and component style references.",
      },
    ],
  },
];

function generateId(prefix: "card" | "board"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 11)}`;
}

export function createInitialBoard(): BoardState {
  return {
    columns: STARTER_COLUMNS.map((column) => ({
      ...column,
      cards: column.cards.map((card) => ({ ...card })),
    })),
  };
}

export function renameColumn(
  board: BoardState,
  columnId: string,
  newName: string,
): BoardState {
  return {
    columns: board.columns.map((column) =>
      column.id === columnId ? { ...column, name: newName } : column,
    ),
  };
}

export function addCard(
  board: BoardState,
  columnId: string,
  title: string,
  details: string,
): BoardState {
  return {
    columns: board.columns.map((column) => {
      if (column.id !== columnId) {
        return column;
      }

      const nextCard: Card = {
        id: generateId("card"),
        title: title.trim(),
        details: details.trim(),
      };

      return {
        ...column,
        cards: [...column.cards, nextCard],
      };
    }),
  };
}

export function deleteCard(board: BoardState, cardId: string): BoardState {
  return {
    columns: board.columns.map((column) => ({
      ...column,
      cards: column.cards.filter((card) => card.id !== cardId),
    })),
  };
}

type CardPosition = {
  columnIndex: number;
  cardIndex: number;
};

function findCardPosition(board: BoardState, cardId: string): CardPosition | null {
  for (let columnIndex = 0; columnIndex < board.columns.length; columnIndex += 1) {
    const cardIndex = board.columns[columnIndex].cards.findIndex((card) => card.id === cardId);
    if (cardIndex !== -1) {
      return { columnIndex, cardIndex };
    }
  }

  return null;
}

export function moveCard(
  board: BoardState,
  activeCardId: string,
  overId: string,
): BoardState {
  const source = findCardPosition(board, activeCardId);
  if (!source) {
    return board;
  }

  const targetCard = findCardPosition(board, overId);
  const targetColumnIndex = targetCard
    ? targetCard.columnIndex
    : board.columns.findIndex((column) => column.id === overId);

  if (targetColumnIndex === -1) {
    return board;
  }

  const nextColumns = board.columns.map((column) => ({
    ...column,
    cards: [...column.cards],
  }));

  const [movingCard] = nextColumns[source.columnIndex].cards.splice(source.cardIndex, 1);
  if (!movingCard) {
    return board;
  }

  if (targetCard) {
    const targetIndex =
      source.columnIndex === targetCard.columnIndex && source.cardIndex < targetCard.cardIndex
        ? targetCard.cardIndex - 1
        : targetCard.cardIndex;

    nextColumns[targetCard.columnIndex].cards.splice(targetIndex, 0, movingCard);
  } else {
    nextColumns[targetColumnIndex].cards.push(movingCard);
  }

  return { columns: nextColumns };
}

export function findColumnIdByCard(board: BoardState, cardId: string): string | null {
  for (const column of board.columns) {
    if (column.cards.some((card) => card.id === cardId)) {
      return column.id;
    }
  }

  return null;
}

export function boardId(): string {
  return generateId("board");
}
