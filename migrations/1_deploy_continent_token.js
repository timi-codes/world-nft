var ContinentToken = artifacts.require("./ContinentToken.sol");

module.exports = function (deployer) {
    deployer.deploy(ContinentToken, "ContinentToken", "CNT", "https://playstudio.ca/token/assets/");
};
