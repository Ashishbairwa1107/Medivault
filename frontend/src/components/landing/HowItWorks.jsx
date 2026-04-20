import { motion } from 'framer-motion';
import { UserPlus, Link as LinkIcon, Clock } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Create Health ID',
    desc: 'Register yourself on the platform to get your unique digital health identity.'
  },
  {
    icon: LinkIcon,
    title: 'Link Records',
    desc: 'Connect your previous medical history from any partner hospital across the country.'
  },
  {
    icon: Clock,
    title: 'Access Anytime',
    desc: 'View your reports, prescriptions, and health history 24/7 from any device.'
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-950/50 border-y border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-6">
            How the System Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            A simplified, secure process designed to put you at the center of your healthcare journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 flex flex-col items-center group hover:shadow-lg transition-all"
            >
              <div className="w-20 h-20 bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-400 rounded-full flex items-center justify-center mb-8 group-hover:bg-blue-700 group-hover:text-white dark:group-hover:text-white transition-colors duration-500 shadow-inner">
                <step.icon size={36} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{step.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
