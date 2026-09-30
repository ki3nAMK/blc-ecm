import type { IOrderProductItem } from 'src/types/order';

import { Button, Chip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';

import { useAuthContext } from '@/auth/hooks';
import orderService, { IUpdateItemStatusPayload } from '@/lib/service/order.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { fCurrency, fEth } from 'src/utils/format-number';
import EscrowABI from "@/abis/Escrow.json";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BrowserProvider, Contract, ethers } from 'ethers';
import config from "@/config/blockchain.json";
import { get } from 'lodash';
import { toast } from 'sonner';

// ----------------------------------------------------------------------
// ENUM TRẠNG THÁI
export enum OrderType {
  NONE = 'NONE',
  DEPOSIT_ESCROW = 'DEPOSIT_ESCROW',
  FULLY_DEPOSITED = 'FULLY_DEPOSITED',
  CANCLED = 'CANCLED',
  ON_WAITING_REFUND = 'ON_WAITING_REFUND',
  SELLER_FINALIZED = 'SELLER_FINALIZED',
  ORDER_RECEIVED = 'ORDER_RECEIVED',
  DONE = 'DONE',
}

// ITEM MỞ RỘNG
export type IOrderProductItemExtended = IOrderProductItem & {
  orderType?: OrderType;
  escrowAmount?: number;
  remainingAmount?: number;
  status?: OrderType;
  escrow?: number;
  isVerifyBySeller?: boolean;
  orderContractId?: string;
};

// ----------------------------------------------------------------------

type Props = {
  taxes?: number;
  shipping?: number;
  discount?: number;
  subtotal?: number;
  totalAmount?: number;
  items?: IOrderProductItemExtended[];
  orderId: string;
  buyerAddress?: string;
  referrerAddress?: string;
};

// ----------------------------------------------------------------------

