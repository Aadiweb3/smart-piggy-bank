import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { VAULT_ADDRESS, VAULT_ABI, ERC20_ABI, STRATEGY_ABI } from '@/config/contracts';
import { useWalletStore } from '@/store/walletStore';
import { useEffect, useRef } from 'react';

const USDT_DECIMALS = 6;

export function useUserDeposits() {
  const { address, isConnected } = useAccount();
  const { data: userDeposits, refetch, isLoading } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'userDeposits',
    args: address ? [address] : undefined,
    query: { enabled: isConnected && !!address },
  });
  const formattedDeposits = userDeposits ? parseFloat(formatUnits(userDeposits as bigint, USDT_DECIMALS)) : 0;
  return { userDeposits: formattedDeposits, refetch, isLoading };
}

export function useVaultUSDT() {
  const { data: usdtAddress } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'usdt',
  });
  return usdtAddress as `0x${string}` | undefined;
}

export function useUSDTBalance() {
  const { address, isConnected } = useAccount();
  const usdtAddress = useVaultUSDT();
  const { data: balance, refetch, isLoading } = useReadContract({
    address: usdtAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: isConnected && !!address && !!usdtAddress },
  });
  const formattedBalance = balance ? parseFloat(formatUnits(balance as bigint, USDT_DECIMALS)) : 0;
  return { balance: formattedBalance, refetch, isLoading };
}

export function useUSDTAllowance() {
  const { address, isConnected } = useAccount();
  const usdtAddress = useVaultUSDT();
  const { data: allowance, refetch } = useReadContract({
    address: usdtAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, VAULT_ADDRESS] : undefined,
    query: { enabled: isConnected && !!address && !!usdtAddress },
  });
  const formattedAllowance = allowance ? parseFloat(formatUnits(allowance as bigint, USDT_DECIMALS)) : 0;
  return { allowance: formattedAllowance, refetch };
}

export function useStrategyAllocations() {
  const { data: piggyAAddress } = useReadContract({ address: VAULT_ADDRESS, abi: VAULT_ABI, functionName: 'piggyA' });
  const { data: piggyBAddress } = useReadContract({ address: VAULT_ADDRESS, abi: VAULT_ABI, functionName: 'piggyB' });
  const { data: piggyCAddress } = useReadContract({ address: VAULT_ADDRESS, abi: VAULT_ABI, functionName: 'piggyC' });
  const { data: piggyADeposits } = useReadContract({ address: piggyAAddress as `0x${string}`, abi: STRATEGY_ABI, functionName: 'totalDeposits', query: { enabled: !!piggyAAddress } });
  const { data: piggyBDeposits } = useReadContract({ address: piggyBAddress as `0x${string}`, abi: STRATEGY_ABI, functionName: 'totalDeposits', query: { enabled: !!piggyBAddress } });
  const { data: piggyCDeposits } = useReadContract({ address: piggyCAddress as `0x${string}`, abi: STRATEGY_ABI, functionName: 'totalDeposits', query: { enabled: !!piggyCAddress } });
  
  const strategyA = piggyADeposits ? parseFloat(formatUnits(piggyADeposits as bigint, USDT_DECIMALS)) : 0;
  const strategyB = piggyBDeposits ? parseFloat(formatUnits(piggyBDeposits as bigint, USDT_DECIMALS)) : 0;
  const strategyC = piggyCDeposits ? parseFloat(formatUnits(piggyCDeposits as bigint, USDT_DECIMALS)) : 0;
  const total = strategyA + strategyB + strategyC;

  return {
    strategies: [
      { name: 'Strategy A', amount: strategyA, percentage: total > 0 ? (strategyA / total) * 100 : 40 },
      { name: 'Strategy B', amount: strategyB, percentage: total > 0 ? (strategyB / total) * 100 : 35 },
      { name: 'Strategy C', amount: strategyC, percentage: total > 0 ? (strategyC / total) * 100 : 25 },
    ],
    total,
  };
}

