var ContinentToken = artifacts.require("./ContinentToken.sol");
var ContinentAuction = artifacts.require("./ContinentAuction.sol");

module.exports = async function (deployer) {
    const tokenInstance = await ContinentToken.deployed();
    await deployer.deploy(ContinentAuction, tokenInstance.address);
};