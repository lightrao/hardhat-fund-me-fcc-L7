const { network } = require("hardhat")

// function deployFunc(hre) {
//     console.log(hre)
// }
// module.exports.default = deployFunc

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // well what happens when we want to change chains?
    // when going for localhost or hardhat network we want to use a mock
}
