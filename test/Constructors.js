const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('Constructors', () => {

  describe('Example 1', () => {
    it('It does not have a constructor', async () => {
      const Contract = await ethers.getContractFactory('Constructors1')
      let contract = await Contract.deploy()
      expect(await contract.name()).to.equal('Example 1')
    })
  })

  describe('Example 2', () => {
    it('Has a constructor with no arguments', async () => {
      const Contract = await ethers.getContractFactory('Constructors2')
      let contract = await Contract.deploy()
      expect(await contract.name()).to.equal('Example 2')
    })
  })

  describe('Example 3', () => {
    it('Has a constructor with arguments', async () => {
      const Contract = await ethers.getContractFactory('Constructors3')
      let contract = await Contract.deploy('Example 3')
      expect(await contract.name()).to.equal('Example 3')
    })
  })

  describe('Example 4', () => {
    it('Has a payable constructor', async () => {
      const Contract = await ethers.getContractFactory('Constructors4')
      let contract = await Contract.deploy({ value: ether(1) })
      let balance = await ethers.provider.getBalance(contract.address)
      expect(ethers.utils.formatEther(balance)).to.equal('1.0')
    })
  })

  describe('Example 5', () => {
    it('Inherits the constructor', async () => {
      const Contract = await ethers.getContractFactory('Constructors5')
      let contract = await Contract.deploy()
      expect(await contract.name()).to.equal('Example 5')
    })
  })


  describe('Example 6', () => {
    it('Extends the parent constructor', async () => {
      const Contract = await ethers.getContractFactory('Constructors6')
      let contract = await Contract.deploy('Example 6', 'This contract inherits from Parent 2')
      expect(await contract.name()).to.equal('Example 6')
    })
  })
})
