import { Shield, Globe, FileText, BarChart3, Bot, Hospital } from 'lucide-react';
import FeatureCard from './FeatureCard';

const features = [
  { 
    icon: Shield, 
    title: "Patient-Owned Records", 
    desc: "You control who sees your data. Grant and revoke access to any doctor or hospital at any time.", 
    colorHex: "#1d4ed8", 
    bgHex: "#dbeafe" 
  },
  { 
    icon: Globe, 
    title: "Universal Access", 
    desc: "Your records travel with you. Any registered doctor across India can view your history with consent.", 
    colorHex: "#0d9488", 
    bgHex: "#ccfbf1" 
  },
  { 
    icon: FileText, 
    title: "Digital Prescriptions", 
    desc: "Doctors issue verified digital prescriptions linked directly to your secure health record.", 
    colorHex: "#059669", 
    bgHex: "#d1fae5" 
  },
  { 
    icon: BarChart3, 
    title: "Health Analytics", 
    desc: "Track your health trends over time with intelligent charts and personalised insights.", 
    colorHex: "#d97706", 
    bgHex: "#fef3c7" 
  },
  { 
    icon: Bot, 
    title: "AI Health Assistant", 
    desc: "Ask our AI assistant anything about your health records, appointments, and platform features.", 
    colorHex: "#7c3aed", 
    bgHex: "#ede9fe" 
  },
  { 
    icon: Hospital, 
    title: "Hospital Integration", 
    desc: "Hospitals can upload lab reports, scans and test results directly to your secure profile.", 
    colorHex: "#dc2626", 
    bgHex: "#fee2e2" 
  }
];

const ScrollFeatureSection = () => {
  return (
    <section id="features" className="py-32 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
          <div className="max-w-3xl">
            <div className="mb-4 text-sm font-bold tracking-[0.2em] text-teal-600 dark:text-teal-400 uppercase">
              Platform Features
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white leading-tight">
              Everything Your <br className="hidden md:block" /> Healthcare Needs
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-sm mb-2">
            Experience the future of medical record management with our comprehensive ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, idx) => (
            <FeatureCard 
              key={idx}
              {...feature}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScrollFeatureSection;
