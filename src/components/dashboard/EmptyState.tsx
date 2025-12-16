import { motion } from 'framer-motion';
import { Suspense, lazy } from 'react';

const PiggyBank3D = lazy(() => import('@/components/3d/PiggyBank3D'));

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-8 text-center"
    >
      {/* Sleeping Piggy Visual */}
      <div className="relative w-48 h-48 mx-auto mb-6">
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [-2, 2, -2]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-8xl"
        >
          🐷
        </motion.div>
        
        {/* Zzz animation */}
        <motion.div
          className="absolute -top-2 right-8"
          animate={{
            y: [-10, -30],
            opacity: [0, 1, 0],
            scale: [0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          <span className="text-2xl text-primary">z</span>
        </motion.div>
        <motion.div
          className="absolute top-2 right-4"
          animate={{
            y: [-10, -30],
            opacity: [0, 1, 0],
            scale: [0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.3,
            ease: "easeOut",
          }}
        >
          <span className="text-3xl text-mint">Z</span>
        </motion.div>
        <motion.div
          className="absolute top-4 right-0"
          animate={{
            y: [-10, -30],
            opacity: [0, 1, 0],
            scale: [0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.6,
            ease: "easeOut",
          }}
        >
          <span className="text-4xl text-accent">Z</span>
        </motion.div>
      </div>

      {/* Text */}
      <h3 className="font-display text-2xl font-bold text-foreground mb-3">
        Your piggy bank is empty
      </h3>
      <p className="text-muted-foreground max-w-sm mx-auto mb-6">
        Feed it once and let it grow forever. Your smart piggy will automatically 
        find the best yields across DeFi.
      </p>

      {/* Sparkles */}
      <div className="flex justify-center gap-4">
        <motion.span
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl"
        >
          ✨
        </motion.span>
        <motion.span
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          className="text-2xl"
        >
          💰
        </motion.span>
        <motion.span
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          className="text-2xl"
        >
          ✨
        </motion.span>
      </div>
    </motion.div>
  );
}
