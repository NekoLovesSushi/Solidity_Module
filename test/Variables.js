const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('Variables', () => {

  describe('Example 1', () => {
    it('It has a state variable with a default value', async () => {
      const Contract = await ethers.getContractFactory('Variables1')
      let contract = await Contract.deploy()
      expect(await contract.name()).to.equal('Example 1')
    })
  })

  describe('Example 2', () => {
    it('Demonstrates the constructor sets the state variable', async () => {
      const Contract = await ethers.getContractFactory('Variables2')
      let contract = await Contract.deploy('Example 2')
      expect(await contract.name()).to.equal('Example 2')
    })
  })

  describe('Example 3', () => {
    let contract

    beforeEach(async () => {
      const Contract = await ethers.getContractFactory('Variables3')
      contract = await Contract.deploy()
    })

    it('Has blank name by default', async () => {
      expect(await contract.getName()).to.equal('')
    })

    it('Has a function to set name & sets state variable a function', async () => {
      await contract.setName('Example 3')
      expect(await contract.getName()).to.equal('Example 3')
    })

    it('Does not expose a "#name()" function', async () => {
      // TODO: uncomment this out to see failure
      // expect(await contract.name()).to.be.reverted
    })
  })

  describe('Example 4', () => {
    let contract

    beforeEach(async () => {
      const Contract = await ethers.getContractFactory('Variables4')
      contract = await Contract.deploy()
    })

    it('Has a NAME constant', async () => {
      expect(await contract.name()).to.equal('Example 4')
    })

    it('Tracks the owner as immutable', async () => {
      let accounts = await ethers.getSigners()
      expect(await contract.owner()).to.equal(accounts[0].address)
    })

  })

  describe('Example 5', () => {
    let contract

    beforeEach(async () => {
      const Contract = await ethers.getContractFactory('Variables5')
      contract = await Contract.deploy()
    })

    it('Demonstrates "this" global variable', async () => {
      expect(await contract.contractAddress()).to.equal(contract.address)
    })

    it('Demonstrates "msg" & "tx" global variables', async () => {
      await contract.pay({ value: ether(1) })
      expect(await contract.amount()).to.equal(ether(1))
      let accounts = await ethers.getSigners()
      expect(await contract.payer()).to.equal(accounts[0].address)
      expect(await contract.origin()).to.equal(accounts[0].address)
    })

    it('Demonstrates "block" global variable', async () => {
      let result = await contract.getBlockInfo()
      // Uncomment this to view return values in console
      // console.log(result)
    })
  })
})
