import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { scrollToSection } from '../../utils/navigation';

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleActive = () => {
      // Basic implementation for active link
      const sections = ['how-it-works', 'features'];
      let current = '';
      for (let s of sections) {
        const el = document.getElementById(s);
        if (el && window.scrollY >= (el.offsetTop - 300)) {
          current = s;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleActive);
    return () => window.removeEventListener('scroll', handleActive);
  }, []);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      padding: '1.5rem 3rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 100,
      mixBlendMode: 'difference',
    }}>
      <div style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.02em', cursor: 'pointer' }} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
        InterPrep
      </div>
      
      <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem' }}>
        <button className="nav-link" onClick={() => scrollToSection('product')}>Product</button>
        <button onClick={() => scrollToSection('how-it-works')} style={{ opacity: activeSection === 'how-it-works' ? 1 : 0.6, transition: 'opacity 0.2s' }}>How It Works</button>
        <button onClick={() => scrollToSection('features')} style={{ opacity: activeSection === 'features' ? 1 : 0.6, transition: 'opacity 0.2s' }}>Features</button>
      </div>
      
      <div>
        <button style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          border: '1px solid var(--border-light)',
          padding: '0.5rem 1.25rem',
          borderRadius: '100px',
          transition: 'all 0.2s ease',
        }}
        onClick={() => navigate('/auth?mode=signup')}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'white';
          e.currentTarget.style.color = 'black';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'inherit';
        }}
        >
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
