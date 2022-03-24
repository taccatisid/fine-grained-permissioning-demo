// A part of the AccountRules API
accountRulesAbi = [{"name":"addAccount","type":"function","inputs":[{"internalType":"address","name":"account","type":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"name":"setCreateContractPermission","type":"function","inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bool","name":"allowed","type":"bool"}],"outputs":[],"stateMutability":"nonpayable"}]

// Prefunded accounts to play with
adminAccount = accounts[0];
internalAccount = accounts[1];
externalAccount = accounts[2];

// Contract instances
DirectDemo.at(process.env.CONTRACT_DIRECT).then(result => directDemo = result);
DelegateDemo.at(process.env.CONTRACT_DELEGATED).then(result => delegateDemo = result);
CentralAccessControl.at(process.env.CONTRACT_CENTRAL_AUTHORITY).then(result => centralAuthority = result);
accountRules = new web3.eth.Contract(accountRulesAbi, process.env.CONTRACT_ACCOUNT_RULES);

// The role our contracts use to discern writing permission
writerRole = web3.utils.keccak256("WRITER_ROLE");

// Things to try:
await accountRules.methods.addAccount(internalAccount).send({from: adminAccount});
// - await accountRules.methods.setCreateContractPermission(internalAccount, true).send({from: adminAccount});
// - await DirectDemo.new({from: internalAccount})
// - directDemo.grantRole(writerRole, internalAccount, {from: adminAccount})
// - directDemo.write(99, {from: internalAccount})
// - centralAuthority.grantRole(writerRole, internalAccount, {from: adminAccount})
// - delegateDemo.write(10, {from: internalAccount})
// - delegateDemo.read({from: externalAccount})
// - centralAuthority.revokeRole(writerRole, internalAccount, {from: adminAccount})

'lets start'
