import React, { useState, useEffect, useRef, useCallback } from 'react';

// Color constants
const COLORS = {
  default: '#6366f1',
  comparing: '#f59e0b',
  swapping: '#ef4444',
  sorted: '#10b981',
  pivot: '#ec4899',
  
  // Pathfinding colors
  wall: '#1e293b',
  start: '#10b981',
  end: '#ef4444',
  visited: '#6366f1',
  path: '#f59e0b',
  empty: '#334155',
  current: '#ec4899',
};

// ==================== SORTING ALGORITHMS ====================

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Bubble Sort
async function* bubbleSort(arr) {
  const array = [...arr];
  const n = array.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield { array: [...array], comparing: [j, j + 1], sorted: Array.from({length: i}, (_, k) => n - 1 - k) };
      
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        yield { array: [...array], swapping: [j, j + 1], sorted: Array.from({length: i}, (_, k) => n - 1 - k) };
      }
    }
  }
  
  yield { array: [...array], sorted: Array.from({length: n}, (_, i) => i) };
}

// Selection Sort
async function* selectionSort(arr) {
  const array = [...arr];
  const n = array.length;
  
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    
    for (let j = i + 1; j < n; j++) {
      yield { array: [...array], comparing: [minIdx, j], sorted: Array.from({length: i}, (_, k) => k) };
      
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }
    
    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      yield { array: [...array], swapping: [i, minIdx], sorted: Array.from({length: i}, (_, k) => k) };
    }
  }
  
  yield { array: [...array], sorted: Array.from({length: n}, (_, i) => i) };
}

// Insertion Sort
async function* insertionSort(arr) {
  const array = [...arr];
  const n = array.length;
  
  for (let i = 1; i < n; i++) {
    let j = i;
    
    while (j > 0 && array[j - 1] > array[j]) {
      yield { array: [...array], comparing: [j - 1, j], sorted: [] };
      
      [array[j], array[j - 1]] = [array[j - 1], array[j]];
      yield { array: [...array], swapping: [j - 1, j], sorted: [] };
      
      j--;
    }
  }
  
  yield { array: [...array], sorted: Array.from({length: n}, (_, i) => i) };
}

// Quick Sort
async function* quickSort(arr, low = 0, high = arr.length - 1, array = [...arr]) {
  if (low < high) {
    let pivot = array[high];
    let i = low - 1;
    
    yield { array: [...array], pivot: [high], comparing: [], sorted: [] };
    
    for (let j = low; j < high; j++) {
      yield { array: [...array], comparing: [j, high], pivot: [high], sorted: [] };
      
      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        yield { array: [...array], swapping: [i, j], pivot: [high], sorted: [] };
      }
    }
    
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    yield { array: [...array], swapping: [i + 1, high], sorted: [] };
    
    const pi = i + 1;
    
    yield* quickSort(arr, low, pi - 1, array);
    yield* quickSort(arr, pi + 1, high, array);
  }
  
  if (low === 0 && high === arr.length - 1) {
    yield { array: [...array], sorted: Array.from({length: array.length}, (_, i) => i) };
  }
}

// Merge Sort
async function* mergeSort(arr, left = 0, right = arr.length - 1, array = [...arr]) {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);
    
    yield* mergeSort(arr, left, mid, array);
    yield* mergeSort(arr, mid + 1, right, array);
    
    // Merge
    const leftArr = array.slice(left, mid + 1);
    const rightArr = array.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < leftArr.length && j < rightArr.length) {
      yield { array: [...array], comparing: [left + i, mid + 1 + j], sorted: [] };
      
      if (leftArr[i] <= rightArr[j]) {
        array[k] = leftArr[i];
        i++;
      } else {
        array[k] = rightArr[j];
        j++;
      }
      yield { array: [...array], swapping: [k], sorted: [] };
      k++;
    }
    
    while (i < leftArr.length) {
      array[k] = leftArr[i];
      yield { array: [...array], swapping: [k], sorted: [] };
      i++;
      k++;
    }
    
    while (j < rightArr.length) {
      array[k] = rightArr[j];
      yield { array: [...array], swapping: [k], sorted: [] };
      j++;
      k++;
    }
  }
  
  if (left === 0 && right === arr.length - 1) {
    yield { array: [...array], sorted: Array.from({length: array.length}, (_, i) => i) };
  }
}

