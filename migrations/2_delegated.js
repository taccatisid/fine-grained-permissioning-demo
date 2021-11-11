const fs = require('fs');

const CentralAuthority = artifacts.require("CentralAccessControl.sol");
const DelegateDemo = artifacts.require("DelegateDemo.sol");

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(CentralAuthority);
    let centralAuthorityContract = await CentralAuthority.deployed();
    fs.appendFileSync('contracts.env', 'export CONTRACT_CENTRAL_AUTHORITY=' + centralAuthorityContract.address + '\n');

    await deployer.deploy(DelegateDemo, centralAuthorityContract.address);
    let delegateContract = await DelegateDemo.deployed();
    fs.appendFileSync('contracts.env', 'export CONTRACT_DELEGATED=' + delegateContract.address + '\n');
};
