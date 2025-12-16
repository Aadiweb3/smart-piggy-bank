import { motion } from 'framer-motion';
import { Wallet, ChevronDown, ExternalLink, Copy, LogOut } from 'lucide-react';
import { useWalletStore } from '@/store/walletStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export default function WalletConnect() {
  const { isConnected, address, balance, connect, disconnect } = useWalletStore();

  const handleConnect = () => {
    // Simulate wallet connection
    const mockAddress = '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 6);
    connect(mockAddress);
    toast.success('Wallet connected!', {
      description: 'Connected to Monad Testnet',
    });
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

  if (!isConnected) {
    return (
      <Button
        onClick={handleConnect}
        className="btn-primary gap-2"
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
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
            <span className="font-mono text-sm text-foreground">{address}</span>
          </div>
          
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 glass-card border-border/50">
        <div className="px-3 py-2">
          <p className="text-sm text-muted-foreground">Balance</p>
          <p className="text-lg font-display font-bold text-foreground">
            ${balance.toLocaleString()} USDC
          </p>
        </div>
        
        <DropdownMenuSeparator className="bg-border/50" />
        
        <DropdownMenuItem onClick={handleCopyAddress} className="gap-2 cursor-pointer">
          <Copy className="w-4 h-4" />
          Copy Address
        </DropdownMenuItem>
        
        <DropdownMenuItem className="gap-2 cursor-pointer">
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
