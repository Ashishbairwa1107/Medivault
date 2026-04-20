import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRightCircle } from 'lucide-react';

const benefitData = {
  Patients: [
    'Access medical records anytime, anywhere.',
    'Enhanced privacy and consent management.',
    'Easier follow-ups with digital history.',
    'Unified identity for all health services.'
  ],
  'Doctors & Hospitals': [
    'Instant access to verified patient history.',
    'Reduced diagnostic errors with complete data.',
    'Streamlined digital prescriptions and reports.',
    'Better care coordination across facilities.'
  ],
  Policymakers: [
    'Real-time data for public health planning.',
    'Effective monitoring of health schemes.',
    'Improved health outcome reporting.',
    'Data-driven policy interventions.'
  ]
};

const BenefitsSection = () => {
  const [activeTab, setActiveTab] = useState('Patients');

  return (
    <section className="py-24 bg-gray-200 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-6">
            Benefits for the Nation
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Empowering every stakeholder in the healthcare ecosystem through a unified digital backbone.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 bg-gray-300/50 dark:bg-slate-800/50 p-2 rounded-2xl">
          {Object.keys(benefitData).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-md transform scale-105'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-[#e0f2f1] dark:bg-slate-800/30 border border-teal-100 dark:border-teal-900/30 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-teal-900/5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefitData[activeTab].map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <ChevronRightCircle className="text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1" size={24} />
                  <p className="text-slate-800 dark:text-slate-200 text-lg font-medium leading-relaxed">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default BenefitsSection;
