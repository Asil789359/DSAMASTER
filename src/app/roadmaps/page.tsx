'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface RoadmapNode {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  subtopics: string[];
  problems: Array<{ id: string; title: string; difficulty: 'Easy' | 'Medium' | 'Hard'; premium: boolean }>;
}

const DSA_NODES: RoadmapNode[] = [
  {
    id: 'complexity',
    title: 'Complexity Analysis',
    subtitle: 'Big-O notation, Time & Space Complexity',
    difficulty: 'Easy',
    description: 'Learn how to measure and compare the efficiency of algorithms. Master time complexity (how runtime grows relative to input size) and space complexity (how auxiliary memory grows). Understand standard bounds: O(1), O(log N), O(N), O(N log N), O(N^2), and O(2^N).',
    subtopics: ['Big-O Definition', 'Time Complexity Bounds', 'Space Complexity Bounds', 'Best/Average/Worst Case', 'Recursion Tree Method'],
    problems: []
  },
  {
    id: 'two-pointers',
    title: 'Two Pointers',
    subtitle: 'Opposite and Fast/Slow traversal patterns',
    difficulty: 'Easy',
    description: 'The Two Pointers pattern is a technique that uses two array indices/pointers to scan an array in O(N) time. Typically used on sorted arrays to find pairs, or on linked lists as slow/fast pointers to detect cycles.',
    subtopics: ['Opposite Ends Traversal', 'Fast and Slow Pointers', 'Cycle Detection', 'Middle of Linked List'],
    problems: [
      { id: 'two-sum', title: 'Two Sum', difficulty: 'Easy', premium: false },
      { id: 'container-with-most-water', title: 'Container With Most Water', difficulty: 'Medium', premium: false }
    ]
  },
  {
    id: 'sliding-window',
    title: 'Sliding Window',
    subtitle: 'Subarrays, subsets, and running window boundaries',
    difficulty: 'Medium',
    description: 'The Sliding Window pattern is used to perform operations on a specific window size of a linear data structure. It reduces O(N^2) nested loops into O(N) linear time by shifting the window bounds rather than recalculating the sub-array from scratch.',
    subtopics: ['Fixed Window Size', 'Variable Dynamic Window', 'Subarray Hashmap Counting', 'Monotonic Deque tracker'],
    problems: [
      { id: 'sliding-window-maximum', title: 'Sliding Window Maximum', difficulty: 'Hard', premium: true }
    ]
  },
  {
    id: 'bfs-dfs',
    title: 'BFS & DFS',
    subtitle: 'Breadth-First and Depth-First Search in Graphs/Trees',
    difficulty: 'Medium',
    description: 'Master core graph traversals. Breadth-First Search (BFS) explores level-by-level using a queue, solving shortest path problems. Depth-First Search (DFS) dives down recursion paths, ideal for connectivity, topological sorts, and backtracking.',
    subtopics: ['Queue-based BFS', 'Recursive DFS Stack', 'Graph Cycles', 'Topological Sort', 'Bipartite Matching'],
    problems: []
  },
  {
    id: 'dp',
    title: 'Dynamic Programming',
    subtitle: 'Overlapping subproblems and memoization states',
    difficulty: 'Hard',
    description: 'Dynamic Programming (DP) is a technique that solves complex problems by breaking them down into simpler, overlapping subproblems. By storing calculations in a memo table (top-down) or tabulating state (bottom-up), we avoid repeating expensive sub-computations.',
    subtopics: ['Memoization (Top-down)', 'Tabulation (Bottom-up)', '1D DP States', '2D DP Matrices', 'Knapsack Pattern'],
    problems: [
      { id: 'climbing-stairs', title: 'Climbing Stairs', difficulty: 'Easy', premium: false }
    ]
  }
];

