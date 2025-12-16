import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowDownRight, Zap, Info } from 'lucide-react';
import { useWalletStore } from '@/store/walletStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WithdrawModal({ isOpen, onClose }: WithdrawModalProps) {
  const [amount, setAmount] = useState('');
  const { totalDeposited, withdraw } = useWalletStore();

  const numAmount = parseFloat(amount) || 0;

  const handleWithdraw = () => {
    if (numAmount > 0 && numAmount <= totalDeposited) {
      withdraw(numAmount);
      onClose();
      setAmount('');
    }
  };

  const handleMaxClick = () => {
    setAmount(totalDeposited.toString());
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
            onClick={onClose}
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
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <ArrowDownRight className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground">Withdraw</h2>
                    <p className="text-sm text-muted-foreground">Remove from Smart Basket</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Amount Input */}
              <div className="p-4 rounded-xl bg-background/50 border border-border/30 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Amount to Withdraw</span>
                  <span className="text-sm text-muted-foreground">
                    Available: ${totalDeposited.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                    <span className="text-xl">💰</span>
                    <span className="font-semibold">USDC</span>
                  </div>
                  <div className="flex-1 relative">
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="text-xl font-bold bg-transparent border-none text-right pr-16"
                    />
                    <button
                      onClick={handleMaxClick}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/10 rounded"
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>

              {/* Gas Info */}
              <div className="p-4 rounded-xl bg-mint/10 border border-mint/20 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-mint" />
                    <span className="text-sm font-medium text-foreground">Estimated Gas</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-mint">~$0.001</p>
                    <p className="text-xs text-muted-foreground">Powered by Monad</p>
                  </div>
                </div>
              </div>

              {/* Receive Preview */}
              <div className="p-4 rounded-xl bg-background/50 border border-border/30 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">You will receive</span>
                  <span className="text-xl font-display font-bold text-foreground">
                    ${numAmount.toLocaleString()} USDC
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 mb-6">
                <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Withdrawals are instant on Monad. Your funds will be transferred 
                  directly to your connected wallet.
                </p>
              </div>

              {/* Action Button */}
              <Button
                onClick={handleWithdraw}
                disabled={numAmount <= 0 || numAmount > totalDeposited}
                className="w-full btn-secondary h-14 text-lg font-semibold border-accent/50 hover:border-accent"
              >
                Withdraw Now
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
