import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';

const FinalCTA = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current.children, 
        { opacity: 0, y: 30 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          stagger: 0.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="final-cta" ref={containerRef} style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 5vw' }}>
      <h2 className="text-huge">READY FOR YOUR</h2>
      <h2 className="text-huge">NEXT INTERVIEW?</h2>
      
      <p className="text-body" style={{ marginTop: '2rem', maxWidth: '600px' }}>
        Prepare with purpose. Walk into interviews knowing exactly where you stand.
      </p>
      
      <div style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/auth?mode=signup" style={{ fontSize: '1.25rem', fontWeight: 600, backgroundColor: 'var(--text-primary)', color: 'var(--bg)', padding: '0.75rem 2rem', borderRadius: '4px', transition: 'opacity 0.2s', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.opacity = 0.9} onMouseLeave={(e) => e.target.style.opacity = 1}>
            Start Preparing
          </Link>
        </div>
        <span className="text-small" style={{ marginTop: '1rem' }}>Your next opportunity starts before the interview.</span>
      </div>
    </section>
  );
};

export default FinalCTA;
