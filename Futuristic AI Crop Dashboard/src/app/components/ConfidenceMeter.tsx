import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface ConfidenceMeterProps {
  confidence: number;
}

export function ConfidenceMeter({ confidence }: ConfidenceMeterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(confidence);
    }, 300);
    return () => clearTimeout(timer);
  }, [confidence]);

  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (displayValue / 100) * circumference;

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Outer glow */}
      <motion.div 
        className="absolute inset-0 rounded-full opacity-40"
        style={{
          background: `radial-gradient(circle, #10b98130, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.4, 0.6, 0.4]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <svg className="absolute inset-0 w-full h-full -rotate-90">
        {/* Background circle */}
        <circle
          cx="96"
          cy="96"
          r="70"
          fill="none"
          stroke="rgba(16, 185, 129, 0.15)"
          strokeWidth="12"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx="96"
          cy="96"
          r="70"
          fill="none"
          stroke="url(#confidenceGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            filter: 'drop-shadow(0 0 6px #10b98160)'
          }}
        />
        
        <defs>
          <linearGradient id="confidenceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          className="text-5xl font-bold text-emerald-600"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          {displayValue}%
        </motion.div>
        <div className="text-xs text-gray-600 uppercase tracking-wider mt-1">Confidence</div>
      </div>
    </div>
  );
}