import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ApplicationTransition = () => {
  const containerRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const text3Ref = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1,
        }
      });

      tl.fromTo(text1Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 })
        .fromTo(text2Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 })
        .fromTo(text3Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 })
        .to([text1Ref.current, text2Ref.current, text3Ref.current], { opacity: 0, y: -50, duration: 1, stagger: 0.2 }, "+=0.5");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} style={{ height: '100vh', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      <h2 ref={text1Ref} className="text-huge" style={{ opacity: 0 }}>YOUR CAREER.</h2>
      <h2 ref={text2Ref} className="text-huge" style={{ color: 'var(--text-secondary)', opacity: 0 }}>YOUR PREPARATION.</h2>
      <h2 ref={text3Ref} className="text-huge" style={{ opacity: 0 }}>YOUR EDGE.</h2>
    </section>
  );
};

export default ApplicationTransition;
