import { motion } from 'framer-motion';
import { Wallet, ChevronDown, ExternalLink, Copy, LogOut } from 'lucide-react';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useWalletStore } from '@/store/walletStore';
import { monadTestnet } from '@/config/wagmi';

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balanceData } = useBalance({ address });
  
  const { connect: storeConnect, disconnect: storeDisconnect } = useWalletStore();

  // Sync wagmi state with zustand store
  useEffect(() => {
    if (isConnected && address) {
      storeConnect(address);
    } else {
      storeDisconnect();
    }
  }, [isConnected, address, storeConnect, storeDisconnect]);

  const handleConnect = async () => {
    const injectedConnector = connectors.find((c) => c.id === 'injected');
    if (injectedConnector) {
      try {
        connect({ connector: injectedConnector });
      } catch (error) {
        toast.error('Failed to connect wallet');
      }
    } else {
      toast.error('MetaMask not found. Please install MetaMask.');
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.info('Wallet disconnected');
  };

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard');
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const openExplorer = () => {
    if (address) {
      window.open(`${monadTestnet.blockExplorers.default.url}/address/${address}`, '_blank');
    }
  };

  if (!isConnected) {
    return (
      <Button
        onClick={handleConnect}
        disabled={isPending}
        className="btn-primary gap-2"
      >
        <Wallet className="w-4 h-4" />
        {isPending ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 px-4 py-2 rounded-xl bg-card-glass/60 border border-border/50 hover:border-primary/50 transition-all"
        >
          {/* Network Badge */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-mint"></span>
            </span>
            <span className="text-xs font-medium text-mint">Monad</span>
          </div>
          
          <div className="h-4 w-px bg-border" />
          
          {/* Address */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-primary" />
            <span className="font-mono text-sm text-foreground">
              {address && formatAddress(address)}
            </span>
          </div>
          
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 glass-card border-border/50">
        <div className="px-3 py-2">
          <p className="text-sm text-muted-foreground">Balance</p>
          <p className="text-lg font-display font-bold text-foreground">
            {balanceData ? `${(Number(balanceData.value) / 10 ** balanceData.decimals).toFixed(4)} ${balanceData.symbol}` : '0 MON'}
          </p>
        </div>
        
        <DropdownMenuSeparator className="bg-border/50" />
        
        <DropdownMenuItem onClick={handleCopyAddress} className="gap-2 cursor-pointer">
          <Copy className="w-4 h-4" />
          Copy Address
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={openExplorer} className="gap-2 cursor-pointer">
          <ExternalLink className="w-4 h-4" />
          View on Explorer
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-border/50" />
        
        <DropdownMenuItem 
          onClick={handleDisconnect}
          className="gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
