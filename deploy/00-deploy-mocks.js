const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")

// async function deployFunc(hre) {
//     console.log("Hi!")
//     hre.getNamedAccounts()
//     hre.deployments()
// }
// module.exports.default = deployFunc

// param is hre: hardhat runtime envirement
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer, user } = await getNamedAccounts()
    // console.log("deployer:", deployer) // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 => default:0
    // console.log("user    :", user) // 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 => defualt:1

    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying Mock...")
        const mock = await deploy(
            "MockV3Aggregator", // file name
            {
                contract: "MockV3Aggregator", // constract name
                from: deployer, // hardhat network's first account address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
                log: true,
                args: [DECIMALS, INITIAL_ANSWER], // constructor arguments, DECIMALS first, INITIAL_ANSWER second
            }
        )
        // log("Mock deployed:", mock)
        log("----".repeat(10))
    }
}
// run only our deploy mock script
module.exports.tags = ["all", "mocks"]
