const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Escrow', () => {
  let seller1, seller2, seller3, admin;
  let escrowContract;

  beforeEach(async () => {
    [seller1, seller2, seller3, admin] = await ethers.getSigners();

    escrowContract = await ethers.getContractFactory('Escrow');
    escrowContract = await escrowContract.deploy(admin.address, [seller1.address, seller2.address]);
  });

  it('Should set correct admin', async () => {
    expect(await escrowContract.adminAddress()).to.equal(admin.address);
  });
});
