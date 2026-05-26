import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Leaf, Droplets, Sun, RefreshCw } from 'lucide-react';
import { CropVisualization } from '../components/CropVisualization';

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
}

const monthlyData = [
  { month: 'Jan', yield: 65, rainfall: 45, temp: 18 },
  { month: 'Feb', yield: 59, rainfall: 52, temp: 20 },
  { month: 'Mar', yield: 80, rainfall: 78, temp: 23 },
  { month: 'Apr', yield: 81, rainfall: 95, temp: 25 },
  { month: 'May', yield: 56, rainfall: 125, temp: 28 },
  { month: 'Jun', yield: 55, rainfall: 180, temp: 27 },
  { month: 'Jul', yield: 40, rainfall: 210, temp: 26 },
  { month: 'Aug', yield: 68, rainfall: 165, temp: 26 },
  { month: 'Sep', yield: 88, rainfall: 135, temp: 25 },
  { month: 'Oct', yield: 92, rainfall: 98, temp: 23 },
  { month: 'Nov', yield: 85, rainfall: 62, temp: 20 },
  { month: 'Dec', yield: 75, rainfall: 48, temp: 18 },
];

const cropDistribution = [
  { name: 'Coffee',  value: 30, color: '#10b981' },
  { name: 'Rice',    value: 25, color: '#3b82f6' },
  { name: 'Wheat',   value: 20, color: '#8b5cf6' },
  { name: 'Cotton',  value: 15, color: '#f59e0b' },
  { name: 'Others',  value: 10, color: '#6b7280' },
];

// Optimal values based on general agronomy guidelines
const OPTIMAL = { N: 100, P: 80, K: 60, ph: 7.0 };

export function Analysis() {
  const [sensor,    setSensor]    = useState<SensorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  async function loadSensorData() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/sensor-data');
      if (!res.ok) throw new Error('Failed to fetch sensor data');
      const data = await res.json();
      setSensor(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading data');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSensorData();
    const interval = setInterval(loadSensorData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Build soil health chart data from real sensor values
  const soilHealth = sensor ? [
    { parameter: 'Nitrogen',   current: sensor.N,   optimal: OPTIMAL.N   },
    { parameter: 'Phosphorus', current: sensor.P,   optimal: OPTIMAL.P   },
    { parameter: 'Potassium',  current: sensor.K,   optimal: OPTIMAL.K   },
    { parameter: 'pH',         current: sensor.ph,  optimal: OPTIMAL.ph  },
  ] : [];

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Detailed Analysis</h1>
          <p className="text-gray-600">Comprehensive insights into crop performance and soil conditions</p>
        </div>
        <button
          onClick={loadSensorData}
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

        {/* Yield Trends — historical, stays static */}
        <motion.div
          className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-900">Yield & Climate Trends</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}   />
                  </linearGradient>
                  <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="yield"    stroke="#10b981" fillOpacity={1} fill="url(#colorYield)" strokeWidth={2} />
                <Area type="monotone" dataKey="rainfall" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRain)"  strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Crop Distribution */}
        <motion.div
          className="col-span-12 lg:col-span-4 bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200 p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Leaf className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-900">Crop Distribution</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={cropDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {cropDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {cropDistribution.map((crop) => (
              <div key={crop.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: crop.color }} />
                  <span className="text-gray-700">{crop.name}</span>
                </div>
                <span className="text-gray-600 font-medium">{crop.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Soil Health — live from sensor */}
        <motion.div
          className="col-span-12 lg:col-span-6 bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200 p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Soil Health Status</h2>
            </div>
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium">
              Live
            </span>
          </div>

          {isLoading && !sensor ? (
            <div className="h-80 flex items-center justify-center text-gray-400">Loading sensor data…</div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={soilHealth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                  <XAxis dataKey="parameter" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Bar dataKey="current" name="Current" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="optimal" name="Optimal" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Environmental Balance — live from sensor */}
        <motion.div
          className="col-span-12 lg:col-span-6 bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200 p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-900">Environmental Balance</h2>
            </div>
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium">
              Live
            </span>
          </div>
          <div className="h-80">
            {isLoading && !sensor ? (
              <div className="h-full flex items-center justify-center text-gray-400">Loading sensor data…</div>
            ) : sensor ? (
              <CropVisualization
                nitrogen={sensor.N}
                phosphorus={sensor.P}
                potassium={sensor.K}
                temperature={sensor.temperature}
                humidity={sensor.humidity}
                ph={sensor.ph}
                rainfall={sensor.rainfall}
              />
            ) : null}
          </div>
        </motion.div>

        {/* Temperature Variation — historical, stays static */}
        <motion.div
          className="col-span-12 bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200 p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Sun className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-900">Temperature Variation</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
}