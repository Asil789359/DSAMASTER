'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PROBLEMS, DSA_PATTERNS } from '@/lib/catalog';

export default function ProblemsPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPattern, setSelectedPattern] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // User progress states
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>([]);
  const [attemptedProblemIds, setAttemptedProblemIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const res = await fetch('/api/progress');
        if (res.ok) {
          const data = await res.json();
          const solved = (data.solvedProblems || [])
            .filter((p: any) => p.status === 'solved')
            .map((p: any) => p.problemId);
          const attempted = (data.solvedProblems || [])
            .filter((p: any) => p.status === 'attempted')
            .map((p: any) => p.problemId);
          
          setSolvedProblemIds(solved);
          setAttemptedProblemIds(attempted);
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };
    fetchProgress();
  }, [user]);

  // Filter Logic
  const filteredProblems = PROBLEMS.filter((problem) => {
    // Search filter
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          problem.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Pattern filter
    const matchesPattern = selectedPattern === 'all' || problem.patternId === selectedPattern;
    
    // Difficulty filter
    const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
    
    // Status filter (only works if user logged in)
    let matchesStatus = true;
    if (user && selectedStatus !== 'all') {
      const isSolved = solvedProblemIds.includes(problem.id);
      const isAttempted = attemptedProblemIds.includes(problem.id);
      
      if (selectedStatus === 'solved') matchesStatus = isSolved;
      if (selectedStatus === 'unsolved') matchesStatus = !isSolved;
      if (selectedStatus === 'attempted') matchesStatus = isAttempted && !isSolved;
    }

    return matchesSearch && matchesPattern && matchesDifficulty && matchesStatus;
  });

  const handleProblemClick = (problemId: string, isPremium: boolean) => {
    if (isPremium && (!user || user.tier !== 'premium')) {
      alert('This is a Premium Problem. Please subscribe to unlock complete solutions, playgrounds, and visualizers!');
      router.push('/pricing');
      return;
    }
    router.push(`/problems/${problemId}`);
  };

  // Stats calculation
  const totalCount = PROBLEMS.length;
  const solvedCount = PROBLEMS.filter((p) => solvedProblemIds.includes(p.id)).length;
  const solvedPercent = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main className="container" style={{ padding: '40px 24px', flex: 1 }}>
        
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', color: 'var(--foreground)' }}>Practice Problems</h1>
            <p style={{ color: 'var(--foreground-secondary)', fontSize: '1.1rem' }}>
              Level up your problem solving with curated LeetCode-style questions.
            </p>
          </div>
          
          {/* Progress Card */}
          {user && (
            <div style={{
              background: 'var(--background-card)',
              border: '1px solid var(--border-color)',
              padding: '16px 24px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--foreground-secondary)', fontWeight: '500' }}>Your Progress</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--foreground)' }}>
                  {solvedCount} <span style={{ color: 'var(--foreground-muted)', fontWeight: '400', fontSize: '1rem' }}>/ {totalCount} Solved</span>
                </h3>
              </div>
              <div style={{ width: '120px', background: 'var(--border-color)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${solvedPercent}%`, background: 'var(--primary)', height: '100%', borderRadius: '4px', transition: 'width 0.4s' }} />
              </div>
            </div>
          )}
        </div>

        {/* Filter Toolbar */}
        <div style={{
          background: 'var(--background-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          marginBottom: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Search and dropdown selectors */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px', flexWrap: 'wrap' }}>
            {/* Search */}
            <input
              type="text"
              placeholder="Search problems by name or pattern..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ width: '100%' }}
            />

            {/* Pattern Select */}
            <select
              value={selectedPattern}
              onChange={(e) => setSelectedPattern(e.target.value)}
              className="form-input"
            >
              <option value="all">All Patterns</option>
              {DSA_PATTERNS.map((pat) => (
                <option key={pat.id} value={pat.id}>
                  {pat.title}
                </option>
              ))}
            </select>

            {/* Difficulty Select */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="form-input"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            {/* Status Select (Auth protected) */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="form-input"
              disabled={!user}
              title={user ? 'Filter by status' : 'Login to filter by progress status'}
            >
              <option value="all">All Statuses</option>
              <option value="solved">Solved</option>
              <option value="attempted">Attempted</option>
              <option value="unsolved">Unsolved</option>
            </select>
          </div>

          {/* Quick Pattern Tabs */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedPattern('all')}
              className={`btn ${selectedPattern === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            >
              All Topics
            </button>
            {DSA_PATTERNS.map((pat) => (
              <button
                key={pat.id}
                onClick={() => setSelectedPattern(pat.id)}
                className={`btn ${selectedPattern === pat.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              >
                {pat.title}
              </button>
            ))}
          </div>
        </div>

        {/* Problems List Table */}
        <div style={{
          background: 'var(--background-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          boxShadow: 'var(--glass-shadow)'
        }}>
          {filteredProblems.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--background)', color: 'var(--foreground-secondary)' }}>
                  <th style={{ padding: '16px 20px', width: '80px' }}>Status</th>
                  <th style={{ padding: '16px 20px' }}>Title</th>
                  <th style={{ padding: '16px 20px' }}>Pattern</th>
                  <th style={{ padding: '16px 20px', width: '120px' }}>Difficulty</th>
                  <th style={{ padding: '16px 20px', width: '140px' }}>Acceptance</th>
                  <th style={{ padding: '16px 20px', width: '100px' }}>Access</th>
                </tr>
              </thead>
              <tbody>
                {filteredProblems.map((problem) => {
                  const isSolved = solvedProblemIds.includes(problem.id);
                  const isAttempted = attemptedProblemIds.includes(problem.id);
                  const pattern = DSA_PATTERNS.find((d) => d.id === problem.patternId);

                  return (
                    <tr
                      key={problem.id}
                      onClick={() => handleProblemClick(problem.id, problem.premium)}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        transition: 'background var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--background-card-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {/* Solved Status Indicator */}
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        {isSolved ? (
                          <span style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                        ) : isAttempted ? (
                          <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>○</span>
                        ) : (
                          <span style={{ color: 'var(--border-color)', fontSize: '1.2rem' }}>–</span>
                        )}
                      </td>

                      {/* Title */}
                      <td style={{ padding: '16px 20px', fontWeight: '600', color: 'var(--foreground)' }}>
                        <span style={{ textDecoration: 'none', color: 'inherit' }}>
                          {problem.title}
                        </span>
                      </td>

                      {/* Pattern Tag */}
                      <td style={{ padding: '16px 20px', color: 'var(--foreground-secondary)' }}>
                        {pattern ? pattern.title : problem.patternId}
                      </td>

                      {/* Difficulty Tag */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          fontWeight: '600',
                          fontSize: '0.8rem',
                          color: problem.difficulty === 'Easy' ? 'var(--success)' : problem.difficulty === 'Medium' ? 'var(--warning)' : 'var(--danger)'
                        }}>
                          {problem.difficulty}
                        </span>
                      </td>

                      {/* Acceptance */}
                      <td style={{ padding: '16px 20px', color: 'var(--foreground-muted)' }}>
                        {problem.acceptance}
                      </td>

                      {/* Premium Check */}
                      <td style={{ padding: '16px 20px' }}>
                        {problem.premium ? (
                          <span style={{
                            fontSize: '0.7rem',
                            padding: '3px 8px',
                            background: 'rgba(245, 158, 11, 0.15)',
                            color: 'var(--accent)',
                            borderRadius: '4px',
                            fontWeight: '700',
                            border: '1px solid var(--accent)'
                          }}>
                            PRO
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>
                            FREE
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--foreground-muted)' }}>
              <h3>No problems found matching your active filters.</h3>
              <p style={{ marginTop: '8px' }}>Try resetting search filters or checking different topics.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