const SYSTEM_DESIGN_NODES: RoadmapNode[] = [
  {
    id: 'fundamentals',
    title: 'Architecture Fundamentals',
    subtitle: 'Scalability, Availability, and Latency',
    difficulty: 'Easy',
    description: 'Understand the foundations of distributed systems. Learn horizontal vs vertical scaling, High Availability (HA) designs, SLA/SLOs, trade-offs of latency vs throughput, and single points of failure.',
    subtopics: ['Horizontal vs Vertical Scaling', 'High Availability (Active-Passive vs Active-Active)', 'SLA and Redundancy', 'SPOF Mitigation'],
    problems: []
  },
  {
    id: 'load-balancing',
    title: 'Load Balancing & CDNs',
    subtitle: 'Traffic distribution and edge caching networks',
    difficulty: 'Medium',
    description: 'Learn how load balancers route requests across backend nodes to prevent bottlenecks. Master L4 vs L7 balancing, Consistent Hashing algorithms, and edge caching Content Delivery Networks (CDNs) for serving static assets near users.',
    subtopics: ['Layer 4 vs Layer 7 Balancers', 'Consistent Hashing Rings', 'DNS Round Robin', 'CDN Edge Caching', 'Static vs Dynamic Content'],
    problems: []
  },
  {
    id: 'caching',
    title: 'Caching Strategies',
    subtitle: 'In-memory stores, Write policies, and Evictions',
    difficulty: 'Medium',
    description: 'Caching is the key to sub-millisecond read latency. Understand Redis/Memcached architectures, Cache Write-through/Write-back/Cache-aside patterns, and eviction algorithms like LRU, LFU, and FIFO.',
    subtopics: ['Cache-aside vs Write-through', 'LRU/LFU Eviction Schemes', 'Cache Invalidation & TTL', 'Cache Stampede & Penetration'],
    problems: []
  },
  {
    id: 'databases',
    title: 'Databases & Partitioning',
    subtitle: 'Relational vs NoSQL, Sharding, and Replication',
    difficulty: 'Medium',
    description: 'Master storage layers. Compare SQL transactions (ACID properties) with NoSQL document/key-value scales. Learn how databases replicate data to prevent data loss, and sharding to distribute storage across database servers.',
    subtopics: ['ACID vs BASE properties', 'Leader-Follower Replication', 'Horizontal Sharding & Keys', 'SQL Indexes & B-Trees'],
    problems: []
  },
  {
    id: 'hld-templates',
    title: 'High-Level Design (HLD)',
    subtitle: 'Designing real-world large-scale microservices',
    difficulty: 'Hard',
    description: 'Apply concepts to architect famous web products. Focus on defining requirements, drawing entity connections, estimating capacities, setting up APIs, databases, caches, and analyzing performance tradeoffs.',
    subtopics: ['Designing URL Shortener (TinyURL)', 'Designing WhatsApp/Messenger Chat', 'Designing Uber/Ride-Hailing Geospatial API'],
    problems: []
  }
];

