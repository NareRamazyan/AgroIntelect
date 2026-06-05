import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, Leaf, Droplets, Sun, RefreshCw } from 'lucide-react';


interface SensorData {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  crop: string;
  confidence: number;
  alternatives: { crop: string; confidence: number }[];
}

interface MonthlyData {
  month:    string;
  rainfall: number;
  temp:     number;
  yield:    number;
}

interface TimelineData {
  time:        string;
  N:           number;
  P:           number;
  K:           number;
  temperature: number;
  humidity:    number;
  ph:          number;
  rainfall:    number;
}

const OPTIMAL = { N: 100, P: 80, K: 60, ph: 7.0 };

export function Analysis() {
  const [sensor,      setSensor]      = useState<SensorData | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [timelineData, setTimelineData] = useState<TimelineData[]>([]);
  const [activeParam,  setActiveParam]  = useState<string>('temperature');

  async function loadAll() {
    setIsLoading(true);
    setError(null);
    try {
      const [sensorRes, monthlyRes, timelineRes] = await Promise.all([
        fetch('/api/sensor-data'),
        fetch('/api/history/monthly'),
        fetch('/api/history/timeline'),
      ]);

      if (!sensorRes.ok)   throw new Error('Failed to fetch sensor data');
      if (!monthlyRes.ok)  throw new Error('Failed to fetch monthly history');
      if (!timelineRes.ok) throw new Error('Failed to fetch timeline');

      const sensorData  = await sensorRes.json();
      const monthlyRaw  = await monthlyRes.json();
      const timelineRaw = await timelineRes.json();

      setSensor(sensorData);
      setMonthlyData(monthlyRaw.map((r: any) => ({
        month:    r.month,
        rainfall: parseFloat(r.rainfall),
        temp:     parseFloat(r.temp),
        yield:    parseFloat(r.yield),
      })));
      setTimelineData(timelineRaw);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading data');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    const interval = setInterval(loadAll, 10000);
    return () => clearInterval(interval);
  }, []);

  
  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Detailed Analysis</h1>
          {/* <p className="text-gray-600">Comprehensive insights into crop performance and soil conditions</p> */}
        </div>
        <button
          onClick={loadAll}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm font-medium text-gray-700"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </motion.div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">

        

        {/* Crop Alternatives — live from sensor */}
        <motion.div
          className="col-span-12 lg:col-span-4 bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200 p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {/* <Leaf className="w-5 h-5 text-emerald-600" /> */}
              <h2 className="text-xl font-bold text-gray-900">Also Suitable</h2>
            </div>
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium">Live</span>
          </div>

          {sensor && (
            <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <p className="text-xs text-emerald-600 uppercase tracking-wider mb-1">Best Match</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-emerald-700 capitalize">{sensor.crop}</span>
                <span className="text-sm font-semibold text-emerald-600">{sensor.confidence}%</span>
              </div>
              <div className="mt-2 h-1.5 bg-emerald-100 rounded-full">
                <div className="h-1.5 bg-emerald-500 rounded-full" style={{ width: `${sensor.confidence}%` }} />
              </div>
            </div>
          )}

          {isLoading && !sensor ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {sensor?.alternatives?.map((alt, i) => (
                <motion.div
                  key={alt.crop}
                  className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  <span className="text-sm font-semibold text-gray-800 capitalize">{alt.crop}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-gray-200 rounded-full">
                      <div className="h-1.5 bg-teal-400 rounded-full" style={{ width: `${alt.confidence}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">{alt.confidence}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Parameter History — replaces Environmental Balance */}
<motion.div
  className="col-span-12 lg:col-span-8 bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200 p-6 shadow-xl"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 }}
>
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      {/* <TrendingUp className="w-5 h-5 text-emerald-600" /> */}
      <h2 className="text-xl font-bold text-gray-900">Parameter History</h2>
    </div>
    <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium">
      Last 50 readings
    </span>
  </div>

  {/* Parameter selector */}
  <div className="flex flex-wrap gap-2 mb-4">
    {[
      { key: 'temperature', label: 'Temperature', color: '#f59e0b' },
      { key: 'humidity',    label: 'Humidity',    color: '#3b82f6' },
      { key: 'ph',          label: 'pH',          color: '#8b5cf6' },
      { key: 'N',           label: 'Nitrogen',    color: '#10b981' },
      { key: 'P',           label: 'Phosphorus',  color: '#ec4899' },
      { key: 'K',           label: 'Potassium',   color: '#f97316' },
      { key: 'rainfall',    label: 'Rainfall',    color: '#06b6d4' },
    ].map((p) => (
      <button
        key={p.key}
        onClick={() => setActiveParam(p.key)}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
          activeParam === p.key ? 'text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        style={activeParam === p.key ? { backgroundColor: p.color } : {}}
      >
        {p.label}
      </button>
    ))}
  </div>

  {timelineData.length === 0 ? (
    <div className="h-56 flex items-center justify-center text-gray-400">
      No history yet — data will appear as the sensor collects readings.
    </div>
  ) : (() => {
    const paramConfig: Record<string, { label: string; color: string; idealMin: number; idealMax: number; unit: string }> = {
      temperature: { label: 'Temperature', color: '#f59e0b', idealMin: 15,  idealMax: 35,  unit: '°C'    },
      humidity:    { label: 'Humidity',    color: '#3b82f6', idealMin: 30,  idealMax: 90,  unit: '%'     },
      ph:          { label: 'pH',          color: '#8b5cf6', idealMin: 5.5, idealMax: 7.5, unit: ''      },
      N:           { label: 'Nitrogen',    color: '#10b981', idealMin: 40,  idealMax: 120, unit: 'mg/kg' },
      P:           { label: 'Phosphorus',  color: '#ec4899', idealMin: 20,  idealMax: 100, unit: 'mg/kg' },
      K:           { label: 'Potassium',   color: '#f97316', idealMin: 15,  idealMax: 80,  unit: 'mg/kg' },
      rainfall:    { label: 'Rainfall',    color: '#06b6d4', idealMin: 50,  idealMax: 250, unit: 'mm'    },
    };
    const cfg = paramConfig[activeParam];

    return (
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timelineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            <XAxis dataKey="time" stroke="#6b7280" tick={{ fontSize: 11 }} />
            <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              formatter={(value: any) => [`${value} ${cfg.unit}`, cfg.label]}
            />
            <ReferenceLine
              y={cfg.idealMin}
              stroke="#10b981"
              strokeDasharray="6 3"
              label={{ value: `Min ${cfg.idealMin}`, position: 'insideTopLeft', fontSize: 11, fill: '#10b981' }}
            />
            <ReferenceLine
              y={cfg.idealMax}
              stroke="#10b981"
              strokeDasharray="6 3"
              label={{ value: `Max ${cfg.idealMax}`, position: 'insideTopLeft', fontSize: 11, fill: '#10b981' }}
            />
            <Line
              type="monotone"
              dataKey={activeParam}
              name={cfg.label}
              stroke={cfg.color}
              strokeWidth={2.5}
              dot={{ fill: cfg.color, r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  })()}

  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
    <div className="flex items-center gap-1.5">
      <div className="w-6 border-t-2 border-dashed border-emerald-500" />
      <span>Ideal range boundary</span>
    </div>
    <div className="flex items-center gap-1.5">
      <div className="w-6 border-t-2 border-amber-400" />
      <span>Actual sensor reading</span>
    </div>
  </div>
</motion.div>

        {/* Soil Health — live comparison table */}
        <motion.div
          className="col-span-12 bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200 p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {/* <Droplets className="w-5 h-5 text-blue-600" /> */}
              <h2 className="text-xl font-bold text-gray-900">Soil Health Status</h2>
            </div>
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium">Live</span>
          </div>

          {isLoading && !sensor ? (
            <div className="h-32 flex items-center justify-center text-gray-400">Loading sensor data…</div>
          ) : sensor ? (() => {
            const params = [
              {
                label: 'Nitrogen (N)',
                value: sensor.N,
                unit: 'mg/kg',
                min: 40,  max: 120,
                good: 'Adequate nitrogen supports leaf growth and photosynthesis.',
                warning: 'Nitrogen is slightly off optimal range.',
                danger: 'Nitrogen level is critically low or high — may affect growth.',
              },
              {
                label: 'Phosphorus (P)',
                value: sensor.P,
                unit: 'mg/kg',
                min: 20,  max: 100,
                good: 'Good phosphorus level supports root development.',
                warning: 'Phosphorus is slightly outside optimal range.',
                danger: 'Phosphorus level may limit root and flower development.',
              },
              {
                label: 'Potassium (K)',
                value: sensor.K,
                unit: 'mg/kg',
                min: 15,  max: 80,
                good: 'Potassium level supports water regulation and disease resistance.',
                warning: 'Potassium is slightly off — monitor closely.',
                danger: 'Potassium deficiency or excess detected.',
              },
              {
                label: 'Temperature',
                value: sensor.temperature,
                unit: '°C',
                min: 15,  max: 35,
                good: 'Temperature is within optimal growing range.',
                warning: 'Temperature is slightly outside ideal range.',
                danger: 'Temperature is too extreme for most crops.',
              },
              {
                label: 'Humidity',
                value: sensor.humidity,
                unit: '%',
                min: 30,  max: 90,
                good: 'Humidity is in a healthy range for most crops.',
                warning: 'Humidity is slightly off — watch for stress.',
                danger: 'Humidity too low or too high — risk of drought or disease.',
              },
              {
                label: 'pH Level',
                value: sensor.ph,
                unit: '',
                min: 5.5, max: 7.5,
                good: 'Soil pH is ideal — nutrients are readily available.',
                warning: 'pH is slightly acidic or alkaline — some nutrients may be limited.',
                danger: 'Extreme pH detected — most nutrients will be unavailable.',
              },
              {
                label: 'Rainfall',
                value: sensor.rainfall,
                unit: 'mm',
                min: 50,  max: 250,
                good: 'Rainfall is sufficient for healthy crop growth.',
                warning: 'Rainfall is slightly outside ideal range.',
                danger: 'Rainfall too low (drought risk) or too high (flooding risk).',
              },
            ];

            const getStatus = (value: number, min: number, max: number) => {
              const range  = max - min;
              const buffer = range * 0.15;
              if (value >= min && value <= max)                          return 'good';
              if (value >= min - buffer && value <= max + buffer)        return 'warning';
              return 'danger';
            };

            const statusConfig = {
              good:    { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', label: 'Good'    },
              warning: { bg: 'bg-amber-50',   border: 'border-amber-200',   badge: 'bg-amber-100 text-amber-700',     dot: 'bg-amber-400',   label: 'Warning' },
              danger:  { bg: 'bg-red-50',     border: 'border-red-200',     badge: 'bg-red-100 text-red-700',         dot: 'bg-red-500',     label: 'Danger'  },
            };

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                {params.map((p) => {
                  const status = getStatus(p.value, p.min, p.max);
                  const cfg    = statusConfig[status];
                  const msg    = status === 'good' ? p.good : status === 'warning' ? p.warning : p.danger;

                  return (
                    <div
                      key={p.label}
                      className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{p.label}</span>
                        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mb-1">
                        {p.value}
                        <span className="text-sm font-normal text-gray-400 ml-1">{p.unit}</span>
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        Ideal: {p.min}–{p.max} {p.unit}
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">{msg}</p>
                    </div>
                  );
                })}
              </div>
            );
          })() : null}
        </motion.div>

        
      </div>
    </div>
  );
}