const fs = require('fs');

const DirectDemo = artifacts.require("DirectDemo.sol");

module.exports = async function (deployer, network, accounts) {
    // deployment steps
    await deployer.deploy(DirectDemo);
    let directContract = await DirectDemo.deployed();
    fs.appendFileSync('contracts.env', 'export CONTRACT_DIRECT=' + directContract.address + '\n');
};
