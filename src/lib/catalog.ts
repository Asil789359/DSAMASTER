export interface DSAPattern {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  problemsCount: number;
}

export interface Problem {
  id: string;
  title: string;
  patternId: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  acceptance: string;
  premium: boolean;
  description: string;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  constraints: string[];
  starterCode: {
    python: string;
    java: string;
    cpp: string;
    javascript: string;
  };
  solutions: {
    python: string;
    java: string;
    cpp: string;
    javascript: string;
    explanation: string;
  };
  visualExplanation: string; // SVG or Step data for visualization
}

export interface CheatSheet {
  id: string;
  title: string;
  category: 'DSA' | 'System Design';
  description: string;
  summary: string;
  keyConcepts: Array<{ term: string; definition: string }>;
  cheatCode?: string;
  tradeoffs?: Array<{ option: string; pros: string[]; cons: string[] }>;
}

export interface SystemDesignGuide {
  id: string;
  title: string;
  difficulty: 'Medium' | 'Hard';
  description: string;
  requirements: {
    functional: string[];
    nonFunctional: string[];
  };
  capacityEstimation: string;
  apiDesign: string;
  dbSchema: string;
  hldDiagram: string; // SVG code representing architecture
  tradeoffs: string;
}

export const DSA_PATTERNS: DSAPattern[] = [
  { id: 'sliding-window', title: 'Sliding Window', description: 'Track a subarray/sublist window that grows, shrinks, or slides based on target conditions.', difficulty: 'Easy', problemsCount: 2 },
  { id: 'two-pointers', title: 'Two Pointers', description: 'Iterate from opposite ends or at different speeds to compare elements without extra memory.', difficulty: 'Easy', problemsCount: 2 },
  { id: 'two-heaps', title: 'Two Heaps', description: 'Use Min-Heap and Max-Heap simultaneously to dynamically track elements like running medians.', difficulty: 'Hard', problemsCount: 1 },
  { id: 'bfs', title: 'Breadth-First Search (BFS)', description: 'Traverse level by level using a queue, ideal for finding shortest paths in trees or graphs.', difficulty: 'Medium', problemsCount: 1 },
  { id: 'dfs', title: 'Depth-First Search (DFS)', description: 'Explore as deep as possible down each branch using recursion or a stack before backtracking.', difficulty: 'Medium', problemsCount: 1 },
  { id: 'dp', title: 'Dynamic Programming', description: 'Solve complex problems by breaking them into overlapping subproblems and memoizing results.', difficulty: 'Medium', problemsCount: 3 }
];

export const PROBLEMS: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    patternId: 'two-pointers',
    difficulty: 'Easy',
    acceptance: '82.4%',
    premium: false,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have ***exactly* one solution**, and you may not use the *same* element twice.

