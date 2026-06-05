import { motion } from 'motion/react';
import { Sparkles, TrendingUp, Activity, Leaf, ArrowRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router';
import { ConfidenceMeter } from '../components/ConfidenceMeter';
import { useState, useEffect } from 'react';

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

async function fetchSensorData(): Promise<SensorData> {
  const response = await fetch('/api/sensor-data');
  if (!response.ok) throw new Error('Failed to fetch sensor data');
  return response.json();
}

export function Dashboard() {
  const [data,        setData]        = useState<SensorData | null>(null);
  const [isLoading,   setIsLoading]   = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  async function loadData() {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchSensorData();
      setData(result);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sensor data');
    } finally {
      setIsLoading(false);
    }
  }

  // Load on mount, then refresh every 10 seconds
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const parameters = data ? [
    { label: 'Nitrogen (N)',    value: data.N,           unit: 'kg/ha' },
    { label: 'Phosphorus (P)',  value: data.P,           unit: 'kg/ha' },
    { label: 'Potassium (K)',   value: data.K,           unit: 'kg/ha' },
    { label: 'Temperature',     value: data.temperature, unit: '°C'    },
    { label: 'Humidity',        value: data.humidity,    unit: '%'     },
    { label: 'pH Level',        value: data.ph,          unit: ''      },
  ] : [];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-12 gap-6">

        {/* Left Panel — Sensor Data Table */}
        <motion.div
          className="col-span-12 lg:col-span-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {/* <TrendingUp className="w-5 h-5 text-emerald-600" /> */}
                <h2 className="text-xl font-bold text-gray-900">Sensor Readings</h2>
              </div>
              <button
                onClick={loadData}
                disabled={isLoading}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {error && (
              <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Read-only table */}
            <div className="overflow-hidden rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Parameter</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && !data ? (
                    Array.from({ length: 7 }).map((_, i) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="px-4 py-3">
                          <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-gray-100 rounded animate-pulse w-16 ml-auto" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    parameters.map((param, i) => (
                      <motion.tr
                        key={param.label}
                        className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <td className="px-4 py-3 text-gray-600">{param.label}</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">
                          {param.value}
                          <span className="text-gray-400 font-normal ml-1">{param.unit}</span>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {lastUpdated && (
              <p className="text-xs text-gray-400 mt-3 text-right">
                Last updated: {lastUpdated}
              </p>
            )}
          </div>
        </motion.div>

        {/* Right Panel */}
        <div className="col-span-12 lg:col-span-8 space-y-6">

          {/* Result Card */}
          <motion.div
            className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-8 shadow-lg relative overflow-hidden"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 animate-shimmer" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm text-gray-600 uppercase tracking-wider">
                    ML Recommended Crop
                  </span>
                </div>

                <motion.div
                  key={data?.crop}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-6xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {isLoading && !data ? '…' : data?.crop.toUpperCase()}
                  </h2>
                </motion.div>

                {/* <p className="text-gray-700 text-sm max-w-md">
                  Based on live soil sensor readings, predicted by your trained Random Forest model.
                </p> */}
              </div>

              <div className="flex items-center justify-center">
                <ConfidenceMeter confidence={isLoading && !data ? 0 : (data?.confidence ?? 0)} />
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: <Activity className="w-5 h-5 text-emerald-600" />,  bg: 'bg-emerald-100', value: data ? `${data.confidence}%` : '…', label: 'Confidence',  delay: 0.3 },
              { icon: <Sparkles  className="w-5 h-5 text-blue-600"    />,  bg: 'bg-blue-100',    value: '7',                                label: 'Parameters', delay: 0.4 },
              { icon: <TrendingUp className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-100', value: 'RF',                               label: 'Model',      delay: 0.5 },
            ].map(({ icon, bg, value, label, delay }) => (
              <motion.div
                key={label}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>{icon}</div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-xs text-gray-600">{label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              onClick={loadData}
              disabled={isLoading}
              className="py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50"
              whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(16,185,129,0.3)' }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center gap-2">
                {/* <Sparkles className="w-5 h-5" /> */}
                {isLoading ? 'Reading Sensor…' : 'Refresh Sensor Data'}
              </span>
            </motion.button>

            <Link to="/dashboard/analysis">
              <motion.button
                className="w-full py-4 px-6 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl border border-gray-200 shadow-sm transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center justify-center gap-2">
                  View Detailed Analysis <ArrowRight className="w-4 h-4" />
                </span>
              </motion.button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}