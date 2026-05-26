import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

interface CropVisualizationProps {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

export function CropVisualization({ nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall }: CropVisualizationProps) {
  const data = [
    { parameter: 'Nitrogen', value: nitrogen, fullMark: 140 },
    { parameter: 'Phosphorus', value: phosphorus, fullMark: 145 },
    { parameter: 'Potassium', value: potassium, fullMark: 205 },
    { parameter: 'Temperature', value: temperature, fullMark: 50 },
    { parameter: 'Humidity', value: humidity, fullMark: 100 },
    { parameter: 'pH', value: ph, fullMark: 14 },
    { parameter: 'Rainfall', value: rainfall, fullMark: 300 },
  ];

  return (
    <div className="relative w-full h-full">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-radial from-[#10b98110] via-transparent to-transparent blur-xl" />
      
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <defs>
            <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          
          <PolarGrid 
            stroke="#10b98130" 
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          
          <PolarAngleAxis
            dataKey="parameter"
            tick={{ fill: '#374151', fontSize: 12 }}
            stroke="#10b98140"
          />

          <PolarRadiusAxis
            angle={90}
            domain={[0, 'auto']}
            tick={{ fill: '#4b5563', fontSize: 10 }}
            stroke="#10b98130"
          />
          
          <Radar
            name="Current Values"
            dataKey="value"
            stroke="#10b981"
            fill="url(#radarGradient)"
            fillOpacity={0.5}
            strokeWidth={2}
            dot={{
              fill: '#10b981',
              strokeWidth: 2,
              r: 4,
              stroke: '#ffffff'
            }}
            activeDot={{
              fill: '#10b981',
              stroke: '#3b82f6',
              strokeWidth: 2,
              r: 6
            }}
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              color: '#1f2937',
              backdropFilter: 'blur(10px)'
            }}
            itemStyle={{ color: '#059669' }}
            labelStyle={{ color: '#2563eb' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}