import { motion } from 'framer-motion';
import { Zap, DollarSign, Layers, Clock } from 'lucide-react';

export default function MonadAdvantage() {
  const advantages = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Execution',
      description: 'Transactions confirm in milliseconds',
      eth: '12-15 seconds',
      monad: '<1 second',
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Near-Zero Gas',
      description: 'Rebalance as often as needed',
      eth: '$5-50 per tx',
      monad: '$0.001 per tx',
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: 'Parallel Execution',
      description: 'Multiple strategies run simultaneously',
      eth: 'Sequential',
      monad: 'Parallel',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'More Opportunities',
      description: 'Capture yields others miss',
      eth: '1-2 rebalances/day',
      monad: '100+ rebalances/day',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 md:p-8"
    >
      <div className="text-center mb-8">
        <h3 className="font-display text-2xl font-bold text-foreground mb-2">
          Why Monad?
        </h3>
        <p className="text-muted-foreground">
          Smart Piggy Bank leverages Monad's speed for superior yields
        </p>
      </div>

      {/* Comparison Visual */}
      <div className="flex items-center justify-center gap-8 mb-8">
        <motion.div
          animate={{ x: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-3xl mb-2">
            🐢
          </div>
          <p className="text-sm text-muted-foreground">Ethereum</p>
        </motion.div>

        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scaleX: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="h-0.5 w-12 bg-gradient-to-r from-muted to-primary"
          />
          <span className="text-2xl">→</span>
          <motion.div
            animate={{ scaleX: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            className="h-0.5 w-12 bg-gradient-to-r from-primary to-mint"
          />
        </div>

        <motion.div
          animate={{ x: [5, -5, 5] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-3xl mb-2 shadow-glow">
            🐆
          </div>
          <p className="text-sm gradient-text font-semibold">Monad</p>
        </motion.div>
      </div>

      {/* Advantage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {advantages.map((advantage, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="p-4 rounded-xl bg-background/30 border border-border/30 hover:border-primary/30 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/20 text-primary">
                {advantage.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">
                  {advantage.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {advantage.description}
                </p>
                
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">ETH:</span>
                    <span className="text-destructive">{advantage.eth}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Monad:</span>
                    <span className="text-mint font-semibold">{advantage.monad}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
