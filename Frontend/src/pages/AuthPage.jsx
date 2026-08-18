import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Bot, Target, LineChart, ShieldCheck, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import CareerParticles from '../components/landing/CareerParticles';

// SVGs for Social Login
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--text-primary)" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);
const AuthInput = ({ label, icon: Icon, type = "text", ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const actualType = isPassword && showPassword ? "text" : type;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
      <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        {Icon && <Icon size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />}
        <input
          type={actualType}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            paddingLeft: Icon ? '2.75rem' : '1rem',
            backgroundColor: 'transparent',
            border: '1px solid var(--border-light)',
            borderRadius: '6px',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--text-secondary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}
            tabIndex="-1"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

const SocialButton = ({ icon: Icon, provider, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      flex: 1,
      padding: '0.75rem',
      backgroundColor: 'transparent',
      border: '1px solid var(--border-light)',
      borderRadius: '6px',
      color: 'var(--text-primary)',
      fontSize: '0.875rem',
      fontWeight: 500,
      transition: 'background-color 0.2s'
    }}
    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-secondary)'}
    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
  >
    <Icon />
    {provider}
  </button>
);

const FeatureColumn = ({ icon: Icon, title, description }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem', flex: 1, minWidth: '150px' }}>
    <Icon size={24} style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }} />
    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</span>
    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{description}</span>
  </div>
);

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const initialMode = params.get('mode') === 'signup' ? 'signup' : 'login';

  const [mode, setMode] = useState(initialMode);

  const wrapperRef = useRef(null);
  const containerRef = useRef(null);
  const loginRef = useRef(null);
  const signupRef = useRef(null);

  useEffect(() => {
    navigate(`/auth?mode=${mode}`, { replace: true });
  }, [mode, navigate]);

  useLayoutEffect(() => {
    const isLogin = mode === 'login';
    const activeRef = isLogin ? loginRef.current : signupRef.current;
    const inactiveRef = isLogin ? signupRef.current : loginRef.current;

    let ctx = gsap.context(() => {
      gsap.set(activeRef, { position: 'relative', pointerEvents: 'auto' });
      gsap.set(inactiveRef, { position: 'absolute', pointerEvents: 'none' });

      const targetHeight = activeRef.offsetHeight;

      gsap.to(containerRef.current, {
        height: targetHeight,
        duration: 0.4,
        ease: "power2.inOut"
      });

      gsap.fromTo(activeRef,
        { opacity: 0, x: isLogin ? -20 : 20 },
        { opacity: 1, x: 0, duration: 0.4, ease: "power2.out", delay: 0.1 }
      );

      gsap.to(inactiveRef,
        { opacity: 0, x: isLogin ? 20 : -20, duration: 0.3, ease: "power2.in" }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, [mode]);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login submitted");
  };

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("Signup submitted");
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', backgroundColor: 'var(--bg)', position: 'relative', overflowX: 'hidden' }}>

      {/* Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none', opacity: 0.6 }}>
        <CareerParticles />
      </div>

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', flex: 1 }}>

        {/* Header / Logo */}
        <div style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.02em', color: 'var(--text-primary)', textDecoration: 'none' }}>
            <span style={{ fontSize: '1.25rem' }}>◆</span> InterPrep
          </Link>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Prepare Smarter. Get Hired.</p>
        </div>

        {/* Auth Card */}
        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-light)',
            borderRadius: '16px',
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.7)',
            overflow: 'hidden'
          }}
        >
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', position: 'relative' }}>
            <button
              onClick={() => setMode('login')}
              style={{ flex: 1, padding: '1.25rem', fontSize: '1rem', fontWeight: mode === 'login' ? 600 : 500, color: mode === 'login' ? 'var(--text-primary)' : 'var(--text-secondary)', transition: 'color 0.2s' }}
            >
              Login
            </button>
            <button
              onClick={() => setMode('signup')}
              style={{ flex: 1, padding: '1.25rem', fontSize: '1rem', fontWeight: mode === 'signup' ? 600 : 500, color: mode === 'signup' ? 'var(--text-primary)' : 'var(--text-secondary)', transition: 'color 0.2s' }}
            >
              Sign Up
            </button>

            {/* Active Tab Indicator */}
            <div
              style={{
                position: 'absolute',
                bottom: -1,
                height: '2px',
                backgroundColor: 'var(--text-primary)',
                width: '30%',
                left: mode === 'login' ? '10%' : '60%',
                transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          </div>

          <div ref={wrapperRef} style={{ width: '100%' }}>
            <div ref={containerRef} style={{ position: 'relative', overflow: 'hidden' }}>

              {/* LOGIN FORM */}
              <div ref={loginRef} style={{ width: '100%', padding: '2rem 2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Welcome back</h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Continue your interview preparation</p>
                </div>

                <form onSubmit={handleLogin}>
                  <AuthInput label="Email" type="email" icon={Mail} placeholder="Enter your email" required autoComplete="email" />
                  <AuthInput label="Password" type="password" icon={Lock} placeholder="Enter your password" required autoComplete="current-password" />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', fontSize: '0.875rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ accentColor: 'var(--text-primary)', width: '1rem', height: '1rem', borderRadius: '4px', backgroundColor: 'transparent', border: '1px solid var(--border-light)' }} />
                      Remember me
                    </label>
                    <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Forgot password?</a>
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      backgroundColor: 'var(--text-primary)',
                      color: 'var(--bg)',
                      fontWeight: 600,
                      borderRadius: '6px',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = 0.9}
                    onMouseLeave={(e) => e.target.style.opacity = 1}
                  >
                    Login <ArrowRight size={18} />
                  </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0', color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-light)' }} />
                  <span style={{ padding: '0 1rem' }}>or continue with</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-light)' }} />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <SocialButton icon={GoogleIcon} provider="Google" onClick={() => console.log('Google login')} />
                  <SocialButton icon={GitHubIcon} provider="GitHub" onClick={() => console.log('GitHub login')} />
                </div>
                <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  New to InterPrep? <button onClick={() => setMode('signup')} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Create an account</button>
                </div>
              </div>
              {/* SIGNUP FORM */}
              <div ref={signupRef} style={{ width: '100%', padding: '2rem 2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Create your account</h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Start preparing smarter with InterPrep</p>
                </div>
                <form onSubmit={handleSignup}>
                  <AuthInput label="Full Name" type="text" icon={User} placeholder="Enter your full name" required autoComplete="name" />
                  <AuthInput label="Email" type="email" icon={Mail} placeholder="Enter your email" required autoComplete="email" />
                  <AuthInput label="Password" type="password" icon={Lock} placeholder="Create a password" required autoComplete="new-password" />
                  <AuthInput label="Confirm Password" type="password" icon={Lock} placeholder="Confirm your password" required autoComplete="new-password" />
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      marginTop: '1rem',
                      padding: '0.875rem',
                      backgroundColor: 'var(--text-primary)',
                      color: 'var(--bg)',
                      fontWeight: 600,
                      borderRadius: '6px',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = 0.9}
                    onMouseLeave={(e) => e.target.style.opacity = 1}
                  >
                    Create Account <ArrowRight size={18} />
                  </button>
                </form>
                <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-light)' }} />
                  <span style={{ padding: '0 1rem' }}>or continue with</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-light)' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <SocialButton icon={GoogleIcon} provider="Google" onClick={() => console.log('Google signup')} />
                  <SocialButton icon={GitHubIcon} provider="GitHub" onClick={() => console.log('GitHub signup')} />
                </div>

                <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Already have an account? <button onClick={() => setMode('login')} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Login</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AuthPage;
