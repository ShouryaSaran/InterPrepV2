import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollProgress = () => {
  const progressRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.to(progressRef.current, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.1
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      right: '2vw',
      transform: 'translateY(-50%)',
      height: '30vh',
      width: '2px',
      backgroundColor: 'var(--border-light)',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      opacity: 0.5
    }} className="hide-on-mobile">
      <div 
        ref={progressRef}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          transformOrigin: 'top',
          transform: 'scaleY(0)'
        }}
      />
    </div>
  );
};

export default ScrollProgress;
