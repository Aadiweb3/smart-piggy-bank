import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, RefreshCw, Zap, Radio } from 'lucide-react';
import { useWalletStore, ActivityItem } from '@/store/walletStore';

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'scan':
      return <Search className="w-4 h-4" />;
    case 'increase':
      return <TrendingUp className="w-4 h-4" />;
    case 'rebalance':
      return <RefreshCw className="w-4 h-4" />;
    case 'execute':
      return <Zap className="w-4 h-4" />;
    default:
      return <Radio className="w-4 h-4" />;
  }
};

const getActivityColor = (type: ActivityItem['type']) => {
  switch (type) {
    case 'scan':
      return 'text-status-scanning bg-status-scanning/20';
    case 'increase':
      return 'text-mint bg-mint/20';
    case 'rebalance':
      return 'text-accent bg-accent/20';
    case 'execute':
      return 'text-primary bg-primary/20';
    default:
      return 'text-muted-foreground bg-muted/20';
  }
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export default function ActivityFeed() {
  const { activities, optimizerStatus } = useWalletStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-bold text-foreground">
          Auto-Optimizer Activity
        </h3>
        <div className="flex items-center gap-2">
          <span className={`status-dot ${
            optimizerStatus === 'scanning' ? 'status-scanning' :
            optimizerStatus === 'analyzing' ? 'status-analyzing' :
            optimizerStatus === 'rebalancing' ? 'status-rebalancing' :
            'status-idle'
          }`} />
          <span className="text-sm text-muted-foreground capitalize">
            {optimizerStatus}
          </span>
        </div>
      </div>

      {/* Activity List */}
      <div 
        ref={scrollRef}
        className="space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin"
      >
        <AnimatePresence mode="popLayout">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-background/30 border border-border/30 hover:border-primary/20 transition-all"
            >
              <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-snug">
                  {activity.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatTime(activity.timestamp)}
                </p>
              </div>
              {index === 0 && (
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium animate-pulse">
                  New
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Live indicator */}
      <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border/30">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-mint"></span>
        </span>
        <span className="text-xs text-muted-foreground">Live updates on Monad</span>
      </div>
    </motion.div>
  );
}
