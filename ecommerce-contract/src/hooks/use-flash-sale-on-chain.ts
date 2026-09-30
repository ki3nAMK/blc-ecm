import { useState } from 'react';
import { ethers, Contract, BrowserProvider } from 'ethers';

import { toast } from 'src/components/snackbar';

import productService from '@/lib/service/product.service';
import EscrowABI from '@/abis/Escrow.json';
import blockchainConfig from '@/config/blockchain.json';

// ----------------------------------------------------------------------

export type FlashSaleInput = {
  id: string;
  discountedPrice: number;
  discountedEscrow: number;
  startDelaySeconds?: number; // seconds from now the sale should start — 0 for immediate (default)
  durationSeconds: number;
};

const toBytes32 = (hexId: string) => {
  try {
    return ethers.encodeBytes32String(hexId);
  } catch {
    return `0x${hexId.padStart(64, '0')}`;
  }
};

function getEscrowContract(signer: any, chainId: keyof typeof blockchainConfig) {
  return new Contract(blockchainConfig[chainId].escrow.address, EscrowABI, signer);
}

async function getSignerAndChain() {
  const ethereum = (window as any).ethereum;
  if (!ethereum) {
    toast.error('MetaMask not found!');
    return null;
  }

  const provider = new BrowserProvider(ethereum);
  const network = await provider.getNetwork();
  const chainId = String(network.chainId) as keyof typeof blockchainConfig;

  if (!blockchainConfig[chainId]) {
    toast.error('Please switch MetaMask to Hardhat Localhost (Chain ID 31337).');
    return null;
  }

  const signer = await provider.getSigner();
  return { provider, signer, chainId };
}

export function useFlashSaleOnChain() {
  const [loading, setLoading] = useState(false);

  const setFlashSaleOnChain = async (input: FlashSaleInput): Promise<boolean> => {
    setLoading(true);
    try {
      const ctx = await getSignerAndChain();
      if (!ctx) return false;
      const escrowContract = getEscrowContract(ctx.signer, ctx.chainId);

      // Base the window on the CHAIN's own clock, not the browser's — a local Hardhat node
      // can sit idle and drift its block timestamp well behind (or ahead of) wall-clock time,
      // which would make a "start now" sale look like it starts in the future to the contract
      // and silently never apply the discount.
      const latestBlock = await ctx.provider.getBlock('latest');
      const chainNow = latestBlock!.timestamp;
      const startTime = chainNow + (input.startDelaySeconds ?? 0);
      const endTime = startTime + input.durationSeconds;

      toast.info('Starting flash sale on-chain...');
      const tx = await escrowContract.setFlashSale(
        toBytes32(input.id),
        ethers.parseEther(String(input.discountedPrice)),
        ethers.parseEther(String(input.discountedEscrow)),
        startTime,
        endTime
      );
      const receipt = await tx.wait();

      await productService.setFlashSale(input.id, {
        discountedPrice: input.discountedPrice,
        discountedEscrow: input.discountedEscrow,
        startTime: new Date(startTime * 1000).toISOString(),
        endTime: new Date(endTime * 1000).toISOString(),
        txHash: receipt.hash,
      });

      toast.success('Flash sale is now live!');
      return true;
    } catch (error: any) {
      console.error('setFlashSaleOnChain error:', error);
      toast.error(error?.reason || error?.message || 'Failed to start flash sale');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancelFlashSaleOnChain = async (productId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const ctx = await getSignerAndChain();
      if (!ctx) return false;
      const escrowContract = getEscrowContract(ctx.signer, ctx.chainId);

      toast.info('Canceling flash sale on-chain...');
      const tx = await escrowContract.cancelFlashSale(toBytes32(productId));
      await tx.wait();

      await productService.cancelFlashSale(productId);

      toast.success('Flash sale canceled.');
      return true;
    } catch (error: any) {
      console.error('cancelFlashSaleOnChain error:', error);
      toast.error(error?.reason || error?.message || 'Failed to cancel flash sale');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { setFlashSaleOnChain, cancelFlashSaleOnChain, loading };
}
