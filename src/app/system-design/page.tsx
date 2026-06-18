'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SYSTEM_DESIGN_GUIDES, SystemDesignGuide } from '@/lib/catalog';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SystemDesignPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [selectedGuide, setSelectedGuide] = useState<SystemDesignGuide | null>(SYSTEM_DESIGN_GUIDES[0]);
  const [activeTab, setActiveTab] = useState<'requirements' | 'capacity' | 'api' | 'db' | 'hld' | 'tradeoffs'>('requirements');

  const handleGuideSelect = (guide: SystemDesignGuide) => {
    // Let's implement a paywall gate
    // E.g., if the user is free, they can read 'url-shortener' but other guides are premium
    const isPremiumGuide = guide.id !== 'url-shortener';
    if (isPremiumGuide && (!user || user.tier !== 'premium')) {
      alert('This is a Premium System Design Guide. Please subscribe to unlock complete architectures, high-level SVG diagrams, capacity estimations, and database patterns!');
      router.push('/pricing');
      return;
    }
    setSelectedGuide(guide);
    setActiveTab('requirements');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main className="container" style={{ padding: '40px 24px', flex: 1 }}>
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '12px', color: 'var(--foreground)' }}>System Design Case Studies</h1>
          <p style={{ color: 'var(--foreground-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Learn how to architect scalable, high-availability, low-latency distributed systems from scratch.
          </p>
        </div>

        {/* Workspace Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px', alignItems: 'start' }}>
          
          {/* Left Panel: Guide selector list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--foreground)', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
              Case Studies
            </h3>
            
            {SYSTEM_DESIGN_GUIDES.map((guide) => {
              const isSelected = selectedGuide?.id === guide.id;
              const isPremium = guide.id !== 'url-shortener';
              
              return (
                <div
                  key={guide.id}
                  onClick={() => handleGuideSelect(guide)}
                  style={{
                    padding: '16px 20px',
                    background: isSelected ? 'var(--background-card-hover)' : 'var(--background-card)',
                    border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      color: guide.difficulty === 'Medium' ? 'var(--success)' : 'var(--danger)'
                    }}>
                      {guide.difficulty}
                    </span>
                    {isPremium && (
                      <span style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: '4px', background: 'gold', color: 'black', fontWeight: 'bold' }}>
                        PRO
                      </span>
                    )}
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--foreground)', marginBottom: '4px' }}>{guide.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)', lineHeight: '1.4' }}>{guide.description.slice(0, 70)}...</p>
                </div>
              );
            })}

            {/* Premium Upsell Card */}
            {(!user || user.tier !== 'premium') && (
              <div style={{
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                color: 'white',
                textAlign: 'center',
                marginTop: '10px',
                boxShadow: '0 10px 20px rgba(var(--primary-rgb), 0.2)'
              }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>Unlock All Designs</h4>
                <p style={{ fontSize: '0.8rem', opacity: 0.9, lineHeight: '1.5', marginBottom: '16px' }}>
                  Get complete access to Messenger, Uber, YouTube, and Rate Limiter designs.
                </p>
                <Link href="/pricing" className="btn btn-primary" style={{ background: 'white', color: 'var(--primary)', border: 'none', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  Upgrade Now
                </Link>
              </div>
            )}
          </div>

          {/* Right Panel: Content tabs and template renderer */}
          {selectedGuide ? (
            <div style={{
              background: 'var(--background-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--glass-shadow)',
              overflow: 'hidden'
            }} className="animate-slide-up">
              
              {/* Tab options headers */}
              <div style={{
                display: 'flex',
                background: 'var(--background)',
                borderBottom: '1px solid var(--border-color)',
                overflowX: 'auto'
              }}>
                {[
                  { key: 'requirements', label: 'Requirements' },
                  { key: 'capacity', label: 'Capacity Math' },
                  { key: 'api', label: 'API Endpoints' },
                  { key: 'db', label: 'DB Schema' },
                  { key: 'hld', label: 'HLD Architecture' },
                  { key: 'tradeoffs', label: 'Trade-offs' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    style={{
                      padding: '16px 20px',
                      border: 'none',
                      background: 'transparent',
                      color: activeTab === tab.key ? 'var(--primary)' : 'var(--foreground-secondary)',
                      fontWeight: activeTab === tab.key ? '600' : '400',
                      borderBottom: activeTab === tab.key ? '2px solid var(--primary)' : 'none',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Display Area */}
              <div style={{ padding: '30px', minHeight: '380px' }}>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--foreground)', marginBottom: '16px' }}>
                  {selectedGuide.title}
                </h2>

                {/* Requirements Tab */}
                {activeTab === 'requirements' && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', fontWeight: '600', color: 'var(--foreground)' }}>1. Functional Requirements</h3>
                      <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--foreground-secondary)' }}>
                        {selectedGuide.requirements.functional.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', fontWeight: '600', color: 'var(--foreground)' }}>2. Non-Functional Requirements</h3>
                      <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--foreground-secondary)' }}>
                        {selectedGuide.requirements.nonFunctional.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Capacity Math Tab */}
                {activeTab === 'capacity' && (
                  <div className="animate-fade-in">
                    <p style={{ color: 'var(--foreground-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>
                      {selectedGuide.capacityEstimation}
                    </p>
                  </div>
                )}

                {/* API Design Tab */}
                {activeTab === 'api' && (
                  <div className="animate-fade-in">
                    <div style={{
                      background: 'var(--background)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '20px',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      color: 'var(--foreground)',
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.5'
                    }}>
                      {selectedGuide.apiDesign}
                    </div>
                  </div>
                )}

                {/* DB Schema Tab */}
                {activeTab === 'db' && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <p style={{ color: 'var(--foreground-secondary)', lineHeight: '1.6' }}>
                      Define tables, storage properties, index optimizations, and partitions:
                    </p>
                    <div style={{
                      background: 'var(--background)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '20px',
                      fontFamily: 'monospace',
                      fontSize: '0.85rem',
                      color: 'var(--foreground)',
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.5'
                    }}>
                      {selectedGuide.dbSchema}
                    </div>
                  </div>
                )}

                {/* HLD Diagram Tab */}
                {activeTab === 'hld' && (
                  <div className="animate-fade-in" style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--foreground-secondary)', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'left' }}>
                      Interactive High-Level Architecture outlining the flow of user queries from DNS down to core cache layers and database backends:
                    </p>
                    <div
                      style={{ maxWidth: '100%', overflowX: 'auto', borderRadius: '12px' }}
                      dangerouslySetInnerHTML={{ __html: selectedGuide.hldDiagram }}
                    />
                  </div>
                )}

                {/* Trade-offs Tab */}
                {activeTab === 'tradeoffs' && (
                  <div className="animate-fade-in">
                    <p style={{ color: 'var(--foreground-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>
                      {selectedGuide.tradeoffs}
                    </p>
                  </div>
                )}

              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--foreground-muted)' }}>
              <h2>Please select a case study on the left panel to begin.</h2>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
