import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";

describe("Escrow - Flash Sale", function () {
  async function deployFixture() {
    const [admin, seller, buyer] = await ethers.getSigners();

    const MyERC1155 = await ethers.getContractFactory("MyERC1155");
    const nft = await MyERC1155.connect(admin).deploy("ipfs://test/");
    await nft.waitForDeployment();

    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy(admin.address, [seller.address], await nft.getAddress());
    await escrow.waitForDeployment();

    const tokenId = 1;
    await nft.connect(admin).mint(seller.address, tokenId, 100, "0x");
    await nft.connect(seller).setApprovalForAll(await escrow.getAddress(), true);

    const productId = ethers.encodeBytes32String("prod-1");
    const price = ethers.parseEther("1.0");
    const escrowAmount = ethers.parseEther("0.5");
    const quantity = 10;

    await escrow.connect(seller).list(productId, escrowAmount, price, quantity, tokenId);

    return { admin, seller, buyer, nft, escrow, productId, price, escrowAmount, quantity, tokenId };
  }

  it("getEffectivePrice returns the normal price when no flash sale exists", async () => {
    const { escrow, productId, price, escrowAmount } = await loadFixture(deployFixture);
    const [effPrice, effEscrow] = await escrow.getEffectivePrice(productId);
    expect(effPrice).to.equal(price);
    expect(effEscrow).to.equal(escrowAmount);
  });

  describe("setFlashSale validation", () => {
    it("rejects a discount that is not lower than the listed price", async () => {
      const { escrow, seller, productId, price } = await loadFixture(deployFixture);
      const now = await time.latest();
      await expect(
        escrow.connect(seller).setFlashSale(productId, price, price, now, now + 3600)
      ).to.be.revertedWith("must be a discount");
    });

    it("rejects a discounted escrow greater than the discounted price", async () => {
      const { escrow, seller, productId, price } = await loadFixture(deployFixture);
      const now = await time.latest();
      const discounted = price / 2n;
      await expect(
        escrow.connect(seller).setFlashSale(productId, discounted, discounted + 1n, now, now + 3600)
      ).to.be.revertedWith("bad escrow");
    });

    it("rejects a start time that is not before the end time", async () => {
      const { escrow, seller, productId, price } = await loadFixture(deployFixture);
      const now = await time.latest();
      const discounted = price / 2n;
      await expect(
        escrow.connect(seller).setFlashSale(productId, discounted, discounted / 2n, now + 100, now)
      ).to.be.revertedWith("bad window");
    });

    it("rejects starting a new sale while one is already active and unexpired", async () => {
      const { escrow, seller, productId, price } = await loadFixture(deployFixture);
      const now = await time.latest();
      const discounted = price / 2n;
      await escrow.connect(seller).setFlashSale(productId, discounted, discounted / 2n, now, now + 3600);
      await expect(
        escrow.connect(seller).setFlashSale(productId, discounted, discounted / 2n, now, now + 3600)
      ).to.be.revertedWith("sale already active/scheduled");
    });

    it("allows starting a new sale once the previous one has naturally expired", async () => {
      const { escrow, seller, productId, price } = await loadFixture(deployFixture);
      const now = await time.latest();
      const discounted = price / 2n;
      await escrow.connect(seller).setFlashSale(productId, discounted, discounted / 2n, now, now + 100);
      await time.increaseTo(now + 200);
      await expect(
        escrow.connect(seller).setFlashSale(productId, discounted, discounted / 2n, now + 200, now + 4000)
      ).to.not.be.reverted;
    });

    it("only the product's own seller can start a flash sale", async () => {
      const { escrow, buyer, productId, price } = await loadFixture(deployFixture);
      const now = await time.latest();
      await expect(
        escrow.connect(buyer).setFlashSale(productId, price / 2n, price / 4n, now, now + 3600)
      ).to.be.reverted;
    });
  });

  describe("getEffectivePrice time-window behavior", () => {
    it("only applies the discount within [startTime, endTime]", async () => {
      const { escrow, seller, productId, price, escrowAmount } = await loadFixture(deployFixture);
      const now = await time.latest();
      const discountedPrice = price / 2n;
      const discountedEscrow = escrowAmount / 2n;
      await escrow
        .connect(seller)
        .setFlashSale(productId, discountedPrice, discountedEscrow, now + 100, now + 200);

      let [effPrice] = await escrow.getEffectivePrice(productId);
      expect(effPrice).to.equal(price);

      await time.increaseTo(now + 150);
      let effEscrow;
      [effPrice, effEscrow] = await escrow.getEffectivePrice(productId);
      expect(effPrice).to.equal(discountedPrice);
      expect(effEscrow).to.equal(discountedEscrow);

      await time.increaseTo(now + 250);
      [effPrice] = await escrow.getEffectivePrice(productId);
      expect(effPrice).to.equal(price);
    });
  });

  describe("depositEarnest", () => {
    it("charges the discounted escrow while a sale is active and snapshots it on the order", async () => {
      const { escrow, seller, buyer, productId, price, escrowAmount } = await loadFixture(deployFixture);
      const now = await time.latest();
      const discountedPrice = price / 2n;
      const discountedEscrow = escrowAmount / 2n;
      await escrow.connect(seller).setFlashSale(productId, discountedPrice, discountedEscrow, now, now + 3600);

      const orderId = ethers.encodeBytes32String("order-1");

      await expect(
        escrow.connect(buyer).depositEarnest(productId, orderId, 1, ethers.ZeroAddress, { value: escrowAmount })
      ).to.be.revertedWith("Wrong escrow");

      await escrow
        .connect(buyer)
        .depositEarnest(productId, orderId, 1, ethers.ZeroAddress, { value: discountedEscrow });

      const order = await escrow.orders(buyer.address, orderId);
      expect(order.unitPrice).to.equal(discountedPrice);
      expect(order.unitEscrow).to.equal(discountedEscrow);
    });

    it("charges the full price when no sale is active", async () => {
      const { escrow, buyer, productId, escrowAmount } = await loadFixture(deployFixture);
      const orderId = ethers.encodeBytes32String("order-1");
      await escrow
        .connect(buyer)
        .depositEarnest(productId, orderId, 1, ethers.ZeroAddress, { value: escrowAmount });
      const order = await escrow.orders(buyer.address, orderId);
      expect(order.unitEscrow).to.equal(escrowAmount);
    });
  });

  describe("Critical regression: settlement uses the deposit-time snapshot, not live state", () => {
    it("settles at the deposit-time discounted price even after the sale expires before reward", async () => {
      const { escrow, seller, buyer, productId, price, escrowAmount } = await loadFixture(deployFixture);
      const now = await time.latest();
      const discountedPrice = price / 2n;
      const discountedEscrow = escrowAmount / 2n;
      const windowEnd = now + 100;
      await escrow.connect(seller).setFlashSale(productId, discountedPrice, discountedEscrow, now, windowEnd);

      const orderId = ethers.encodeBytes32String("order-1");
      await escrow
        .connect(buyer)
        .depositEarnest(productId, orderId, 1, ethers.ZeroAddress, { value: discountedEscrow });

      // Let the flash sale expire before the rest of the order lifecycle continues.
      await time.increaseTo(windowEnd + 10);

      const rest = discountedPrice - discountedEscrow;
      // Must still equal the ORIGINAL discounted rest, not a recomputed full-price rest.
      await escrow.connect(buyer).depositRestAmount(orderId, { value: rest });

      await escrow.connect(seller).finalizeOrder(orderId, buyer.address);
      await escrow.connect(buyer).approveReceiveProduct(orderId);

      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);
      const tx = await escrow.connect(seller).rewardOrder(orderId, buyer.address);
      const receipt = await tx.wait();
      const gasCost = receipt!.gasUsed * receipt!.gasPrice;
      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);

      const fee = (discountedPrice * 10n) / 100n;
      const expectedSellerAmount = discountedPrice - fee;

      expect(sellerBalanceAfter - sellerBalanceBefore + gasCost).to.equal(expectedSellerAmount);
    });

    it("refunds the deposit-time escrow on cancelDeposit even if the sale later expires", async () => {
      const { escrow, seller, buyer, productId, price, escrowAmount } = await loadFixture(deployFixture);
      const now = await time.latest();
      const discountedPrice = price / 2n;
      const discountedEscrow = escrowAmount / 2n;
      const windowEnd = now + 100;
      await escrow.connect(seller).setFlashSale(productId, discountedPrice, discountedEscrow, now, windowEnd);

      const orderId = ethers.encodeBytes32String("order-1");
      await escrow
        .connect(buyer)
        .depositEarnest(productId, orderId, 1, ethers.ZeroAddress, { value: discountedEscrow });

      await time.increaseTo(windowEnd + 10);

      const buyerBalanceBefore = await ethers.provider.getBalance(buyer.address);
      const tx = await escrow.connect(buyer).cancelDeposit(orderId);
      const receipt = await tx.wait();
      const gasCost = receipt!.gasUsed * receipt!.gasPrice;
      const buyerBalanceAfter = await ethers.provider.getBalance(buyer.address);

      expect(buyerBalanceAfter - buyerBalanceBefore + gasCost).to.equal(discountedEscrow);
    });
  });

  describe("cancelFlashSale", () => {
    it("stops new deposits from getting the discount but does not affect already-deposited orders", async () => {
      const { escrow, seller, buyer, productId, price, escrowAmount } = await loadFixture(deployFixture);
      const now = await time.latest();
      const discountedPrice = price / 2n;
      const discountedEscrow = escrowAmount / 2n;
      await escrow.connect(seller).setFlashSale(productId, discountedPrice, discountedEscrow, now, now + 3600);

      const firstOrderId = ethers.encodeBytes32String("order-1");
      await escrow
        .connect(buyer)
        .depositEarnest(productId, firstOrderId, 1, ethers.ZeroAddress, { value: discountedEscrow });

      await escrow.connect(seller).cancelFlashSale(productId);

      const secondOrderId = ethers.encodeBytes32String("order-2");
      await expect(
        escrow
          .connect(buyer)
          .depositEarnest(productId, secondOrderId, 1, ethers.ZeroAddress, { value: discountedEscrow })
      ).to.be.revertedWith("Wrong escrow");

      await escrow
        .connect(buyer)
        .depositEarnest(productId, secondOrderId, 1, ethers.ZeroAddress, { value: escrowAmount });

      const firstOrder = await escrow.orders(buyer.address, firstOrderId);
      expect(firstOrder.unitPrice).to.equal(discountedPrice);
    });
  });
});
