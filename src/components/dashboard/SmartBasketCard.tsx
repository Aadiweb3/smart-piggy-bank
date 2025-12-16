import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Eye } from 'lucide-react';
import { useWalletStore } from '@/store/walletStore';
import { Button } from '@/components/ui/button';

interface SmartBasketCardProps {
  onDeposit: () => void;
  onWithdraw: () => void;
  onViewAllocation: () => void;
}

export default function SmartBasketCard({ onDeposit, onWithdraw, onViewAllocation }: SmartBasketCardProps) {
  const { totalDeposited, currentAPY, todayYield, monthlyEstimate, isConnected } = useWalletStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        rotateX: 2, 
        rotateY: -2,
        boxShadow: '0 30px 80px hsl(259 84% 64% / 0.3), 0 0 60px hsl(259 84% 64% / 0.2)'
      }}
      transition={{ duration: 0.3 }}
      className="glass-card p-6 md:p-8"
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
            <span className="text-2xl">🎒</span>
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-foreground">Smart Basket</h3>
            <p className="text-sm text-muted-foreground">Auto-optimized yield</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/20 text-mint text-sm font-medium">
          <TrendingUp className="w-4 h-4" />
          <span>{currentAPY}% APY</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-background/30 border border-border/30">
          <p className="text-sm text-muted-foreground mb-1">Total Deposited</p>
          <p className="text-2xl font-display font-bold text-foreground">
            ${totalDeposited.toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-background/30 border border-border/30">
          <p className="text-sm text-muted-foreground mb-1">Current APY</p>
          <p className="text-2xl font-display font-bold gradient-text">
            {currentAPY}%
          </p>
        </div>
        <div className="p-4 rounded-xl bg-background/30 border border-border/30">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm text-muted-foreground">Today's Yield</p>
            <ArrowUpRight className="w-3 h-3 text-mint" />
          </div>
          <p className="text-2xl font-display font-bold text-mint">
            +${todayYield.toFixed(2)}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-background/30 border border-border/30">
          <p className="text-sm text-muted-foreground mb-1">Est. Monthly</p>
          <p className="text-2xl font-display font-bold text-foreground">
            ${monthlyEstimate.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          onClick={onDeposit}
          disabled={!isConnected}
          className="flex-1 btn-primary h-12"
        >
          Deposit
        </Button>
        <Button 
          onClick={onWithdraw}
          disabled={!isConnected || totalDeposited === 0}
          className="flex-1 btn-secondary h-12"
        >
          Withdraw
        </Button>
        <Button 
          onClick={onViewAllocation}
          variant="ghost"
          className="h-12 px-4 hover:bg-primary/10"
        >
          <Eye className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
}
