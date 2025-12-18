import { create } from 'zustand';

export interface Protocol {
  id: string;
  name: string;
  apy: number;
  allocation: number;
  risk: 'Low' | 'Medium' | 'High';
  status: 'Active' | 'Rebalancing';
  color: string;
}

export interface ActivityItem {
  id: string;
  type: 'scan' | 'increase' | 'rebalance' | 'execute';
  message: string;
  timestamp: Date;
}

export interface YieldData {
  date: string;
  value: number;
}

interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: number;
  totalDeposited: number;
  currentAPY: number;
  todayYield: number;
  monthlyEstimate: number;
  protocols: Protocol[];
  activities: ActivityItem[];
  yieldHistory: YieldData[];
  optimizerStatus: 'scanning' | 'analyzing' | 'rebalancing' | 'idle';
  
  // Actions
  connect: (address: string) => void;
  disconnect: () => void;
  setTotalDeposited: (amount: number) => void;
  setBalance: (balance: number) => void;
  setProtocols: (protocols: Protocol[]) => void;
  setOptimizerStatus: (status: 'scanning' | 'analyzing' | 'rebalancing' | 'idle') => void;
  addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
}

const defaultProtocols: Protocol[] = [
  { id: '1', name: 'Strategy A', apy: 8.5, allocation: 40, risk: 'Low', status: 'Active', color: '#7F5AF0' },
  { id: '2', name: 'Strategy B', apy: 7.2, allocation: 35, risk: 'Low', status: 'Active', color: '#2CB67D' },
  { id: '3', name: 'Strategy C', apy: 9.1, allocation: 25, risk: 'Medium', status: 'Active', color: '#FF8906' },
];

const mockActivities: ActivityItem[] = [
  { id: '1', type: 'scan', message: 'Scanning yield opportunities...', timestamp: new Date(Date.now() - 1000 * 60) },
  { id: '2', type: 'increase', message: 'Strategy C APY increased to 9.1%', timestamp: new Date(Date.now() - 1000 * 120) },
  { id: '3', type: 'rebalance', message: 'Reallocating funds across strategies', timestamp: new Date(Date.now() - 1000 * 180) },
  { id: '4', type: 'execute', message: 'Transaction executed on Monad (0.001 gas)', timestamp: new Date(Date.now() - 1000 * 240) },
  { id: '5', type: 'scan', message: 'Monitoring 3 strategies...', timestamp: new Date(Date.now() - 1000 * 300) },
];

const mockYieldHistory: YieldData[] = [
  { date: '2024-01-01', value: 1000 },
  { date: '2024-01-05', value: 1012 },
  { date: '2024-01-10', value: 1028 },
  { date: '2024-01-15', value: 1045 },
  { date: '2024-01-20', value: 1067 },
  { date: '2024-01-25', value: 1089 },
  { date: '2024-01-30', value: 1115 },
  { date: '2024-02-04', value: 1142 },
  { date: '2024-02-09', value: 1178 },
  { date: '2024-02-14', value: 1205 },
];

export const useWalletStore = create<WalletState>((set, get) => ({
  isConnected: false,
  address: null,
  balance: 0,
  totalDeposited: 0,
  currentAPY: 8.3,
  todayYield: 0,
  monthlyEstimate: 0,
  protocols: defaultProtocols,
  activities: mockActivities,
  yieldHistory: mockYieldHistory,
  optimizerStatus: 'idle',

  connect: (address) => set({ 
    isConnected: true, 
    address,
  }),
  
  disconnect: () => set({ 
    isConnected: false, 
    address: null,
    totalDeposited: 0,
    balance: 0,
    todayYield: 0,
    monthlyEstimate: 0,
  }),

  setTotalDeposited: (amount) => {
    const { currentAPY } = get();
    set({
      totalDeposited: amount,
      todayYield: (amount * (currentAPY / 100)) / 365,
      monthlyEstimate: (amount * (currentAPY / 100)) / 12,
    });
  },

  setBalance: (balance) => set({ balance }),

  setProtocols: (protocols) => set({ protocols }),
  
  setOptimizerStatus: (status) => set({ optimizerStatus: status }),
  
  addActivity: (activity) => {
    const { activities } = get();
    const newActivity: ActivityItem = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    set({ activities: [newActivity, ...activities.slice(0, 9)] });
  },
}));