export default function RoadmapsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dsa' | 'system-design'>('dsa');
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(false);

  // Fetch progress on load
  const fetchProgress = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/progress');
      if (res.ok) {
        const data = await res.json();
        setCompletedNodes(data.completedNodeIds || []);
        const solved = (data.solvedProblems || [])
          .filter((p: any) => p.status === 'solved')
          .map((p: any) => p.problemId);
        setSolvedProblemIds(solved);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [user]);

  // Set default selected node
  useEffect(() => {
    const nodes = activeTab === 'dsa' ? DSA_NODES : SYSTEM_DESIGN_NODES;
    setSelectedNode(nodes[0]);
  }, [activeTab]);

  const handleToggleNodeCompletion = async (nodeId: string) => {
    if (!user) {
      alert('Please log in or register to track your learning progress!');
      return;
    }
    setLoadingProgress(true);
    try {
      const res = await fetch('/api/progress/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCompletedNodes(data.completedNodeIds || []);
      }
    } catch (error) {
      console.error('Failed to toggle completion:', error);
    } finally {
      setLoadingProgress(false);
    }
  };

  const nodes = activeTab === 'dsa' ? DSA_NODES : SYSTEM_DESIGN_NODES;
  const totalNodes = nodes.length;
  const completedCount = nodes.filter((n) => completedNodes.includes(n.id)).length;
  const progressPercent = totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : 0;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main className="container" style={{ padding: '40px 24px', flex: 1 }}>
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '12px', color: 'var(--foreground)' }}>Learning Roadmaps</h1>
          <p style={{ color: 'var(--foreground-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Follow our structured patterns pathways to master core engineering interview requirements step-by-step.
          </p>
        </div>

        {/* Path Toggle and Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          alignItems: 'center',
          marginBottom: '50px',
          padding: '20px',
          background: 'var(--background-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          {/* Path Toggle Button */}
          <div style={{ display: 'flex', background: 'var(--background)', padding: '6px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', gap: '4px' }}>
            <button
              onClick={() => setActiveTab('dsa')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'dsa' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'dsa' ? 'white' : 'var(--foreground-secondary)',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'var(--font-title)',
                transition: 'all 0.2s'
              }}
            >
              DSA Patterns
            </button>
            <button
              onClick={() => setActiveTab('system-design')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'system-design' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'system-design' ? 'white' : 'var(--foreground-secondary)',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'var(--font-title)',
                transition: 'all 0.2s'
              }}
            >
              System Design
            </button>
          </div>

          {/* Progress Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
              {/* Simple Circular Progress Bar using Inline SVG */}
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border-color)" strokeWidth="6" />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="6"
                  strokeDasharray="213.6"
                  strokeDashoffset={213.6 - (213.6 * progressPercent) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                  style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--foreground)' }}>
                {progressPercent}%
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Path Progress</h3>
              <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.9rem' }}>
                {completedCount} of {totalNodes} topics completed {user ? '' : '(Login to track)'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Interface Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 450px) 1fr', gap: '40px', alignItems: 'start' }}>
          
          {/* Left Side: Roadmap Nodes Timeline */}
          <div style={{ position: 'relative', paddingLeft: '24px' }}>
            {/* Visual vertical path line */}
            <div style={{
              position: 'absolute',
              top: '20px',
              bottom: '20px',
              left: '8px',
              width: '2px',
              background: 'linear-gradient(to bottom, var(--primary), var(--secondary))',
              opacity: 0.3
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {nodes.map((node, index) => {
                const isCompleted = completedNodes.includes(node.id);
                const isSelected = selectedNode?.id === node.id;
                
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    {/* Node Dot Indicator */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleNodeCompletion(node.id);
                      }}
                      style={{
                        zIndex: 2,
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: isCompleted ? 'var(--success)' : 'var(--background-card)',
                        border: `2px solid ${isCompleted ? 'var(--success)' : isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '10px',
                        cursor: 'pointer',
                        marginTop: '12px',
                        boxShadow: isSelected ? '0 0 10px rgba(var(--primary-rgb), 0.5)' : 'none',
                        transition: 'all 0.2s'
                      }}
                    >
                      {isCompleted && '✓'}
                    </div>

                    {/* Node Card UI */}
                    <div style={{
                      flex: 1,
                      padding: '16px 20px',
                      background: isSelected ? 'var(--background-card-hover)' : 'var(--background-card)',
                      border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                      borderRadius: 'var(--radius-md)',
                      boxShadow: isSelected ? '0 4px 15px -5px var(--border-glow)' : 'none',
                      transition: 'all 0.2s'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'var(--background)', color: 'var(--foreground-secondary)', border: '1px solid var(--border-color)' }}>
                          Step {index + 1}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: node.difficulty === 'Easy' ? 'var(--success)' : node.difficulty === 'Medium' ? 'var(--warning)' : 'var(--danger)'
                        }}>
                          {node.difficulty}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '4px', color: 'var(--foreground)' }}>{node.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>{node.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side: Node Detailed Expanded Panel */}
          {selectedNode && (
            <div style={{
              background: 'var(--background-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '30px',
              position: 'sticky',
              top: '94px',
              boxShadow: 'var(--glass-shadow)',
              minHeight: '400px'
            }} className="animate-slide-up">
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '24px' }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      background: selectedNode.difficulty === 'Easy' ? 'var(--success-bg)' : selectedNode.difficulty === 'Medium' ? 'var(--warning-bg)' : 'var(--danger-bg)',
                      color: selectedNode.difficulty === 'Easy' ? 'var(--success)' : selectedNode.difficulty === 'Medium' ? 'var(--warning)' : 'var(--danger)'
                    }}>
                      {selectedNode.difficulty}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>
                      Topic Guide
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.6rem', color: 'var(--foreground)' }}>{selectedNode.title}</h2>
                </div>

                {/* Mark as Complete button */}
                <button
                  disabled={loadingProgress}
                  onClick={() => handleToggleNodeCompletion(selectedNode.id)}
                  className={`btn ${completedNodes.includes(selectedNode.id) ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                >
                  {completedNodes.includes(selectedNode.id) ? '✓ Completed' : 'Mark Complete'}
                </button>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', fontWeight: '600' }}>Overview</h3>
                <p style={{ lineHeight: '1.6', color: 'var(--foreground-secondary)' }}>{selectedNode.description}</p>
              </div>

              {/* Grid for checklist and problem banks */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', flexWrap: 'wrap' }}>
                {/* Sub-topics Checklist */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', fontWeight: '600' }}>Key Concepts</h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {selectedNode.subtopics.map((sub, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--foreground-secondary)' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>•</span>
                        {sub}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Curated Practice Problems */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', fontWeight: '600' }}>Curated Problems</h3>
                  {selectedNode.problems.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {selectedNode.problems.map((prob) => {
                        const isSolved = solvedProblemIds.includes(prob.id);
                        return (
                          <div
                            key={prob.id}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '10px 14px',
                              background: 'var(--background)',
                              border: '1px solid var(--border-color)',
                              borderRadius: '8px'
                            }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <Link
                                href={`/problems/${prob.id}`}
                                style={{
                                  fontSize: '0.9rem',
                                  fontWeight: '600',
                                  color: 'var(--foreground)',
                                  textDecoration: 'none',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                {prob.title}
                                {prob.premium && (
                                  <span style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: '4px', background: 'gold', color: 'black', fontWeight: 'bold' }}>
                                    PRO
                                  </span>
                                )}
                              </Link>
                              <span style={{
                                fontSize: '0.75rem',
                                color: prob.difficulty === 'Easy' ? 'var(--success)' : prob.difficulty === 'Medium' ? 'var(--warning)' : 'var(--danger)'
                              }}>
                                {prob.difficulty}
                              </span>
                            </div>

                            {/* Solved Status */}
                            <div style={{
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              color: isSolved ? 'var(--success)' : 'var(--foreground-muted)'
                            }}>
                              {isSolved ? '✓ Solved' : 'Unsolved'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.9rem', color: 'var(--foreground-muted)', fontStyle: 'italic' }}>
                      Concept guide only. No practice problems linked to this node.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
