import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Home, Shield, Globe, FileText, BarChart3, Bot, Hospital, ArrowRight, Activity, User, Stethoscope, X } from 'lucide-react';
import ScrollFeatureSection from '../components/ScrollFeatureSection';
import HowItWorks from '../components/landing/HowItWorks';
import BenefitsSection from '../components/landing/BenefitsSection';
import TechInfrastructure from '../components/landing/TechInfrastructure';
import ProfessionalFooter from '../components/landing/ProfessionalFooter';

import { useTheme } from '../store/ThemeContext';

const Landing = () => {
    console.log('Landing: Rendering');
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isDarkMode, toggleDarkMode } = useTheme();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-x-hidden selection:bg-blue-200 transition-colors duration-300">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 md:px-12 h-20 flex items-center justify-between transition-all">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-700/20">
                        <Activity size={24} />
                    </div>
                    <span className="font-serif text-2xl font-bold tracking-tight text-blue-800 dark:text-blue-400">
                        Medi<span className="text-teal-600 dark:text-teal-400">Vault</span>
                    </span>
                </div>
                
                {/* Desktop Navigation */}
                <ul className="hidden md:flex items-center gap-8 font-medium text-slate-600 dark:text-slate-300">
                    <li>
                        <button 
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600 dark:border-blue-400 pb-1"
                        >
                        
                        </button>
                    </li>
                    <li><a href="#features" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">Features</a></li>
                    <li><a href="#roles" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">For You</a></li>
                    <li><a href="#about" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">About</a></li>
                </ul>

                <div className="flex items-center gap-3 md:gap-4">
                    {/* Theme Toggle Button */}
                    <motion.button 
                        whileTap={{ scale: 0.9, rotate: 90 }}
                        onClick={toggleDarkMode}
                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                    >
                        {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-blue-600" />}
                    </motion.button>

                    <button 
                        onClick={() => navigate('/auth')} 
                        className="hidden sm:inline-flex px-5 py-2.5 rounded-lg border-2 border-blue-700 dark:border-blue-500 text-blue-700 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                        Sign In
                    </button>
                    <button 
                        onClick={() => navigate('/auth')} 
                        className="hidden md:inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg shadow-blue-700/30 transition-all hover:-translate-y-0.5"
                    >
                        Get Started
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button 
                        className="md:hidden p-2 text-slate-600 dark:text-slate-300"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={28} /> : <Activity size={28} className="rotate-90" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation Dropdown */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                        <ul className="p-6 flex flex-col gap-4 font-medium">
                            <li><button onClick={() => { setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-blue-600 dark:text-blue-400">Home</button></li>
                            <li><a href="#features" onClick={() => setIsMenuOpen(false)} className="block py-2">Features</a></li>
                            <li><a href="#roles" onClick={() => setIsMenuOpen(false)} className="block py-2">For You</a></li>
                            <li><a href="#about" onClick={() => setIsMenuOpen(false)} className="block py-2">About</a></li>
                            <li className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button onClick={() => navigate('/auth')} className="w-full py-3 bg-blue-700 text-white rounded-xl font-bold">Get Started</button>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>

            <main>
                {/* Hero Section */}
                <section className="hero-background-wrapper">
                  <div className="hero-background-content px-6 md:px-12 pt-24 pb-20 md:pt-32 md:pb-32 max-w-7xl mx-auto flex flex-col items-center text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-8 border border-blue-200 dark:border-blue-800"
                    >
                        <Shield size={16} className="text-blue-600" />
                        India's Most Trusted Digital Health Record System
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-serif font-bold text-slate-900 dark:text-white leading-tight md:leading-[1.1] max-w-4xl"
                    >
                        Your Health Records, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-teal-500">
                            Secure & Accessible
                        </span><br />
                        Anywhere
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed"
                    >
                        MediVault empowers patients to own their medical history while giving doctors instant, consent-based access from any registered hospital across India.
                    </motion.p>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-10 flex flex-col sm:flex-row items-center gap-4"
                    >
                        <button 
                            onClick={() => navigate('/auth')} 
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-blue-700/30 transition-all hover:-translate-y-1 text-lg"
                        >
                             Get Started 
                        </button>
                        <button 
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} 
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-blue-700 dark:text-blue-400 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-lg"
                        >
                            Learn More <ArrowRight size={20} />
                        </button>
                    </motion.div>

                    {/* Stats Row */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-20 w-full max-w-5xl bg-white dark:bg-slate-900/60 backdrop-blur-md rounded-2xl md:rounded-full border border-slate-200 dark:border-slate-800 shadow-sm p-8 md:p-0 md:h-32 flex flex-col md:flex-row items-center divide-y-2 md:divide-y-0 md:divide-x-2 divide-slate-100 dark:divide-slate-800"
                    >
                        <div className="flex-1 py-4 md:py-0 text-center w-full">
                            <div className="font-serif text-4xl font-bold text-blue-700 dark:text-blue-400">2.4M+</div>
                            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Patients Registered</div>
                        </div>
                        <div className="flex-1 py-4 md:py-0 text-center w-full">
                            <div className="font-serif text-4xl font-bold text-teal-600 dark:text-teal-400">18K+</div>
                            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Verified Doctors</div>
                        </div>
                        <div className="flex-1 py-4 md:py-0 text-center w-full">
                            <div className="font-serif text-4xl font-bold text-blue-700 dark:text-blue-400">3,200+</div>
                            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Partner Hospitals</div>
                        </div>
                        <div className="flex-1 py-4 md:py-0 text-center w-full">
                            <div className="font-serif text-4xl font-bold text-teal-600 dark:text-teal-400">99.9%</div>
                            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Uptime SLA</div>
                        </div>
                    </motion.div>
                  </div>
                </section>

                {/* Features Section */}
                <ScrollFeatureSection />

                {/* New NDHP Sections */}
                <HowItWorks />
                <BenefitsSection />
                <TechInfrastructure />

                {/* Roles CTA (For You) */}
                <section id="roles" className="py-24 bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-900/20"></div>
                    <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
                        <div className="mb-4 text-sm font-bold tracking-widest text-blue-400 uppercase">Built For Everyone</div>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Choose Your Role & Get Started</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto mb-16 text-lg">Whether you are a patient looking to manage your health, or an administrator overseeing a sprawling hospital network.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
{[
                                { title: "Patient", desc: "Own and manage your medical records.", btn: " Login", icon: "user" },
                                { title: "Doctor", desc: "Access patient history & add diagnoses.", btn: " Login", icon: "stethoscope" },
                                { title: "Hospital Admin", desc: "Manage doctors, patients & reports.", btn: " Login", icon: "hospital" },
                                { title: "System Admin", desc: "Oversee the entire platform & hospitals.", btn: " Login", icon: "shield" }
                            ].map((role, idx) => (
                                <div key={idx} onClick={() => navigate('/auth')} className={`bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-blue-500 cursor-pointer transition-all hover:-translate-y-2 group flex flex-col ${!role.icon ? 'pt-20' : ''}`}>
<div className="mx-auto w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-slate-600/30">
  {role.icon === 'user' ? <User className="w-12 h-12 text-slate-300" /> : 
   role.icon === 'stethoscope' ? <Stethoscope className="w-12 h-12 text-slate-300" /> : 
   role.icon === 'hospital' ? <Hospital className="w-12 h-12 text-slate-300" /> : 
   <Shield className="w-12 h-12 text-slate-300" />}
</div>
                                    <h3 className="text-xl font-bold mb-2">{role.title}</h3>
                                    <p className="text-slate-400 text-sm mb-6">{role.desc}</p>
                                    <button className="w-full mt-auto py-3 bg-slate-700 group-hover:bg-blue-600 rounded-xl font-semibold transition-colors">
                                        {role.btn} →
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <ProfessionalFooter />
        </div>
    );
};

export default Landing;
