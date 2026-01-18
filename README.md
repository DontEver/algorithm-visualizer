# 📊 Algorithm Visualizer

An interactive web application for visualizing sorting and pathfinding algorithms. Built to help understand how these fundamental algorithms work through step-by-step animation.

![Algorithm Visualizer Demo](demo.gif)

## ✨ Features

### Sorting Algorithms
- **Bubble Sort** — O(n²) comparison-based sorting
- **Selection Sort** — O(n²) in-place comparison sort
- **Insertion Sort** — O(n²) builds sorted array one element at a time
- **Quick Sort** — O(n log n) divide-and-conquer with pivot selection
- **Merge Sort** — O(n log n) stable divide-and-conquer sort
- **Heap Sort** — O(n log n) comparison-based using binary heap

### Pathfinding Algorithms
- **BFS (Breadth-First Search)** — Explores level by level, guarantees shortest path
- **DFS (Depth-First Search)** — Explores as far as possible along each branch
- **Dijkstra's Algorithm** — Finds shortest path with weighted edges
- **A* Search** — Uses heuristics for optimal pathfinding performance

### Interactive Controls
- 🎚️ **Speed Control** — Adjust visualization speed from slow-motion to instant
- 📏 **Array Size** — Change the number of elements (10-100)
- 🖱️ **Draw Walls** — Click and drag to create maze obstacles
- 🎯 **Move Start/End** — Reposition pathfinding nodes
- 🎲 **Random Generation** — Generate random arrays or maze patterns

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/DontEver/algorithm-visualizer.git
cd algorithm-visualizer

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

## 🏗️ Build for Production

```bash
# Build optimized version
npm run build

# Preview the build
npm run preview
```

The built files will be in the `dist/` folder.

## 📦 Deployment

### GitHub Pages

1. The `vite.config.js` is already configured for GitHub Pages deployment
2. Build and deploy:
   ```bash
   npm run build
   # Push dist/ folder to gh-pages branch
   ```

### Netlify / Vercel
Just connect your GitHub repo — it will auto-detect Vite and deploy.

## 🛠️ Tech Stack

- **React 18** — UI framework with hooks
- **Vite** — Next-generation frontend tooling
- **Tailwind CSS** — Utility-first styling
- **JavaScript ES6+** — Modern JavaScript with generators for algorithm steps

## 📚 Algorithm Complexity Reference

| Algorithm | Time (Best) | Time (Average) | Time (Worst) | Space |
|-----------|-------------|----------------|--------------|-------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) |

| Algorithm | Time | Space | Guarantees Shortest Path |
|-----------|------|-------|-------------------------|
| BFS | O(V + E) | O(V) | ✅ Yes (unweighted) |
| DFS | O(V + E) | O(V) | ❌ No |
| Dijkstra | O((V + E) log V) | O(V) | ✅ Yes |
| A* | O(E) | O(V) | ✅ Yes (with admissible heuristic) |

## 🎨 Color Legend

### Sorting
- 🟣 **Indigo** — Default unsorted element
- 🟡 **Amber** — Currently comparing
- 🔴 **Red** — Swapping elements
- 🟢 **Green** — Sorted and in final position
- 🩷 **Pink** — Pivot element (Quick Sort)

### Pathfinding
- 🟢 **Green** — Start node
- 🔴 **Red** — End node
- ⬛ **Dark** — Wall/obstacle
- 🟣 **Indigo** — Visited cells
- 🟡 **Amber** — Final path

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new algorithms
- Improve visualizations
- Fix bugs
- Enhance documentation

## 📄 License

MIT — Use it however you want!

---

Built with ❤️ for learning algorithms
