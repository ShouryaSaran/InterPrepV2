import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CareerJourney = () => {
  const containerRef = useRef(null);
  const wordsRef = useRef([]);

  const words = ["APPLY", "ANALYZE", "PREPARE", "PRACTICE", "IMPROVE", "INTERVIEW", "GET HIRED"];

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(wordsRef.current,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.15,
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
    <section id="career-journey" ref={containerRef} style={{ minHeight: '60vh', padding: '10vh 5vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', overflow: 'hidden' }}>
      <h2 className="text-huge" style={{ marginBottom: '3rem' }}>THE JOURNEY</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem 2rem', maxWidth: '1000px' }}>
        {words.map((word, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <h3 ref={el => wordsRef.current[idx] = el} className="text-large" style={{ color: idx === words.length - 1 ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
              {word}.
            </h3>
            {idx < words.length - 1 && (
              <span className="hide-on-mobile" style={{ color: 'var(--border-light)' }}>&rarr;</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CareerJourney;
