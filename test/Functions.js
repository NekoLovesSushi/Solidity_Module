const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('Functions', () => {

  describe('Example 1', () => {
    let contract, deployer

    beforeEach(async () => {
      const Contract = await ethers.getContractFactory('Functions1')
      contract = await Contract.deploy()
      let accounts = await ethers.getSigners()
      deployer = accounts[0]
    })

    it('Demonstrates a read function', async () => {
      expect(await contract.getName()).to.equal('Example 1')
    })

    it('Demonstrates read functions are free', async () => {
      let balanceBefore = await ethers.provider.getBalance(deployer.address)
      await contract.getName()
      let balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceBefore).to.equal(balanceAfter)
    })

    it('Demonstrates a write function with arguments', async () => {
      await contract.setName('New name')
      expect(await contract.getName()).to.equal('New name')
    })

    it('Demonstrates a write function without arguments', async () => {
      await contract.setName('New name')
      expect(await contract.getName()).to.equal('New name')
      await contract.resetName()
      expect(await contract.getName()).to.equal('Example 1')
    })

    it('Demonstrates write functions cost gas', async () => {
      let balanceBefore = await ethers.provider.getBalance(deployer.address)
      await contract.setName('Another name')
      let balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.lessThan(balanceBefore)
    })
  })

  describe('Example 2', () => {
    let contract

    beforeEach(async () => {
      const Contract = await ethers.getContractFactory('Functions3')
      contract = await Contract.deploy()
    })

    it('Calls a function inside another function', async () => {
      await contract.increment()
      expect(await contract.count()).to.equal(1)
    })

  })

  describe('Example 3', () => {

    it('Calls a function from outside the contract', async () => {
      const Contract = await ethers.getContractFactory('Functions3')
      let contract = await Contract.deploy()
      await contract.increment()
      expect(await contract.count()).to.equal(1)
    })

  })

  describe('Example 4', () => {
    let contract

    beforeEach(async () => {
      const Contract = await ethers.getContractFactory('Functions4')
      contract = await Contract.deploy()
    })

    it('Can call a public function outside the contract', async () => {
      await contract.increment1()
      expect(await contract.count()).to.equal(1)
    })

    it('Can call a public from another function', async () => {
      await contract.increment2()
      expect(await contract.count()).to.equal(1)
    })

    it('Cannot call an internal function outside the contract', async () => {
      // Uncomment this to see the error
      // await contract.increment3()
    })

    it('Can call a private function within the contract', async () => {
      await contract.increment4()
      expect(await contract.count()).to.equal(1)
    })

    // Note: you cannot call this function inside another function.
    // It won't even compile.
    it('Can call an external function outside the contract', async () => {
      await contract.increment5()
      expect(await contract.count()).to.equal(1)
    })

    it('Cannot call an internal function outside the contract', async () => {
      // Uncomment this to see the error
      // await contract.increment6()
    })

    it('Can call an internal function inside another function', async () => {
      await contract.increment7()
      expect(await contract.count()).to.equal(1)
    })

  })

  describe('Example 5', () => {
    let contract

    beforeEach(async () => {
      const Contract = await ethers.getContractFactory('Functions5')
      contract = await Contract.deploy()
    })

    it('Demonstrates view function', async () => {
      expect(await contract.getName()).to.equal('Example 5')
    })

    it('Demonstrates pure function', async () => {
      expect(await contract.add(1,2)).to.equal(3)
    })

    it('Demonstrates payable function', async () => {
      await contract.pay({ value: ether(1) })
      expect(await contract.balance()).to.equal(ether(1))
    })

  })

  describe('Example 6', () => {
    let contract, owner, account1

    beforeEach(async () => {
      const Contract = await ethers.getContractFactory('Functions6')
      contract = await Contract.deploy()
      let accounts = await ethers.getSigners()
      owner = accounts[0]
      account1 = accounts[1]
    })

    it('Only lets the owner call the function with a custom modifier', async () => {
      await contract.connect(owner).setName1('New name')
      expect(await contract.name()).to.equal('New name')
      expect(contract.connect(account1).setName1('New name')).to.be.reverted
    })

    it('Demonstrates multiple modifiers', async () => {
      await contract.connect(owner).setName1('New name')
      expect(await contract.name()).to.equal('New name')
      expect(await contract.connect(owner).setName1('New name')).to.be.reverted
    })

  })


  describe('Example 7', () => {
    let contract

    beforeEach(async () => {
      const Contract = await ethers.getContractFactory('Functions7')
      contract = await Contract.deploy()
    })

    it('Demonstrates explicit return value', async () => {
      expect(await contract.getName1()).to.equal('Example 7')
    })

    it('Returns default value if no return is provided', async () => {
      expect(await contract.getName2()).to.equal('')
    })

    it('Returns the value of the previous function inline', async () => {
      expect(await contract.getName3()).to.equal('Example 7')
    })

    it('Returns a named variable without declaring the type inline', async () => {
      expect(await contract.getName4()).to.equal('Another name')
    })

    it('Reads the return value from another function as a variable & returns', async () => {
      expect(await contract.getName5()).to.equal('Another name')
    })

    it('Can return multiple values', async () => {
      let result = await contract.getName6()
      expect(result[0]).to.equal('Example 7')
      expect(result[1]).to.equal('New name')
    })

    it('Read multiple values from another function', async () => {
      let result = await contract.getName7()
      expect(result[0]).to.equal('Example 7')
      expect(result[1]).to.equal('New name')
    })

    it('Uses events to inspect return values on write functions', async () => {
      let transaction = await contract.setName1()
      let result = await transaction.wait()
      await expect(transaction).to.emit(contract, 'NameChanged')
        .withArgs('New name')
    })

    it('Can read return values from write functions inside the conract', async () => {
      let transaction = await contract.setName3()
      let result = await transaction.wait()
      await expect(transaction).to.emit(contract, 'NameChanged')
        .withArgs('New name')
    })

  })
})
