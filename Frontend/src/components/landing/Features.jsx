import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Features = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(cardsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const cardStyle = {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-light)',
    borderRadius: '12px',
    padding: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '2rem'
  };

  return (
    <section id="features" ref={containerRef} style={{ padding: '10vh 5vw', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ marginBottom: '4rem' }}>
        <h2 className="text-large">CORE FEATURES</h2>
        <p className="text-body" style={{ marginTop: '1rem' }}>Everything you need to prepare effectively.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Card 1 */}
        <div ref={el => cardsRef.current[0] = el} style={cardStyle} className="feature-card">
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Resume Analysis</h3>
            <p className="text-small" style={{ color: 'var(--text-secondary)' }}>Understand how recruiters and ATS systems evaluate your resume before you apply.</p>
          </div>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div className="text-small mono" style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>ATS READY</div>
            <div className="text-small mono" style={{ marginBottom: '0.5rem' }}>KEYWORDS FOUND: 24</div>
            <div className="text-small mono" style={{ color: 'var(--text-tertiary)' }}>MISSING SKILLS: Docker, K8s</div>
          </div>
        </div>

        {/* Card 2 */}
        <div ref={el => cardsRef.current[1] = el} style={cardStyle} className="feature-card">
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Job Matching</h3>
            <p className="text-small" style={{ color: 'var(--text-secondary)' }}>Know exactly how well your profile aligns with a specific job description.</p>
          </div>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', fontWeight: 700, lineHeight: 1 }}>82%</div>
            <div className="text-small mono" style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>PROFILE MATCH</div>
          </div>
        </div>

        {/* Card 3 */}
        <div ref={el => cardsRef.current[2] = el} style={cardStyle} className="feature-card">
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Mock Interviews</h3>
            <p className="text-small" style={{ color: 'var(--text-secondary)' }}>Practice interviews tailored to your target role instead of generic questions.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '1rem', border: '1px solid var(--border-light)', borderRadius: '6px', backgroundColor: 'var(--bg)' }}>Technical</div>
            <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '6px', opacity: 0.5 }}>Behavioral</div>
            <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '6px', opacity: 0.5 }}>System Design</div>
          </div>
        </div>

        {/* Card 4 */}
        <div ref={el => cardsRef.current[3] = el} style={cardStyle} className="feature-card">
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Skill Gap Detection</h3>
            <p className="text-small" style={{ color: 'var(--text-secondary)' }}>Know what to improve next instead of preparing randomly.</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <span style={{ padding: '0.5rem 1rem', border: '1px solid var(--border-light)', borderRadius: '20px', backgroundColor: 'var(--bg)' }}>React</span>
            <span style={{ padding: '0.5rem 1rem', border: '1px solid var(--border-light)', borderRadius: '20px', backgroundColor: 'var(--bg)' }}>Node.js</span>
            <span style={{ padding: '0.5rem 1rem', border: '1px dashed var(--text-tertiary)', borderRadius: '20px', color: 'var(--text-tertiary)' }}>System Design</span>
            <span style={{ padding: '0.5rem 1rem', border: '1px dashed var(--text-tertiary)', borderRadius: '20px', color: 'var(--text-tertiary)' }}>Docker</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;
