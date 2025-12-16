import { motion } from 'framer-motion';
import { useWalletStore } from '@/store/walletStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface AllocationChartProps {
  expanded?: boolean;
}

export default function AllocationChart({ expanded = false }: AllocationChartProps) {
  const { protocols } = useWalletStore();

  const chartData = protocols.map(p => ({
    name: p.name,
    value: p.allocation,
    color: p.color,
    apy: p.apy,
    risk: p.risk,
    status: p.status,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-3 border border-border/50">
          <p className="font-semibold text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">Allocation: {data.value}%</p>
          <p className="text-sm text-mint">APY: {data.apy}%</p>
          <p className="text-sm text-muted-foreground">Risk: {data.risk}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ rotateX: 2, rotateY: 2 }}
      className="glass-card p-6"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <h3 className="font-display text-lg font-bold text-foreground mb-4">
        Allocation Breakdown
      </h3>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* 2.5D Chart */}
        <div className="relative w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    style={{
                      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-display font-bold gradient-text">5</p>
              <p className="text-xs text-muted-foreground">Protocols</p>
            </div>
          </div>
        </div>

        {/* Protocol List */}
        <div className="flex-1 space-y-3">
          {protocols.map((protocol, index) => (
            <motion.div
              key={protocol.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 4 }}
              className="flex items-center justify-between p-3 rounded-xl bg-background/30 border border-border/30 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: protocol.color }}
                />
                <div>
                  <p className="font-medium text-foreground text-sm">{protocol.name}</p>
                  <p className="text-xs text-muted-foreground">{protocol.risk} Risk</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-mint text-sm">{protocol.apy}% APY</p>
                <p className="text-xs text-muted-foreground">{protocol.allocation}%</p>
              </div>
              <div className={`px-2 py-0.5 rounded-full text-xs ${
                protocol.status === 'Active' 
                  ? 'bg-mint/20 text-mint' 
                  : 'bg-accent/20 text-accent'
              }`}>
                {protocol.status}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
