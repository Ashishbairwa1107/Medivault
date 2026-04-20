import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Server, Globe } from 'lucide-react';

const specs = [
  { icon: ShieldCheck, title: 'ISO 27001', detail: 'International standard for information security management.' },
  { icon: Lock, title: '256-bit Encryption', detail: 'Military-grade encryption for all data at rest and in transit.' },
  { icon: Server, title: 'Cloud Infrastructure', detail: 'Secure, scalable, and highly available multi-region hosting.' },
  { icon: Globe, title: 'GDPR Compliant', detail: 'Strict adherence to global data protection and privacy laws.' }
];

const TechInfrastructure = () => {
  return (
    <section className="py-24 bg-[#1e2144] dark:bg-slate-950 border-t border-slate-800 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 text-left"
          >
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight mb-8">
              Built on Trust. <br />
              <span className="text-blue-400">Secured by Design.</span>
            </h2>
            <p className="text-blue-100/70 text-lg md:text-xl mb-10 max-w-xl leading-relaxed">
              Our infrastructure is engineered with multiple layers of protection to ensure your health data remains private and secure at all times.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/40">
                Security Whitepaper
              </button>
              <button className="px-8 py-4 border-2 border-blue-400/30 text-blue-300 hover:bg-blue-400/10 font-bold rounded-xl transition-all">
                Privacy Policy
              </button>
            </div>
          </motion.div>

          {/* Right Side - Grid */}
          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {specs.map((spec, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 border border-blue-400/20 rounded-2xl bg-white/5 backdrop-blur-sm group hover:bg-white/10 transition-all border-l-4 border-l-blue-500"
              >
                <div className="text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <spec.icon size={32} />
                </div>
                <h4 className="text-white font-bold text-xl mb-2">{spec.title}</h4>
                <p className="text-blue-200/60 text-sm leading-relaxed">{spec.detail}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default TechInfrastructure;
