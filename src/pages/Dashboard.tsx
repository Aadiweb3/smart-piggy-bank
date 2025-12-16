import { useState, Suspense, lazy, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useWalletStore } from '@/store/walletStore';
import WalletConnect from '@/components/wallet/WalletConnect';
import SmartBasketCard from '@/components/dashboard/SmartBasketCard';
import AllocationChart from '@/components/dashboard/AllocationChart';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import YieldChart from '@/components/dashboard/YieldChart';
import MonadAdvantage from '@/components/dashboard/MonadAdvantage';
import EmptyState from '@/components/dashboard/EmptyState';
import DepositModal from '@/components/modals/DepositModal';
import WithdrawModal from '@/components/modals/WithdrawModal';

const OptimizerRobot3D = lazy(() => import('@/components/3d/OptimizerRobot3D'));
const MagicBasket3D = lazy(() => import('@/components/3d/MagicBasket3D'));

export default function Dashboard() {
  const { isConnected, totalDeposited, setOptimizerStatus, addActivity } = useWalletStore();
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [showAllocation, setShowAllocation] = useState(false);

  // Simulate optimizer activity
  useEffect(() => {
    if (!isConnected) return;

    const statuses: Array<'scanning' | 'analyzing' | 'rebalancing' | 'idle'> = [
      'scanning', 'analyzing', 'rebalancing', 'idle'
    ];
    
    const messages = [
      { type: 'scan' as const, message: 'Scanning 47 DeFi protocols...' },
      { type: 'increase' as const, message: 'Compound APY increased to 7.5%' },
      { type: 'rebalance' as const, message: 'Reallocating funds for optimal yield' },
      { type: 'execute' as const, message: 'Transaction executed (0.0001 gas)' },
    ];

    let statusIndex = 0;
    let messageIndex = 0;

    const statusInterval = setInterval(() => {
      setOptimizerStatus(statuses[statusIndex]);
      statusIndex = (statusIndex + 1) % statuses.length;
    }, 5000);

    const activityInterval = setInterval(() => {
      addActivity(messages[messageIndex]);
      messageIndex = (messageIndex + 1) % messages.length;
    }, 8000);

    return () => {
      clearInterval(statusInterval);
      clearInterval(activityInterval);
    };
  }, [isConnected, setOptimizerStatus, addActivity]);

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <div className="animated-bg" />

      {/* Header */}
      <header className="relative z-10 px-6 py-4 border-b border-border/30">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🐷</span>
              <span className="font-display text-lg font-bold gradient-text">Smart Piggy Bank</span>
            </div>
          </div>
          
          <WalletConnect />
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {!isConnected ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <span className="text-8xl mb-6">🔐</span>
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                Connect your wallet to access your Smart Piggy Bank dashboard 
                and start earning optimized yields.
              </p>
              <WalletConnect />
            </motion.div>
          ) : totalDeposited === 0 ? (
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <EmptyState />
              <div className="space-y-6">
                <SmartBasketCard
                  onDeposit={() => setDepositOpen(true)}
                  onWithdraw={() => setWithdrawOpen(true)}
                  onViewAllocation={() => setShowAllocation(!showAllocation)}
                />
                <MonadAdvantage />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Top Row */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Smart Basket Card */}
                <div className="lg:col-span-2">
                  <SmartBasketCard
                    onDeposit={() => setDepositOpen(true)}
                    onWithdraw={() => setWithdrawOpen(true)}
                    onViewAllocation={() => setShowAllocation(!showAllocation)}
                  />
                </div>

                {/* Optimizer Robot */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-4 relative overflow-hidden"
                >
                  <h3 className="font-display text-lg font-bold text-foreground mb-2 relative z-10">
                    Auto-Optimizer
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 relative z-10">
                    AI brain scanning yields
                  </p>
                  <div className="h-48">
                    <Suspense fallback={
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-primary animate-pulse" />
                      </div>
                    }>
                      <OptimizerRobot3D />
                    </Suspense>
                  </div>
                </motion.div>
              </div>

              {/* Middle Row */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Magic Basket 3D */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card p-6 relative overflow-hidden"
                >
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    Your Magic Basket
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Watch your coins grow
                  </p>
                  <div className="h-64">
                    <Suspense fallback={
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl animate-bounce">🎒</span>
                      </div>
                    }>
                      <MagicBasket3D />
                    </Suspense>
                  </div>
                </motion.div>

                {/* Activity Feed */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <ActivityFeed />
                </motion.div>
              </div>

              {/* Allocation Chart */}
              {showAllocation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <AllocationChart expanded />
                </motion.div>
              )}

              {/* Bottom Row */}
              <div className="grid lg:grid-cols-2 gap-6">
                <YieldChart />
                <MonadAdvantage />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <DepositModal isOpen={depositOpen} onClose={() => setDepositOpen(false)} />
      <WithdrawModal isOpen={withdrawOpen} onClose={() => setWithdrawOpen(false)} />
    </div>
  );
}
