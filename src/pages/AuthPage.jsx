import React, { useState, useRef, useEffect } from "react";
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useTransform, 
  useSpring 
} from "framer-motion";
import { Sparkles, Gift, Eye, EyeOff, ArrowRight, Check, ShieldCheck, User } from "lucide-react"; 

// NOTE: To use your actual logo locally:
// 1. Place your 'logo.png' file in the 'src' folder.
// 2. Uncomment the line below:
// import logo from "../logo.png"; 

// Modern, Mature iOS-styled CSS
const styles = `
  :root {
    --ios-text-primary: #1D1D1F;
    --ios-text-secondary: #86868B;
    --brand-gradient: linear-gradient(135deg, #FF2D55 0%, #AF52DE 100%);
    --glass-border: rgba(255, 255, 255, 0.4);
    --glass-bg: rgba(255, 255, 255, 0.65);
    --input-bg: rgba(235, 235, 245, 0.5);
    --focus-ring: rgba(175, 82, 222, 0.3);
  }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    background-color: #F5F5F7;
  }

  /* Sophisticated Aurora Background */
  .auth-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    position: relative;
    overflow: hidden;
    background: #FBFBFD;
    perspective: 1000px;
  }

  /* The Aurora Orbs */
  .aurora-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.5;
    z-index: 0;
    animation: auroraFloat 20s infinite alternate ease-in-out;
  }

  .orb-1 {
    top: -10%; left: -10%; width: 60vw; height: 60vw;
    background: radial-gradient(circle, #E0F7FA, #E1BEE7);
    animation-delay: 0s;
  }

  .orb-2 {
    bottom: -10%; right: -10%; width: 50vw; height: 50vw;
    background: radial-gradient(circle, #F3E5F5, #FFCDD2);
    animation-delay: -5s;
  }

  .orb-3 {
    top: 40%; left: 40%; width: 40vw; height: 40vw;
    background: radial-gradient(circle, #E8EAF6, #FFFFFF);
    opacity: 0.8;
    animation-delay: -10s;
  }

  @keyframes auroraFloat {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(30px, -20px) scale(1.05); }
  }

  /* Professional Glass Card */
  .auth-card {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 400px;
    background: var(--glass-bg);
    backdrop-filter: blur(30px) saturate(180%);
    -webkit-backdrop-filter: blur(30px) saturate(180%);
    border-radius: 24px;
    padding: 48px 36px;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.08),
      0 0 0 1px var(--glass-border) inset;
    transform-style: preserve-3d;
  }

  /* Header */
  .auth-header {
    text-align: center;
    margin-bottom: 30px;
    transform: translateZ(20px);
  }

  .auth-title {
    font-size: 32px;
    font-weight: 700;
    color: var(--ios-text-primary);
    margin: 16px 0 8px;
    letter-spacing: -0.02em;
  }

  .auth-subtitle {
    font-size: 16px;
    color: var(--ios-text-secondary);
    font-weight: 400;
    line-height: 1.4;
  }

  /* Logo Box */
  .auth-logo-box {
    width: 72px; height: 72px;
    background: #FFFFFF; 
    display: flex; justify-content: center; align-items: center;
    border-radius: 18px; margin: 0 auto;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
    position: relative; z-index: 2;
    transform-style: preserve-3d;
  }

  .auth-logo-icon {
    width: 36px; height: 36px; color: #FF2D55;
    filter: drop-shadow(0 4px 6px rgba(255, 45, 85, 0.3));
  }

  /* Segmented Control */
  .auth-tabs-container {
    background: rgba(118, 118, 128, 0.12);
    padding: 2px;
    border-radius: 9px;
    margin-bottom: 24px;
    display: flex;
    position: relative;
    height: 36px;
    transform: translateZ(10px);
  }

  .auth-tab {
    flex: 1; position: relative; z-index: 2;
    font-size: 13px; font-weight: 600;
    background: transparent; border: none; cursor: pointer;
    transition: color 0.2s; color: #636366;
    height: 100%; display: flex; align-items: center; justify-content: center;
  }

  .auth-tab.active { color: #000000; }

  .tab-background {
    position: absolute; top: 2px; left: 2px; bottom: 2px;
    background: #FFFFFF;
    border-radius: 7px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.05);
  }

  /* Inputs */
  .auth-form {
    display: flex; flex-direction: column; gap: 16px;
    transform: translateZ(15px);
  }
  
  .input-wrapper { position: relative; width: 100%; }

  .auth-input {
    width: 100%; padding: 16px 16px;
    border-radius: 12px; border: 1px solid transparent;
    background: var(--input-bg);
    font-size: 17px; color: var(--ios-text-primary);
    outline: none; transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
    box-sizing: border-box;
  }

  .auth-input::placeholder { color: #aeaeb2; }

  .auth-input:focus {
    background: #FFFFFF;
    border-color: rgba(175, 82, 222, 0.5);
    box-shadow: 0 0 0 4px var(--focus-ring);
    transform: scale(1.02);
  }

  /* Password Toggle Button */
  .password-toggle {
    position: absolute; right: 16px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--ios-text-secondary); padding: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .password-toggle:hover { color: #AF52DE; }

  /* OTP Input Styles */
  .otp-container {
    display: flex; gap: 12px; justify-content: center;
    margin: 10px 0;
  }
  .otp-input {
    width: 50px; height: 60px;
    border-radius: 12px; border: 1px solid rgba(0,0,0,0.1);
    background: #FFFFFF;
    font-size: 24px; font-weight: 700; text-align: center;
    color: var(--ios-text-primary); outline: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    transition: all 0.2s;
  }
  .otp-input:focus {
    border-color: #AF52DE;
    box-shadow: 0 0 0 4px var(--focus-ring);
    transform: translateY(-2px);
  }

  /* Button */
  .auth-button {
    margin-top: 12px; padding: 16px;
    border: none; border-radius: 12px;
    background: var(--brand-gradient);
    color: white; font-weight: 600; font-size: 17px;
    cursor: pointer; width: 100%;
    box-shadow: 0 4px 12px rgba(175, 82, 222, 0.25);
    position: relative; overflow: hidden;
    transform: translateZ(20px);
    display: flex; justify-content: center; align-items: center; gap: 8px;
  }
  
  .shimmer-effect {
    position: absolute; top: 0; left: -100%;
    width: 50%; height: 100%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: skewX(-20deg);
  }

  .auth-switch-text {
    text-align: center; margin-top: 28px;
    font-size: 14px; color: var(--ios-text-secondary);
    transform: translateZ(10px);
  }
  .auth-switch-link {
    color: #AF52DE; cursor: pointer; font-weight: 600;
    margin-left: 5px; transition: color 0.2s;
  }
  .auth-switch-link:hover { color: #FF2D55; text-decoration: underline; }

  /* Step Indicator */
  .step-indicator {
    display: flex; justify-content: center; gap: 6px; margin-bottom: 20px;
  }
  .step-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #E5E5EA;
    transition: all 0.3s;
  }
  .step-dot.active { background: #AF52DE; width: 18px; border-radius: 4px; }
`;

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
};