// Heap Sort
async function* heapSort(arr) {
  const array = [...arr];
  const n = array.length;
  
  function* heapify(size, root) {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;
    
    if (left < size) {
      yield { array: [...array], comparing: [largest, left], sorted: Array.from({length: n - size}, (_, k) => n - 1 - k) };
      if (array[left] > array[largest]) {
        largest = left;
      }
    }
    
    if (right < size) {
      yield { array: [...array], comparing: [largest, right], sorted: Array.from({length: n - size}, (_, k) => n - 1 - k) };
      if (array[right] > array[largest]) {
        largest = right;
      }
    }
    
    if (largest !== root) {
      [array[root], array[largest]] = [array[largest], array[root]];
      yield { array: [...array], swapping: [root, largest], sorted: Array.from({length: n - size}, (_, k) => n - 1 - k) };
      yield* heapify(size, largest);
    }
  }
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i);
  }
  
  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    yield { array: [...array], swapping: [0, i], sorted: Array.from({length: n - i}, (_, k) => n - 1 - k) };
    yield* heapify(i, 0);
  }
  
  yield { array: [...array], sorted: Array.from({length: n}, (_, i) => i) };
}

const SORTING_ALGORITHMS = {
  bubble: { name: 'Bubble Sort', fn: bubbleSort, complexity: 'O(n²)' },
  selection: { name: 'Selection Sort', fn: selectionSort, complexity: 'O(n²)' },
  insertion: { name: 'Insertion Sort', fn: insertionSort, complexity: 'O(n²)' },
  quick: { name: 'Quick Sort', fn: quickSort, complexity: 'O(n log n)' },
  merge: { name: 'Merge Sort', fn: mergeSort, complexity: 'O(n log n)' },
  heap: { name: 'Heap Sort', fn: heapSort, complexity: 'O(n log n)' },
};

// ==================== PATHFINDING ALGORITHMS ====================

const GRID_ROWS = 20;
const GRID_COLS = 40;

function createGrid() {
  const grid = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < GRID_COLS; col++) {
      currentRow.push({
        row,
        col,
        isStart: row === 10 && col === 5,
        isEnd: row === 10 && col === 35,
        isWall: false,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        heuristic: 0,
        previous: null,
      });
    }
    grid.push(currentRow);
  }
  return grid;
}

function getNeighbors(grid, node) {
  const neighbors = [];
  const { row, col } = node;
  
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < GRID_ROWS - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < GRID_COLS - 1) neighbors.push(grid[row][col + 1]);
  
  return neighbors.filter(n => !n.isWall);
}

function heuristic(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

function reconstructPath(endNode) {
  const path = [];
  let current = endNode;
  while (current !== null) {
    path.unshift(current);
    current = current.previous;
  }
  return path;
}

// BFS
async function* bfs(grid, startNode, endNode) {
  const queue = [startNode];
  const visited = new Set();
  visited.add(`${startNode.row}-${startNode.col}`);
  startNode.distance = 0;
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    yield { current, visited: Array.from(visited) };
    
    if (current === endNode) {
      const path = reconstructPath(endNode);
      yield { path, done: true };
      return;
    }
    
    for (const neighbor of getNeighbors(grid, current)) {
      const key = `${neighbor.row}-${neighbor.col}`;
      if (!visited.has(key)) {
        visited.add(key);
        neighbor.previous = current;
        neighbor.distance = current.distance + 1;
        queue.push(neighbor);
      }
    }
  }
  
  yield { done: true, noPath: true };
}

// DFS
async function* dfs(grid, startNode, endNode) {
  const stack = [startNode];
  const visited = new Set();
  
  while (stack.length > 0) {
    const current = stack.pop();
    const key = `${current.row}-${current.col}`;
    
    if (visited.has(key)) continue;
    visited.add(key);
    
    yield { current, visited: Array.from(visited) };
    
    if (current === endNode) {
      const path = reconstructPath(endNode);
      yield { path, done: true };
      return;
    }
    
    for (const neighbor of getNeighbors(grid, current)) {
      const nKey = `${neighbor.row}-${neighbor.col}`;
      if (!visited.has(nKey)) {
        neighbor.previous = current;
        stack.push(neighbor);
      }
    }
  }
  
  yield { done: true, noPath: true };
}

