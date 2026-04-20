import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, desc, colorHex, bgHex }) => {
  return (
    <motion.div
      initial="inactive"
      whileInView="active"
      viewport={{ amount: 0.6, once: false }}
      variants={{
        inactive: {
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          scale: 1,
          boxShadow: "var(--shadow)",
        },
        active: {
          backgroundColor: "#0f172a", // We can keep this specific dark blue for pop
          borderColor: "#3b82f6",
          scale: 1.03,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
        }
      }}
      transition={{ 
        duration: 0.5, 
        ease: [0.4, 0, 0.2, 1] // Premium ease-in-out
      }}
      className="p-8 rounded-[2rem] border-2 flex flex-col items-start text-left h-full transition-colors group cursor-default"
    >
      <motion.div
        variants={{
          inactive: { 
            backgroundColor: bgHex || "#f1f5f9", 
            color: colorHex || "#0f172a" 
          },
          active: { 
            backgroundColor: "#1e293b", 
            color: "#5eead4" // Light teal (teal-300)
          }
        }}
        transition={{ duration: 0.5 }}
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm"
      >
        <Icon size={28} />
      </motion.div>

      <motion.h3
        variants={{
          inactive: { color: "#0f172a" },
          active: { color: "#ffffff" }
        }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold mb-3 font-serif"
      >
        {title}
      </motion.h3>

      <motion.p
        variants={{
          inactive: { color: "#475569" },
          active: { color: "#94a3b8" }
        }}
        transition={{ duration: 0.5 }}
        className="text-lg leading-relaxed font-medium"
      >
        {desc}
      </motion.p>
      
      {/* Decorative element that appears on active */}
      <motion.div
        variants={{
          inactive: { opacity: 0, x: -10 },
          active: { opacity: 1, x: 0 }
        }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-auto pt-6 flex items-center gap-2 text-teal-400 font-semibold text-sm uppercase tracking-wider"
      >
        Learn More <span>→</span>
      </motion.div>
    </motion.div>
  );
};

export default FeatureCard;
