import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ProductPhilosophy = () => {
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
          end: '+=300%',
          pin: true,
          scrub: 1,
        }
      });

      tl.to(text1Ref.current, { opacity: 0, scale: 0.9, duration: 1 }, 1)
        .fromTo(text2Ref.current, { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 1 }, 1)
        .to(text2Ref.current, { opacity: 0, scale: 0.9, duration: 1 }, 3)
        .fromTo(text3Ref.current, { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 1 }, 3)
        .to(text3Ref.current, { opacity: 0, duration: 1 }, 5);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const textStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    width: '100%'
  };

  return (
    <section ref={containerRef} style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div ref={text1Ref} style={textStyle}>
        <h2 className="text-huge">STOP</h2>
        <h2 className="text-huge">PREPARING</h2>
        <h2 className="text-huge">RANDOMLY.</h2>
      </div>
      <div ref={text2Ref} style={{ ...textStyle, opacity: 0 }}>
        <h2 className="text-huge">PREPARE</h2>
        <h2 className="text-huge">FOR THE ROLE.</h2>
      </div>
      <div ref={text3Ref} style={{ ...textStyle, opacity: 0 }}>
        <h2 className="text-huge">KNOW</h2>
        <h2 className="text-huge">WHEN YOU'RE READY.</h2>
      </div>
    </section>
  );
};

export default ProductPhilosophy;