export function OrderDetailsItems({
  taxes,
  shipping,
  discount,
  subtotal,
  items = [],
  totalAmount,
  orderId,
  buyerAddress,
  referrerAddress
}: Props) {
  const queryClient = useQueryClient();
  const [escrowContract, setEscrowContract] = useState<ethers.Contract | null>(null);

  const loadBlockchainData = async () => {
    const provider = new BrowserProvider((window as any).ethereum);

    const network = await provider.getNetwork();

    const chainId = String(network.chainId) as keyof typeof config;

    if (!config[chainId]) {
      console.warn(`Chain ID ${chainId} is not configured in blockchain.json. Please switch MetaMask to Hardhat Localhost (Chain ID 31337).`);
      return;
    }

    const escrow = new Contract(
      config[chainId].escrow.address,
      EscrowABI,
      provider
    );

    setEscrowContract(escrow);

    // (window as any).ethereum.on("accountsChanged", async (accounts: string[]) => {
    //   const account = accounts[0];
    //   setAccount(account as any);
    // });
  };

  useEffect(() => {
    loadBlockchainData();

    if ((window as any).ethereum) {
      const handleChainChanged = () => {
        window.location.reload();
      };
      (window as any).ethereum.on("chainChanged", handleChainChanged);

      return () => {
        (window as any).ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  const updateStatusMutation = useMutation({
    mutationFn: (payload: { data: IUpdateItemStatusPayload }) =>
      orderService.updateItemStatus(orderId, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-detail'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-detail'] });
    },
  });

  const handleUpdateStatus = (productId: string, status: OrderType) => {
    updateStatusMutation.mutate({
      data: {
        productId,
        status,
      },
    });
  };


  const { user } = useAuthContext();

  const isSeller = useMemo(() => user?.role === 'SELLER', [user]);
  const isBuyer = useMemo(() => user?.role === 'CLIENT', [user]);

  // ----------------------------------------------------------------------
  // TOTAL
  const renderTotal = (
    <Stack spacing={2} alignItems="flex-end" sx={{ p: 3, textAlign: 'right', typography: 'body2' }}>
      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Subtotal</Box>
        <Box sx={{ width: 160, typography: 'subtitle2' }}>{fCurrency(subtotal) || '-'}</Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Shipping</Box>
        <Box sx={{ width: 160, ...(shipping && { color: 'error.main' }) }}>
          {shipping ? `- ${fCurrency(shipping)}` : '-'}
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Discount</Box>
        <Box sx={{ width: 160, ...(discount && { color: 'error.main' }) }}>
          {discount ? `- ${fCurrency(discount)}` : '-'}
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Taxes</Box>
        <Box sx={{ width: 160 }}>{taxes ? fCurrency(taxes) : '-'}</Box>
      </Stack>

      <Stack direction="row" sx={{ typography: 'subtitle1' }}>
        <div>Total</div>
        <Box sx={{ width: 160 }}>{fCurrency(totalAmount) || '-'}</Box>
      </Stack>
    </Stack>
  );

  const toBytes32 = (hexId: string) => {
    try {
      return ethers.encodeBytes32String(hexId);
    } catch (e) {
      return "0x" + hexId.padStart(64, "0");
    }
  };


  const callContract = useCallback(async (method: string, args: any[] = [], value?: string | bigint) => {
    if (!escrowContract) return console.error("Contract not loaded");

    const provider = new BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();

    const contractWithSigner = escrowContract.connect(signer);

    if (value) {
      return (contractWithSigner as any)[method](...args, { value });
    }

    return (contractWithSigner as any)[method](...args);
  }, [escrowContract])

  const handleDepositEscrow = async (item: IOrderProductItemExtended) => {
    // Use the order's own unitEscrow snapshot (set at order-creation time) rather than the
    // product's live escrow — if a flash sale is active, the contract's depositEarnest will
    // expect the discounted amount, and sending the stale full-price amount reverts with
    // "Wrong escrow".
    const escrowAmount = item.unitEscrow ?? ((item.productId as any)?.escrow || 0);

    const productIdBytes32 = toBytes32(get(item, "productId.id", ""));
    const orderIdBytes32 = toBytes32(get(item, "orderContractId", ""));

    const totalEscrow = (escrowAmount * item.quantity).toFixed(8).replace(/\.?0+$/, "");

    try {
      const tx = await callContract(
        "depositEarnest",
        [productIdBytes32, orderIdBytes32, item.quantity, referrerAddress || ethers.ZeroAddress],
        ethers.parseEther(totalEscrow)
      );
      if (tx) {
        toast.info("Transaction submitted. Waiting for confirmation...");
        await tx.wait();
        toast.success("Deposit Escrow successful!");
        handleUpdateStatus(item.productId.id, OrderType.DEPOSIT_ESCROW);
      }
    } catch (error: any) {
      console.error("depositEscrow error:", error);
      toast.error(error?.reason || error?.message || "Transaction failed");
    }
  }

  const handleApproveProduct = async (item: IOrderProductItemExtended) => {
    if (!buyerAddress) {
      console.error("Buyer address is not available");
      toast.error("Buyer address is not available");
      return;
    }
    const productIdBytes32 = toBytes32(get(item, "productId.id", ""));
    const orderIdBytes32 = toBytes32(get(item, "orderContractId", ""));

    try {
      const tx = await callContract(
        "approveProduct",
        [productIdBytes32, orderIdBytes32, buyerAddress.toLowerCase()]
      );
      if (tx) {
        toast.info("Transaction approved. Waiting for confirmation...");
        await tx.wait();
        toast.success("Product approved successfully!");
        updateStatusMutation.mutate({
          data: {
            productId: item.productId.id,
            isVerifyBySeller: true
          },
        });
      }
    } catch (error: any) {
      console.error("approveProduct error:", error);
      toast.error(error?.reason || error?.message || "Transaction failed");
    }
  };

  const handleDepositRemaining = async (item: IOrderProductItemExtended) => {
    const orderIdBytes32 = toBytes32(get(item, "orderContractId", ""));

    // Must mirror the order's OWN unitPrice/unitEscrow snapshot, not the live product —
    // the contract's depositRestAmount now computes rest from the order's snapshot taken
    // at depositEarnest time, which can differ from the product's current price if a flash
    // sale has since expired or been canceled. Recomputing from live state here would send
    // the wrong amount and revert with "Value must equal rest of price".
    const hasSnapshot = item.unitPrice != null && item.unitEscrow != null;
    const price = hasSnapshot ? item.unitPrice! : (item.productId as any)?.price || 0;
    const escrowAmount = hasSnapshot ? item.unitEscrow! : (item.productId as any)?.escrow || 0;
    const remainingPerUnit = price - escrowAmount;
    const totalRemaining = (remainingPerUnit * item.quantity).toFixed(8).replace(/\.?0+$/, "");

    try {
      const tx = await callContract(
        "depositRestAmount",
        [orderIdBytes32],
        ethers.parseEther(totalRemaining)
      );
      if (tx) {
        toast.info("Remaining deposit transaction submitted. Waiting...");
        await tx.wait();
        toast.success("Remaining payment deposited successfully!");
        handleUpdateStatus(item.productId.id, OrderType.FULLY_DEPOSITED);
      }
    } catch (error: any) {
      console.error("depositRemaining error:", error);
      toast.error(error?.reason || error?.message || "Transaction failed");
    }
  };

  const handleFinalizeOrder = async (item: IOrderProductItemExtended) => {
    if (!buyerAddress) {
      console.error("Buyer address is not available");
      toast.error("Buyer address is not available");
      return;
    }
    const orderIdBytes32 = toBytes32(get(item, "orderContractId", ""));

    try {
      const tx = await callContract(
        "finalizeOrder",
        [orderIdBytes32, buyerAddress.toLowerCase()]
      );
      if (tx) {
        toast.info("Finalizing transaction submitted. Waiting...");
        await tx.wait();
        toast.success("Order finalized successfully!");
        handleUpdateStatus(item.productId.id, OrderType.SELLER_FINALIZED);
      }
    } catch (error: any) {
      console.error("finalizeOrder error:", error);
      toast.error(error?.reason || error?.message || "Transaction failed");
    }
  };

  const handleConfirmReceived = async (item: IOrderProductItemExtended) => {
    const orderIdBytes32 = toBytes32(get(item, "orderContractId", ""));

    try {
      const tx = await callContract(
        "approveReceiveProduct",
        [orderIdBytes32]
      );
      if (tx) {
        toast.info("Confirming delivery transaction submitted...");
        await tx.wait();
        toast.success("Delivery confirmed successfully!");
        handleUpdateStatus(item.productId.id, OrderType.ORDER_RECEIVED);
      }
    } catch (error: any) {
      console.error("confirmReceived error:", error);
      toast.error(error?.reason || error?.message || "Transaction failed");
    }
  };

  const handleRewardOrder = async (item: IOrderProductItemExtended) => {
    if (!buyerAddress) {
      console.error("Buyer address is not available");
      toast.error("Buyer address is not available");
      return;
    }
    const orderIdBytes32 = toBytes32(get(item, "orderContractId", ""));

    try {
      const tx = await callContract(
        "rewardOrder",
        [orderIdBytes32, buyerAddress.toLowerCase()]
      );
      if (tx) {
        toast.info("Rewarding transaction submitted...");
        await tx.wait();
        toast.success("Funds rewarded and order completed!");
        handleUpdateStatus(item.productId.id, OrderType.DONE);
      }
    } catch (error: any) {
      console.error("rewardOrder error:", error);
      toast.error(error?.reason || error?.message || "Transaction failed");
    }
  };


  // ----------------------------------------------------------------------
  // CHIP TRẠNG THÁI
  const getStatusChip = (type: OrderType) => {
    const map: Record<OrderType, { label: string; color: any }> = {
      NONE: { label: 'Wating for deposit escrow', color: 'info' },
      DEPOSIT_ESCROW: { label: 'Escrowed, wait for remaining deposit', color: 'warning' },
      FULLY_DEPOSITED: { label: 'Fully Deposited', color: 'info' },
      CANCLED: { label: 'Cancelled', color: 'error' },
      ON_WAITING_REFUND: { label: 'Refund Requested', color: 'secondary' },
      SELLER_FINALIZED: { label: 'Seller Finalized', color: 'primary' },
      ORDER_RECEIVED: { label: 'Received', color: 'success' },
      DONE: { label: 'Completed', color: 'success' },
    };

    const { label, color } = map[type] || map.NONE;
    return <Chip label={label} color={color} size="small" />;
  };

  // ----------------------------------------------------------------------
  // BUTTON ACTION
  const renderActions = (item: IOrderProductItemExtended) => {
    const status = item.status ?? OrderType.NONE;
    const loading = updateStatusMutation.isPending;

    // BUYER ACTIONS
    if (isBuyer) {
      switch (status) {
        case OrderType.NONE:
          return (
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="solar:wallet-bold" />}
              disabled={loading}
              onClick={() => { handleDepositEscrow(item) }}
            >
              Deposit Escrow
            </Button>
          );

        case OrderType.DEPOSIT_ESCROW:
          if (!item.isVerifyBySeller) {
            return (
              <Chip label="Waiting for seller approval" color="warning" size="small" />
            );
          }
          const price = (item.productId as any)?.price || 0;
          const escrowAmount = (item.productId as any)?.escrow || 0;
          const calculatedRemaining = (price - escrowAmount) * item.quantity;
          const displayRemaining = item.remainingAmount || calculatedRemaining;
          return (
            <Button
              size="small"
              variant="contained"
              color="secondary"
              startIcon={<Iconify icon="solar:money-bag-bold" />}
              disabled={loading}
              onClick={() => handleDepositRemaining(item)}
            >
              Deposit Remaining {fEth(displayRemaining)}
            </Button>
          );

        case OrderType.SELLER_FINALIZED:
          return (
            <Button
              size="small"
              variant="contained"
              color="success"
              startIcon={<Iconify icon="solar:box-bold" />}
              disabled={loading}
              onClick={() => handleConfirmReceived(item)}
            >
              Confirm Received
            </Button>
          );

        case OrderType.FULLY_DEPOSITED:
          return (
            <Chip label="Waiting for seller finalize" color="warning" size="small" />
          );

        case OrderType.ON_WAITING_REFUND:
          return (
            <Chip label="Refund in progress" color="secondary" size="small" />
          );

        default:
          return null;
      }
    }

    // SELLER ACTIONS
    if (isSeller) {
      switch (status) {
        case OrderType.DEPOSIT_ESCROW:
          if (!item.isVerifyBySeller) {
            return (
              <Button
                size="small"
                variant="contained"
                color="warning"
                startIcon={<Iconify icon="solar:check-circle-bold" />}
                disabled={loading}
                onClick={() => handleApproveProduct(item)}
              >
                Approve Product
              </Button>
            );
          }
          return (
            <Chip label="Approved, waiting for remaining deposit" color="info" size="small" />
          );

        case OrderType.FULLY_DEPOSITED:
          return (
            <Button
              size="small"
              variant="contained"
              color="info"
              startIcon={<Iconify icon="solar:check-circle-bold" />}
              disabled={loading}
              onClick={() => handleFinalizeOrder(item)}
            >
              Finalize Order
            </Button>
          );

        case OrderType.SELLER_FINALIZED:
          return <Chip label="You finalized" color="primary" size="small" />;

        case OrderType.ORDER_RECEIVED:
          return (
            <Button
              size="small"
              variant="contained"
              color="success"
              startIcon={<Iconify icon="solar:card-transfer-bold" />}
              disabled={loading}
              onClick={() => handleRewardOrder(item)}
            >
              Complete & Reward Order
            </Button>
          );

        default:
          return null;
      }
    }

    return null;
  };


  // ----------------------------------------------------------------------

  return (
    <Card>
      <CardHeader title="Order Details" />

      <Scrollbar>
        {items.map((item, index) => {
          const safeProduct = item.productId || {
            id: `mock-${index}`,
            name: 'Unknown product',
            price: 0,
            sku: 'N/A',
            coverUrl: '',
          };

          return (
            <Stack
              key={safeProduct.id}
              sx={{
                p: 3,
                borderBottom: index < items.length - 1 ? '1px dashed' : 'none',
                borderColor: 'divider',
              }}
            >
              {/* Dòng 1 */}
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  src={safeProduct.coverUrl}
                  variant="rounded"
                  sx={{ width: 64, height: 64, flexShrink: 0 }}
                />

                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" sx={{ mb: 0.5 }}>
                    <Box
                      sx={{
                        fontWeight: 600,
                        fontSize: 15,
                        color: 'text.primary',
                        pr: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {safeProduct.name}
                    </Box>

                    {getStatusChip(item.status || OrderType.NONE)}
                  </Stack>

                  <Box sx={{ color: 'text.disabled', fontSize: 13 }}>
                    SKU: {safeProduct.sku}
                  </Box>
                </Box>

                {/* ACTION BUTTON */}
                <Box sx={{ ml: 'auto', pl: 2 }}>{renderActions(item)}</Box>
              </Stack>

              {/* Dòng 2 */}
              <Stack direction="row" spacing={6} sx={{ mt: 2, color: 'text.secondary', fontSize: 14 }}>
                <Box>
                  <Box component="span" sx={{ color: 'text.disabled', mr: 1 }}>
                    Quantity
                  </Box>
                  <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    x{item.quantity}
                  </Box>
                </Box>

                <Box>
                  <Box component="span" sx={{ color: 'text.disabled', mr: 1 }}>
                    Price
                  </Box>
                  <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {fEth(safeProduct.price)}
                  </Box>
                </Box>
              </Stack>
            </Stack>
          );
        })}
      </Scrollbar>

      {renderTotal}
    </Card>
  );
}
