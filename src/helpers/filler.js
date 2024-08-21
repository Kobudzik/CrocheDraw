export function filler(x, y, cc) {
  let board = window.board;
  if (x >= 0 && x < board.width && y >= 0 && y < board.height) {
    if (JSON.stringify(board.data[x][y]) === JSON.stringify(cc) && JSON.stringify(board.data[x][y]) !== JSON.stringify(board.color)) {
      board.draw(x, y);
      filler(x + 1, y, cc);
      filler(x, y + 1, cc);
      filler(x - 1, y, cc);
      filler(x, y - 1, cc);
    }
  }
}
