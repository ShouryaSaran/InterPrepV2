import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { scrollToSection } from '../../utils/navigation';

const Hero = () => {
  const containerRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const text3Ref = useRef(null);
  const subRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(text1Ref.current, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.2)
        .fromTo(text2Ref.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.4)
        .fromTo(text3Ref.current, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.6)
        .fromTo(subRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.8);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={containerRef} className="hero-section" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 5vw', overflow: 'hidden' }}>
      <div className="hero-text-container" style={{ position: 'relative', zIndex: 10 }}>
        <h1 ref={text1Ref} className="text-massive" style={{ textAlign: 'left' }}>PREPARE.</h1>
        <h1 ref={text2Ref} className="text-massive" style={{ textAlign: 'center' }}>PERFORM.</h1>
        <h1 ref={text3Ref} className="text-massive" style={{ textAlign: 'right' }}>GET HIRED.</h1>
        
        <div ref={subRef} style={{ marginTop: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
          <p className="text-body" style={{ maxWidth: '400px' }}>
            AI-powered preparation for internships, placements and your next job. Understand the role. Find your gaps. Practice the interview. Walk in prepared.
          </p>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link to="/auth?mode=signup" style={{ fontWeight: 600, fontSize: '1.125rem', backgroundColor: 'var(--text-primary)', color: 'var(--bg)', padding: '0.75rem 1.5rem', borderRadius: '4px', transition: 'opacity 0.2s', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.opacity = 0.9} onMouseLeave={(e) => e.target.style.opacity = 1}>Start Preparing &rarr;</Link>
            <button onClick={() => scrollToSection('how-it-works')} className="text-small" style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-light)', paddingBottom: '2px' }}>Explore Features</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
