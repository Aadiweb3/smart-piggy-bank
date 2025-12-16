import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWalletStore } from '@/store/walletStore';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

type TimeFilter = '7D' | '30D' | 'All';

export default function YieldChart() {
  const { yieldHistory } = useWalletStore();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30D');

  const filteredData = (() => {
    switch (timeFilter) {
      case '7D':
        return yieldHistory.slice(-3);
      case '30D':
        return yieldHistory.slice(-6);
      default:
        return yieldHistory;
    }
  })();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-border/50">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-lg font-bold gradient-text">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">
            Yield Growth
          </h3>
          <p className="text-sm text-muted-foreground">
            Portfolio value over time
          </p>
        </div>
        
        {/* Time Filter */}
        <div className="flex gap-1 p-1 rounded-lg bg-background/50 border border-border/30">
          {(['7D', '30D', 'All'] as TimeFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                timeFilter === filter
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7f5af0" stopOpacity={0.4} />
                <stop offset="50%" stopColor="#2cb67d" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#7f5af0" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7f5af0" />
                <stop offset="100%" stopColor="#2cb67d" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              opacity={0.3}
              vertical={false}
            />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              domain={['dataMin - 50', 'dataMax + 50']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="url(#lineGradient)"
              strokeWidth={3}
              fill="url(#yieldGradient)"
              filter="url(#glow)"
              dot={{
                fill: '#7f5af0',
                strokeWidth: 2,
                stroke: '#fff',
                r: 4,
              }}
              activeDot={{
                fill: '#2cb67d',
                strokeWidth: 2,
                stroke: '#fff',
                r: 6,
                filter: 'url(#glow)',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="flex justify-between mt-6 pt-4 border-t border-border/30">
        <div>
          <p className="text-sm text-muted-foreground">Starting Value</p>
          <p className="font-display font-bold text-foreground">
            ${filteredData[0]?.value.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Current Value</p>
          <p className="font-display font-bold text-mint">
            ${filteredData[filteredData.length - 1]?.value.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Gain</p>
          <p className="font-display font-bold gradient-text">
            +{((filteredData[filteredData.length - 1]?.value / filteredData[0]?.value - 1) * 100).toFixed(2)}%
          </p>
        </div>
      </div>
    </motion.div>
  );
}
