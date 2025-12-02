import React, { useState, useEffect } from "react";
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useTransform, 
  useSpring 
} from "framer-motion";
import { 
  Sparkles, Gift, Eye, EyeOff, ArrowRight, Check, 
  ShieldCheck, User, ChevronLeft, Calendar, Smartphone, Mail, AlertCircle 
} from "lucide-react"; 

// NOTE: To use your actual logo locally:
// import logo from "../logo.png"; 

const styles = `
  :root {
    --ios-text-primary: #1D1D1F;
    --ios-text-secondary: #86868B;
    --brand-gradient: linear-gradient(135deg, #FF2D55 0%, #AF52DE 100%);
    --glass-border: rgba(255, 255, 255, 0.4);
    --glass-bg: rgba(255, 255, 255, 0.65);
    --input-bg: rgba(235, 235, 245, 0.5);
    --focus-ring: rgba(175, 82, 222, 0.3);
    --success-green: #34C759;
    --warn-orange: #FF9500;
    --error-red: #FF3B30;
  }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    background-color: #F5F5F7;
  }

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

  .orb-1 { top: -10%; left: -10%; width: 60vw; height: 60vw; background: radial-gradient(circle, #E0F7FA, #E1BEE7); animation-delay: 0s; }
  .orb-2 { bottom: -10%; right: -10%; width: 50vw; height: 50vw; background: radial-gradient(circle, #F3E5F5, #FFCDD2); animation-delay: -5s; }
  .orb-3 { top: 40%; left: 40%; width: 40vw; height: 40vw; background: radial-gradient(circle, #E8EAF6, #FFFFFF); opacity: 0.8; animation-delay: -10s; }

  @keyframes auroraFloat {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(30px, -20px) scale(1.05); }
  }

  /* Glass Card */
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

  /* Header */
  .auth-header { text-align: center; margin-bottom: 24px; transform: translateZ(20px); position: relative; }
  .auth-title { font-size: 28px; font-weight: 700; color: var(--ios-text-primary); margin: 12px 0 4px; letter-spacing: -0.02em; }
  .auth-subtitle { font-size: 15px; color: var(--ios-text-secondary); font-weight: 400; line-height: 1.4; }
  
  /* Top Username Label */
  .user-badge {
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 1.5px;
    color: var(--ios-text-secondary);
    font-weight: 500;
    margin-top: 4px;
    opacity: 0.8;
  }

  /* Back Button */
  .back-btn {
    position: absolute; left: 0; top: 0;
    background: none; border: none; cursor: pointer;
    color: var(--ios-text-primary); opacity: 0.6;
    transition: opacity 0.2s;
  }
  .back-btn:hover { opacity: 1; }

  /* Inputs */
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
  .auth-input.error { border-color: var(--error-red); background: rgba(255, 59, 48, 0.05); }

  /* Password Strength */
  .strength-bar-container { height: 4px; background: #E5E5EA; border-radius: 2px; margin-top: 8px; overflow: hidden; display: flex; }
  .strength-segment { height: 100%; transition: all 0.3s ease; flex: 1; margin-right: 2px; opacity: 0.3; }
  .strength-segment.active { opacity: 1; }
  .strength-text { font-size: 11px; text-align: right; margin-top: 4px; font-weight: 600; transition: color 0.3s; }

  /* Age Calculator Box */
  .age-box {
    background: rgba(255,255,255,0.5); border-radius: 12px; padding: 12px;
    display: flex; align-items: center; gap: 10px; margin-top: 8px;
    border: 1px solid rgba(0,0,0,0.05);
  }
  .age-text { font-size: 14px; font-weight: 500; color: var(--ios-text-primary); }
  .age-sub { font-size: 12px; color: var(--ios-text-secondary); }

  /* OTP */
  .otp-container { display: flex; gap: 10px; justify-content: center; margin: 10px 0; }
  .otp-input {
    width: 50px; height: 60px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.1);
    background: #FFFFFF; font-size: 24px; font-weight: 700; text-align: center;
    color: var(--ios-text-primary); outline: none; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  .otp-input:focus { border-color: #AF52DE; box-shadow: 0 0 0 4px var(--focus-ring); transform: translateY(-2px); }

  /* Buttons */
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
`;

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const formTransition = { type: "spring", stiffness: 300, damping: 30 };

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // 'login' or 'signup'
  
  // Signup Wizard State
  const [step, setStep] = useState(1);
  const [signupMethod, setSignupMethod] = useState('phone'); // 'phone' or 'email'
  
  // Form Data
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    birthday: '',
    phone: '',
    email: '',
    otp: ['', '', '', '']
  });

  // Derived State
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [age, setAge] = useState(null);

  // UI Toggles
  const [showPassword, setShowPassword] = useState(false);
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

  function handleMouseLeave() { x.set(0); y.set(0); }

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-7, 7]);
  const logoX = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);
  const logoY = useTransform(mouseY, [-0.5, 0.5], [-15, 15]);

  // --- LOGIC HANDLERS ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Live Password Logic
    if (name === 'password') {
      let score = 0;
      if (value.length >= 8) score++;
      if (/[A-Z]/.test(value)) score++;
      if (/[0-9]/.test(value)) score++;
      if (/[^A-Za-z0-9]/.test(value)) score++;
      setPasswordStrength(score);
    }

    // Live Birthday Logic
    if (name === 'birthday') {
      const birthDate = new Date(value);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
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

  // Validation
  const isStepValid = () => {
    if (mode === 'login') return true; // simplified for login
    switch (step) {
      case 1: // Username
        return /^[a-zA-Z0-9_]{4,20}$/.test(formData.username);
      case 2: // Password
        return passwordStrength >= 3 && formData.password === formData.confirmPassword;
      case 3: // Birthday
        return formData.birthday && age >= 18;
      case 4: // Contact
        if (signupMethod === 'phone') return formData.phone.length > 9;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      case 5: // OTP
        return formData.otp.every(digit => digit !== '');
      default: return false;
    }
  };

  const nextStep = () => {
    if (isStepValid()) {
      if (step === 4) setStep(5); // Go to OTP
      else if (step === 5) alert("Welcome to Surprizxo!"); // Finish
      else setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
    else setMode("login");
  };

  const getStepTitle = () => {
    if (mode === 'login') return "Welcome Back";
    switch(step) {
      case 1: return "Create Username";
      case 2: return "Create Password";
      case 3: return "Your Birthday";
      case 4: return signupMethod === 'phone' ? "Add Phone" : "Add Email";
      case 5: return "Verification";
      default: return "Sign Up";
    }
  };

  const getStepDesc = () => {
    if (mode === 'login') return "Login to continue gifting.";
    switch(step) {
      case 1: return "Pick a unique username. You can change this later.";
      case 2: return "Secure your account with a strong password.";
      case 3: return "This helps us confirm your age (18+ only).";
      case 4: return `Enter your ${signupMethod} to verify your account.`;
      case 5: return `Enter the code sent to your ${signupMethod}.`;
      default: return "";
    }
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
            {(mode === 'signup' && step > 1) || (mode === 'signup' && step === 1) ? (
              <button onClick={prevStep} className="back-btn">
                <ChevronLeft size={28} />
              </button>
            ) : null}

            <motion.div 
              style={{ x: logoX, y: logoY, width: 48, height: 48, background: '#FFF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
               {hasLocalLogo ? null : <Gift color="#FF2D55" size={24} />}
            </motion.div>

            {/* REQUIREMENT 1: Top Center Username Label */}
            {mode === 'signup' && step > 1 && formData.username && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="user-badge"
              >
                @{formData.username}
              </motion.div>
            )}

            <motion.h1 className="auth-title" key={step}>{getStepTitle()}</motion.h1>
            <motion.p className="auth-subtitle" key={`${step}-sub`}>{getStepDesc()}</motion.p>
          </div>

          {/* Form Area */}
          <div className="auth-form">
            <AnimatePresence mode="popLayout" custom={step}>
              
              {/* === LOGIN === */}
              {mode === 'login' && (
                <motion.div key="login" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}} transition={formTransition} style={{display:'flex', flexDirection:'column', gap:16}}>
                   <input type="email" placeholder="Email" className="auth-input" />
                   <div className="input-wrapper">
                     <input type={showPassword ? "text" : "password"} placeholder="Password" className="auth-input" />
                     <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                     </button>
                   </div>
                   <button className="auth-button" onClick={() => alert("Logging in...")}>Log In <ArrowRight size={18} /></button>
                   <p style={{textAlign:'center', color:'#86868B', fontSize:14, marginTop:10}}>
                     Don't have an account? <span onClick={() => { setMode('signup'); setStep(1); }} className="switch-link">Sign Up</span>
                   </p>
                </motion.div>
              )}

              {/* === STEP 1: USERNAME === */}
              {mode === 'signup' && step === 1 && (
                <motion.div key="step1" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} transition={formTransition} style={{display:'flex', flexDirection:'column', gap:16}}>
                  <div className="input-wrapper">
                    <User size={20} color="#86868B" style={{position:'absolute', left:16, top:16}} />
                    <input 
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Username" 
                      className="auth-input" 
                      style={{paddingLeft: 44}}
                    />
                    {isStepValid() && <Check size={20} color="#34C759" style={{position:'absolute', right:16, top:16}} />}
                  </div>
                  <div style={{fontSize:12, color:'#86868B', paddingLeft:4}}>
                    • Must be unique<br/>• 4-20 characters<br/>• Letters, numbers, underscores
                  </div>
                </motion.div>
              )}

              {/* === STEP 2: PASSWORD === */}
              {mode === 'signup' && step === 2 && (
                <motion.div key="step2" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} transition={formTransition} style={{display:'flex', flexDirection:'column', gap:16}}>
                  <div className="input-wrapper">
                    <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} placeholder="Password" className="auth-input" />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                       {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  
                  {/* Password Strength Bar */}
                  <div>
                    <div className="strength-bar-container">
                      <div className={`strength-segment ${passwordStrength >= 1 ? 'active' : ''}`} style={{background: 'var(--error-red)'}} />
                      <div className={`strength-segment ${passwordStrength >= 3 ? 'active' : ''}`} style={{background: 'var(--warn-orange)'}} />
                      <div className={`strength-segment ${passwordStrength >= 4 ? 'active' : ''}`} style={{background: 'var(--success-green)'}} />
                    </div>
                    <div className="strength-text" style={{
                      color: passwordStrength < 2 ? 'var(--error-red)' : passwordStrength < 4 ? 'var(--warn-orange)' : 'var(--success-green)'
                    }}>
                      {passwordStrength < 2 ? "Weak" : passwordStrength < 4 ? "Fair" : "Strong"}
                    </div>
                  </div>

                  <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm Password" className="auth-input" />
                </motion.div>
              )}

              {/* === STEP 3: BIRTHDAY === */}
              {mode === 'signup' && step === 3 && (
                <motion.div key="step3" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} transition={formTransition} style={{display:'flex', flexDirection:'column', gap:16}}>
                  <div className="input-wrapper">
                    <Calendar size={20} color="#86868B" style={{position:'absolute', left:16, top:16}} />
                    <input type="date" name="birthday" value={formData.birthday} onChange={handleInputChange} className="auth-input" style={{paddingLeft:44}} />
                  </div>

                  {age !== null && (
                    <div className="age-box" style={{ borderColor: age < 18 ? 'var(--error-red)' : 'var(--success-green)' }}>
                      {age < 18 ? <AlertCircle color="var(--error-red)" size={24} /> : <Check color="var(--success-green)" size={24} />}
                      <div>
                        <div className="age-text">You are {age} years old</div>
                        {age < 18 && <div className="age-sub" style={{color:'var(--error-red)'}}>You must be 18+ to sign up.</div>}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* === STEP 4: CONTACT === */}
              {mode === 'signup' && step === 4 && (
                <motion.div key="step4" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} transition={formTransition} style={{display:'flex', flexDirection:'column', gap:16}}>
                   {signupMethod === 'phone' ? (
                     <div style={{display:'flex', gap:10}}>
                       <div className="auth-input" style={{width:80, textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center'}}>🇳🇬 +234</div>
                       <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="80 123 4567" className="auth-input" />
                     </div>
                   ) : (
                     <div className="input-wrapper">
                       <Mail size={20} color="#86868B" style={{position:'absolute', left:16, top:16}} />
                       <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="name@example.com" className="auth-input" style={{paddingLeft:44}} />
                     </div>
                   )}
                   
                   <button type="button" className="secondary-btn" onClick={() => setSignupMethod(signupMethod === 'phone' ? 'email' : 'phone')}>
                     {signupMethod === 'phone' ? "Sign up with email instead" : "Sign up with phone instead"}
                   </button>
                </motion.div>
              )}

              {/* === STEP 5: OTP === */}
              {mode === 'signup' && step === 5 && (
                 <motion.div key="step5" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} transition={formTransition} style={{display:'flex', flexDirection:'column', gap:20, alignItems:'center'}}>
                    <ShieldCheck size={48} color="#AF52DE" />
                    <div className="otp-container">
                      {formData.otp.map((digit, i) => (
                        <input key={i} type="text" maxLength={1} value={digit} onChange={(e) => handleOtpChange(e.target, i)} className="otp-input" />
                      ))}
                    </div>
                 </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Actions (Signup Only) */}
          {mode === 'signup' && (
            <div style={{ marginTop: '20px' }}>
              <button 
                onClick={nextStep} 
                disabled={!isStepValid()} 
                className="auth-button"
              >
                {step === 5 ? "Complete Signup" : "Next"} <ArrowRight size={18} />
              </button>
              
              {step === 1 && (
                <p style={{textAlign:'center', color:'#86868B', fontSize:14, marginTop:10}}>
                   Already have an account? <span onClick={() => setMode('login')} className="switch-link">Log In</span>
                </p>
              )}
            </div>
          )}

        </motion.div>
      </div>
    </>
  );
}