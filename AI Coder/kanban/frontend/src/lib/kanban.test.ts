import {
  addCard,
  createInitialBoard,
  deleteCard,
  findColumnIdByCard,
  moveCard,
  renameColumn,
} from "@/lib/kanban";

describe("kanban board utilities", () => {
  it("creates a board with exactly five columns and starter cards", () => {
    const board = createInitialBoard();

    expect(board.columns).toHaveLength(5);
    expect(board.columns[0].name).toBe("Backlog");
    expect(board.columns.every((column) => column.cards.length > 0)).toBe(true);
  });

  it("renames a column by id", () => {
    const board = createInitialBoard();
    const targetColumnId = board.columns[1].id;

    const updated = renameColumn(board, targetColumnId, "Queued");

    expect(updated.columns[1].name).toBe("Queued");
    expect(updated.columns[0].name).toBe(board.columns[0].name);
  });

  it("adds a trimmed card into the selected column", () => {
    const board = createInitialBoard();
    const targetColumnId = board.columns[2].id;

    const updated = addCard(board, targetColumnId, "  New Card  ", "  Important details  ");
    const targetColumn = updated.columns[2];

    expect(targetColumn.cards.at(-1)?.title).toBe("New Card");
    expect(targetColumn.cards.at(-1)?.details).toBe("Important details");
    expect(targetColumn.cards).toHaveLength(board.columns[2].cards.length + 1);
  });

  it("deletes a card from the board", () => {
    const board = createInitialBoard();
    const cardId = board.columns[0].cards[0].id;

    const updated = deleteCard(board, cardId);

    expect(findColumnIdByCard(updated, cardId)).toBeNull();
  });

  it("moves a card between columns when dropped over a column", () => {
    const board = createInitialBoard();
    const movingCardId = board.columns[0].cards[0].id;
    const targetColumnId = board.columns[3].id;

    const updated = moveCard(board, movingCardId, targetColumnId);

    expect(findColumnIdByCard(updated, movingCardId)).toBe(targetColumnId);
    expect(updated.columns[3].cards.at(-1)?.id).toBe(movingCardId);
  });

  it("reorders cards inside a single column when dropped over another card", () => {
    const board = createInitialBoard();
    const columnId = board.columns[0].id;
    const firstCardId = board.columns[0].cards[0].id;
    const secondCardId = board.columns[0].cards[1].id;

    const updated = moveCard(board, secondCardId, firstCardId);
    const reorderedColumn = updated.columns.find((column) => column.id === columnId);

    expect(reorderedColumn?.cards[0].id).toBe(secondCardId);
    expect(reorderedColumn?.cards[1].id).toBe(firstCardId);
  });

  it("keeps board unchanged when drag targets are unknown", () => {
    const board = createInitialBoard();

    const updated = moveCard(board, "missing-card", "missing-target");

    expect(updated).toEqual(board);
  });
});
