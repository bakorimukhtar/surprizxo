import React, { useState, useEffect } from "react";
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useTransform, 
  useSpring 
} from "framer-motion";
import { 
  // Icons grouped by category
  Sparkles, Gift, Eye, EyeOff, ArrowRight, Check, ShieldCheck, 
  User, ChevronLeft, Calendar, Smartphone, Mail, AlertCircle,
  Home, Heart, ShoppingBag, Plus, MessageCircle, Settings, 
  LogOut, Bell, Shield, CircleUser, ChevronRight, Edit3
} from "lucide-react"; 

// --- STYLES ---
const styles = `
  :root {
    --ios-text-primary: #1D1D1F;
    --ios-text-secondary: #86868B;
    --brand-gradient: linear-gradient(135deg, #FF2D55 0%, #AF52DE 100%);
    --brand-pink: #FF2D55;
    --brand-purple: #AF52DE;
    --glass-border: rgba(255, 255, 255, 0.4);
    --glass-bg: rgba(255, 255, 255, 0.65);
    --input-bg: rgba(235, 235, 245, 0.5);
    --focus-ring: rgba(175, 82, 222, 0.3);
    --success-green: #34C759;
    --warn-orange: #FF9500;
    --error-red: #FF3B30;
    --app-bg: #F5F5F7;
    --max-app-width: 480px; /* Standardize max width */
  }

  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    background-color: var(--app-bg);
    /* Ensure background covers full screen on desktop */
    min-height: 100vh;
    display: flex;
    justify-content: center;
    background: #F2F2F7; 
  }

  /* --- GLOBAL ANIMATIONS & BACKGROUNDS --- */
  .aurora-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.5;
    z-index: 0;
    pointer-events: none;
    animation: auroraFloat 20s infinite alternate ease-in-out;
  }
  .orb-1 { top: -10%; left: -10%; width: 60vw; height: 60vw; background: radial-gradient(circle, #E0F7FA, #E1BEE7); }
  .orb-2 { bottom: -10%; right: -10%; width: 50vw; height: 50vw; background: radial-gradient(circle, #F3E5F5, #FFCDD2); animation-delay: -5s; }
  .orb-3 { top: 40%; left: 40%; width: 40vw; height: 40vw; background: radial-gradient(circle, #E8EAF6, #FFFFFF); opacity: 0.8; animation-delay: -10s; }

  @keyframes auroraFloat {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(30px, -20px) scale(1.05); }
  }

  /* --- AUTH STYLES --- */
  .auth-container {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    position: relative;
    overflow: hidden;
    background: #FBFBFD;
    perspective: 1000px;
    max-width: var(--max-app-width);
    margin: 0 auto;
    box-shadow: 0 0 40px rgba(0,0,0,0.05); /* Shadow for desktop view */
  }

  .auth-card {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 400px;
    background: var(--glass-bg);
    backdrop-filter: blur(30px) saturate(180%);
    -webkit-backdrop-filter: blur(30px) saturate(180%);
    border-radius: 24px;
    padding: 40px 32px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px var(--glass-border) inset;
    transform-style: preserve-3d;
    min-height: 520px;
    display: flex;
    flex-direction: column;
  }

  .auth-header { text-align: center; margin-bottom: 24px; transform: translateZ(20px); position: relative; }
  .auth-title { font-size: 28px; font-weight: 700; color: var(--ios-text-primary); margin: 12px 0 4px; letter-spacing: -0.02em; }
  .auth-subtitle { font-size: 15px; color: var(--ios-text-secondary); font-weight: 400; line-height: 1.4; }
  
  .auth-logo-text {
    font-size: 26px;
    font-weight: 800;
    background: var(--brand-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.02em;
    margin: 0 auto;
    display: inline-block;
  }

  .user-badge {
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 1.5px;
    color: var(--ios-text-secondary);
    font-weight: 500;
    margin-top: 4px;
    opacity: 0.8;
  }

  .back-btn {
    position: absolute; left: 0; top: 0;
    background: none; border: none; cursor: pointer;
    color: var(--ios-text-primary); opacity: 0.6;
    transition: opacity 0.2s;
  }
  .back-btn:hover { opacity: 1; }

  .auth-form { flex: 1; display: flex; flex-direction: column; gap: 16px; transform: translateZ(15px); }
  .input-wrapper { position: relative; width: 100%; }
  
  .auth-input {
    width: 100%; padding: 16px 16px;
    border-radius: 12px; border: 1px solid transparent;
    background: var(--input-bg);
    font-size: 17px; color: var(--ios-text-primary);
    outline: none; transition: all 0.2s;
    box-sizing: border-box;
  }
  .auth-input:focus {
    background: #FFFFFF; border-color: rgba(175, 82, 222, 0.5);
    box-shadow: 0 0 0 4px var(--focus-ring); transform: scale(1.01);
  }

  .strength-bar-container { height: 4px; background: #E5E5EA; border-radius: 2px; margin-top: 8px; overflow: hidden; display: flex; }
  .strength-segment { height: 100%; transition: all 0.3s ease; flex: 1; margin-right: 2px; opacity: 0.3; }
  .strength-segment.active { opacity: 1; }
  .strength-text { font-size: 11px; text-align: right; margin-top: 4px; font-weight: 600; transition: color 0.3s; }

  .age-box {
    background: rgba(255,255,255,0.5); border-radius: 12px; padding: 12px;
    display: flex; align-items: center; gap: 10px; margin-top: 8px;
    border: 1px solid rgba(0,0,0,0.05);
  }
  .age-text { font-size: 14px; font-weight: 500; color: var(--ios-text-primary); }
  .age-sub { font-size: 12px; color: var(--ios-text-secondary); }

  .otp-container { display: flex; gap: 10px; justify-content: center; margin: 10px 0; }
  .otp-input {
    width: 50px; height: 60px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.1);
    background: #FFFFFF; font-size: 24px; font-weight: 700; text-align: center;
    color: var(--ios-text-primary); outline: none; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  .otp-input:focus { border-color: #AF52DE; box-shadow: 0 0 0 4px var(--focus-ring); transform: translateY(-2px); }

  .auth-button {
    margin-top: auto; padding: 16px; border: none; border-radius: 12px;
    background: var(--brand-gradient); color: white; font-weight: 600; font-size: 17px;
    cursor: pointer; width: 100%; box-shadow: 0 4px 12px rgba(175, 82, 222, 0.25);
    position: relative; overflow: hidden; transform: translateZ(20px);
    display: flex; justify-content: center; align-items: center; gap: 8px;
    transition: all 0.2s;
  }
  .auth-button:disabled { background: #C7C7CC; cursor: not-allowed; box-shadow: none; }
  
  .secondary-btn {
    background: transparent; color: #AF52DE; font-size: 14px; font-weight: 600;
    border: none; cursor: pointer; padding: 8px; width: 100%; margin-top: 8px;
  }
  .secondary-btn:hover { text-decoration: underline; }

  .password-toggle {
    position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: var(--ios-text-secondary);
  }
  .switch-link { color: #AF52DE; cursor: pointer; font-weight: 600; margin-left: 5px; }

  /* --- DASHBOARD & PROFILE STYLES --- */
  .dashboard-container {
    width: 100%;
    min-height: 100vh;
    background: #FBFBFD;
    display: flex;
    flex-direction: column;
    padding-bottom: 80px; /* Space for navbar */
    max-width: var(--max-app-width);
    margin: 0 auto;
    position: relative;
    box-shadow: 0 0 40px rgba(0,0,0,0.05); /* Enhanced shadow for desktop */
    overflow-y: auto;
    overflow-x: hidden;
  }

  .dash-header {
    padding: 20px 20px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 5;
  }
  
  .chat-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255,255,255,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid rgba(0,0,0,0.05);
    color: #1D1D1F;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    cursor: pointer;
    transition: all 0.2s;
  }
  .chat-btn:active { transform: scale(0.95); }

  .section-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--ios-text-primary);
    margin: 20px 20px 10px;
    position: relative;
    z-index: 5;
  }

  /* Wishlist Horizontal Scroll */
  .wishlist-scroll {
    display: flex;
    overflow-x: auto;
    padding: 10px 20px;
    gap: 15px;
    scrollbar-width: none; 
    position: relative;
    z-index: 5;
    /* Ensure scrolling feels native */
    -webkit-overflow-scrolling: touch;
  }
  .wishlist-scroll::-webkit-scrollbar { display: none; }
  
  .wishlist-item {
    flex-shrink: 0;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .wishlist-item:active { transform: scale(0.95); }

  .wish-circle {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: 3px solid #FF2D55;
    padding: 3px;
    background: rgba(255,255,255,0.9);
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  }
  .wish-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
  .wish-price-tag {
    margin-top: -10px;
    background: var(--ios-text-primary);
    color: white;
    font-size: 11px;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 12px;
    z-index: 2;
  }

  /* Banner */
  .promo-banner {
    margin: 10px 20px;
    background: var(--brand-gradient);
    border-radius: 20px;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    box-shadow: 0 10px 25px rgba(175, 82, 222, 0.3);
    position: relative;
    z-index: 5;
    cursor: pointer;
  }
  .banner-content h3 { margin: 0; font-size: 20px; width: 60%; line-height: 1.2; font-weight: 700; }
  .banner-icon { font-size: 24px; font-weight: 800; opacity: 0.9; }

  /* Main Card */
  .main-card {
    margin: 10px 20px;
    background: var(--glass-bg);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid var(--glass-border);
    border-radius: 24px;
    padding: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    position: relative;
    z-index: 5;
  }
  .card-img-container {
    background: #FFFFFF;
    border-radius: 18px;
    height: 220px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
  }
  .card-img {
    max-height: 85%;
    max-width: 85%;
    object-fit: contain;
    mix-blend-mode: multiply;
  }
  .card-price {
    position: absolute;
    top: 12px;
    right: 12px;
    background: #FF2D55;
    color: white;
    font-weight: 700;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 14px;
    box-shadow: 0 4px 10px rgba(255, 45, 85, 0.3);
  }
  .card-actions {
    display: flex;
    gap: 10px;
    margin-top: 15px;
  }
  .btn-action {
    flex: 1;
    border: none;
    border-radius: 14px;
    padding: 14px;
    color: white;
    font-weight: 600;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .btn-action:active { transform: scale(0.98); }
  .btn-pink { background: var(--brand-pink); box-shadow: 0 4px 12px rgba(255, 45, 85, 0.2); }
  .btn-purple { background: var(--ios-text-primary); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

  /* Navbar */
  .navbar {
    position: fixed;
    bottom: 0;
    left: 0; 
    right: 0;
    margin: 0 auto;
    max-width: var(--max-app-width);
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-top: 1px solid rgba(255,255,255,0.5);
    height: 70px;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 -5px 20px rgba(0,0,0,0.05);
    padding-bottom: 10px; 
    z-index: 50;
  }
  .nav-item {
    color: #86868B;
    opacity: 0.8;
    cursor: pointer;
    transition: 0.2s;
    padding: 10px; /* Better touch target */
  }
  .nav-item.active {
    color: #AF52DE;
    opacity: 1;
  }
  .fab-add {
    width: 56px;
    height: 56px;
    border-radius: 20px;
    background: var(--brand-gradient);
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    margin-top: -30px;
    box-shadow: 0 10px 20px rgba(175, 82, 222, 0.3);
    transform: rotate(0deg);
    transition: transform 0.2s;
    cursor: pointer;
  }
  .fab-add:active { transform: scale(0.95); }

  /* PROFILE SPECIFIC */
  .profile-header {
    display: flex; flex-direction: column; align-items: center;
    margin-bottom: 24px; position: relative; z-index: 5;
    padding-top: 20px;
  }
  .profile-avatar {
    width: 100px; height: 100px; border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 10px 20px rgba(175, 82, 222, 0.3);
    margin-bottom: 12px;
    object-fit: cover;
  }
  .profile-name { font-size: 22px; font-weight: 800; color: var(--ios-text-primary); }
  .profile-handle { font-size: 14px; color: var(--ios-text-secondary); margin-top: 2px; }

  .stats-row {
    display: flex; justify-content: space-around; width: 100%;
    margin-bottom: 24px;
    padding: 0 20px;
  }
  .stat-item { text-align: center; }
  .stat-val { font-size: 18px; font-weight: 700; color: var(--ios-text-primary); }
  .stat-label { font-size: 12px; color: var(--ios-text-secondary); }

  .menu-list {
    display: flex; flex-direction: column; gap: 12px; width: 100%;
    padding: 0 20px 20px;
  }
  .menu-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px; background: rgba(255,255,255,0.6);
    border-radius: 16px; cursor: pointer; transition: 0.2s;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.4);
  }
  .menu-item:active { background: rgba(255,255,255,0.9); transform: scale(0.98); }
  .menu-left { display: flex; align-items: center; gap: 12px; color: var(--ios-text-primary); font-weight: 600; font-size: 15px; }
  .menu-icon-box {
    width: 36px; height: 36px; border-radius: 10px;
    background: white; display: flex; align-items: center; justify-content: center;
    color: #AF52DE;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  .logout-btn {
    color: var(--error-red);
  }

  /* Responsive Adjustments for Desktop */
  @media (min-width: 768px) {
    /* When on desktop, we show a nice background outside the app container */
    body {
       background-image: radial-gradient(#F3E5F5 2px, transparent 2px);
       background-size: 32px 32px;
       background-color: #F8F8FA;
    }
  }
`;

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const formTransition = { type: "spring", stiffness: 300, damping: 30 };

