import React, { Component, ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AskBaseLogo } from './AskBaseLogo';
import { FloatingUI } from './FloatingUI';
import { AuthModal } from './AuthModal';
import { Scene } from './3d/Scene';

class SceneErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
 constructor(props: { children: ReactNode }) {
 super(props);
 this.state = { hasError: false };
 }

 static getDerivedStateFromError() {
 return { hasError: true };
 }

 componentDidCatch(error: any, errorInfo: any) {
 console.warn("WebGL Scene render error (fallback to 2D background):", error, errorInfo);
 }

 render() {
 if (this.state.hasError) {
 return (
 <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-white via-[#CB2958]/5 to-white" />
 );
 }
 return this.props.children;
 }
}

export default function LandingPage() {
 const navigate = useNavigate();
 const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
 const [scrollProgress, setScrollProgress] = useState(0);

 useEffect(() => {
 const handleScroll = () => {
 const scrolled = window.scrollY;
 const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
 const progress = maxScroll > 0 ? Math.min(Math.max(scrolled / maxScroll, 0), 1) : 0;
 setScrollProgress(progress);
 };
 window.addEventListener('scroll', handleScroll, { passive: true });
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 const getStageFromScroll = (progress: number): 'hero' | 'understanding' | 'features' | 'about' => {
 if (progress < 0.25) return 'hero';
 if (progress < 0.50) return 'understanding';
 if (progress < 0.75) return 'features';
 return 'about';
 };

 const activeStage = getStageFromScroll(scrollProgress);

 const handleStageSelect = (stage: 'hero' | 'understanding' | 'features' | 'about') => {
 const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
 let targetProgress = 0;
 if (stage === 'understanding') targetProgress = 0.33;
 if (stage === 'features') targetProgress = 0.66;
 if (stage === 'about') targetProgress = 1.0;

 window.scrollTo({
 top: maxScroll * targetProgress,
 behavior: 'smooth',
 });
 };

 return (
 <div className="relative min-h-[300vh] bg-white text-[#18181B] selection:bg-[#CB2958]/10 selection:text-[#CB2958] font-sans overflow-x-hidden">
 {/* 3D WebGL Animated Environment */}
 <SceneErrorBoundary>
 <Scene activeStage={activeStage} scrollProgress={scrollProgress} />
 </SceneErrorBoundary>

 {/* Top Navigation */}
 <motion.nav
 initial={{ y: -20, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 className="fixed top-0 w-full z-50 h-20 px-8 flex items-center justify-between pointer-events-none"
 >
 <div className="flex items-center gap-4 pointer-events-auto">
 <AskBaseLogo size={40} className="rounded-full shadow-md" />
 <span className="font-black tracking-tighter text-2xl uppercase">AskBase</span>
 </div>

 <div className="flex items-center gap-4 pointer-events-auto">
 <button
 type="button"
 onClick={() => setAuthModal('login')}
 className="rounded-full border border-[#E4E4E7] bg-white/70 backdrop-blur-md px-7 h-11 text-[11px] font-black uppercase tracking-[0.2em] text-[#71717A] hover:text-[#18181B] transition-all hover:scale-105 cursor-pointer shadow-sm"
 >
 Log in
 </button>
 <button
 type="button"
 onClick={() => setAuthModal('signup')}
 className="bg-[#18181B] hover:bg-black text-white rounded-full px-8 h-11 text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-xl cursor-pointer"
 >
 Sign up
 </button>
 </div>
 </motion.nav>

 {/* Floating Interactive UI Overlay */}
 <FloatingUI
 activeStage={activeStage}
 onStageSelect={handleStageSelect}
 onStartFree={() => setAuthModal('signup')}
 onExploreDemo={() => setAuthModal('login')}
 />

 {/* Auth Modal (Login / Sign Up) */}
 <AnimatePresence>
 {authModal && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[100]"
 >
 <AuthModal
 type={authModal}
 onClose={() => setAuthModal(null)}
 onSuccess={() => { setAuthModal(null); navigate('/home'); }}
 onSwitch={(type: 'login' | 'signup') => setAuthModal(type)}
 />
 </motion.div>
 )}
 </AnimatePresence>

 {/* Background Grid */}
 <div
 className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
 style={{
 backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
 backgroundSize: '40px 40px'
 }}
 />
 </div>
 );
}
