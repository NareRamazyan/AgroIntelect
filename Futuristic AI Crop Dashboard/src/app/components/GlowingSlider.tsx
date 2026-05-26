import { useState } from 'react';
import { motion } from 'motion/react';

interface GlowingSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit?: string;
  color?: string;
}

export function GlowingSlider({ label, value, onChange, min, max, unit = '', color = '#39FF14' }: GlowingSliderProps) {
  const [isFocused, setIsFocused] = useState(false);
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm text-gray-600 uppercase tracking-wider">{label}</label>
        <motion.span
          className="text-lg font-bold text-gray-900"
          style={{ 
            color: color,
            textShadow: isFocused ? `0 0 8px ${color}50` : 'none'
          }}
          animate={{ 
            scale: isFocused ? 1.05 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {value}{unit}
        </motion.span>
      </div>
      
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full backdrop-blur-sm overflow-hidden">
          <motion.div 
            className="h-full rounded-full"
            style={{ 
              width: `${percentage}%`,
              background: `linear-gradient(90deg, ${color}99, ${color})`,
              boxShadow: isFocused ? `0 0 12px ${color}60` : `0 0 6px ${color}40`
            }}
            animate={{
              boxShadow: isFocused 
                ? [`0 0 10px ${color}50`, `0 0 16px ${color}70`, `0 0 10px ${color}50`]
                : `0 0 6px ${color}40`
            }}
            transition={{ duration: 1.5, repeat: isFocused ? Infinity : 0 }}
          />
        </div>
        
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
        />
        
        <motion.div
          className="absolute top-1/2 w-5 h-5 rounded-full border-2 pointer-events-none"
          style={{
            left: `calc(${percentage}% - 10px)`,
            transform: 'translateY(-50%)',
            borderColor: color,
            backgroundColor: '#ffffff',
            boxShadow: `0 0 10px ${color}60`
          }}
          animate={{
            scale: isFocused ? 1.15 : 1,
            boxShadow: isFocused 
              ? [`0 0 12px ${color}60`, `0 0 20px ${color}80`, `0 0 12px ${color}60`]
              : `0 0 10px ${color}50`
          }}
          transition={{ duration: 1, repeat: isFocused ? Infinity : 0 }}
        />
      </div>
    </div>
  );
}