export function useDeposit() {
  const usdtAddress = useVaultUSDT();
  const { refetch: refetchDeposits } = useUserDeposits();
  const { refetch: refetchBalance } = useUSDTBalance();
  const { refetch: refetchAllowance } = useUSDTAllowance();
  const addActivity = useWalletStore((state) => state.addActivity);
  const pendingAmountRef = useRef<string | null>(null);

  const { writeContract: approve, isPending: isApproving, reset: resetApprove } = useWriteContract();
  const { writeContract: depositFn, data: depositHash, isPending: isDepositing, reset: resetDeposit } = useWriteContract();
  const { isLoading: isDepositConfirming, isSuccess: isDepositConfirmed } = useWaitForTransactionReceipt({ hash: depositHash });

  useEffect(() => {
    if (isDepositConfirmed) {
      pendingAmountRef.current = null;
      refetchDeposits();
      refetchBalance();
      refetchAllowance();
      addActivity({ type: 'execute', message: 'Deposit executed successfully on Monad' });
    }
  }, [isDepositConfirmed]);

  const startDeposit = (amount: number) => {
    if (!usdtAddress) return;
    pendingAmountRef.current = amount.toString();
    const amountInUnits = parseUnits(amount.toString(), USDT_DECIMALS);

    approve(
      { address: usdtAddress, abi: ERC20_ABI, functionName: 'approve', args: [VAULT_ADDRESS, amountInUnits] },
      { onSuccess: () => {
        depositFn({ address: VAULT_ADDRESS, abi: VAULT_ABI, functionName: 'deposit', args: [amountInUnits] });
      }}
    );
  };

  const reset = () => { pendingAmountRef.current = null; resetApprove(); resetDeposit(); };

  return { deposit: startDeposit, isApproving, isDepositing, isDepositConfirming, isDepositConfirmed, depositHash, reset };
}

export function useWithdraw() {
  const { refetch: refetchDeposits } = useUserDeposits();
  const { refetch: refetchBalance } = useUSDTBalance();
  const addActivity = useWalletStore((state) => state.addActivity);

  const { writeContract: withdraw, data: withdrawHash, isPending: isWithdrawing, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: withdrawHash });

  useEffect(() => {
    if (isConfirmed) {
      refetchDeposits();
      refetchBalance();
      addActivity({ type: 'execute', message: 'Withdrawal executed successfully on Monad' });
    }
  }, [isConfirmed]);

  const executeWithdraw = (amount: number) => {
    const amountInUnits = parseUnits(amount.toString(), USDT_DECIMALS);
    withdraw({ address: VAULT_ADDRESS, abi: VAULT_ABI, functionName: 'withdraw', args: [amountInUnits] });
  };

  return { withdraw: executeWithdraw, isWithdrawing, isConfirming, isConfirmed, withdrawHash, reset };
}

export function useSyncVaultData() {
  const { userDeposits, isLoading: isDepositsLoading } = useUserDeposits();
  const { balance, isLoading: isBalanceLoading } = useUSDTBalance();
  const { strategies } = useStrategyAllocations();
  const setTotalDeposited = useWalletStore((state) => state.setTotalDeposited);
  const setBalance = useWalletStore((state) => state.setBalance);
  const setProtocols = useWalletStore((state) => state.setProtocols);

  useEffect(() => { if (!isDepositsLoading) setTotalDeposited(userDeposits); }, [userDeposits, isDepositsLoading]);
  useEffect(() => { if (!isBalanceLoading) setBalance(balance); }, [balance, isBalanceLoading]);
  useEffect(() => {
    const protocols = strategies.map((s, i) => ({
      id: String(i + 1), name: s.name, apy: [8.5, 7.2, 9.1][i], allocation: s.percentage,
      risk: (['Low', 'Low', 'Medium'] as const)[i], status: 'Active' as const, color: ['#7F5AF0', '#2CB67D', '#FF8906'][i],
    }));
    setProtocols(protocols);
  }, [strategies]);

  return { isLoading: isDepositsLoading || isBalanceLoading };
}
