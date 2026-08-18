import React from 'react';
import { Link } from 'react-router-dom';
import { scrollToSection } from '../../utils/navigation';

const Footer = () => {
  return (
    <footer id="footer" style={{
      padding: '4rem 3rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      borderTop: '1px solid var(--border)',
      color: 'var(--text-secondary)',
      fontSize: '0.875rem'
    }}>
      <div>
        <div style={{ color: 'white', fontWeight: 600, marginBottom: '1rem' }}>InterPrep</div>
        <div>&copy; {new Date().getFullYear()} InterPrep. All rights reserved.</div>
      </div>
      
      <div style={{ display: 'flex', gap: '4rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
          <button onClick={() => scrollToSection('how-it-works')} style={{ color: 'white', textAlign: 'left' }}>Product</button>
          <button onClick={() => scrollToSection('features')} style={{ textAlign: 'left' }}>Features</button>
          <button onClick={() => scrollToSection('about')} style={{ textAlign: 'left' }}>About</button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>Social</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/legal" style={{ color: 'white', textDecoration: 'none' }}>Legal</Link>
          <Link to="/privacy" style={{ textDecoration: 'none', color: 'inherit' }}>Privacy</Link>
          <Link to="/terms" style={{ textDecoration: 'none', color: 'inherit' }}>Terms</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