const formTransition = { type: "spring", stiffness: 300, damping: 30 };

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [signupStep, setSignupStep] = useState(1); // 1: Info, 2: OTP, 3: Username
  
  // Form State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [username, setUsername] = useState("");
  
  const hasLocalLogo = false; 

  // --- 3D TILT LOGIC ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set((clientX - left) / width - 0.5);
    y.set((clientY - top) / height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0); y.set(0);
  }

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-7, 7]);
  const logoX = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);
  const logoY = useTransform(mouseY, [-0.5, 0.5], [-15, 15]);

  // Handle OTP Input
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (mode === "login") {
      alert("Logging in...");
    } else {
      if (signupStep === 1) setSignupStep(2);
      else if (signupStep === 2) setSignupStep(3);
      else alert("Welcome to Surprizxo! Entering App...");
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setSignupStep(1); // Reset step when switching
    setOtp(["", "", "", ""]);
  };

  return (
    <>
      <style>{styles}</style>
      <div 
        className="auth-container"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="aurora-orb orb-1"></div>
        <div className="aurora-orb orb-2"></div>
        <div className="aurora-orb orb-3"></div>

        <motion.div
          className="auth-card"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ rotateX, rotateY }}
        >
          {/* Header */}
          <div className="auth-header">
            <motion.div 
              className="auth-logo-box"
              variants={itemVariants}
              style={{ x: logoX, y: logoY }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              {hasLocalLogo ? null : <Gift className="auth-logo-icon" />}
            </motion.div>
            
            <motion.h1 className="auth-title" variants={itemVariants}>
              Surprizxo
            </motion.h1>
            
            <motion.p className="auth-subtitle" variants={itemVariants}>
              {mode === "login" 
                ? "Welcome back, ready to gift?" 
                : signupStep === 1 
                  ? "Create your account" 
                  : signupStep === 2 
                    ? "Verify your email" 
                    : "Choose your identity"}
            </motion.p>
          </div>

          {/* Step Indicator for Signup */}
          {mode === "signup" && (
            <motion.div className="step-indicator" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className={`step-dot ${signupStep >= 1 ? "active" : ""}`} />
              <div className={`step-dot ${signupStep >= 2 ? "active" : ""}`} />
              <div className={`step-dot ${signupStep >= 3 ? "active" : ""}`} />
            </motion.div>
          )}

          {/* Tabs - Only show on Step 1 of Signup or Login */}
          {(mode === "login" || (mode === "signup" && signupStep === 1)) && (
            <motion.div className="auth-tabs-container" variants={itemVariants}>
              <motion.div 
                className="tab-background" 
                style={{ width: "calc(50% - 4px)" }}
                animate={{ x: mode === "login" ? 0 : "100%" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
              <button onClick={() => switchMode("login")} className={`auth-tab ${mode === "login" ? "active" : ""}`}>Log In</button>
              <button onClick={() => switchMode("signup")} className={`auth-tab ${mode === "signup" ? "active" : ""}`}>Sign Up</button>
            </motion.div>
          )}

          <form className="auth-form" onSubmit={handleFormSubmit}>
            <AnimatePresence mode="popLayout" custom={signupStep}>
              
              {/* === LOGIN MODE === */}
              {mode === "login" && (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={formTransition}
                  style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                >
                  <div className="input-wrapper">
                    <input type="email" placeholder="Email" className="auth-input" required />
                  </div>
                  <div className="input-wrapper">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Password" 
                      className="auth-input" 
                      required 
                    />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="auth-button" type="submit">
                    <motion.div 
                       className="shimmer-effect"
                       animate={{ left: ["-100%", "200%"] }}
                       transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: 1 }}
                    />
                    <span>Log In</span>
                    <ArrowRight size={18} />
                  </motion.button>
                </motion.div>
              )}

              {/* === SIGNUP MODE: STEP 1 (Details) === */}
              {mode === "signup" && signupStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={formTransition}
                  style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                >
                  <input type="text" placeholder="Full Name" className="auth-input" required />
                  <input type="email" placeholder="Email Address" className="auth-input" required />
                  
                  <div className="input-wrapper">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Password" 
                      className="auth-input" 
                      required 
                    />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div className="input-wrapper">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Confirm Password" 
                      className="auth-input" 
                      required 
                    />
                    <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="auth-button" type="submit">
                    <span>Continue</span>
                    <ArrowRight size={18} />
                  </motion.button>
                </motion.div>
              )}

              {/* === SIGNUP MODE: STEP 2 (OTP) === */}
              {mode === "signup" && signupStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={formTransition}
                  style={{ display: 'flex', flexDirection: 'column', gap: 20, textAlign: 'center' }}
                >
                  <div style={{ color: '#86868B', fontSize: '14px' }}>
                    <ShieldCheck size={48} color="#AF52DE" style={{ marginBottom: 10, display: 'block', margin: '0 auto' }} />
                    Enter the 4-digit code sent to your email.
                  </div>
                  
                  <div className="otp-container">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        className="otp-input"
                        value={data}
                        onChange={(e) => handleOtpChange(e.target, index)}
                        onFocus={(e) => e.target.select()}
                      />
                    ))}
                  </div>

                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="auth-button" type="submit">
                    <span>Verify Code</span>
                    <ArrowRight size={18} />
                  </motion.button>
                  
                  <span 
                    onClick={() => setSignupStep(1)} 
                    style={{ fontSize: '13px', color: '#AF52DE', cursor: 'pointer', marginTop: '10px' }}
                  >
                    Back to details
                  </span>
                </motion.div>
              )}

              {/* === SIGNUP MODE: STEP 3 (Username) === */}
              {mode === "signup" && signupStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={formTransition}
                  style={{ display: 'flex', flexDirection: 'column', gap: 20, textAlign: 'center' }}
                >
                  <User size={48} color="#AF52DE" style={{ margin: '0 auto' }} />
                  
                  <div className="input-wrapper">
                    <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#86868B', fontWeight: 'bold' }}>@</span>
                    <input 
                      type="text" 
                      placeholder="username" 
                      className="auth-input" 
                      style={{ paddingLeft: 35 }}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required 
                    />
                  </div>

                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="auth-button" type="submit">
                    <motion.div 
                       className="shimmer-effect"
                       animate={{ left: ["-100%", "200%"] }}
                       transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: 1 }}
                    />
                    <span>Enter App</span>
                    <Check size={18} />
                  </motion.button>
                </motion.div>
              )}

            </AnimatePresence>
          </form>

          {/* Bottom Switch Text (Only for Login or Step 1) */}
          {(mode === "login" || (mode === "signup" && signupStep === 1)) && (
            <motion.p className="auth-switch-text" variants={itemVariants}>
              {mode === "login" ? (
                <>Don’t have an account? <span onClick={() => switchMode("signup")} className="auth-switch-link">Sign Up</span></>
              ) : (
                <>Already have an account? <span onClick={() => switchMode("login")} className="auth-switch-link">Log In</span></>
              )}
            </motion.p>
          )}

        </motion.div>
      </div>
    </>
  );
}