import { useState } from 'react';
import { Contract, BrowserProvider } from 'ethers';

import { toast } from 'src/components/snackbar';

import airdropService, { IMyAirdrop } from '@/lib/service/airdrop.service';
import AirdropDistributorABI from '@/abis/AirdropDistributor.json';
import blockchainConfig from '@/config/blockchain.json';

// ----------------------------------------------------------------------

export function useClaimAirdrop() {
  const [loading, setLoading] = useState(false);

  const claim = async (airdrop: IMyAirdrop): Promise<boolean> => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      toast.error('MetaMask not found!');
      return false;
    }

    setLoading(true);
    try {
      const provider = new BrowserProvider(ethereum);
      const network = await provider.getNetwork();
      const chainId = String(network.chainId) as keyof typeof blockchainConfig;

      if (!blockchainConfig[chainId]) {
        toast.error('Please switch MetaMask to Hardhat Localhost (Chain ID 31337).');
        return false;
      }

      const signer = await provider.getSigner();
      const airdropContract = new Contract(
        blockchainConfig[chainId].airdrop.address,
        AirdropDistributorABI,
        signer
      );

      toast.info('Claiming airdrop...');
      const tx = await airdropContract.claim(airdrop.campaignId, airdrop.amountWei, airdrop.proof);
      await tx.wait();

      await airdropService.markClaimed(airdrop.campaignId, tx.hash);

      toast.success('Airdrop claimed successfully!');
      return true;
    } catch (error: any) {
      console.error('claimAirdrop error:', error);
      toast.error(error?.reason || error?.message || 'Failed to claim airdrop');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { claim, loading };
}
