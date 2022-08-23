const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hadhat-config")

// function deployFunc(hre) {
//     console.log(hre)
// }
// module.exports.default = deployFunc

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments // deploy tools
    const { deployer } = await getNamedAccounts() // see hardhat.config.js namedAccounts part and network part
    const chainId = network.config.chainId // see hardhat.config.js network part

    // when going for localhost or hardhat network we want to use a mock
    let ethUsdPriceFeedAdress
    if (developmentChains.includes(network.name)) {
        // mock: if the contract doesn't exist, we deploy the minimal version of it
        // for our local testing
        const ethUsdAggregator = await get("MockV3Aggregator")
        ethUsdPriceFeedAdress = ethUsdAggregator.address
    } else {
        // if network name(chainId) is X use address Y
        // well what happens when we want to change chains?
        ethUsdPriceFeedAdress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    const fundMe = await deploy(
        "FundMe", // file name
        {
            contract: "FundMe", // contract name
            from: deployer,
            args: [ethUsdPriceFeedAdress], // put price feed addresss
            log: true,
        }
    )
    // log("FundMe deployed:", fundMe)
    log("----".repeat(10))
}
module.exports.tags = ["all", "fundme"]
