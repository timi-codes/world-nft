var ContinentToken = artifacts.require("./ContinentToken.sol");
var ContinentAuction = artifacts.require("./ContinentAuction.sol");

module.exports = function (deployer) {
    deployer.deploy(ContinentAuction, ContinentToken.address);
};