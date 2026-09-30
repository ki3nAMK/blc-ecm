import { useState } from 'react';
import { ethers, Contract, BrowserProvider } from 'ethers';

import { toast } from 'src/components/snackbar';

import productService from '@/lib/service/product.service';
import EscrowABI from '@/abis/Escrow.json';
import MyERC1155ABI from '@/abis/MyERC1155.json';
import blockchainConfig from '@/config/blockchain.json';

// ----------------------------------------------------------------------

export type ListableProduct = {
  id: string;
  tokenId: string;
  escrow: number;
  price: number;
  quantity: number;
};

const toBytes32 = (hexId: string) => {
  try {
    return ethers.encodeBytes32String(hexId);
  } catch {
    return `0x${hexId.padStart(64, '0')}`;
  }
};

export function useListProductOnChain() {
  const [loading, setLoading] = useState(false);

  const listOnChain = async (product: ListableProduct): Promise<boolean> => {
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
      const sellerAddress = await signer.getAddress();
      const escrowAddress = blockchainConfig[chainId].escrow.address;

      const myErc1155 = new Contract(blockchainConfig[chainId].myErc1155.address, MyERC1155ABI, signer);
      const escrowContract = new Contract(escrowAddress, EscrowABI, signer);

      const isApproved: boolean = await myErc1155.isApprovedForAll(sellerAddress, escrowAddress);
      if (!isApproved) {
        toast.info('Approving Escrow contract to hold your tokens...');
        const approveTx = await myErc1155.setApprovalForAll(escrowAddress, true);
        await approveTx.wait();
      }

      toast.info('Listing product on-chain...');
      const listTx = await escrowContract.list(
        toBytes32(product.id),
        ethers.parseEther(String(product.escrow)),
        ethers.parseEther(String(product.price)),
        product.quantity,
        product.tokenId
      );
      await listTx.wait();

      await productService.publishProduct(product.id);

      toast.success('Product listed on blockchain successfully!');
      return true;
    } catch (error: any) {
      console.error('listOnChain error:', error);
      toast.error(error?.reason || error?.message || 'Failed to list product on-chain');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { listOnChain, loading };
}
