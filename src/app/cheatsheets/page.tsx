'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CHEATSHEETS, CheatSheet } from '@/lib/catalog';

export default function CheatsheetsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'DSA' | 'System Design'>('all');
  const [selectedSheet, setSelectedSheet] = useState<CheatSheet | null>(null);

  const filteredSheets = CHEATSHEETS.filter((sheet) => {
    const matchesSearch = sheet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sheet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sheet.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || sheet.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main className="container" style={{ padding: '40px 24px', flex: 1 }}>
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '12px', color: 'var(--foreground)' }}>Quick Cheat Sheets</h1>
          <p style={{ color: 'var(--foreground-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Consolidated notes, skeletons, and architectures to revise core engineering principles in minutes.
          </p>
        </div>

        {/* Toolbar filter */}
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          background: 'var(--background-card)',
          border: '1px solid var(--border-color)',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search cheat sheets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ flex: 2, minWidth: '250px' }}
          />

          {/* Category Tabs */}
          <div style={{ display: 'flex', background: 'var(--background)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', gap: '4px', flex: 1 }}>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                background: selectedCategory === 'all' ? 'var(--primary)' : 'transparent',
                color: selectedCategory === 'all' ? 'white' : 'var(--foreground-secondary)',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              All
            </button>
            <button
              onClick={() => setSelectedCategory('DSA')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                background: selectedCategory === 'DSA' ? 'var(--primary)' : 'transparent',
                color: selectedCategory === 'DSA' ? 'white' : 'var(--foreground-secondary)',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              DSA
            </button>
            <button
              onClick={() => setSelectedCategory('System Design')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                background: selectedCategory === 'System Design' ? 'var(--primary)' : 'transparent',
                color: selectedCategory === 'System Design' ? 'white' : 'var(--foreground-secondary)',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              System Design
            </button>
          </div>
        </div>

        {/* Cheat Sheets Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredSheets.map((sheet) => (
            <div
              key={sheet.id}
              onClick={() => setSelectedSheet(sheet)}
              className="interactive-card"
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: sheet.category === 'DSA' ? 'var(--primary-bg)' : 'rgba(14, 165, 233, 0.1)',
                  color: sheet.category === 'DSA' ? 'var(--primary)' : 'var(--secondary)',
                  border: `1px solid ${sheet.category === 'DSA' ? 'var(--primary)' : 'var(--secondary)'}`
                }}>
                  {sheet.category}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>Quick Read</span>
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--foreground)' }}>{sheet.title}</h3>
              <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.9rem', lineHeight: '1.5', flex: 1 }}>
                {sheet.description}
              </p>
              
              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                Revise Details ➜
              </div>
            </div>
          ))}
        </div>

        {/* ----------------- SHEET DETAILS MODAL OVERLAY ----------------- */}
        {selectedSheet && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }} onClick={() => setSelectedSheet(null)}>
            
            <div style={{
              background: 'var(--background-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              width: '100%',
              maxWidth: '720px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '30px',
              position: 'relative',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }} onClick={(e) => e.stopPropagation()} className="animate-slide-up">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedSheet(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--foreground-muted)',
                  fontSize: '1.3rem',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>

              {/* Header */}
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {selectedSheet.category} Revision Sheet
                </span>
                <h2 style={{ fontSize: '1.8rem', marginTop: '6px', color: 'var(--foreground)' }}>{selectedSheet.title}</h2>
              </div>

              {/* Summary */}
              <div style={{ marginBottom: '24px' }}>
                <p style={{ color: 'var(--foreground-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>{selectedSheet.summary}</p>
              </div>

              {/* Key Concepts List */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', fontWeight: '600' }}>Core Terminology</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedSheet.keyConcepts.map((concept, idx) => (
                    <div key={idx} style={{
                      padding: '12px 16px',
                      background: 'var(--background)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px'
                    }}>
                      <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--foreground)', marginBottom: '4px' }}>{concept.term}</strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--foreground-secondary)', lineHeight: '1.4' }}>{concept.definition}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Snippet (if available) */}
              {selectedSheet.cheatCode && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', fontWeight: '600' }}>Pattern Blueprint / Code Skeleton</h3>
                  <div style={{
                    background: '#0f172a',
                    color: '#e2e8f0',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    padding: '16px',
                    borderRadius: '8px',
                    overflowX: 'auto',
                    border: '1px solid var(--border-color)'
                  }}>
                    <pre>{selectedSheet.cheatCode}</pre>
                  </div>
                </div>
              )}

              {/* Tradeoffs (if available) */}
              {selectedSheet.tradeoffs && (
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', fontWeight: '600' }}>System Design Comparisons</h3>
                  {selectedSheet.tradeoffs.map((item, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                      <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.05)', borderRight: '1px solid var(--border-color)' }}>
                        <strong style={{ color: 'var(--success)', fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Option A Pros / Cons</strong>
                        <ul style={{ paddingLeft: '16px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {item.pros.map((p, k) => <li key={k}>{p}</li>)}
                        </ul>
                      </div>
                      <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.05)' }}>
                        <strong style={{ color: 'var(--danger)', fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Option B Pros / Cons</strong>
                        <ul style={{ paddingLeft: '16px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {item.cons.map((c, k) => <li key={k}>{c}</li>)}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
