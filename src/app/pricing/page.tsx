'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface OrderResponse {
  success: boolean;
  mock: boolean;
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
  };
}

export default function PricingPage() {
  const { user, refreshSession } = useAuth();
  const router = useRouter();

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  
  // Sandbox Simulator Modal States
  const [showSandbox, setShowSandbox] = useState(false);
  const [sandboxOrder, setSandboxOrder] = useState<OrderResponse | null>(null);
  const [sandboxStatus, setSandboxStatus] = useState<'idle' | 'success' | 'fail'>('idle');

  // Load Razorpay Checkout Widget script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      alert('Please create an account or log in to subscribe and unlock premium features.');
      router.push(`/signup?redirect=/pricing`);
      return;
    }

    if (user.tier === 'premium') {
      alert('You are already an active Premium member! Enjoy unlimited access to DSA and System Design roadmaps.');
      router.push('/profile');
      return;
    }

    setLoadingPlan(planId);

    try {
      const res = await fetch('/api/payments/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      });

      const orderData: OrderResponse = await res.json();

      if (!res.ok || !orderData.success) {
        alert('Failed to generate order ID. Please try again.');
        setLoadingPlan(null);
        return;
      }

      // If mock mode is returned (no API keys in .env), trigger sandbox overlay
      if (orderData.mock) {
        setSandboxOrder(orderData);
        setShowSandbox(true);
        setLoadingPlan(null);
        return;
      }

      // Initialize real Razorpay checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: orderData.name,
        description: orderData.description,
        order_id: orderData.orderId,
        prefill: {
          name: orderData.prefill.name,
          email: orderData.prefill.email
        },
        theme: {
          color: '#6366f1' // Brand primary indigo color
        },
        handler: async function (response: any) {
          setLoadingPlan(planId);
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                mock: false
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              alert('Payment verified! Welcome to AlgoMaster Premium.');
              await refreshSession();
              router.push('/profile');
            } else {
              alert(verifyData.error || 'Verification failed. Contact support.');
            }
          } catch (e) {
            alert('A verification connection error occurred. Please refresh.');
          } finally {
            setLoadingPlan(null);
          }
        },
        modal: {
          ondismiss: function () {
            setLoadingPlan(null);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Subscription error:', error);
      alert('Checkout pipeline error. Please reload.');
      setLoadingPlan(null);
    }
  };

  const handleSimulatePayment = async (status: 'success' | 'fail') => {
    if (!sandboxOrder) return;
    
    setSandboxStatus(status === 'success' ? 'success' : 'fail');
    
    setTimeout(async () => {
      if (status === 'success') {
        try {
          const res = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: sandboxOrder.orderId,
              razorpay_payment_id: 'pay_mock_' + Math.random().toString(36).substring(2, 11),
              mock: true
            })
          });

          const data = await res.json();
          if (res.ok && data.success) {
            alert('Mock checkout successful! Account upgraded.');
            await refreshSession();
            setShowSandbox(false);
            router.push('/profile');
          } else {
            alert(data.error || 'Mock verification failed.');
          }
        } catch (e) {
          alert('Network verification failure in simulation.');
        }
      } else {
        alert('Checkout simulated cancellation.');
        setShowSandbox(false);
      }
      setSandboxStatus('idle');
    }, 1200);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main className="container" style={{ padding: '60px 24px', flex: 1 }}>
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            PRICING OPTIONS
          </span>
          <h1 style={{ fontSize: '2.8rem', marginTop: '8px', marginBottom: '16px', color: 'var(--foreground)' }}>Unlock Premium Access</h1>
          <p style={{ color: 'var(--foreground-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' }}>
            Get unlimited access to advanced DSA patterns, coding playgrounds, SVG tracers, and scalable System Design case studies.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          maxWidth: '1100px',
          margin: '0 auto',
          alignItems: 'stretch'
        }}>
          {/* Card 1: Monthly */}
          <div style={{
            background: 'var(--background-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '40px 30px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            transition: 'all 0.3s'
          }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--foreground)', marginBottom: '8px' }}>Monthly</h3>
              <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>Best for short term prep needs.</p>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '30px' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--foreground)', fontFamily: 'var(--font-title)' }}>₹2,499</span>
                <span style={{ color: 'var(--foreground-secondary)' }}>/ month</span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', marginBottom: '30px' }} />

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--foreground-secondary)', fontSize: '0.95rem' }}>
                <li>✓ Full Access to 600+ DSA Problems</li>
                <li>✓ Pattern-based DSA Roadmap</li>
                <li>✓ Interactive step visualizer</li>
                <li>✓ Multi-language Code playground</li>
                <li style={{ color: 'var(--foreground-muted)' }}>✗ Advanced System Design Guides</li>
                <li style={{ color: 'var(--foreground-muted)' }}>✗ Lifetime product updates</li>
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe('monthly')}
              disabled={loadingPlan !== null}
              className="btn btn-secondary btn-glow"
              style={{ width: '100%', padding: '12px', marginTop: '40px', fontWeight: 'bold' }}
            >
              {loadingPlan === 'monthly' ? 'Loading checkout...' : 'Choose Monthly'}
            </button>
          </div>

          {/* Card 2: Annual (POPULAR) */}
          <div style={{
            background: 'var(--background-card)',
            border: '2px solid var(--primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '40px 30px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            boxShadow: '0 20px 40px -15px var(--border-glow)',
            transform: 'scale(1.03)',
            zIndex: 10
          }}>
            {/* Ribbon Badge */}
            <span style={{
              position: 'absolute',
              top: '16px',
              right: '24px',
              background: 'var(--primary)',
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: '700',
              padding: '4px 12px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Most Popular
            </span>

            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--foreground)', marginBottom: '8px' }}>Annual Pass</h3>
              <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>Save 60% compared to monthly plan.</p>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '30px' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--foreground)', fontFamily: 'var(--font-title)' }}>₹6,499</span>
                <span style={{ color: 'var(--foreground-secondary)' }}>/ year</span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', marginBottom: '30px' }} />

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--foreground-secondary)', fontSize: '0.95rem' }}>
                <li>✓ Full Access to 600+ DSA Problems</li>
                <li>✓ Pattern-based DSA Roadmap</li>
                <li>✓ Interactive step visualizer</li>
                <li>✓ Multi-language Code playground</li>
                <li>✓ <strong>All System Design Case Studies</strong></li>
                <li>✓ Architectural SVG diagrams & math</li>
                <li>✓ Priority support via Discord</li>
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe('annual')}
              disabled={loadingPlan !== null}
              className="btn btn-primary btn-glow"
              style={{ width: '100%', padding: '12px', marginTop: '40px', fontWeight: 'bold' }}
            >
              {loadingPlan === 'annual' ? 'Loading checkout...' : 'Choose Annual'}
            </button>
          </div>

          {/* Card 3: Lifetime */}
          <div style={{
            background: 'var(--background-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '40px 30px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            transition: 'all 0.3s'
          }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--foreground)', marginBottom: '8px' }}>Lifetime Pass</h3>
              <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>One-time payment, permanent access.</p>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '30px' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--foreground)', fontFamily: 'var(--font-title)' }}>₹12,999</span>
                <span style={{ color: 'var(--foreground-secondary)' }}>/ one-time</span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', marginBottom: '30px' }} />

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--foreground-secondary)', fontSize: '0.95rem' }}>
                <li>✓ Full Access to 600+ DSA Problems</li>
                <li>✓ Pattern-based DSA Roadmap</li>
                <li>✓ Interactive step visualizer</li>
                <li>✓ Multi-language Code playground</li>
                <li>✓ All System Design Case Studies</li>
                <li>✓ Architectural SVG diagrams & math</li>
                <li>✓ <strong>Lifetime Updates & New Content</strong></li>
                <li>✓ Exclusive Slack/Discord group</li>
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe('lifetime')}
              disabled={loadingPlan !== null}
              className="btn btn-secondary btn-glow"
              style={{ width: '100%', padding: '12px', marginTop: '40px', fontWeight: 'bold' }}
            >
              {loadingPlan === 'lifetime' ? 'Loading checkout...' : 'Choose Lifetime'}
            </button>
          </div>
        </div>

        {/* ----------------- INTERACTIVE SANDBOX PAYMENT SIMULATOR MODAL ----------------- */}
        {showSandbox && sandboxOrder && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(5px)',
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}>
            <div style={{
              background: 'var(--background-card)',
              border: '2px solid var(--primary)',
              borderRadius: 'var(--radius-lg)',
              width: '100%',
              maxWidth: '500px',
              padding: '30px',
              textAlign: 'center',
              boxShadow: '0 25px 50px rgba(0,0,0,0.6)'
            }} className="animate-slide-up">
              
              {/* Simulator Header */}
              <div style={{ marginBottom: '20px' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: '800',
                  color: 'white',
                  background: 'var(--primary)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  marginBottom: '10px'
                }}>
                  Gateway Sandbox Simulator
                </span>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--foreground)' }}>Razorpay Checkout</h2>
                <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
                  Simulated gateway environment for testing the subscription flow.
                </p>
              </div>

              {/* Order Details Panel */}
              <div style={{
                background: 'var(--background)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'left',
                marginBottom: '24px',
                fontSize: '0.9rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--foreground-secondary)' }}>Merchant:</span>
                  <strong style={{ color: 'var(--foreground)' }}>AlgoMaster Platform</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--foreground-secondary)' }}>Order ID:</span>
                  <strong style={{ color: 'var(--foreground)', fontFamily: 'monospace' }}>{sandboxOrder.orderId}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--foreground-secondary)' }}>Plan Details:</span>
                  <strong style={{ color: 'var(--foreground)' }}>{sandboxOrder.description}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '8px' }}>
                  <span style={{ color: 'var(--foreground-secondary)', fontWeight: 'bold' }}>Total Charge:</span>
                  <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>₹{sandboxOrder.amount / 100} INR</strong>
                </div>
              </div>

              {/* Simulation Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={() => handleSimulatePayment('success')}
                  disabled={sandboxStatus !== 'idle'}
                  className="btn btn-primary btn-glow"
                  style={{ width: '100%', padding: '12px', background: 'var(--success)', color: 'white', border: 'none', fontWeight: 'bold' }}
                >
                  {sandboxStatus === 'success' ? 'Processing Simulated Success...' : '✓ Simulate Successful Payment'}
                </button>

                <button
                  onClick={() => handleSimulatePayment('fail')}
                  disabled={sandboxStatus !== 'idle'}
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '12px', color: 'var(--danger)', borderColor: 'var(--danger)', fontWeight: 'bold' }}
                >
                  {sandboxStatus === 'fail' ? 'Cancelling Simulated Checkout...' : '✗ Simulate Cancel/Failed Payment'}
                </button>
              </div>

              <div style={{ marginTop: '20px', fontSize: '0.75rem', color: 'var(--foreground-muted)' }}>
                ℹ In production, this simulator is automatically skipped and replaced by the standard Razorpay standard payment checkout widget overlay.
              </div>

            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
