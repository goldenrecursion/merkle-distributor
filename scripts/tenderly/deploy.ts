require('@nomiclabs/hardhat-ethers')
const { ethers } = require('hardhat')
import moment from 'moment'

async function main() {
  const INITIAL_SUPPLY = ethers.utils.parseUnits('1' + '0'.repeat(9), 18)
  const merkleRoot = '0x65b315f4565a40f738cbaaef7dbab4ddefa14620407507d0f2d5cdbd1d8063f6' // complex example
  const endTime = moment().add(20, 'minutes').unix()

  const TestERC20 = await ethers.getContractFactory('TestERC20')
  const testErc20 = await TestERC20.deploy('Golden Test Token', 'TGLD', INITIAL_SUPPLY)
  await testErc20.deployed()

  const MerkleDistributor = await ethers.getContractFactory('MerkleDistributor')
  const merkleDistributor = await MerkleDistributor.deploy(testErc20.address, merkleRoot)
  await merkleDistributor.deployed()

  const MerkleDistributorWithDeadline = await ethers.getContractFactory('MerkleDistributorWithDeadline')
  const merkleDistributorWithDeadline = await MerkleDistributorWithDeadline.deploy(
    testErc20.address,
    merkleRoot,
    endTime
  )
  await merkleDistributorWithDeadline.deployed()

  console.log({
    testErc20: testErc20.address,
    merkleDistributor: merkleDistributor.address,
    merkleDistributorWithDeadline: merkleDistributorWithDeadline.address,
    merkleRoot,
    endTime,
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