// Dijkstra
async function* dijkstra(grid, startNode, endNode) {
  const unvisited = [];
  const visited = new Set();
  
  startNode.distance = 0;
  unvisited.push(startNode);
  
  while (unvisited.length > 0) {
    unvisited.sort((a, b) => a.distance - b.distance);
    const current = unvisited.shift();
    
    const key = `${current.row}-${current.col}`;
    if (visited.has(key)) continue;
    visited.add(key);
    
    yield { current, visited: Array.from(visited) };
    
    if (current === endNode) {
      const path = reconstructPath(endNode);
      yield { path, done: true };
      return;
    }
    
    for (const neighbor of getNeighbors(grid, current)) {
      const nKey = `${neighbor.row}-${neighbor.col}`;
      if (!visited.has(nKey)) {
        const newDist = current.distance + 1;
        if (newDist < neighbor.distance) {
          neighbor.distance = newDist;
          neighbor.previous = current;
          unvisited.push(neighbor);
        }
      }
    }
  }
  
  yield { done: true, noPath: true };
}

// A*
async function* aStar(grid, startNode, endNode) {
  const openSet = [startNode];
  const visited = new Set();
  
  startNode.distance = 0;
  startNode.heuristic = heuristic(startNode, endNode);
  
  while (openSet.length > 0) {
    openSet.sort((a, b) => (a.distance + a.heuristic) - (b.distance + b.heuristic));
    const current = openSet.shift();
    
    const key = `${current.row}-${current.col}`;
    if (visited.has(key)) continue;
    visited.add(key);
    
    yield { current, visited: Array.from(visited) };
    
    if (current === endNode) {
      const path = reconstructPath(endNode);
      yield { path, done: true };
      return;
    }
    
    for (const neighbor of getNeighbors(grid, current)) {
      const nKey = `${neighbor.row}-${neighbor.col}`;
      if (!visited.has(nKey)) {
        const newDist = current.distance + 1;
        if (newDist < neighbor.distance) {
          neighbor.distance = newDist;
          neighbor.heuristic = heuristic(neighbor, endNode);
          neighbor.previous = current;
          openSet.push(neighbor);
        }
      }
    }
  }
  
  yield { done: true, noPath: true };
}

const PATHFINDING_ALGORITHMS = {
  bfs: { name: 'BFS', fn: bfs, description: 'Breadth-First Search - Guarantees shortest path' },
  dfs: { name: 'DFS', fn: dfs, description: 'Depth-First Search - Does not guarantee shortest path' },
  dijkstra: { name: 'Dijkstra', fn: dijkstra, description: "Dijkstra's Algorithm - Guarantees shortest path" },
  astar: { name: 'A*', fn: aStar, description: 'A* Search - Guarantees shortest path, uses heuristic' },
};

// ==================== COMPONENTS ====================

