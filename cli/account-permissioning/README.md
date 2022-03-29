Account Permissiong CLI
=======================
All example commands are run from the top level directory. The network can be restricted to a read only mode - where only read operations (calls) are permitted, reads can be accessed by any account.

Read methods
============

getAccounts
-----------
Retrieves a list of all permitted accounts in the network.

Example usage `node cli/account-permissioning/accountRulesCLI.js getAccounts`

Example response
```
Querying all permitted accounts
[
  '0xD1cf9D73a91DE6630c2bb068Ba5fDdF9F0DEac09',
  '0x8b935bc20793c5Dbff83F3C699812AFCff08c804'
]
```

accountPermitted
----------------
Checks whether an account address is permitted in the network.

Example usage `node cli/account-permissioning/accountRulesCLI.js accountPermitted 0x8b935bc20793c5Dbff83F3C699812AFCff08c804`

Example response
```
Querying if account 0x8b935bc20793c5Dbff83F3C699812AFCff08c804 is permitted (whether the account is in account storage)
Account is permitted (in the account storage)
```
getReadOnly
------------
Reads whether the storage is in read only mode.

Calls `AccountRules.getReadOnly`

Example usage `node cli/account-permissioning/accountRulesCLI.js getReadOnly`

Example response `Permissioning contract is not in read only mode.` 

getCreateContractPermission
---------------------------
Queries whether an internal acccount can create contracts.

Example usage `node cli/account-permissioning/accountRulesCLI.js getCreateContractPermission 0x8b935bc20793c5Dbff83F3C699812AFCff08c804`

Example response
```
Querying can create contract permission for account 0x8b935bc20793c5Dbff83F3C699812AFCff08c804
Account has permission to create contracts
```

getAdmins
---------
Retrieves the list of all admin addresses in the network.

Example usage `node cli/account-permissioning/accountRulesCLI.js getAdmins`

Example response
```
Querying all admin accounts
[
  '0xD1cf9D73a91DE6630c2bb068Ba5fDdF9F0DEac09',
  '0x8b935bc20793c5Dbff83F3C699812AFCff08c804'
]
```

Admin methods (write/update)
============================

enterReadOnly
--------------
Enters read only mode. This is an admin only function.

Sends a transaction to `AccountRules.enterReadOnly`

Example usage `node cli/account-permissioning/accountRulesCLI.js enterReadOnly`

Example response

```
Atttempting to enter read only mode
{
  blockHash: '0x6732b6b6cb641eb0728d0de314bea18686647893f8588f3caeea9ba410cabe68',
  blockNumber: 2316,
  contractAddress: null,
  cumulativeGasUsed: 42853,
  from: '0xd1cf9d73a91de6630c2bb068ba5fddf9f0deac09',
  gasUsed: 42853,
  effectiveGasPrice: 1000,
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  status: true,
  to: '0x7c2edb0e7cb6920b961b9a52b61fc17039181e6b',
  transactionHash: '0x16cfdd311d3411db4c840452d110a79e6e2b0054819aacb2f7aec18d46411b65',
  transactionIndex: 0,
  events: {}
}
```

exitReadOnly
------------

Exits read only mode. This is an admin only function.

Sends a transaction to `AccountRules.exitReadOnly`

Example usage `node cli/account-permissioning/accountRulesCLI.js exitReadOnly`

Example response

```
Attempting to exit read only mode
{
  blockHash: '0xa627c9db9814759fd0b2bf1699fa7f1d70ea847e04cf1e3448e71259e367f25e',
  blockNumber: 2409,
  contractAddress: null,
  cumulativeGasUsed: 42855,
  from: '0xd1cf9d73a91de6630c2bb068ba5fddf9f0deac09',
  gasUsed: 42855,
  effectiveGasPrice: 1000,
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  status: true,
  to: '0x7c2edb0e7cb6920b961b9a52b61fc17039181e6b',
  transactionHash: '0xf835ff7dbb496e8f8fdf19f9b2b2151c2df6021987a16ad1a69e643c39d85ef3',
  transactionIndex: 0,
  events: {}
}
```

