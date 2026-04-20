import { Activity, Mail, Phone, ShieldCheck, Globe } from 'lucide-react';

const ProfessionalFooter = () => {
    return (
        <footer id="about" className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left">
                    
                    {/* Column 1: Platform Info */}
                    <div className="flex flex-col gap-6">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center text-white">
                                <Activity size={20} />
                            </div>
                            <span className="font-serif text-xl font-bold tracking-tight text-blue-800 dark:text-blue-400">
                                Medi<span className="text-teal-600 dark:text-teal-400">Vault</span>
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            A secure, unified digital healthcare initiative aiming to provide seamless medical record portability across India. Empowerment through ownership of health data.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-6 uppercase text-xs tracking-wider">Quick Links</h4>
                        <ul className="flex flex-col gap-4 text-slate-600 dark:text-slate-400 text-sm font-medium">
                            <li><a href="#features" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">Platform Features</a></li>
                            <li><a href="#how-it-works" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">How it Works</a></li>
                            <li><a href="#benefits" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">Stakeholder Benefits</a></li>
                            <li><a href="/auth" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">Register as Patient</a></li>
                            <li><a href="/auth" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">Doctor Portal</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Helpdesk & Contact */}
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-6 uppercase text-xs tracking-wider">Helpdesk & Contact</h4>
                        <ul className="flex flex-col gap-4 text-slate-600 dark:text-slate-400 text-sm font-medium">
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-blue-600 dark:text-blue-400" />
                                <a href="mailto:support@medivault.gov.in" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">support@medivault.gov.in</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-blue-600 dark:text-blue-400" />
                                <span className="text-slate-900 dark:text-slate-200">1800-123-4567 (Toll-Free)</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Globe size={18} className="text-blue-600 dark:text-blue-400" />
                                <span>Ministry of Health & FW</span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Compliance & Badges */}
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-6 uppercase text-xs tracking-wider">Compliance</h4>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-lg shadow-sm">
                                <ShieldCheck size={20} className="text-teal-600" />
                                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-tight">ISO 27001<br/>CERTIFIED</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-lg shadow-sm">
                                <ShieldCheck size={20} className="text-blue-600" />
                                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-tight">SOC2 TYPE II<br/>COMPLIANT</span>
                            </div>
                        </div>
                        <p className="mt-6 text-[11px] text-slate-400 dark:text-slate-500 italic">
                            All data is processed strictly as per the National Data Governance Policy (2023).
                        </p>
                    </div>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6">
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 dark:text-slate-400 text-[13px] font-medium">
                    <div>
                        © 2025 MediVault — A Digital India Healthcare Initiative. &nbsp;All rights reserved.
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">Accessibility</a>
                        <a href="#" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">Sitemap</a>
                        <a href="#" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">Security</a>
                        <a href="#" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default ProfessionalFooter;