// --- AUTH COMPONENT ---
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState(1);
  const [signupMethod, setSignupMethod] = useState('phone');
  
  // Form State
  const [formData, setFormData] = useState({
    username: '', password: '', confirmPassword: '', birthday: '', phone: '', email: '', otp: ['', '', '', '']
  });
  
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [age, setAge] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // 3D Motion Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set((clientX - left) / width - 0.5);
    y.set((clientY - top) / height - 0.5);
  }
  function handleMouseLeave() { x.set(0); y.set(0); }

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-7, 7]);
  const logoX = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);
  const logoY = useTransform(mouseY, [-0.5, 0.5], [-15, 15]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') {
      let score = 0;
      if (value.length >= 8) score++;
      if (/[A-Z]/.test(value)) score++;
      if (/[0-9]/.test(value)) score++;
      if (/[^A-Za-z0-9]/.test(value)) score++;
      setPasswordStrength(score);
    }
    if (name === 'birthday') {
      const birthDate = new Date(value);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) calculatedAge--;
      setAge(calculatedAge);
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...formData.otp];
    newOtp[index] = element.value;
    setFormData({ ...formData, otp: newOtp });
    if (element.nextSibling && element.value) element.nextSibling.focus();
  };

  const isStepValid = () => {
    if (mode === 'login') return true; 
    switch (step) {
      case 1: return /^[a-zA-Z0-9_]{4,20}$/.test(formData.username);
      case 2: return passwordStrength >= 3 && formData.password === formData.confirmPassword;
      case 3: return formData.birthday && age >= 18;
      case 4: return signupMethod === 'phone' ? formData.phone.length > 9 : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      case 5: return formData.otp.every(digit => digit !== '');
      default: return false;
    }
  };

  const handleNext = () => {
    if (isStepValid()) {
      if (step === 4) setStep(5);
      else if (step === 5) {
        onLogin();
      } else setStep(step + 1);
    }
  };

  return (
    <div className="auth-container" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {/* Background Orbs inside container for clipped effect */}
      <div className="aurora-orb orb-1"></div>
      <div className="aurora-orb orb-2"></div>
      <div className="aurora-orb orb-3"></div>

      <motion.div className="auth-card" variants={containerVariants} initial="hidden" animate="visible" style={{ rotateX, rotateY }}>
        <div className="auth-header">
          {(mode === 'signup' && step > 1) || (mode === 'signup' && step === 1) ? (
            <button onClick={() => step > 1 ? setStep(step - 1) : setMode("login")} className="back-btn"><ChevronLeft size={28} /></button>
          ) : null}
          <motion.div style={{ x: logoX, y: logoY, margin: '0 auto', textAlign: 'center' }} whileHover={{ scale: 1.05 }}>
             <h1 className="auth-logo-text">SURPRIZXO</h1>
          </motion.div>
          {mode === 'signup' && step > 1 && formData.username && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="user-badge">@{formData.username}</motion.div>}
          <motion.h1 className="auth-title" key={step}>{mode === 'login' ? "Welcome Back" : (step === 5 ? "Verification" : "Sign Up")}</motion.h1>
          <motion.p className="auth-subtitle" key={`${step}-sub`}>{mode === 'login' ? "Login to continue gifting." : (step === 5 ? `Enter the code sent to your ${signupMethod}.` : "Create your account.")}</motion.p>
        </div>

        <div className="auth-form">
          <AnimatePresence mode="popLayout" custom={step}>
            {/* Login View */}
            {mode === 'login' && (
              <motion.div key="login" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}} transition={formTransition} style={{display:'flex', flexDirection:'column', gap:16}}>
                 <input type="email" placeholder="Email" className="auth-input" />
                 <div className="input-wrapper">
                   <input type={showPassword ? "text" : "password"} placeholder="Password" className="auth-input" />
                   <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                 </div>
                 <button className="auth-button" onClick={onLogin}>Log In <ArrowRight size={18} /></button>
                 <p style={{textAlign:'center', color:'#86868B', fontSize:14, marginTop:10}}>Don't have an account? <span onClick={() => { setMode('signup'); setStep(1); }} className="switch-link">Sign Up</span></p>
              </motion.div>
            )}
            
            {/* Signup Steps */}
            {mode === 'signup' && step === 1 && (
              <motion.div key="step1" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} transition={formTransition} style={{display:'flex', flexDirection:'column', gap:16}}>
                <div className="input-wrapper">
                  <User size={20} color="#86868B" style={{position:'absolute', left:16, top:16}} />
                  <input name="username" value={formData.username} onChange={handleInputChange} placeholder="Username" className="auth-input" style={{paddingLeft: 44}} />
                  {isStepValid() && <Check size={20} color="#34C759" style={{position:'absolute', right:16, top:16}} />}
                </div>
              </motion.div>
            )}
             
            {mode === 'signup' && step === 2 && (
              <motion.div key="step2" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} transition={formTransition} style={{display:'flex', flexDirection:'column', gap:16}}>
                <div className="input-wrapper">
                  <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} placeholder="Password" className="auth-input" />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="strength-bar-container">
                    <div className={`strength-segment ${passwordStrength >= 1 ? 'active' : ''}`} style={{background: 'var(--error-red)'}} />
                    <div className={`strength-segment ${passwordStrength >= 3 ? 'active' : ''}`} style={{background: 'var(--warn-orange)'}} />
                    <div className={`strength-segment ${passwordStrength >= 4 ? 'active' : ''}`} style={{background: 'var(--success-green)'}} />
                </div>
                <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm Password" className="auth-input" />
              </motion.div>
            )}

            {mode === 'signup' && step === 3 && (
              <motion.div key="step3" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} transition={formTransition} style={{display:'flex', flexDirection:'column', gap:16}}>
                  <div className="input-wrapper"><input type="date" name="birthday" value={formData.birthday} onChange={handleInputChange} className="auth-input" /></div>
                  {age !== null && <div className="age-box" style={{ borderColor: age < 18 ? 'var(--error-red)' : 'var(--success-green)' }}><div className="age-text">You are {age} years old</div></div>}
              </motion.div>
            )}

            {mode === 'signup' && step === 4 && (
              <motion.div key="step4" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} transition={formTransition} style={{display:'flex', flexDirection:'column', gap:16}}>
                {signupMethod === 'phone' ? (
                  <div style={{display:'flex', gap:10}}><div className="auth-input" style={{width:80}}>+234</div><input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="auth-input" /></div>
                ) : (
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="auth-input" placeholder="Email" />
                )}
                <button type="button" className="secondary-btn" onClick={() => setSignupMethod(signupMethod === 'phone' ? 'email' : 'phone')}>Switch Method</button>
              </motion.div>
            )}

            {mode === 'signup' && step === 5 && (
              <motion.div key="step5" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} transition={formTransition} style={{display:'flex', flexDirection:'column', gap:20, alignItems:'center'}}>
                <ShieldCheck size={48} color="#AF52DE" />
                <div className="otp-container">{formData.otp.map((digit, i) => <input key={i} type="text" maxLength={1} value={digit} onChange={(e) => handleOtpChange(e.target, i)} className="otp-input" />)}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {mode === 'signup' && (
          <div style={{ marginTop: '20px' }}>
            <button onClick={handleNext} disabled={!isStepValid()} className="auth-button">
              {step === 5 ? "Complete Signup" : "Next"} <ArrowRight size={18} />
            </button>
            {step === 1 && <p style={{textAlign:'center', color:'#86868B', fontSize:14, marginTop:10}}>Already have an account? <span onClick={() => setMode('login')} className="switch-link">Log In</span></p>}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// --- HOME/PROFILE COMPONENT ---
function HomePage({ onLogout }) {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'profile'
  
  const wishlistItems = [
    { id: 1, price: "$18.90", img: "https://images.unsplash.com/photo-1544155843-d9d10e08f23f?auto=format&fit=crop&q=80&w=200" }, 
    { id: 2, price: "$19.90", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=200" }, 
    { id: 3, price: "$18.90", img: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=200" }, 
    { id: 4, price: "$15.00", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=200" }, 
    { id: 5, price: "$22.00", img: "https://images.unsplash.com/photo-1576594496020-534bf2437b21?auto=format&fit=crop&q=80&w=200" }, 
  ];

  return (
    <motion.div 
      className="dashboard-container"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Aurora effects now within dashboard too for seamless transition */}
      <div className="aurora-orb orb-1" style={{ top: '-15%', left: '-15%' }}></div>
      <div className="aurora-orb orb-2" style={{ bottom: '-5%', right: '-15%', opacity: 0.4 }}></div>

      {/* === CONTENT SWITCHER === */}
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: HOME */}
        {activeTab === 'home' && (
          <motion.div key="home" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.2}} style={{paddingBottom: 20}}>
            <div className="dash-header">
              <h1 className="auth-logo-text" style={{ fontSize: 24, margin: 0 }}>Surprizxo</h1>
              <button className="chat-btn">
                <MessageCircle size={20} />
              </button>
            </div>

            <h2 className="section-title">My Wishlist</h2>
            <div className="wishlist-scroll">
              {wishlistItems.map((item) => (
                <div key={item.id} className="wishlist-item">
                  <div className="wish-circle">
                    <img src={item.img} alt="Wishlist Item" className="wish-img" />
                  </div>
                  <div className="wish-price-tag">{item.price}</div>
                </div>
              ))}
            </div>

            <div className="promo-banner">
              <div className="banner-content">
                <h3>Upcoming Moments</h3>
              </div>
              <div className="banner-icon">
                <Gift size={32} />
              </div>
            </div>

            <div className="main-card">
              <div className="card-img-container">
                <div className="card-price">$19.90</div>
                <img 
                  src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=500" 
                  alt="Product" 
                  className="card-img" 
                />
              </div>
              <div className="card-actions">
                 <button className="btn-action btn-pink">
                   <Plus size={18} /> Add to Wishlist
                 </button>
                 <button className="btn-action btn-purple">
                   <Gift size={18} /> Send as Gift
                 </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: PROFILE */}
        {activeTab === 'profile' && (
          <motion.div key="profile" initial={{opacity:0, x: 20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} transition={{duration:0.3}} style={{paddingBottom: 20}}>
            <div className="profile-header">
               {/* Updated to a reliable Unsplash image */}
               <img src="https://unsplash.com/photos/man-in-white-crew-neck-shirt-wearing-black-framed-eyeglasses-C8Ta0gwPbQg" alt="Avatar" className="profile-avatar" />
               <div className="profile-name">Mukhtar Abdullahi</div>
               <div className="profile-handle">@bakori</div>
               <button className="chat-btn" style={{position:'absolute', top: 20, right: 20}}>
                 <Edit3 size={18} />
               </button>
            </div>

            <div className="stats-row">
              <div className="stat-item">
                <div className="stat-val">12</div>
                <div className="stat-label">Wishlist</div>
              </div>
              <div className="stat-item">
                <div className="stat-val">5</div>
                <div className="stat-label">Gifts Sent</div>
              </div>
              <div className="stat-item">
                <div className="stat-val">28</div>
                <div className="stat-label">Friends</div>
              </div>
            </div>

            <div className="menu-list">
              <div className="menu-item">
                <div className="menu-left">
                  <div className="menu-icon-box"><Settings size={20} /></div>
                  Account Settings
                </div>
                <ChevronRight size={20} color="#C7C7CC" />
              </div>
              <div className="menu-item">
                <div className="menu-left">
                  <div className="menu-icon-box"><Bell size={20} /></div>
                  Notifications
                </div>
                <ChevronRight size={20} color="#C7C7CC" />
              </div>
              <div className="menu-item">
                <div className="menu-left">
                  <div className="menu-icon-box"><Shield size={20} /></div>
                  Privacy & Security
                </div>
                <ChevronRight size={20} color="#C7C7CC" />
              </div>
              
              <div className="menu-item" onClick={onLogout} style={{marginTop: 10, borderColor: 'rgba(255,59,48,0.2)'}}>
                <div className="menu-left logout-btn">
                  <div className="menu-icon-box" style={{color:'var(--error-red)'}}><LogOut size={20} /></div>
                  Log Out
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* NAVBAR */}
      <div className="navbar">
        <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}><Home size={24} /></div>
        <div className="nav-item"><Heart size={24} /></div>
        <div className="fab-add"><Plus size={28} /></div>
        <div className="nav-item"><ShoppingBag size={24} /></div>
        <div className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}><CircleUser size={24} /></div>
      </div>

    </motion.div>
  );
}

// --- MAIN APP (ROUTER) ---
export default function App() {
  const [currentPage, setCurrentPage] = useState("auth"); // 'auth', 'loading', 'home'

  const handleLogin = () => {
    setCurrentPage("loading");
    setTimeout(() => {
      setCurrentPage("home");
    }, 1500);
  };

  const handleLogout = () => {
    // Show loading briefly then go to auth
    setCurrentPage("loading");
    setTimeout(() => {
      setCurrentPage("auth");
    }, 1000);
  };

  return (
    <>
      <style>{styles}</style>
      <AnimatePresence mode="wait">
        
        {currentPage === "auth" && (
           <motion.div key="auth" exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
              <AuthPage onLogin={handleLogin} />
           </motion.div>
        )}

        {currentPage === "loading" && (
           <motion.div 
             key="loading" 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             exit={{ opacity: 0 }}
             style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FBFBFD' }}
           >
              <div className="aurora-orb orb-1" style={{opacity: 0.3}}></div>
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Sparkles size={48} color="#AF52DE" />
              </motion.div>
              <p style={{ marginTop: 20, color: '#86868B', fontWeight: 500 }}>
                 Loading...
              </p>
           </motion.div>
        )}

        {currentPage === "home" && (
           <HomePage key="home" onLogout={handleLogout} />
        )}

      </AnimatePresence>
    </>
  );
}