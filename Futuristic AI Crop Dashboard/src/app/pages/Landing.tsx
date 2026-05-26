import { motion } from 'motion/react';
import { Sprout, Leaf, Droplet, Sun, Wind, Tractor, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50">
      {/* Hero Section */}
      <header className="border-b border-emerald-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sprout className="w-8 h-8 text-emerald-600" />
            <span className="font-semibold text-xl text-emerald-900">AgroCrop AI</span>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate('/register')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Banner with Animation */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-6xl font-bold text-emerald-900 mb-6">
              Intelligent Crop Recommendations
              <br />
              <span className="text-emerald-600">Powered by AI</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Maximize your harvest with data-driven insights. Our AI analyzes soil conditions,
              climate patterns, and historical data to recommend the best crops for your land.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-6"
            >
              Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>

          {/* Floating Icons Animation */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-20 left-10"
            >
              <Leaf className="w-16 h-16 text-emerald-300 opacity-30" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-40 right-20"
            >
              <Droplet className="w-12 h-12 text-blue-300 opacity-30" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-20 left-1/4"
            >
              <Sun className="w-20 h-20 text-amber-300 opacity-30" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Plants Section - Carousel Effect */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-center text-emerald-900 mb-4">
              Optimize Plant Growth
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Our AI understands the unique needs of over 200 crop varieties
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sprout,
                title: 'Smart Selection',
                description: 'Get personalized crop recommendations based on your soil composition and local climate.',
                color: 'emerald',
              },
              {
                icon: Leaf,
                title: 'Growth Tracking',
                description: 'Monitor plant health with real-time data and receive alerts for optimal care timing.',
                color: 'teal',
              },
              {
                icon: Sun,
                title: 'Seasonal Planning',
                description: 'Plan your planting schedule with AI-powered seasonal forecasts and rotation strategies.',
                color: 'amber',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className={`bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 rounded-2xl p-8 h-full border border-${item.color}-200`}>
                  <item.icon className={`w-12 h-12 text-${item.color}-600 mb-4`} />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Farming?
            </h2>
            <p className="text-xl text-emerald-50 mb-8">
              Join thousands of farmers already using AI to increase yields and reduce costs.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-8 py-6"
            >
              Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sprout className="w-6 h-6 text-emerald-500" />
            <span className="font-semibold text-lg text-white">AgroCrop AI</span>
          </div>
          <p className="text-sm">
            © 2026 AgroCrop AI. Empowering farmers with intelligent technology.
          </p>
        </div>
      </footer>
    </div>
  );
}
