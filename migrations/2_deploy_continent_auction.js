var ContinentToken = artifacts.require("./ContinentToken.sol");
var ContinentAuction = artifacts.require("./ContinentAuction.sol");

module.exports = async function (deployer) {
    await deployer.deploy(ContinentToken, "Continent Token", "CNT", process.env.BASE_TOKEN_URI);
    const tokenInstance = await ContinentToken.deployed();
    await deployer.deploy(ContinentAuction, tokenInstance.address);
};