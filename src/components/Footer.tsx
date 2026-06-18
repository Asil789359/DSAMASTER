'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer
      style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-color)',
        background: 'var(--background-card)',
        padding: '60px 24px 30px',
        color: 'var(--foreground-secondary)',
        fontSize: '0.9rem',
      }}
    >
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '50px' }}>
        
        {/* Brand and Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--foreground)' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              borderRadius: '8px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}>A</div>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'var(--font-title)' }}>AlgoMaster</span>
          </Link>
          <p style={{ lineHeight: '1.6', color: 'var(--foreground-muted)' }}>
            Learn Data Structures, Algorithms, and System Design through interactive pattern-based pathways. Prepare for technical interviews like a pro.
          </p>
        </div>

        {/* Learning Paths Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ color: 'var(--foreground)', fontSize: '1rem', fontWeight: '600' }}>Roadmaps</h4>
          <Link href="/roadmaps" style={{ color: 'inherit', textDecoration: 'none' }}>DSA Patterns</Link>
          <Link href="/roadmaps" style={{ color: 'inherit', textDecoration: 'none' }}>System Design</Link>
          <Link href="/problems" style={{ color: 'inherit', textDecoration: 'none' }}>Problem Bank</Link>
          <Link href="/cheatsheets" style={{ color: 'inherit', textDecoration: 'none' }}>Quick Cheat Sheets</Link>
        </div>

        {/* Legal and Company */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ color: 'var(--foreground)', fontSize: '1rem', fontWeight: '600' }}>Resources</h4>
          <Link href="/pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Premium Subscription</Link>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Contact Support</a>
        </div>

        {/* Newsletter Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ color: 'var(--foreground)', fontSize: '1rem', fontWeight: '600' }}>Weekly Newsletter</h4>
          <p style={{ color: 'var(--foreground-muted)', lineHeight: '1.5' }}>
            Get interview tips, editorial solutions, and system design break-downs in your inbox weekly.
          </p>
          {subscribed ? (
            <div style={{ color: 'var(--success)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ✓ Subscribed successfully!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                Join
              </button>
            </form>
          )}
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          color: 'var(--foreground-muted)',
          fontSize: '0.85rem',
        }}
      >
        <div>© {new Date().getFullYear()} AlgoMaster Clone. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="#" style={{ color: 'inherit' }}>Twitter</a>
          <a href="#" style={{ color: 'inherit' }}>GitHub</a>
          <a href="#" style={{ color: 'inherit' }}>Discord</a>
        </div>
      </div>
    </footer>
  );
}
