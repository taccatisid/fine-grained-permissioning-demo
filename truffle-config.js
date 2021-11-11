const HDWalletProvider = require('truffle-hdwallet-provider');
const path = require("path");

/* The adress used when creating contracts */
var address = process.env.BESU_NODE_PERM_ACCOUNT;

/* The private key associated with the address above */
var adminPrivateKey = process.env.BESU_NODE_PERM_KEY;

/* Accounts to test contract calls from */
var internalPrivateKey = process.env.INTERNAL_ACCOUNT_KEY;
var externalPrivateKey = process.env.EXTERNAL_ACCOUNT_KEY;

/* The endpoint of the Ethereum node */
var endpoint = process.env.BESU_NODE_PERM_ENDPOINT;
if (endpoint === undefined) {
  endpoint = "http://127.0.0.1:8545";
}

module.exports = {
  networks: {
    demo: {
      provider: () => new HDWalletProvider([adminPrivateKey, internalPrivateKey, externalPrivateKey],  endpoint, 0, 3),
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      from: address,
    }
  },

  compilers: {
    solc: {
      version: "0.8.9"
    }
  }
};
