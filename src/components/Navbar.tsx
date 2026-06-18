'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize theme from storage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const navLinks = [
    { name: 'Roadmaps', path: '/roadmaps' },
    { name: 'Practice', path: '/problems' },
    { name: 'Cheat Sheets', path: '/cheatsheets' },
    { name: 'System Design', path: '/system-design' },
    { name: 'Pricing', path: '/pricing' },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Brand Logo */}
        <Link href="/" className={styles.brand}>
          <div className={styles.logoIcon}>A</div>
          <span className={styles.logoText}>AlgoMaster</span>
        </Link>

        {/* Desktop Links */}
        <ul className={styles.navLinks}>
          {navLinks.map((link) => {
            const isActive = pathname === link.path || pathname?.startsWith(link.path + '/');
            return (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* User Actions & Theme Toggle */}
        <div className={styles.actions}>
          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label="Toggle theme"
            title="Toggle Light/Dark Mode"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {!loading && (
            <>
              {user ? (
                <div className={styles.profileMenu}>
                  <Link href="/profile" className={styles.userName} title="View Profile">
                    {user.name.split(' ')[0]}
                  </Link>
                  <span
                    className={`${styles.userBadge} ${
                      user.tier === 'premium' ? styles.badgePremium : styles.badgeFree
                    }`}
                  >
                    {user.tier}
                  </span>
                  <button onClick={logout} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                    Logout
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link href="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                    Login
                  </Link>
                  <Link href="/signup" className="btn btn-primary btn-glow" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                    Sign Up
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={styles.menuButton}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className={styles.navLinksMobile}>
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                style={{ display: 'block', padding: '8px 0' }}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
