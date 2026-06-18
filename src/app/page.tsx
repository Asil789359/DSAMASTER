'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  const stats = [
    { value: '600+', label: 'Practice Problems' },
    { value: '15+', label: 'Pattern Roadmaps' },
    { value: '25+', label: 'System Design Templates' },
    { value: '94.8%', label: 'Offer Success Rate' }
  ];

  const coreFeatures = [
    {
      emoji: '🗺️',
      title: 'Pattern-Based Learning',
      desc: 'Stop memorizing. Learn the 15 coding patterns (like Sliding Window, Two Pointers) that solve 90% of interview questions.'
    },
    {
      emoji: '💻',
      title: 'Integrated Code Sandbox',
      desc: 'Write and test solutions directly in the browser across multiple languages (Python, Java, C++, JavaScript) with instant compiler feedback.'
    },
    {
      emoji: '📈',
      title: 'Interactive Visualizers',
      desc: 'See algorithms run step-by-step. SVG-based graphical simulators animate pointer movements and recursion trees in real time.'
    },
    {
      emoji: '⚡',
      title: 'System Design Case Studies',
      desc: 'Scale from zero to millions of users. Master High-Level Design (HLD) and Low-Level Design (LLD) with capacities, DB schemas, and tradeoffs.'
    }
  ];

  const testimonials = [
    {
      name: 'Ananya Sharma',
      role: 'SDE-2 at Microsoft',
      text: 'The sliding window and DP guides on AlgoMaster were game changers. I understood the intuition rather than memorizing solutions.'
    },
    {
      name: 'Rahul Verma',
      role: 'Software Engineer at Google',
      text: 'Consistent hashing and load balancing explanations are by far the best I have seen. Visualizing the ring structure helped me nail the HLD round.'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '100px 24px 80px',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          {/* Tag */}
          <span className="pulse-target" style={{
            fontSize: '0.8rem',
            fontWeight: '700',
            padding: '6px 14px',
            borderRadius: '20px',
            background: 'var(--primary-bg)',
            color: 'var(--primary)',
            border: '1px solid var(--border-glow)',
            display: 'inline-block',
            marginBottom: '24px'
          }}>
            🎓 Master Technical Interviews Efficiently
          </span>

          {/* Heading */}
          <h1 style={{
            fontSize: '3.6rem',
            lineHeight: '1.15',
            fontWeight: '800',
            maxWidth: '900px',
            margin: '0 auto 20px',
            letterSpacing: '-0.03em',
            color: 'var(--foreground)'
          }}>
            Don't Memorize Solutions. <br />
            <span style={{ background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Master the Patterns.
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--foreground-secondary)',
            maxWidth: '650px',
            margin: '0 auto 40px',
            lineHeight: '1.6'
          }}>
            A structured, visual platform to master Data Structures, Algorithms, and System Design patterns. Get interview-ready without the grind.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/roadmaps" className="btn btn-primary btn-glow" style={{ padding: '14px 28px', fontSize: '1.05rem', fontWeight: 'bold' }}>
              Explore Roadmaps
            </Link>
            <Link href="/problems" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1.05rem', fontWeight: 'bold' }}>
              Practice Problems
            </Link>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section style={{
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--background-card)',
        padding: '40px 24px'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px',
          textAlign: 'center'
        }}>
          {stats.map((stat, idx) => (
            <div key={idx}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--foreground)', fontFamily: 'var(--font-title)', marginBottom: '4px' }}>
                {stat.value}
              </h2>
              <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CORE FEATURES SECTION */}
      <section style={{ padding: '100px 24px' }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '16px', color: 'var(--foreground)' }}>Why Engineers Choose AlgoMaster</h2>
            <p style={{ color: 'var(--foreground-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              We build visual, pattern-oriented concepts that bridge the gap between theoretical basics and real-world system deployments.
            </p>
          </div>

          {/* Features Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px' }}>
            {coreFeatures.map((feat, idx) => (
              <div key={idx} className="interactive-card">
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'var(--background)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  marginBottom: '20px'
                }}>
                  {feat.emoji}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px', color: 'var(--foreground)' }}>{feat.title}</h3>
                <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PREMIUM CTA BANNER */}
      <section style={{ padding: '0 24px 100px' }}>
        <div className="container" style={{
          background: 'linear-gradient(135deg, var(--background-card) 0%, rgba(99, 102, 241, 0.05) 100%)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '60px 40px',
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          alignItems: 'center',
          gap: '40px',
          flexWrap: 'wrap'
        }}>
          <div>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '16px', color: 'var(--foreground)' }}>Ready to nail your dream SDE role?</h2>
            <p style={{ color: 'var(--foreground-secondary)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '24px', maxWidth: '600px' }}>
              Unlock full solutions to hard questions, comprehensive system design templates, consistent hashing rings, and CAP theorem trade-offs today.
            </p>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="/pricing" className="btn btn-primary btn-glow" style={{ padding: '12px 24px', fontWeight: 'bold' }}>
                View Pricing Plans
              </Link>
              <span style={{ fontSize: '0.9rem', color: 'var(--foreground-muted)' }}>
                ✓ 7-day refund policy • Secure Razorpay checkout
              </span>
            </div>
          </div>
          
          {/* Testimonial Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {testimonials.map((t, idx) => (
              <div key={idx} style={{
                background: 'var(--background-card)',
                border: '1px solid var(--border-color)',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--glass-shadow)'
              }}>
                <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--foreground-secondary)', lineHeight: '1.5', marginBottom: '12px' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--foreground)' }}>{t.name}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)' }}>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
