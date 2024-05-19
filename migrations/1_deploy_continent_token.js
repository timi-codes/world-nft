var ContinentToken = artifacts.require("./ContinentToken.sol");
require('dotenv').config();

module.exports = function (deployer) {
    deployer.deploy(ContinentToken, "Continent Token", "CNT", process.env.BASE_TOKEN_URI);
};
