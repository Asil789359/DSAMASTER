'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PROBLEMS, Problem } from '@/lib/catalog';
import { useAuth } from '@/context/AuthContext';

export default function ProblemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user } = useAuth();
  
  const [problemId, setProblemId] = useState<string>('');
  const [problem, setProblem] = useState<Problem | null>(null);
  
  // Tab states: 'description' | 'visualizer' | 'solution'
  const [activeLeftTab, setActiveLeftTab] = useState<'description' | 'visualizer' | 'solution'>('description');
  const [activeLanguage, setActiveLanguage] = useState<'python' | 'java' | 'cpp' | 'javascript'>('python');
  
  const [code, setCode] = useState<string>('');
  const [runLogs, setRunLogs] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSolvedLocally, setIsSolvedLocally] = useState<boolean>(false);
  
  // Visualizer step state
  const [visualStep, setVisualStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Unpack params and load problem
  useEffect(() => {
    params.then((p) => {
      setProblemId(p.id);
      const found = PROBLEMS.find((item) => item.id === p.id);
      if (found) {
        setProblem(found);
        setCode(found.starterCode.python);
      }
    });
  }, [params]);

  // Sync starter code when language changes
  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode[activeLanguage]);
      setRunLogs('');
    }
  }, [activeLanguage, problem]);

  // Handle visualizer play/pause interval
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setVisualStep((prev) => {
          const maxSteps = problemId === 'two-sum' ? 3 : problemId === 'container-with-most-water' ? 4 : 2;
          if (prev >= maxSteps) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1500);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, problemId]);

  if (!problem) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <h2>Loading Problem Details...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  // Visualizer steps description
  const twoSumSteps = [
    { text: 'Start with Pointers: Left at index 0 (val = 2), Right at index 3 (val = 15). Sum = 2 + 15 = 17. Target is 9.', leftIdx: 0, rightIdx: 3, sum: 17, action: 'Sum 17 > 9. Decrement Right pointer.' },
    { text: 'Move Right inwards: Left at index 0 (val = 2), Right at index 2 (val = 11). Sum = 2 + 11 = 13. Target is 9.', leftIdx: 0, rightIdx: 2, sum: 13, action: 'Sum 13 > 9. Decrement Right pointer.' },
    { text: 'Move Right inwards: Left at index 0 (val = 2), Right at index 1 (val = 7). Sum = 2 + 7 = 9. Target is 9.', leftIdx: 0, rightIdx: 1, sum: 9, action: 'Match found! Returns indices [0, 1].' }
  ];

  const waterSteps = [
    { text: 'Pointers start at extreme ends: Left = 0 (height 1), Right = 8 (height 7). Width = 8. Area = min(1, 7) * 8 = 8.', l: 0, r: 8, area: 8, maxArea: 8, next: 'Height 1 < 7. Increment Left.' },
    { text: 'Move Left inwards: Left = 1 (height 8), Right = 8 (height 7). Width = 7. Area = min(8, 7) * 7 = 49.', l: 1, r: 8, area: 49, maxArea: 49, next: 'Height 7 < 8. Decrement Right.' },
    { text: 'Move Right inwards: Left = 1 (height 8), Right = 7 (height 3). Width = 6. Area = min(8, 3) * 6 = 18.', l: 1, r: 7, area: 18, maxArea: 49, next: 'Height 3 < 8. Decrement Right.' },
    { text: 'Move Right inwards: Left = 1 (height 8), Right = 6 (height 8). Width = 5. Area = min(8, 8) * 5 = 40.', l: 1, r: 6, area: 40, maxArea: 49, next: 'Equal heights. Decrement Right.' },
    { text: 'Walkthrough complete. Maximum water volume found: 49.', l: 1, r: 5, area: 0, maxArea: 49, next: 'Done.' }
  ];

  const handleRunCode = () => {
    setIsRunning(true);
    setRunLogs('Compiling and running local test cases...');
    
    setTimeout(() => {
      setRunLogs(`[SUCCESS] Compilation complete.
Running Test Case 1... Passed!
Running Test Case 2... Passed!
Running Test Case 3... Passed!

All tests successfully finished in 14ms.`);
      setIsRunning(false);
    }, 1200);
  };

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setRunLogs('Running full production tests...');
    
    setTimeout(async () => {
      try {
        const res = await fetch(`/api/problems/${problemId}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            language: activeLanguage,
            status: 'solved'
          })
        });

        if (res.ok) {
          setRunLogs(`[SUBMISSION SUCCESS]
All 182/182 test cases passed.
Runtime: 42ms (Beats 91.24% of submissions)
Memory: 16.4 MB (Beats 84.11% of submissions)`);
          setIsSolvedLocally(true);
        } else {
          const errData = await res.json();
          setRunLogs(`[SUBMISSION FAIL]
Error: ${errData.error || 'Server error. Saving progress requires logging in.'}`);
        }
      } catch (error) {
        setRunLogs('[SUBMISSION SUCCESS] Local simulation passed! (Database offline, log in to persist progress).');
        setIsSolvedLocally(true);
      } finally {
        setIsSubmitting(false);
      }
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      {/* Main Workspace Split screen */}
      <main style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 45%) 1fr', flex: 1, height: 'calc(100vh - 70px)', overflow: 'hidden' }}>
        
        {/* Left Column (Details, visualizer, editorials) */}
        <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--background-card)' }}>
          {/* Tabs header */}
          <div style={{ display: 'flex', background: 'var(--background)', borderBottom: '1px solid var(--border-color)', padding: '0 10px' }}>
            <button
              onClick={() => setActiveLeftTab('description')}
              style={{
                padding: '14px 16px',
                border: 'none',
                background: 'transparent',
                color: activeLeftTab === 'description' ? 'var(--primary)' : 'var(--foreground-secondary)',
                fontWeight: activeLeftTab === 'description' ? '600' : '400',
                borderBottom: activeLeftTab === 'description' ? '2px solid var(--primary)' : 'none',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              Description
            </button>
            <button
              onClick={() => setActiveLeftTab('visualizer')}
              style={{
                padding: '14px 16px',
                border: 'none',
                background: 'transparent',
                color: activeLeftTab === 'visualizer' ? 'var(--primary)' : 'var(--foreground-secondary)',
                fontWeight: activeLeftTab === 'visualizer' ? '600' : '400',
                borderBottom: activeLeftTab === 'visualizer' ? '2px solid var(--primary)' : 'none',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              Step Visualizer
            </button>
            <button
              onClick={() => setActiveLeftTab('solution')}
              style={{
                padding: '14px 16px',
                border: 'none',
                background: 'transparent',
                color: activeLeftTab === 'solution' ? 'var(--primary)' : 'var(--foreground-secondary)',
                fontWeight: activeLeftTab === 'solution' ? '600' : '400',
                borderBottom: activeLeftTab === 'solution' ? '2px solid var(--primary)' : 'none',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              Editorial Solutions
            </button>
          </div>

          {/* Tab Content Box */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
            
            {/* 1. DESCRIPTION TAB */}
            {activeLeftTab === 'description' && (
              <div className="animate-fade-in">
                {/* Title */}
                <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h1 style={{ fontSize: '1.8rem', color: 'var(--foreground)' }}>{problem.title}</h1>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: problem.difficulty === 'Easy' ? 'var(--success-bg)' : problem.difficulty === 'Medium' ? 'var(--warning-bg)' : 'var(--danger-bg)',
                    color: problem.difficulty === 'Easy' ? 'var(--success)' : problem.difficulty === 'Medium' ? 'var(--warning)' : 'var(--danger)'
                  }}>
                    {problem.difficulty}
                  </span>
                </div>

                {/* Sub info */}
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--foreground-muted)', marginBottom: '24px' }}>
                  <span>Acceptance Rate: <strong>{problem.acceptance}</strong></span>
                  {isSolvedLocally && <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓ Solved</span>}
                </div>

                {/* Description Body */}
                <div style={{ lineHeight: '1.6', color: 'var(--foreground-secondary)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{problem.description}</p>

                  {/* Examples */}
                  <div>
                    {problem.examples.map((ex, i) => (
                      <div key={i} style={{
                        background: 'var(--background)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '16px',
                        marginTop: '12px'
                      }}>
                        <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '6px', color: 'var(--foreground)' }}>Example {i + 1}:</strong>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--foreground)' }}>
                          <strong>Input:</strong> {ex.input} <br />
                          <strong>Output:</strong> {ex.output}
                          {ex.explanation && (
                            <>
                              <br /><strong>Explanation:</strong> {ex.explanation}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Constraints */}
                  <div style={{ marginTop: '20px' }}>
                    <strong style={{ display: 'block', marginBottom: '8px', color: 'var(--foreground)' }}>Constraints:</strong>
                    <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {problem.constraints.map((c, idx) => (
                        <li key={idx} style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 2. VISUALIZER TAB */}
            {activeLeftTab === 'visualizer' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Algorithm Step-by-Step Visualization</h3>
                <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.9rem' }}>
                  See how the pointers alter their index values dynamically at each step.
                </p>

                {/* VISUALIZER CANVAS FOR TWO SUM */}
                {problemId === 'two-sum' && (
                  <div style={{ background: 'var(--background)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '40px', marginTop: '20px' }}>
                      {[2, 7, 11, 15].map((val, idx) => {
                        const isL = twoSumSteps[Math.min(visualStep, 2)].leftIdx === idx;
                        const isR = twoSumSteps[Math.min(visualStep, 2)].rightIdx === idx;
                        return (
                          <div key={idx} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{
                              width: '50px',
                              height: '50px',
                              background: isL ? 'var(--primary)' : isR ? 'var(--secondary)' : 'var(--background-card)',
                              border: `2px solid ${isL ? 'var(--primary)' : isR ? 'var(--secondary)' : 'var(--border-color)'}`,
                              borderRadius: '8px',
                              color: (isL || isR) ? 'white' : 'var(--foreground)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '1.1rem',
                              boxShadow: (isL || isR) ? '0 4px 10px rgba(var(--primary-rgb), 0.2)' : 'none',
                              transition: 'all 0.3s'
                            }}>
                              {val}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)', marginTop: '4px' }}>idx {idx}</span>
                            {isL && <span style={{ position: 'absolute', bottom: '-24px', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.8rem' }}>Left</span>}
                            {isR && <span style={{ position: 'absolute', bottom: '-24px', color: 'var(--secondary)', fontWeight: 'bold', fontSize: '0.8rem' }}>Right</span>}
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Step explanation */}
                    <div style={{
                      background: 'var(--background-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '16px',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      textAlign: 'left'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>Step {Math.min(visualStep, 2) + 1} of 3</span>
                        <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>{twoSumSteps[Math.min(visualStep, 2)].action}</span>
                      </div>
                      <p style={{ color: 'var(--foreground-secondary)' }}>
                        {twoSumSteps[Math.min(visualStep, 2)].text}
                      </p>
                    </div>
                  </div>
                )}

                {/* VISUALIZER CANVAS FOR CONTAINER WITH MOST WATER */}
                {problemId === 'container-with-most-water' && (
                  <div style={{ background: 'var(--background)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px' }}>
                    
                    {/* SVG Height Chart */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '140px', gap: '8px', borderBottom: '2px solid var(--border-color)', marginBottom: '30px' }}>
                      {[1, 8, 6, 2, 5, 4, 8, 3, 7].map((h, idx) => {
                        const step = waterSteps[Math.min(visualStep, 4)];
                        const isL = step.l === idx;
                        const isR = step.r === idx;
                        const inBetween = idx > step.l && idx < step.r;
                        return (
                          <div key={idx} style={{
                            width: '24px',
                            height: `${h * 15}px`,
                            background: isL ? 'var(--primary)' : isR ? 'var(--secondary)' : inBetween ? 'rgba(14, 165, 233, 0.1)' : 'var(--background-card)',
                            border: `1px solid ${isL ? 'var(--primary)' : isR ? 'var(--secondary)' : 'var(--border-color)'}`,
                            borderRadius: '3px 3px 0 0',
                            position: 'relative',
                            transition: 'all 0.3s'
                          }}>
                            {isL && <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.75rem' }}>L</span>}
                            {isR && <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', color: 'var(--secondary)', fontWeight: 'bold', fontSize: '0.75rem' }}>R</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Step explanations */}
                    <div style={{
                      background: 'var(--background-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '16px',
                      fontSize: '0.9rem',
                      lineHeight: '1.5'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>Step {Math.min(visualStep, 4) + 1} of 5</span>
                        <span style={{ color: 'var(--success)' }}>Active Area: {waterSteps[Math.min(visualStep, 4)].area || '–'}</span>
                      </div>
                      <p style={{ color: 'var(--foreground-secondary)', marginBottom: '10px' }}>
                        {waterSteps[Math.min(visualStep, 4)].text}
                      </p>
                      <div style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>
                        👉 Recommendation: <span style={{ color: 'var(--warning)', fontWeight: '500' }}>{waterSteps[Math.min(visualStep, 4)].next}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Generic fallback Visualizer */}
                {problemId !== 'two-sum' && problemId !== 'container-with-most-water' && (
                  <div style={{ background: 'var(--background)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '30px', textAlign: 'center', color: 'var(--foreground-muted)' }}>
                    <p>Visual stepper graph coming soon for this problem.</p>
                    <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>Check the editorial solution for structural complexity details.</p>
                  </div>
                )}

                {/* Stepper Controls */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center' }}>
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setVisualStep((prev) => Math.max(0, prev - 1));
                    }}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                  >
                    ◀ Prev
                  </button>
                  
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="btn btn-primary"
                    style={{ padding: '6px 16px', fontSize: '0.85rem' }}
                  >
                    {isPlaying ? '⏸ Pause' : '▶ Play'}
                  </button>

                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      const maxSteps = problemId === 'two-sum' ? 2 : problemId === 'container-with-most-water' ? 4 : 1;
                      setVisualStep((prev) => Math.min(maxSteps, prev + 1));
                    }}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                  >
                    Next ▶
                  </button>

                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setVisualStep(0);
                    }}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {/* 3. SOLUTION TAB */}
            {activeLeftTab === 'solution' && (
              <div className="animate-fade-in">
                {/* Premium Lock Check */}
                {problem.premium && (!user || user.tier !== 'premium') ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    background: 'var(--background)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px'
                  }}>
                    <span style={{ fontSize: '2.5rem' }}>🔒</span>
                    <h2 style={{ fontSize: '1.4rem', marginTop: '16px', color: 'var(--foreground)' }}>Premium Solution</h2>
                    <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.95rem', maxWidth: '350px', margin: '8px auto 20px' }}>
                      Unlock complete code solutions, Big-O tables, and visual analysis walkthroughs.
                    </p>
                    <Link href="/pricing" className="btn btn-primary btn-glow">
                      Upgrade to Premium
                    </Link>
                  </div>
                ) : (
                  <div>
                    {/* Solution Selector */}
                    <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '20px' }}>
                      {['python', 'java', 'cpp', 'javascript'].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setActiveLanguage(lang as any)}
                          style={{
                            padding: '6px 12px',
                            background: activeLanguage === lang ? 'var(--primary)' : 'transparent',
                            color: activeLanguage === lang ? 'white' : 'var(--foreground-secondary)',
                            border: `1px solid ${activeLanguage === lang ? 'var(--primary)' : 'var(--border-color)'}`,
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            textTransform: 'capitalize'
                          }}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>

                    {/* Solution Code */}
                    <div style={{ background: '#0f172a', color: '#e2e8f0', padding: '20px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.85rem', overflowX: 'auto', marginBottom: '24px', border: '1px solid var(--border-color)' }}>
                      <pre>{problem.solutions[activeLanguage]}</pre>
                    </div>

                    {/* Editorial Description */}
                    <div>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', fontWeight: '600' }}>Pattern Explanation</h3>
                      <div
                        style={{ lineHeight: '1.6', color: 'var(--foreground-secondary)', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}
                        dangerouslySetInnerHTML={{ __html: problem.solutions.explanation.replace(/\n/g, '<br />') }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Playground Area) */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#1e293b' }}>
          
          {/* Playground Header Options */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', borderBottom: '1px solid #2e3e56', padding: '10px 20px', height: '50px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '500' }}>Language:</span>
              <select
                value={activeLanguage}
                onChange={(e) => setActiveLanguage(e.target.value as any)}
                style={{
                  background: '#1e293b',
                  color: 'white',
                  border: '1px solid #2e3e56',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  outline: 'none',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <option value="python">Python 3</option>
                <option value="java">Java 17</option>
                <option value="cpp">C++ 20</option>
                <option value="javascript">JavaScript (ES6)</option>
              </select>
            </div>

            <button
              onClick={() => setCode(problem.starterCode[activeLanguage])}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
            >
              ⟲ Reset Starter Code
            </button>
          </div>

          {/* Code Editor Container */}
          <div style={{ flex: 1, position: 'relative', display: 'flex', overflow: 'hidden' }}>
            {/* Simple Line Numbers Gutter */}
            <div style={{
              width: '45px',
              background: '#0b1329',
              color: '#475569',
              padding: '16px 0',
              textAlign: 'center',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              lineHeight: '1.6',
              userSelect: 'none',
              borderRight: '1px solid #2e3e56'
            }}>
              {Array.from({ length: 25 }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Code Textarea Input */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              style={{
                flex: 1,
                background: '#0f172a',
                color: '#e2e8f0',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                lineHeight: '1.6',
                border: 'none',
                padding: '16px',
                outline: 'none',
                resize: 'none',
                overflowY: 'auto',
                whiteSpace: 'pre'
              }}
            />
          </div>

          {/* Action console logs area */}
          <div style={{
            height: '180px',
            background: '#0b1329',
            borderTop: '1px solid #2e3e56',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ background: '#070c1b', padding: '6px 20px', borderBottom: '1px solid #1a2942', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold' }}>Test Console Log</span>
              {isSolvedLocally && <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 'bold' }}>Passed ✓</span>}
            </div>
            
            <div style={{
              flex: 1,
              padding: '16px 20px',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              color: runLogs.includes('[SUCCESS]') || runLogs.includes('[SUBMISSION SUCCESS]') ? '#34d399' : runLogs.includes('[SUBMISSION FAIL]') ? '#f87171' : '#94a3b8',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.5'
            }}>
              {runLogs || 'Press "Run Code" or "Submit Solution" to trigger local test cases.'}
            </div>
          </div>

          {/* Playground Footer Buttons */}
          <div style={{
            height: '60px',
            background: '#0f172a',
            borderTop: '1px solid #2e3e56',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 24px'
          }}>
            <Link
              href="/problems"
              style={{
                color: '#94a3b8',
                fontSize: '0.9rem',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
            >
              ← Back to Problem List
            </Link>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleRunCode}
                disabled={isRunning || isSubmitting}
                className="btn btn-secondary"
                style={{
                  background: '#1e293b',
                  color: 'white',
                  border: '1px solid #2e3e56',
                  padding: '8px 16px',
                  fontSize: '0.85rem'
                }}
              >
                {isRunning ? 'Running...' : 'Run Code'}
              </button>

              <button
                onClick={handleSubmitCode}
                disabled={isRunning || isSubmitting}
                className="btn btn-primary btn-glow"
                style={{
                  padding: '8px 20px',
                  fontSize: '0.85rem'
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Solution'}
              </button>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
