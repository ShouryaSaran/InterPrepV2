import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

const HowItWorks = () => {
  const containerRef = useRef(null);
  const stepsRef = useRef([]);

  const steps = [
    { title: "Target Role", desc: "Choose your desired role and upload your resume." },
    { title: "Practice", desc: "Take tailored mock interviews focusing on your gaps." },
    { title: "AI Analysis", desc: "Get detailed feedback on clarity, structure, and depth." },
    { title: "Improve", desc: "Follow a personalized plan to address weak areas." },
    { title: "Interview Ready", desc: "Walk into your next interview with complete confidence." }
  ];

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(stepsRef.current,
        { opacity: 0, y: 30 },
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

  return (
    <section id="how-it-works" ref={containerRef} style={{ minHeight: '80vh', padding: '10vh 5vw', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ marginBottom: '6rem', textAlign: 'center' }}>
        <h2 className="text-large">THE WORKFLOW</h2>
        <p className="text-body" style={{ margin: '1rem auto 0' }}>A systematic approach to becoming interview ready.</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', position: 'relative' }}>
        {/* Connecting line for desktop */}
        <div className="hide-on-mobile" style={{ position: 'absolute', top: '24px', left: '10%', right: '10%', height: '1px', backgroundColor: 'var(--border-light)', zIndex: 0 }}></div>
        
        {steps.map((step, idx) => (
          <div 
            key={idx} 
            ref={el => stepsRef.current[idx] = el}
            style={{ 
              flex: '1 1 180px', 
              maxWidth: '250px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
              backgroundColor: 'var(--bg)', // to block out the line behind the circle
              padding: '0 0.5rem'
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              {idx + 1}
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600 }}>{step.title}</h3>
            <p className="text-small" style={{ lineHeight: 1.5 }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