You can return the answer in any order.`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    starterCode: {
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Write your code here
    return []`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        return {};
    }
};`,
      javascript: `function twoSum(nums, target) {
    // Write your code here
    return [];
}`
    },
    solutions: {
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []`,
      java: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`,
      cpp: `#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        std::unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.find(complement) != map.end()) {
                return {map[complement], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};`,
      javascript: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
      explanation: `The optimal approach is to store the array elements and their indices in a hash map as we iterate. For each element \`nums[i]\`, we check if its complement \`target - nums[i]\` exists in the hash map. 
- If it exists, we have found the two elements that sum up to target and return their indices.
- If it does not exist, we insert the current element \`nums[i]\` and its index into the map.

**Time Complexity:** O(N) where N is the length of the array since we traverse it only once.
**Space Complexity:** O(N) to store elements in the hash map.`
    },
    visualExplanation: 'two-sum'
  },
  {
    id: 'container-with-most-water',
    title: 'Container With Most Water',
    patternId: 'two-pointers',
    difficulty: 'Medium',
    acceptance: '54.2%',
    premium: false,
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i\`-th line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return *the maximum amount of water a container can store*.`,
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49.' }
    ],
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4'
    ],
    starterCode: {
      python: `def maxArea(height: list[int]) -> int:
    return 0`,
      java: `class Solution {
    public int maxArea(int[] height) {
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int maxArea(vector<int>& height) {
        return 0;
    }
};`,
      javascript: `function maxArea(height) {
    return 0;
}`
    },
    solutions: {
      python: `def maxArea(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_water = 0
    while left < right:
        width = right - left
        h = min(height[left], height[right])
        max_water = max(max_water, width * h)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_water`,
      java: `class Solution {
    public int maxArea(int[] height) {
        int left = 0, right = height.length - 1;
        int maxWater = 0;
        while (left < right) {
            int width = right - left;
            int h = Math.min(height[left], height[right]);
            maxWater = Math.max(maxWater, width * h);
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxWater;
    }
}`,
      cpp: `class Solution {
public:
    int maxArea(vector<int>& height) {
        int left = 0, right = height.size() - 1;
        int maxWater = 0;
        while (left < right) {
            int width = right - left;
            int h = min(height[left], height[right]);
            maxWater = max(maxWater, width * h);
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxWater;
    }
};`,
      javascript: `function maxArea(height) {
    let left = 0;
    let right = height.length - 1;
    let maxWater = 0;
    while (left < right) {
        const width = right - left;
        const h = Math.min(height[left], height[right]);
        maxWater = Math.max(maxWater, width * h);
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    return maxWater;
}`,
      explanation: `We use two pointers, one at the start (\`left = 0\`) and one at the end (\`right = n-1\`).
At each step:
1. The water contained is bounded by the shorter line, i.e., \`min(height[left], height[right]) * (right - left)\`.
2. Update the \`maxWater\` found so far.
3. Move the pointer pointing to the shorter height inward, because moving the taller one would only decrease the width without any chance of finding a taller boundary to make up for the width loss.

**Time Complexity:** O(N) single scan.
**Space Complexity:** O(1) constant auxiliary space.`
    },
    visualExplanation: 'water-container'
  },
  {
    id: 'sliding-window-maximum',
    title: 'Sliding Window Maximum',
    patternId: 'sliding-window',
    difficulty: 'Hard',
    acceptance: '46.7%',
    premium: true,
    description: `You are given an array of integers \`nums\`, there is a sliding window of size \`k\` which is moving from the very left of the array to the very right. You can only see the \`k\` numbers in the window. Each time the sliding window moves right by one position.

Return *the max sliding window*.`,
    examples: [
      { input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', output: '[3,3,5,5,6,7]', explanation: 'Window positions: [1,3,-1] -> 3; [3,-1,-3] -> 3; [-1,-3,5] -> 5; [-3,5,3] -> 5; [5,3,6] -> 6; [3,6,7] -> 7.' }
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
      '1 <= k <= nums.length'
    ],
    starterCode: {
      python: `def maxSlidingWindow(nums: list[int], k: int) -> list[int]:
    return []`,
      java: `class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        return new int[]{};
    }
}`,
      cpp: `class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        return {};
    }
};`,
      javascript: `function maxSlidingWindow(nums, k) {
    return [];
}`
    },
    solutions: {
      python: `from collections import deque

def maxSlidingWindow(nums: list[int], k: int) -> list[int]:
    q = deque() # store indices
    res = []
    for i, num in enumerate(nums):
        # remove indices out of window bounds
        if q and q[0] < i - k + 1:
            q.popleft()
        # remove smaller elements from back of queue
        while q and nums[q[-1]] < num:
            q.pop()
        q.append(i)
        # add max of window to result
        if i >= k - 1:
            res.append(nums[q[0]])
    return res`,
      java: `import java.util.Deque;
import java.util.LinkedList;

class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        if (nums == null || nums.length == 0) return new int[0];
        int n = nums.length;
        int[] res = new int[n - k + 1];
        Deque<Integer> q = new LinkedList<>(); // store indices
        int idx = 0;
        for (int i = 0; i < n; i++) {
            // remove out of range
            if (!q.isEmpty() && q.peek() < i - k + 1) {
                q.poll();
            }
            // remove smaller
            while (!q.isEmpty() && nums[q.peekLast()] < nums[i]) {
                q.pollLast();
            }
            q.offer(i);
            if (i >= k - 1) {
                res[idx++] = nums[q.peek()];
            }
        }
        return res;
    }
}`,
      cpp: `#include <vector>
#include <deque>

class Solution {
public:
    std::vector<int> maxSlidingWindow(std::vector<int>& nums, int k) {
        std::deque<int> q; // store indices
        std::vector<int> res;
        for (int i = 0; i < nums.size(); i++) {
            if (!q.empty() && q.front() < i - k + 1) {
                q.pop_front();
            }
            while (!q.empty() && nums[q.back()] < nums[i]) {
                q.pop_back();
            }
            q.push_back(i);
            if (i >= k - 1) {
                res.push_back(nums[q.front()]);
            }
        }
        return res;
    }
};`,
      javascript: `function maxSlidingWindow(nums, k) {
    const q = []; // double-ended queue storing indices
    const res = [];
    for (let i = 0; i < nums.length; i++) {
        if (q.length && q[0] < i - k + 1) {
            q.shift();
        }
        while (q.length && nums[q[q.length - 1]] < nums[i]) {
            q.pop();
        }
        q.push(i);
        if (i >= k - 1) {
            res.push(nums[q[0]]);
        }
    }
    return res;
}`,
      explanation: `We use a Monotonic Deque (double-ended queue) to store indices of the array elements. The deque elements are kept in decreasing order of their values.
1. For each index \`i\`, we clean up indices that are no longer inside the current window, i.e., indices smaller than \`i - k + 1\`.
2. We pop elements from the back of the queue if their corresponding values are smaller than the incoming element \`nums[i]\`.
3. Push the current index \`i\` onto the queue.
4. The front of the queue will always store the index of the maximum element in the current window.

**Time Complexity:** O(N) because each element is pushed and popped at most once.
**Space Complexity:** O(K) for the deque.`
    },
    visualExplanation: 'sliding-window-max'
  },
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    patternId: 'dp',
    difficulty: 'Easy',
    acceptance: '52.1%',
    premium: false,
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    examples: [
      { input: 'n = 2', output: '2', explanation: 'There are two ways to climb: (1 + 1) steps, or (2) steps.' },
      { input: 'n = 3', output: '3', explanation: 'Three ways: (1+1+1) steps, (1+2) steps, or (2+1) steps.' }
    ],
    constraints: [
      '1 <= n <= 45'
    ],
    starterCode: {
      python: `def climbStairs(n: int) -> int:
    return 0`,
      java: `class Solution {
    public int climbStairs(int n) {
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        return 0;
    }
};`,
      javascript: `function climbStairs(n) {
    return 0;
}`
    },
    solutions: {
      python: `def climbStairs(n: int) -> int:
    if n <= 2:
        return n
    first, second = 1, 2
    for _ in range(3, n + 1):
        third = first + second
        first = second
        second = third
    return second`,
      java: `class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int first = 1, second = 2;
        for (int i = 3; i <= n; i++) {
            int third = first + second;
            first = second;
            second = third;
        }
        return second;
    }
}`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        int first = 1, second = 2;
        for (int i = 3; i <= n; i++) {
            int third = first + second;
            first = second;
            second = third;
        }
        return second;
    }
};`,
      javascript: `function climbStairs(n) {
    if (n <= 2) return n;
    let first = 1;
    let second = 2;
    for (let i = 3; i <= n; i++) {
        let third = first + second;
        first = second;
        second = third;
    }
    return second;
}`,
      explanation: `This is a classic Dynamic Programming problem isomorphic to Fibonacci numbers.
