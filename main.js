import { input } from '@inquirer/prompts'

const inputNumber = await input({
    message: '請輸入字串 \n ex:0110011101111111110011110：'
})

function parseInput(inputNumber) {
  // 將輸入字串轉成5x5陣列
  return Array.from({length: 5}, (_, i) =>
    inputNumber.slice(i * 5, i * 5 + 5).split('').map(Number)
  );
}

function cloneBoard(board) {
  return board.map(row => row.slice());
}

function flip(board, x, y) {
  // 上下左右和自己都要flip
  const dirs = [[0,0],[1,0],[-1,0],[0,1],[0,-1]];
  for (const [dx, dy] of dirs) {
    const nx = x + dx, ny = y + dy;
    if (nx >= 0 && nx < 5 && ny >= 0 && ny < 5) {
      board[nx][ny] ^= 1;
    }
  }
}

function solve(inputNumber) {
  let minSteps = Infinity;
  let bestOps = null;
  const initial = parseInput(inputNumber);

  // 只窮舉第一行，5位bit，32種可能
  for (let firstRow = 0; firstRow < 32; firstRow++) {
    let board = cloneBoard(initial);
    let ops = [];

    // 第1行按法
    for (let y = 0; y < 5; y++) {
      if ((firstRow >> y) & 1) {
        flip(board, 0, y);
        ops.push([1, y + 1]);
      }
    }

    // 2~5行
    for (let x = 1; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        if (board[x - 1][y] === 1) {
          flip(board, x, y);
          ops.push([x + 1, y + 1]);
        }
      }
    }

    // 檢查結果是否全1或全0
    let flat = board.flat();
    if (flat.every(v => v === 0) || flat.every(v => v === 1)) {
      if (ops.length < minSteps) {
        minSteps = ops.length;
        bestOps = ops.slice();
      }
    }
  }

  return bestOps;
}

// 用法
const ans = solve(inputNumber);

if (!ans) {
  console.log('無解');
} else {
  // 輸出每一步 (x, y) 座標
  console.log('最小步數解:');
  ans.forEach(([x, y], i) => {
    console.log(`${i+1}. (${x},${y})`);
  });
}