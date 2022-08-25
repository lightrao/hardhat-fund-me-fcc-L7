const { assert, expect } = require("chai") // chai is overwritten by waffle
const { deployments, ethers, getNamedAccounts } = require("hardhat") // hre: hardhat runtime enviroment

describe("FundMe", function () {
    let fundMe
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.utils.parseEther("1") // 1 Ether also is 1000000000000000000 Wei
    beforeEach(async function () {
        // deploy our FundMe contract using hardhat deploy

        // const accounts = await ethers.getSigners(); // get all accounts in current chain
        // const deployer = accounts[0]

        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer) // conect account with contract: from deployer account call function in FundMe
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })
    describe("constructor", function () {
        it("sets the aggregator address correctly", async function () {
            const response = await fundMe.priceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })
    describe("fund", function () {
        it("Fails if you don't send enough ETH", async function () {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        })
        it("Updated the amount funded data structure", async function () {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.addressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })
        it("Adds funder to array of funders", async function () {
            await fundMe.fund({ value: sendValue })
            const funder = await fundMe.funders(0)
            assert.equal(funder, deployer)
        })
    })
    describe("withdraw", function () {
        beforeEach(async function () {
            await fundMe.fund({ value: sendValue })
        })
        it("Withdraw ETH from a singler founder", async function () {
            // arrange
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )
            // act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            // <- breakpoint: see transactionReceipt include gasUsed & effectiveGasPrice property
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice) // use big number function to multiply

            const endingFundMeBalance = await ethers.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )
            // assert
            assert.equal(endingFundMeBalance, 0)
            // note: when call withdraw deployer spent a little bit of gas
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            )
        })
    })
})
