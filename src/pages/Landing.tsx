import { Suspense, lazy, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Zap, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import WalletConnect from '@/components/wallet/WalletConnect';
import { useWalletStore } from '@/store/walletStore';

const PiggyBank3D = lazy(() => import('@/components/3d/PiggyBank3D'));

export default function Landing() {
  const { isConnected } = useWalletStore();
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Check for WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setShowFallback(true);
    }
  }, []);

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Auto-Optimize',
      description: 'AI-powered yield optimization across 50+ protocols',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Risk-Managed',
      description: 'Smart risk assessment for every allocation',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      description: 'Powered by Monad for instant rebalancing',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Best Yields',
      description: 'Always positioned in highest APY opportunities',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="animated-bg" />
      
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              y: [null, -1000],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <span className="text-3xl">🐷</span>
            <span className="font-display text-xl font-bold gradient-text">Smart Piggy Bank</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <WalletConnect />
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 pt-12 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-mint"></span>
                </span>
                <span className="text-sm text-primary font-medium">Live on Monad Testnet</span>
              </motion.div>

              <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6">
                One Basket.{' '}
                <span className="gradient-text">Best Yield.</span>{' '}
                Zero Effort.
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                Deposit once. Our smart robot automatically moves your money to the 
                highest-yield DeFi protocols on Monad.
              </p>

              <div className="flex flex-wrap gap-4">
                {!isConnected ? (
                  <WalletConnect />
                ) : (
                  <Link to="/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary gap-2 text-lg"
                    >
                      Enter Piggy Bank 🐷
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </Link>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary gap-2"
                >
                  Learn More
                </motion.button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12 pt-8 border-t border-border/30">
                <div>
                  <p className="text-3xl font-display font-bold gradient-text">$2.5M+</p>
                  <p className="text-sm text-muted-foreground">Total Value Locked</p>
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-mint">12.4%</p>
                  <p className="text-sm text-muted-foreground">Avg. APY</p>
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-foreground">1,200+</p>
                  <p className="text-sm text-muted-foreground">Happy Depositors</p>
                </div>
              </div>
            </motion.div>

            {/* Right 3D Scene */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative h-[500px] lg:h-[600px]"
            >
              {!showFallback ? (
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-8xl animate-bounce">🐷</div>
                  </div>
                }>
                  <PiggyBank3D className="w-full h-full" />
                </Suspense>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      y: [0, -20, 0],
                      rotate: [-5, 5, -5]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-[200px]"
                  >
                    🐷
                  </motion.div>
                </div>
              )}
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-card p-6 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white mb-4 group-hover:shadow-glow transition-shadow">
                  {feature.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-border/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐷</span>
            <span className="text-sm text-muted-foreground">
              © 2024 Smart Piggy Bank. Built on Monad.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              GitHub
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Twitter
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Discord
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