Let \`dp[i]\` be the number of ways to reach step \`i\`.
To reach step \`i\`, you can take:
1. A single step from step \`i-1\` (dp[i-1] ways)
2. A double step from step \`i-2\` (dp[i-2] ways)
Thus, \`dp[i] = dp[i-1] + dp[i-2]\`.
Using two variables to hold precomputed states reduces space complexity.

**Time Complexity:** O(N) time.
**Space Complexity:** O(1) space.`
    },
    visualExplanation: 'climbing-stairs'
  }
];

export const CHEATSHEETS: CheatSheet[] = [
  {
    id: 'two-pointers-cheatsheet',
    category: 'DSA',
    title: 'Two Pointers Cheat Sheet',
    description: 'Master the two pointers technique for linear structures.',
    summary: 'The two pointers pattern is an efficient coding technique typically used on arrays or linked lists. It uses two indices or reference pointers to iterate through the data structure in a single scan.',
    keyConcepts: [
      { term: 'Opposite Ends', definition: 'Pointers start at index 0 and length-1. Move inwards based on comparison. Used in Sorted Sums, Container Water, Reversing arrays.' },
      { term: 'Fast & Slow (Tortoise & Hare)', definition: 'One pointer moves twice as fast as the other. Used to find cycles in graphs/linked lists, middle nodes, or duplicate elements.' },
      { term: 'Interval Merging', definition: 'Comparing head and tail boundaries across overlapping subsets.' }
    ],
    cheatCode: `# Opposite ends skeleton
def solve(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []`
  },
  {
    id: 'load-balancer-cheatsheet',
    category: 'System Design',
    title: 'Load Balancer Basics',
    description: 'Trade-offs and algorithms of distributed load balancers.',
    summary: 'Load balancers distribute network or application traffic across multiple backend servers to optimize resource utilization, maximize throughput, and prevent server overloads.',
    keyConcepts: [
      { term: 'Layer 4 Load Balancing', definition: 'Routing decisions are made at the Transport level (TCP/UDP). It does not read message payloads, only packet headers. Fast but lacks intelligence.' },
      { term: 'Layer 7 Load Balancing', definition: 'Routing decisions are made at the Application level (HTTP/HTTPS). Reads URL routes, cookies, and HTTP headers to route dynamically (e.g. content-based routing).' },
      { term: 'Weighted Round Robin', definition: 'Static algorithm that distributes traffic sequentially based on a hardcoded capability weight assigned to each node.' },
      { term: 'Consistent Hashing', definition: 'Dynamic mapping based on key hashes. Minimizes key remapping when servers scale up/down, vital for stateful cache load balancing.' }
    ],
    tradeoffs: [
      {
        option: 'L4 vs L7 Routing',
        pros: ['L4 is extremely fast, uses less CPU', 'L7 allows intelligent routing (cookies, path routing)'],
        cons: ['L4 cannot parse paths or split headers', 'L7 is CPU heavy due to TLS termination and parsing']
      }
    ]
  }
];