addAdmin
--------
Adds an internal account to the admins list, this allows the account to call admin methods on the permissionig contracts.

Example usage 
```
node cli/account-permissioning/accountRulesCLI.js addAdmin 0x8b935bc20793c5Dbff83F3C699812AFCff08c804
```

Example response
```
Result {
  '0': true,
  '1': '0x8b935bc20793c5Dbff83F3C699812AFCff08c804',
  '2': 'Admin account added successfully',
  adminAdded: true,
  account: '0x8b935bc20793c5Dbff83F3C699812AFCff08c804',
  message: 'Admin account added successfully'
}
Admin successfully added
```

removeAdmin
-----------
Removes an admin account from the admins list.

Example usage
```
node cli/account-permissioning/accountRulesCLI.js addAdmin 0x8b935bc20793c5Dbff83F3C699812AFCff08c804 
```

Example response 
```
Sending a transaction from account 0xD1cf9D73a91DE6630c2bb068Ba5fDdF9F0DEac09 to remove account 0x8b935bc20793c5Dbff83F3C699812AFCff08c804 to admin list
Result {
  '0': true,
  '1': '0x8b935bc20793c5Dbff83F3C699812AFCff08c804',
  adminRemoved: true,
  account: '0x8b935bc20793c5Dbff83F3C699812AFCff08c804'
}
Admin successfully removed
```

addAccount
----------
Adds an internal account to account storage, this allows the account to send transactions in the permissioned network. This is an admin only function.

Example usage `node cli/account-permissioning/accountRulesCLI.js addAccount 0x8b935bc20793c5Dbff83F3C699812AFCff08c804`

Example response
```
Sending a transaction from account 0xD1cf9D73a91DE6630c2bb068Ba5fDdF9F0DEac09 to add account 0x8b935bc20793c5Dbff83F3C699812AFCff08c804 to account storage
Result {
  '0': true,
  '1': '0x8b935bc20793c5Dbff83F3C699812AFCff08c804',
  accountAdded: true,
  accountAddress: '0x8b935bc20793c5Dbff83F3C699812AFCff08c804'
}
Account successfully added
```

removeAccount
-------------
Removes an internal account from account storage. This is an admin only function.

Example usage `node cli/account-permissioning/accountRulesCLI.js removeAccount 0x8b935bc20793c5Dbff83F3C699812AFCff08c804`

Example response
```
Sending a transaction from account 0xD1cf9D73a91DE6630c2bb068Ba5fDdF9F0DEac09 to remove account 0x8b935bc20793c5Dbff83F3C699812AFCff08c804 from account storage
Result {
  '0': true,
  '1': '0x8b935bc20793c5Dbff83F3C699812AFCff08c804',
  accountRemoved: true,
  accountAddress: '0x8b935bc20793c5Dbff83F3C699812AFCff08c804'
}
Account successfully removed
```

setCreateContractPermission
---------------------------
Sets whether an internal account can create contracts. This is an admin only function.

Example usage `node cli/account-permissioning/accountRulesCLI.js setCreateContractPermission 0x8b935bc20793c5Dbff83F3C699812AFCff08c804 true`

Example response
```
Attempting to set 0x8b935bc20793c5Dbff83F3C699812AFCff08c804 can create contract permission to true
{
  blockHash: '0xe32f79145651a8b4bee8a48b6bfc2b5b4360c995d56448ba54d2213c1a5c5e8e',
  blockNumber: 3201,
  contractAddress: null,
  cumulativeGasUsed: 50452,
  from: '0xd1cf9d73a91de6630c2bb068ba5fddf9f0deac09',
  gasUsed: 50452,
  effectiveGasPrice: 1000,
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  status: true,
  to: '0x7c2edb0e7cb6920b961b9a52b61fc17039181e6b',
  transactionHash: '0x1a1143d18d763c99610c29db6b112c5b63eab64d3d453433d670c47f4004867f',
  transactionIndex: 0,
  events: {}
}
```