function SortingVisualizer() {
  const [array, setArray] = useState([]);
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [pivot, setPivot] = useState([]);
  const [algorithm, setAlgorithm] = useState('bubble');
  const [speed, setSpeed] = useState(50);
  const [arraySize, setArraySize] = useState(50);
  const [isRunning, setIsRunning] = useState(false);
  const stopRef = useRef(false);
  
  const generateArray = useCallback(() => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 400) + 10);
    setArray(newArray);
    setComparing([]);
    setSwapping([]);
    setSorted([]);
    setPivot([]);
  }, [arraySize]);
  
  useEffect(() => {
    generateArray();
  }, [generateArray]);
  
  const runAlgorithm = async () => {
    setIsRunning(true);
    stopRef.current = false;
    
    const generator = SORTING_ALGORITHMS[algorithm].fn(array);
    
    for (const state of generator) {
      if (stopRef.current) break;
      
      setArray(state.array);
      setComparing(state.comparing || []);
      setSwapping(state.swapping || []);
      setSorted(state.sorted || []);
      setPivot(state.pivot || []);
      
      await sleep(101 - speed);
    }
    
    setIsRunning(false);
  };
  
  const stop = () => {
    stopRef.current = true;
    setIsRunning(false);
  };
  
  const getBarColor = (index) => {
    if (sorted.includes(index)) return COLORS.sorted;
    if (swapping.includes(index)) return COLORS.swapping;
    if (comparing.includes(index)) return COLORS.comparing;
    if (pivot.includes(index)) return COLORS.pivot;
    return COLORS.default;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {Object.entries(SORTING_ALGORITHMS).map(([key, { name, complexity }]) => (
            <button
              key={key}
              onClick={() => setAlgorithm(key)}
              disabled={isRunning}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                algorithm === key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              } disabled:opacity-50`}
            >
              {name} <span className="text-xs opacity-70">{complexity}</span>
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={generateArray}
            disabled={isRunning}
            className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 disabled:opacity-50 transition-all"
          >
            New Array
          </button>
          {!isRunning ? (
            <button
              onClick={runAlgorithm}
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 transition-all"
            >
              Start
            </button>
          ) : (
            <button
              onClick={stop}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition-all"
            >
              Stop
            </button>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-slate-300">
          <span className="text-sm">Speed:</span>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-24"
          />
        </label>
        
        <label className="flex items-center gap-2 text-slate-300">
          <span className="text-sm">Size:</span>
          <input
            type="range"
            min="10"
            max="100"
            value={arraySize}
            onChange={(e) => {
              setArraySize(Number(e.target.value));
            }}
            disabled={isRunning}
            className="w-24"
          />
          <span className="text-sm w-8">{arraySize}</span>
        </label>
      </div>
      
      <div className="flex items-end justify-center gap-px h-96 bg-slate-900 rounded-lg p-4">
        {array.map((value, index) => (
          <div
            key={index}
            className="transition-all duration-75"
            style={{
              height: `${value}px`,
              width: `${Math.max(2, 800 / arraySize - 1)}px`,
              backgroundColor: getBarColor(index),
            }}
          />
        ))}
      </div>
      
      <div className="flex gap-4 text-sm justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.comparing }} />
          <span className="text-slate-400">Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.swapping }} />
          <span className="text-slate-400">Swapping</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.sorted }} />
          <span className="text-slate-400">Sorted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.pivot }} />
          <span className="text-slate-400">Pivot</span>
        </div>
      </div>
    </div>
  );
}

function PathfindingVisualizer() {
  const [grid, setGrid] = useState(createGrid);
  const [algorithm, setAlgorithm] = useState('astar');
  const [speed, setSpeed] = useState(50);
  const [isRunning, setIsRunning] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState('wall'); // 'wall', 'start', 'end'
  const [visitedCells, setVisitedCells] = useState(new Set());
  const [pathCells, setPathCells] = useState(new Set());
  const [currentCell, setCurrentCell] = useState(null);
  const stopRef = useRef(false);
  
  const resetGrid = () => {
    setGrid(createGrid());
    setVisitedCells(new Set());
    setPathCells(new Set());
    setCurrentCell(null);
  };
  
  const clearPath = () => {
    setVisitedCells(new Set());
    setPathCells(new Set());
    setCurrentCell(null);
    setGrid(prev => {
      const newGrid = prev.map(row => row.map(cell => ({
        ...cell,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        heuristic: 0,
        previous: null,
      })));
      return newGrid;
    });
  };
  
  const generateMaze = () => {
    clearPath();
    setGrid(prev => {
      const newGrid = prev.map(row => row.map(cell => ({
        ...cell,
        isWall: !cell.isStart && !cell.isEnd && Math.random() < 0.3,
      })));
      return newGrid;
    });
  };
  
  const handleCellInteraction = (row, col) => {
    if (isRunning) return;
    
    setGrid(prev => {
      const newGrid = prev.map(r => r.map(c => ({ ...c })));
      const cell = newGrid[row][col];
      
      if (drawMode === 'wall') {
        if (!cell.isStart && !cell.isEnd) {
          cell.isWall = !cell.isWall;
        }
      } else if (drawMode === 'start') {
        // Clear old start
        for (let r of newGrid) {
          for (let c of r) {
            c.isStart = false;
          }
        }
        cell.isStart = true;
        cell.isWall = false;
        cell.isEnd = false;
      } else if (drawMode === 'end') {
        // Clear old end
        for (let r of newGrid) {
          for (let c of r) {
            c.isEnd = false;
          }
        }
        cell.isEnd = true;
        cell.isWall = false;
        cell.isStart = false;
      }
      
      return newGrid;
    });
  };
  
  const handleMouseDown = (row, col) => {
    setIsDrawing(true);
    handleCellInteraction(row, col);
  };
  
  const handleMouseEnter = (row, col) => {
    if (isDrawing && drawMode === 'wall') {
      handleCellInteraction(row, col);
    }
  };
  
  const handleMouseUp = () => {
    setIsDrawing(false);
  };
  
  const runAlgorithm = async () => {
    clearPath();
    setIsRunning(true);
    stopRef.current = false;
    
    // Find start and end nodes
    let startNode = null;
    let endNode = null;
    
    const gridCopy = grid.map(row => row.map(cell => ({
      ...cell,
      distance: Infinity,
      heuristic: 0,
      previous: null,
    })));
    
    for (let row of gridCopy) {
      for (let cell of row) {
        if (cell.isStart) startNode = cell;
        if (cell.isEnd) endNode = cell;
      }
    }
    
    if (!startNode || !endNode) {
      setIsRunning(false);
      return;
    }
    
    const generator = PATHFINDING_ALGORITHMS[algorithm].fn(gridCopy, startNode, endNode);
    
    for (const state of generator) {
      if (stopRef.current) break;
      
      if (state.current) {
        setCurrentCell(`${state.current.row}-${state.current.col}`);
      }
      
      if (state.visited) {
        setVisitedCells(new Set(state.visited));
      }
      
      if (state.path) {
        const pathSet = new Set(state.path.map(n => `${n.row}-${n.col}`));
        setPathCells(pathSet);
      }
      
      if (state.done) {
        setCurrentCell(null);
        break;
      }
      
      await sleep(101 - speed);
    }
    
    setIsRunning(false);
  };
  
  const stop = () => {
    stopRef.current = true;
    setIsRunning(false);
  };
  
  const getCellColor = (cell) => {
    if (cell.isStart) return COLORS.start;
    if (cell.isEnd) return COLORS.end;
    if (cell.isWall) return COLORS.wall;
    
    const key = `${cell.row}-${cell.col}`;
    if (pathCells.has(key)) return COLORS.path;
    if (currentCell === key) return COLORS.current;
    if (visitedCells.has(key)) return COLORS.visited;
    
    return COLORS.empty;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {Object.entries(PATHFINDING_ALGORITHMS).map(([key, { name }]) => (
            <button
              key={key}
              onClick={() => setAlgorithm(key)}
              disabled={isRunning}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                algorithm === key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              } disabled:opacity-50`}
            >
              {name}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={resetGrid}
            disabled={isRunning}
            className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 disabled:opacity-50 transition-all"
          >
            Reset
          </button>
          <button
            onClick={clearPath}
            disabled={isRunning}
            className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 disabled:opacity-50 transition-all"
          >
            Clear Path
          </button>
          <button
            onClick={generateMaze}
            disabled={isRunning}
            className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 disabled:opacity-50 transition-all"
          >
            Random Walls
          </button>
          {!isRunning ? (
            <button
              onClick={runAlgorithm}
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 transition-all"
            >
              Start
            </button>
          ) : (
            <button
              onClick={stop}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition-all"
            >
              Stop
            </button>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-6 items-center">
        <label className="flex items-center gap-2 text-slate-300">
          <span className="text-sm">Speed:</span>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-24"
          />
        </label>
        
        <div className="flex gap-2 text-sm">
          <span className="text-slate-400">Draw:</span>
          {['wall', 'start', 'end'].map(mode => (
            <button
              key={mode}
              onClick={() => setDrawMode(mode)}
              disabled={isRunning}
              className={`px-3 py-1 rounded capitalize transition-all ${
                drawMode === mode
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              } disabled:opacity-50`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
      
      <div className="text-sm text-slate-400 italic">
        {PATHFINDING_ALGORITHMS[algorithm].description}
      </div>
      
      <div 
        className="inline-block bg-slate-900 rounded-lg p-2"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="flex">
            {row.map((cell, colIdx) => (
              <div
                key={`${rowIdx}-${colIdx}`}
                className="w-4 h-4 border border-slate-800 transition-colors duration-75 cursor-pointer"
                style={{ backgroundColor: getCellColor(cell) }}
                onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
              />
            ))}
          </div>
        ))}
      </div>
      
      <div className="flex gap-4 text-sm justify-center flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.start }} />
          <span className="text-slate-400">Start</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.end }} />
          <span className="text-slate-400">End</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.wall }} />
          <span className="text-slate-400">Wall</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.visited }} />
          <span className="text-slate-400">Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.path }} />
          <span className="text-slate-400">Path</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('sorting');
  
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Algorithm Visualizer</h1>
        <p className="text-slate-400 text-center mb-6">Interactive visualization of sorting and pathfinding algorithms</p>
        
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab('sorting')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'sorting'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Sorting Algorithms
          </button>
          <button
            onClick={() => setActiveTab('pathfinding')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'pathfinding'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Pathfinding Algorithms
          </button>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-6">
          {activeTab === 'sorting' ? <SortingVisualizer /> : <PathfindingVisualizer />}
        </div>
        
        <footer className="mt-6 text-center text-slate-500 text-sm">
          Built by Xinci Ma • React + TypeScript
        </footer>
      </div>
    </div>
  );
}

export default App;
