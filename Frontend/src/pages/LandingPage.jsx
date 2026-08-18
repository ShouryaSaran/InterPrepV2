import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import CareerParticles from '../components/landing/CareerParticles';
import HowItWorks from '../components/landing/HowItWorks';
import Features from '../components/landing/Features';
import CareerJourney from '../components/landing/CareerJourney';
import FinalCTA from '../components/landing/FinalCTA';
import Footer from '../components/landing/Footer';
import ScrollProgress from '../components/landing/ScrollProgress';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const appRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Global GSAP context for the landing page
    }, appRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={appRef} className="app-container" style={{ position: 'relative', width: '100%', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />
      
      {/* 3D Canvas Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}>
        <CareerParticles />
      </div>

      {/* Content Layers */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Hero />
        <HowItWorks />
        <Features />
        <CareerJourney />
        <FinalCTA />
        <Footer />
      </div>

      <ScrollProgress />
    </div>
  );
};

export default LandingPage;