export const SYSTEM_DESIGN_GUIDES: SystemDesignGuide[] = [
  {
    id: 'url-shortener',
    title: 'Designing a URL Shortener (TinyURL)',
    difficulty: 'Medium',
    description: 'Design a service that takes a long HTTP link and returns a shortened, easily shareable URL redirecting back to the original source.',
    requirements: {
      functional: [
        'Generate a unique shortened URL for any given long URL.',
        'Redirect users visiting the shortened URL to the original URL with HTTP 302.',
        'Users should be able to specify custom alias keys (optional).'
      ],
      nonFunctional: [
        'High availability: The system must never go down for redirects.',
        'Low latency: Redirects should take less than 100ms.',
        'URL shortening key should be non-guessable for security.'
      ]
    },
    capacityEstimation: `- **Traffic volume:** Assume 500 Million new URL creations per month and 10 Billion redirection reads per month.
- **QPS (Query Per Second):** 
  - Write QPS: 500,000,000 / (30 days * 86400s) ≈ 200 writes/sec
  - Read QPS: 10,000,000,000 / (30 days * 86400s) ≈ 3,850 reads/sec
- **Storage:** Storing each URL takes ~500 bytes. For 5 years: 500M * 12 months * 5 years * 500 bytes = 15 Terabytes total storage.`,
    apiDesign: `- **Generate Short URL:**
  \`POST /api/v1/urls\`
  Request: \`{ "longUrl": "https://google.com/search?q=algomaster", "customAlias": "algo-search" }\`
  Response: \`{ "shortUrl": "https://tiny.io/algo-search", "expiresAt": "2028-06-18T22:00:00Z" }\`

- **Redirect Short URL:**
  \`GET /{shortKey}\`
  Response: \`HTTP 302 Redirect\` with header \`Location: https://google.com/search?q=algomaster\``,
    dbSchema: `We need a simple Key-Value look-up schema. Since relational queries are not required and we require high scalability, a NoSQL database (e.g. MongoDB, Cassandra, DynamoDB) is ideal.

**URL Table / Collection:**
- \`short_key\` (Primary Key): VARCHAR(8)
- \`long_url\`: VARCHAR(2048)
- \`created_at\`: TIMESTAMP
- \`user_id\`: VARCHAR(64)`,
    hldDiagram: `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" style="background: #1e293b; border-radius: 12px; font-family: sans-serif;">
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid)" />
  
  <text x="40" y="40" fill="#f8fafc" font-size="20" font-weight="bold">TinyURL High Level Architecture</text>
  
  <g transform="translate(40, 150)">
    <rect width="100" height="80" rx="8" fill="#38bdf8" />
    <text x="50" y="45" fill="#0f172a" font-size="14" font-weight="bold" text-anchor="middle">Client</text>
  </g>
  
  <g transform="translate(220, 120)">
    <rect width="150" height="140" rx="8" fill="#818cf8" />
    <text x="75" y="40" fill="#0f172a" font-size="14" font-weight="bold" text-anchor="middle">Load Balancer</text>
    <rect x="15" y="70" width="120" height="45" rx="4" fill="rgba(255,255,255,0.15)" />
    <text x="75" y="98" fill="#f8fafc" font-size="12" text-anchor="middle">Nginx / AWS ALB</text>
  </g>
  
  <g transform="translate(450, 60)">
    <rect width="160" height="110" rx="8" fill="#34d399" />
    <text x="80" y="35" fill="#0f172a" font-size="14" font-weight="bold" text-anchor="middle">Web Servers</text>
    <text x="80" y="65" fill="#0f172a" font-size="12" text-anchor="middle">Write API (Hashing)</text>
    <text x="80" y="85" fill="#0f172a" font-size="12" text-anchor="middle">Read API (Redirects)</text>
  </g>

  <g transform="translate(450, 240)">
    <rect width="160" height="110" rx="8" fill="#fbbf24" />
    <text x="80" y="35" fill="#0f172a" font-size="14" font-weight="bold" text-anchor="middle">Key Gen Service</text>
    <text x="80" y="65" fill="#0f172a" font-size="12" text-anchor="middle">Pre-generates keys</text>
    <text x="80" y="85" fill="#0f172a" font-size="12" text-anchor="middle">Range Allocator</text>
  </g>
  
  <g transform="translate(680, 60)">
    <rect width="100" height="110" rx="8" fill="#f87171" />
    <text x="50" y="35" fill="#0f172a" font-size="14" font-weight="bold" text-anchor="middle">Cache</text>
    <text x="50" y="65" fill="#0f172a" font-size="12" text-anchor="middle">Redis</text>
    <text x="50" y="85" fill="#0f172a" font-size="12" text-anchor="middle">(20% Hot URLs)</text>
  </g>

  <g transform="translate(680, 240)">
    <rect width="100" height="110" rx="8" fill="#a78bfa" />
    <text x="50" y="35" fill="#0f172a" font-size="14" font-weight="bold" text-anchor="middle">Database</text>
    <text x="50" y="65" fill="#0f172a" font-size="12" text-anchor="middle">Cassandra /</text>
    <text x="50" y="85" fill="#0f172a" font-size="12" text-anchor="middle">DynamoDB</text>
  </g>

  <line x1="140" y1="190" x2="220" y2="190" stroke="#f8fafc" stroke-width="2" marker-end="url(#arrow)" />
  <path d="M 370 160 L 410 160 L 410 115 L 450 115" fill="none" stroke="#f8fafc" stroke-width="2" />
  <path d="M 370 210 L 410 210 L 410 295 L 450 295" fill="none" stroke="#f8fafc" stroke-width="2" />
  <line x1="610" y1="115" x2="680" y2="115" stroke="#f8fafc" stroke-width="2" />
  <path d="M 610 145 L 640 145 L 640 295 L 680 295" fill="none" stroke="#f8fafc" stroke-width="2" />
  <line x1="610" y1="295" x2="680" y2="295" stroke="#f8fafc" stroke-width="2" />

  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#f8fafc" />
    </marker>
  </defs>
</svg>`,
    tradeoffs: `### Hash Collision vs Token Range Allocation
- **Option 1 (Hashing longUrl):** Take MD5 hash of longUrl and take first 7 characters.
  * *Trade-off:* Collisions can occur, requiring us to append sequence IDs or queries, generating write overhead.
- **Option 2 (Key Generation Service - KGS):** A separate service generates unique random keys beforehand and stores them. When writing, we just grab a key.
  * *Trade-off:* Simpler writes and zero collisions. However, KGS is a single point of failure (SPOF) and requires range allocation cache synchronization to prevent dual allocations across nodes.`
  }
];
