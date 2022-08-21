const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hadhat-config")

// function deployFunc(hre) {
//     console.log(hre)
// }
// module.exports.default = deployFunc

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // if chainId is X use address Y
    let ethUsdPriceFeedAdress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAdress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAdress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    // if the contract doesn't exist, we deploy the minimal version of it
    // for our local testing

    // well what happens when we want to change chains?
    // when going for localhost or hardhat network we want to use a mock
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAdress], // put price feed addresss
        log: true,
    })
    log("-------------------------------------")
}
module.exports.tags = ["all", "fundme"]
