Account permissioning and contract permissioning package
=========================================================
This package has the tools to set up a permissioning enabled Besu network from scratch and enables CRUD operations on the permissioning contracts via the CLI.
This repository is a fork of https://github.com/taccatisid/fine-grained-permissioning-demo

Setting up the environment
----------------

To set up the environment you'll need a running besu network and deployed contracts.

Start the nodes via

    docker-compose up -d

If you want to see the besu node logs, omit the `-d` and run this command in a separate terminal.

Then compile and deploy all contracts to your network using

    ./deploy.sh

and follow the instructions given there.

Contracts in the package
======================================
Two sets of contracts will be deployed as part of the package.

Besu account permissiong contracts
----------------------------------
Account permissioning contracts are imported from https://github.com/ConsenSys/permissioning-smart-contracts

The contract has the admin entry point `AccountRules.sol` which exposes functionalities involving access control for specific accounts. In a flexible permissioning network only accounts added to the `AccountStorage` contract are considered permitted and can send transactions on the network.

A CLI api is included to interact with the contract with CRUD operations such as adding account to account storage, removing account, giving account the permission to deploy contracts etc. These operations need to be sent from an Admin account. 


Using the CLI
-------------

A scaffolded CLI is provided that makes web3js calls to the permissioning contracts. Two options are provided for accounts permissioning and contract permissioning under the `/cli` folder.

Once the nodes are configured and contracts are deployed, you can start experimenting with the api - run `node cli/account-permissioning/accountRulesCLI.js -h` to get a full list of all available commands. Note that all commands should be executed at the top level direcotry.

For example you can use
``` 
node api/account-permissiong/accountRulesCLI.js accountPermitted D1cf9D73a91DE6630c2bb068Ba5fDdF9F0DEac0
```

To send a call to the accounPermitted method from the AccountRules contract.

More detailed documentation is found under each folder.

Cleaning up
-----------

Stop the besu network via

    docker-compose down

This retains the state of the blockchain. To erase all blockchain data and start from scratch run

    rm -r docker-data/node*/{DATABASE_METADATA.json,caches,database}

# Appendix

Contract deployment sequence
----------------------------

Permissioning setup happens in three phases:

1. A bootstrap contract is included in the [genesis file](/docker-config/genesis.json).
   Besu nodes are started with `--permissions-accounts-contract-enabled --permissions-accounts-contract-address=0x0000000000000000000000000000000000008888` to activate account permissioning using this particular contract.
   The bootstrap contract allows all blockchain interactions and has the sole purpose of being a placeholder before being updated by the actual account permissioning contract.
2. The [AccountRules](/permissioning-smart-contract/contracts/AccountRules.sol) contract is deployed by an arbitrary account.
   By deploying, this account becomes the admin account for entire blockchain.
3. The [CentralAccessControl](/contracts/CentralAccessControl.sol) contract is deployed.
   Again, the account deploying it becomes the administrator of that contract.

All subsequently deployed contracts are derived from the [DelegatedAccessControl](/contracts/DelegatedAccessControl.sol) contract and linked to the `CentralAccessControl` instance on deployment.

![Contract deployment sequence UML diagram](contract-deployment.png)

Permissiong control flow
------------------------

Every blockchain interaction is checked on two levels:
* Transactions are checked by looking up whether the sender is permitted in the `AccountRules` contract.
* Calls in a transaction are checked by looking up whether the caller has the required role in the `CentralAccessControl` contract.

![Permissiong control flow UML diagram](contract-calls.png)
