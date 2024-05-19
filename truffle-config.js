const path = require("path");
require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = process.env.MNEMONIC;
const alchemyKey = process.env.ALCHEMY_API_KEY;

module.exports = {
  contracts_build_directory: path.join(__dirname, "node_modules", "@contracts", "build"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    dashboard: {
      port: 24012
    },
    sepolia: {
      provider: () => new HDWalletProvider(mnemonic, `https://base-sepolia.g.alchemy.com/v2/${alchemyKey}`),
      network_id: 84532,
      confirmations: 1,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  mocha: {},
  compilers: {
    solc: {
      version: "0.8.13"
    }
  },
  db: {
    enabled: false
  }
};
