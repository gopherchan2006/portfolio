export const articles = [
  {
    id: 1,
    slug: 'go-concurrency-patterns',
    title: 'Go Concurrency Patterns',
    summary:
      'Real-world goroutines, channels and select examples. How to not break production while squeezing every bit out of a multicore CPU.',
    date: '2026-04-15',
    readTime: '8 min',
    tags: ['Go', 'Concurrency', 'Backend'],
    accent: 'cyan',
    content: [
      {
        type: 'paragraph',
        text: 'Go was designed with concurrency in mind from day one. Goroutines are cheap, channels are expressive, and the scheduler is smart. But even with tools this good, it\'s easy to shoot yourself in the foot.',
      },
      {
        type: 'h2',
        text: 'Goroutines: not threads, but close',
      },
      {
        type: 'paragraph',
        text: 'A goroutine is a green thread managed by the Go runtime. The starting stack is 2вЂ“8 KB and grows dynamically. You can safely launch a million goroutines вЂ” the scheduler distributes them across OS threads via GOMAXPROCS.',
      },
      {
        type: 'code',
        lang: 'go',
        text: `func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        fmt.Printf("worker %d processing job %d\\n", id, j)
        results <- j * 2
    }
}

func main() {
    jobs    := make(chan int, 100)
    results := make(chan int, 100)

    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }
    for j := 1; j <= 9; j++ {
        jobs <- j
    }
    close(jobs)
    for a := 1; a <= 9; a++ {
        <-results
    }
}`,
      },
      {
        type: 'h2',
        text: 'Select: multiplexing channels',
      },
      {
        type: 'paragraph',
        text: 'select lets you wait on multiple channels at once. When several cases are ready simultaneously, Go picks one at random. This matters вЂ” don\'t write code that depends on a specific order.',
      },
      {
        type: 'code',
        lang: 'go',
        text: `ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

select {
case result := <-compute():
    fmt.Println("got:", result)
case <-ctx.Done():
    fmt.Println("timeout:", ctx.Err())
}`,
      },
      {
        type: 'h2',
        text: 'Common mistakes',
      },
      {
        type: 'paragraph',
        text: 'The most frequent one is goroutine leak: you launch a goroutine that reads from a channel, but nobody ever closes it. Use context for cancellation and always verify that every goroutine will eventually exit.',
      },
      {
        type: 'paragraph',
        text: 'Second most common вЂ” data races. Run your tests with the -race flag. It\'s free and catches 95% of race conditions at development time.',
      },
    ],
  },
  {
    id: 2,
    slug: 'postgres-indexing-guide',
    title: 'PostgreSQL: Indexes That Actually Work',
    summary:
      'EXPLAIN ANALYZE, B-tree vs GIN vs BRIN, partial and composite indexes. How to turn a 3-second query into 3 milliseconds.',
    date: '2026-04-02',
    readTime: '11 min',
    tags: ['PostgreSQL', 'Database', 'Performance'],
    accent: 'purple',
    content: [
      {
        type: 'paragraph',
        text: 'An index is a separate data structure that lets PostgreSQL find rows without a full table scan. Sounds simple, but the nuances could fill a book.',
      },
      {
        type: 'h2',
        text: 'EXPLAIN ANALYZE вЂ” your main tool',
      },
      {
        type: 'paragraph',
        text: 'Before adding an index, run EXPLAIN (ANALYZE, BUFFERS) and see what\'s happening. Seq Scan on a large table вЂ” bad. Index Scan вЂ” good. Bitmap Index Scan вЂ” a middle ground for large result sets.',
      },
      {
        type: 'code',
        lang: 'sql',
        text: `EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT *
FROM orders
WHERE user_id = 42
  AND created_at > NOW() - INTERVAL '30 days'
ORDER BY created_at DESC
LIMIT 20;`,
      },
      {
        type: 'h2',
        text: 'Composite indexes: column order matters',
      },
      {
        type: 'paragraph',
        text: 'The left-prefix rule: an index on (a, b, c) can be used for conditions on a, on a+b, on a+b+c вЂ” but not on b or c alone. Put the column with the highest selectivity first.',
      },
      {
        type: 'code',
        lang: 'sql',
        text: `-- For this query (user_id, created_at) is better than the reverse
CREATE INDEX idx_orders_user_date
  ON orders(user_id, created_at DESC);

-- Partial index вЂ” only index what you need
CREATE INDEX idx_orders_pending
  ON orders(created_at)
  WHERE status = 'pending';`,
      },
      {
        type: 'h2',
        text: 'GIN for full-text search and JSONB',
      },
      {
        type: 'paragraph',
        text: 'B-tree can\'t search inside JSONB or tsvector. That\'s what GIN (Generalized Inverted Index) is for. It\'s slower to update but blazing fast at content lookups.',
      },
      {
        type: 'code',
        lang: 'sql',
        text: `-- Full-text search
CREATE INDEX idx_articles_fts
  ON articles USING GIN(to_tsvector('english', title || ' ' || content));

SELECT * FROM articles
WHERE to_tsvector('english', title || ' ' || content)
      @@ plainto_tsquery('english', 'concurrency golang');`,
      },
    ],
  },
  {
    id: 3,
    slug: 'react-performance-tricks',
    title: 'React: Performance Without Pain',
    summary:
      'memo, useMemo, useCallback вЂ” when they actually help and when they just get in the way. Profiling with DevTools and real scenarios.',
    date: '2026-03-20',
    readTime: '7 min',
    tags: ['React', 'Frontend', 'Performance'],
    accent: 'orange',
    content: [
      {
        type: 'paragraph',
        text: 'Premature optimization is the root of all evil. Before reaching for memo and useMemo, open React DevTools Profiler and confirm the problem actually exists.',
      },
      {
        type: 'h2',
        text: 'When memo actually helps',
      },
      {
        type: 'paragraph',
        text: 'React.memo is useful when: the component is expensive to render, its parent re-renders frequently, and the component\'s props don\'t change in the process. If all three apply вЂ” wrap it. Otherwise, the overhead of comparing props outweighs the benefit.',
      },
      {
        type: 'code',
        lang: 'jsx',
        text: `// Bad: creates a new function on every parent render
function Parent() {
  const handleClick = () => console.log('click') // new reference every time
  return <ExpensiveChild onClick={handleClick} />
}

// Good: stable reference + memo on the child
function Parent() {
  const handleClick = useCallback(() => console.log('click'), [])
  return <ExpensiveChild onClick={handleClick} />
}

const ExpensiveChild = memo(({ onClick }) => {
  // only re-renders if onClick changed
  return <button onClick={onClick}>Click</button>
})`,
      },
      {
        type: 'h2',
        text: 'useMemo: only for heavy computations',
      },
      {
        type: 'paragraph',
        text: 'useMemo caches a computed value. It only makes sense when the computation takes noticeable time вЂ” sorting/filtering large arrays, complex aggregations. For trivial operations it\'s just extra overhead.',
      },
      {
        type: 'code',
        lang: 'jsx',
        text: `// Not needed вЂ” instant operation
const doubled = useMemo(() => value * 2, [value])

// Needed вЂ” sorting thousands of items
const sorted = useMemo(
  () => [...items].sort((a, b) => b.score - a.score),
  [items]
)`,
      },
      {
        type: 'h2',
        text: 'List virtualization',
      },
      {
        type: 'paragraph',
        text: 'The most powerful optimization for long lists вЂ” don\'t render what\'s not visible. TanStack Virtual (formerly react-virtual) weighs 3 KB and handles lists of 100,000 items with ease.',
      },
    ],
  },
  {
    id: 4,
    slug: 'dsa-graphs-bfs-dfs',
    title: 'Graphs: BFS, DFS and When to Use Which',
    summary:
      'Breadth-first and depth-first traversal вЂ” the foundation of graph algorithms. Breaking it down with LeetCode problems and real-world scenarios.',
    date: '2026-03-05',
    readTime: '10 min',
    tags: ['DSA', 'Algorithms', 'Go'],
    accent: 'green',
    content: [
      {
        type: 'paragraph',
        text: 'Graphs are nodes and edges. Sounds simple, but this abstraction describes social networks, routing, package dependency trees, web crawlers, and a thousand other things.',
      },
      {
        type: 'h2',
        text: 'BFS вЂ” breadth-first search',
      },
      {
        type: 'paragraph',
        text: 'BFS explores a graph layer by layer. Ideal for finding the shortest path in an unweighted graph. Uses a queue. If the problem asks for "minimum number of steps" вЂ” BFS is almost certainly the answer.',
      },
      {
        type: 'code',
        lang: 'go',
        text: `func bfs(graph [][]int, start int) []int {
    visited := make([]bool, len(graph))
    queue   := []int{start}
    result  := []int{}
    visited[start] = true

    for len(queue) > 0 {
        node := queue[0]
        queue = queue[1:]
        result = append(result, node)

        for _, neighbor := range graph[node] {
            if !visited[neighbor] {
                visited[neighbor] = true
                queue = append(queue, neighbor)
            }
        }
    }
    return result
}`,
      },
      {
        type: 'h2',
        text: 'DFS вЂ” depth-first search',
      },
      {
        type: 'paragraph',
        text: 'DFS goes as deep as possible down one branch before backtracking. Ideal for topological sort, finding connected components, cycle detection. Implemented via recursion or an explicit stack.',
      },
      {
        type: 'code',
        lang: 'go',
        text: `func dfs(graph [][]int, node int, visited []bool, result *[]int) {
    visited[node] = true
    *result = append(*result, node)
    for _, neighbor := range graph[node] {
        if !visited[neighbor] {
            dfs(graph, neighbor, visited, result)
        }
    }
}`,
      },
      {
        type: 'h2',
        text: 'When to use which',
      },
      {
        type: 'paragraph',
        text: 'BFS: shortest path (unweighted), level order traversal, "minimum steps". DFS: topological sort, connected components, cycle detection, backtracking problems. For weighted shortest paths вЂ” Dijkstra or A*.',
      },
    ],
  },
]

export function getArticleBySlug(slug) {
  return articles.find(a => a.slug === slug) ?? null
}
