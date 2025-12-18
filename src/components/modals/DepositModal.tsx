import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Coins, Info, Loader2, CheckCircle } from 'lucide-react';
import { useWalletStore } from '@/store/walletStore';
import { useDeposit, useUSDTBalance, useUSDTAllowance } from '@/hooks/useVaultContract';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [amount, setAmount] = useState('');
  const { currentAPY } = useWalletStore();
  const { balance } = useUSDTBalance();
  const { allowance } = useUSDTAllowance();
  const { 
    deposit, 
    isApproving, 
    isApproveConfirming, 
    isApproveConfirmed,
    isDepositing, 
    isDepositConfirming, 
    isDepositConfirmed,
    reset 
  } = useDeposit();

  const numAmount = parseFloat(amount) || 0;
  const estimatedAPY = currentAPY;
  const monthlyEstimate = (numAmount * (estimatedAPY / 100)) / 12;
  const needsApproval = numAmount > allowance;

  const isProcessing = isApproving || isApproveConfirming || isDepositing || isDepositConfirming;

  useEffect(() => {
    if (isDepositConfirmed) {
      toast.success('Deposit successful!', {
        description: `Successfully deposited ${numAmount} USDT to Smart Piggy Bank`,
      });
      setAmount('');
      reset();
      onClose();
    }
  }, [isDepositConfirmed, numAmount, reset, onClose]);

  const handleDeposit = () => {
    if (numAmount > 0 && numAmount <= balance) {
      deposit(numAmount);
    }
  };

  const handleMaxClick = () => {
    setAmount(balance.toString());
  };

  const handleClose = () => {
    if (!isProcessing) {
      reset();
      setAmount('');
      onClose();
    }
  };

  const getButtonText = () => {
    if (isApproving) return 'Approving USDT...';
    if (isApproveConfirming) return 'Confirming Approval...';
    if (isDepositing) return 'Depositing...';
    if (isDepositConfirming) return 'Confirming Deposit...';
    if (needsApproval) return 'Approve & Deposit';
    return 'Deposit & Relax 😌';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="glass-card p-6 mx-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <Coins className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground">Deposit</h2>
                    <p className="text-sm text-muted-foreground">Add USDT to Smart Basket</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isProcessing}
                  className="p-2 rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Transaction Progress */}
              {isProcessing && (
                <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {isApproveConfirmed ? (
                        <CheckCircle className="w-4 h-4 text-mint" />
                      ) : (
                        <div className={`w-4 h-4 rounded-full border-2 ${isApproving || isApproveConfirming ? 'border-primary animate-pulse' : 'border-muted'}`} />
                      )}
                      <span className={`text-sm ${isApproveConfirmed ? 'text-mint' : isApproving || isApproveConfirming ? 'text-primary' : 'text-muted-foreground'}`}>
                        Approve
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-border" />
                    <div className="flex items-center gap-2">
                      {isDepositConfirmed ? (
                        <CheckCircle className="w-4 h-4 text-mint" />
                      ) : (
                        <div className={`w-4 h-4 rounded-full border-2 ${isDepositing || isDepositConfirming ? 'border-primary animate-pulse' : 'border-muted'}`} />
                      )}
                      <span className={`text-sm ${isDepositConfirmed ? 'text-mint' : isDepositing || isDepositConfirming ? 'text-primary' : 'text-muted-foreground'}`}>
                        Deposit
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Token Selector */}
              <div className="p-4 rounded-xl bg-background/50 border border-border/30 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Token</span>
                  <span className="text-sm text-muted-foreground">
                    Balance: {balance.toLocaleString()} USDT
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                    <span className="text-xl">💵</span>
                    <span className="font-semibold">USDT</span>
                  </div>
                  <div className="flex-1 relative">
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      disabled={isProcessing}
                      className="text-xl font-bold bg-transparent border-none text-right pr-16"
                    />
                    <button
                      onClick={handleMaxClick}
                      disabled={isProcessing}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/10 rounded disabled:opacity-50"
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>

              {/* APY Preview */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-mint/10 border border-primary/20 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-mint" />
                  <span className="text-sm font-medium text-foreground">Estimated Returns</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current APY</p>
                    <p className="text-2xl font-display font-bold gradient-text">{estimatedAPY}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Est. Monthly</p>
                    <p className="text-2xl font-display font-bold text-mint">
                      +${monthlyEstimate.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 mb-6">
                <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Your USDT will be bridged to mUSDT and automatically allocated across 3 yield strategies 
                  on Monad. You can withdraw anytime.
                </p>
              </div>

              {/* Action Button */}
              <Button
                onClick={handleDeposit}
                disabled={numAmount <= 0 || numAmount > balance || isProcessing}
                className="w-full btn-primary h-14 text-lg font-semibold"
              >
                {isProcessing && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                {getButtonText()}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
