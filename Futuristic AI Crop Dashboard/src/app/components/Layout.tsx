import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { LayoutDashboard, BarChart3, Leaf, LogOut } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard/analysis', label: 'Analysis', icon: BarChart3 },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="relative z-10 border-b border-emerald-100 backdrop-blur-xl bg-white/90 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <Leaf className="w-8 h-8 text-emerald-600" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Agro Intellect AI</h1>
                <p className="text-xs text-gray-600">Smart Crop Management</p>
              </div>
            </Link>

            <nav className="flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link key={item.path} to={item.path}>
                    <motion.div
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm'
                          : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}

              {/* Logout Button */}
              <motion.button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-gray-600 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </motion.button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.div>
      </main>

    </div>
  );
}