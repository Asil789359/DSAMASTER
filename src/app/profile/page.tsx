'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ProfileData {
  solvedProblemsCount: number;
  solvedProblems: Array<{
    problemId: string;
    language: string;
    solvedAt: string;
  }>;
  completedNodeIds: string[];
  payments: Array<{
    id: string;
    orderId: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
}

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const fetchProfileDetails = async () => {
    if (!user) return;
    try {
      // Fetch user progress
      const progressRes = await fetch('/api/progress');
      const progressData = await progressRes.json();

      // Fetch payment details (we will write a simple endpoint or mock)
      const paymentRes = await fetch('/api/payments/history');
      const paymentData = await paymentRes.json();

      setProfile({
        solvedProblemsCount: (progressData.solvedProblems || []).length,
        solvedProblems: progressData.solvedProblems || [],
        completedNodeIds: progressData.completedNodeIds || [],
        payments: paymentData.payments || []
      });
    } catch (e) {
      console.error('Error fetching profile details:', e);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfileDetails();
    }
  }, [user]);

  if (loading || loadingProfile || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h2>Loading User Profile Dashboard...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main className="container" style={{ padding: '40px 24px', flex: 1 }}>
        
        {/* User Card Layout */}
        <div style={{
          background: 'var(--background-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '30px',
          marginBottom: '40px',
          boxShadow: 'var(--glass-shadow)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '2.2rem', color: 'var(--foreground)' }}>{user.name}</h1>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '4px 12px',
                borderRadius: '20px',
                background: user.tier === 'premium' ? 'var(--primary)' : 'var(--border-color)',
                color: user.tier === 'premium' ? 'white' : 'var(--foreground-secondary)',
                boxShadow: user.tier === 'premium' ? '0 0 10px rgba(var(--primary-rgb), 0.4)' : 'none'
              }}>
                {user.tier.toUpperCase()} TIER
              </span>
            </div>
            <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.95rem' }}>
              Registered Email: <strong>{user.email}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {user.tier !== 'premium' && (
              <Link href="/pricing" className="btn btn-primary btn-glow">
                🚀 Upgrade to Premium
              </Link>
            )}
            <button onClick={logout} className="btn btn-secondary">
              Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Statistics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {/* Card 1: Solved Problems */}
          <div style={{
            background: 'var(--background-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '2.5rem' }}>💻</span>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--foreground-secondary)', fontWeight: '500', marginTop: '10px', marginBottom: '6px' }}>
              Problems Solved
            </h3>
            <span style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--foreground)' }}>
              {profile?.solvedProblemsCount || 0}
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)', marginTop: '8px' }}>
              Curated coding problems solved in workspace
            </p>
          </div>

          {/* Card 2: Roadmap Completion */}
          <div style={{
            background: 'var(--background-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '2.5rem' }}>🗺️</span>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--foreground-secondary)', fontWeight: '500', marginTop: '10px', marginBottom: '6px' }}>
              Roadmap Topics
            </h3>
            <span style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--foreground)' }}>
              {profile?.completedNodeIds.length || 0}
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)', marginTop: '8px' }}>
              DSA and System Design concept blocks completed
            </p>
          </div>

          {/* Card 3: Solved Problems languages list */}
          <div style={{
            background: 'var(--background-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--foreground)', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
              Languages Summary
            </h3>
            {profile && profile.solvedProblems.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Array.from(new Set(profile.solvedProblems.map((p) => p.language))).map((lang) => {
                  const count = profile.solvedProblems.filter((p) => p.language === lang).length;
                  return (
                    <div key={lang} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--foreground-secondary)' }}>
                      <span style={{ textTransform: 'capitalize', fontWeight: '600' }}>{lang}</span>
                      <span>{count} solved</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)', fontStyle: 'italic', textAlign: 'center', marginTop: '10px' }}>
                No language records yet. Solve problems to track!
              </p>
            )}
          </div>
        </div>

        {/* Transaction Billing History List */}
        <div style={{
          background: 'var(--background-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '30px',
          boxShadow: 'var(--glass-shadow)'
        }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--foreground)', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            Billing & Subscriptions Logs
          </h2>

          {profile && profile.payments.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--foreground-muted)' }}>
                    <th style={{ padding: '12px 16px' }}>Invoice ID</th>
                    <th style={{ padding: '12px 16px' }}>Order ID</th>
                    <th style={{ padding: '12px 16px' }}>Date</th>
                    <th style={{ padding: '12px 16px' }}>Amount</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.payments.map((pay) => (
                    <tr key={pay.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{pay.id}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{pay.orderId}</td>
                      <td style={{ padding: '12px 16px' }}>{new Date(pay.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '12px 16px', fontWeight: '600' }}>₹{pay.amount} INR</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: pay.status === 'verified' ? 'var(--success-bg)' : 'rgba(239, 68, 68, 0.1)',
                          color: pay.status === 'verified' ? 'var(--success)' : 'var(--danger)'
                        }}>
                          {pay.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--foreground-muted)' }}>
              <p>No billing or transaction records found.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>Upgrade your plan on our pricing screen to generate checkout receipts.</p>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
