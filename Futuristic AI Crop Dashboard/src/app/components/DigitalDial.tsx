import { useState } from 'react';
import { motion } from 'motion/react';

interface DigitalDialProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit: string;
  icon: React.ReactNode;
}

export function DigitalDial({ label, value, onChange, min, max, unit, icon }: DigitalDialProps) {
  const [isDragging, setIsDragging] = useState(false);
  const percentage = ((value - min) / (max - min)) * 100;
  const angle = (percentage / 100) * 270 - 135; // -135 to 135 degrees

  const handleIncrement = () => {
    if (value < max) onChange(Math.min(value + 1, max));
  };

  const handleDecrement = () => {
    if (value > min) onChange(Math.max(value - 1, min));
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="text-xs text-gray-600 uppercase tracking-wider mb-3">{label}</div>
      
      <div className="relative w-32 h-32">
        {/* Outer glow ring */}
        <motion.div 
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, transparent 60%, #3b82f610 80%, transparent 100%)',
            boxShadow: isDragging ? '0 0 30px #3b82f640' : '0 0 15px #3b82f630'
          }}
          animate={{
            boxShadow: isDragging 
              ? ['0 0 20px #3b82f640', '0 0 35px #3b82f660', '0 0 20px #3b82f640']
              : '0 0 15px #3b82f630'
          }}
          transition={{ duration: 1.5, repeat: isDragging ? Infinity : 0 }}
        />
        
        {/* Main dial background */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white to-gray-50 backdrop-blur-xl border border-gray-300 shadow-2xl">
          {/* Angle indicators */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              strokeDasharray="5 5"
              opacity="0.3"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-blue-600 mb-1 opacity-70">
              {icon}
            </div>
            <motion.div
              className="text-3xl font-bold text-gray-900"
              animate={{ scale: isDragging ? 1.08 : 1 }}
            >
              {value}
            </motion.div>
            <div className="text-xs text-blue-600 opacity-70">{unit}</div>
          </div>
          
          {/* Needle */}
          <motion.div
            className="absolute top-1/2 left-1/2 origin-left"
            style={{
              width: '35%',
              height: '2px',
              background: 'linear-gradient(90deg, #3b82f6, transparent)',
              boxShadow: '0 0 8px #3b82f6',
              transform: `translate(-50%, -50%) rotate(${angle}deg)`
            }}
            animate={{
              boxShadow: isDragging 
                ? ['0 0 8px #3b82f6', '0 0 14px #3b82f6', '0 0 8px #3b82f6']
                : '0 0 8px #3b82f6'
            }}
            transition={{ duration: 1, repeat: isDragging ? Infinity : 0 }}
          >
            <div className="absolute right-0 top-1/2 w-2 h-2 rounded-full bg-blue-400 -translate-y-1/2" 
                 style={{ boxShadow: '0 0 6px #3b82f6' }}
            />
          </motion.div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleDecrement}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 text-blue-600 transition-all hover:shadow-[0_0_8px_#3b82f660]"
        >
          −
        </button>
        <button
          onClick={handleIncrement}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 text-blue-600 transition-all hover:shadow-[0_0_8px_#3b82f660]"
        >
          +
        </button>
      </div>
    </div>
  );
}