import { motion } from 'motion/react';
import { Calendar, CheckCircle2, TrendingUp, Leaf } from 'lucide-react';

const historyData = [
  { 
    id: 1, 
    date: '2026-04-10', 
    crop: 'Coffee', 
    confidence: 94,
    nitrogen: 90,
    phosphorus: 70,
    potassium: 50,
    status: 'optimal'
  },
  { 
    id: 2, 
    date: '2026-04-08', 
    crop: 'Rice', 
    confidence: 91,
    nitrogen: 105,
    phosphorus: 85,
    potassium: 55,
    status: 'optimal'
  },
  { 
    id: 3, 
    date: '2026-04-05', 
    crop: 'Wheat', 
    confidence: 86,
    nitrogen: 65,
    phosphorus: 45,
    potassium: 40,
    status: 'good'
  },
  { 
    id: 4, 
    date: '2026-04-02', 
    crop: 'Cotton', 
    confidence: 88,
    nitrogen: 55,
    phosphorus: 40,
    potassium: 35,
    status: 'good'
  },
  { 
    id: 5, 
    date: '2026-03-28', 
    crop: 'Maize', 
    confidence: 85,
    nitrogen: 80,
    phosphorus: 60,
    potassium: 110,
    status: 'optimal'
  },
  { 
    id: 6, 
    date: '2026-03-25', 
    crop: 'Sugarcane', 
    confidence: 89,
    nitrogen: 95,
    phosphorus: 70,
    potassium: 65,
    status: 'optimal'
  },
];

export function History() {
  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recommendation History</h1>
        <p className="text-gray-600">Track your past crop recommendations and analysis</p>
      </motion.div>

      <div className="grid gap-4">
        {historyData.map((item, index) => (
          <motion.div
            key={item.id}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:border-emerald-300 hover:shadow-xl transition-all cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01, boxShadow: "0 10px 40px rgba(16, 185, 129, 0.15)" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 flex-1">
                {/* Date */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="text-gray-900 font-semibold">{item.date}</p>
                  </div>
                </div>

                {/* Crop */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Recommended Crop</p>
                    <p className="text-gray-900 font-semibold text-lg">{item.crop}</p>
                  </div>
                </div>

                {/* Confidence */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Confidence</p>
                    <p className="text-gray-900 font-semibold text-lg">{item.confidence}%</p>
                  </div>
                </div>

                {/* NPK Values */}
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">NPK Values</p>
                  <div className="flex gap-3">
                    <div className="px-3 py-1 bg-emerald-100 rounded-lg border border-emerald-200">
                      <span className="text-xs text-emerald-700">N: {item.nitrogen}</span>
                    </div>
                    <div className="px-3 py-1 bg-blue-100 rounded-lg border border-blue-200">
                      <span className="text-xs text-blue-700">P: {item.phosphorus}</span>
                    </div>
                    <div className="px-3 py-1 bg-purple-100 rounded-lg border border-purple-200">
                      <span className="text-xs text-purple-700">K: {item.potassium}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-emerald-600 capitalize">{item.status}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <motion.div
        className="grid grid-cols-4 gap-4 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-gray-900">{historyData.length}</p>
          <p className="text-sm text-gray-600 mt-1">Total Analyses</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-emerald-600">
            {Math.round(historyData.reduce((sum, item) => sum + item.confidence, 0) / historyData.length)}%
          </p>
          <p className="text-sm text-gray-600 mt-1">Avg Confidence</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-blue-600">
            {historyData.filter(item => item.status === 'optimal').length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Optimal Results</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-gray-900">{new Set(historyData.map(item => item.crop)).size}</p>
          <p className="text-sm text-gray-600 mt-1">Crop Types</p>
        </div>
      </motion.div>
    </div>
  );
}
