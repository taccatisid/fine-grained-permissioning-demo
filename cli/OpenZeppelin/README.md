# OpenZeppelin AccessControl.sol CLI Demo

This directory contains contracts and scripts that show how the features of the AccessControl contract from OpenZeppelin
can be used to restrict access to functions of contracts that are deployed on an Ethereum blockchain. 

The AccessControl contract features can be used in addition to the permissioning contracts. The permissioning contracts can be used to restrict
which accounts can be used to sign transaction that can execute functions on
contracts that are deployed on the blockchain as well as which accounts can deploy contracts on the blockchain.

Using the AccessControl contract provides role based access control. When writing a smart contract that makes use of
the AccessControl features any function in that smart contract can be restricted to accounts that have a certain role.
Any number of roles can be created and any accounts can be granted roles. Each role has an admin role and accounts that
have been granted the admin role for a certain role can grant that role to accounts.

Two different ways of using the AccessControl contract are demonstrated:
* Direct
  * The contract using the direct approach imports the AccessControl contract
  * The contract has it's own roles, role administrators
  
* Delegated
  * The contract delegates calls that determine restrictions to a contract that has been deployed independently
  * The contract the calls are delegated to can be used by many contracts
  * All contracts delegating to a specific contract use the roles of that contract

## Direct Demo

The contract _DirectDemo.sol_ is an example of a contract that uses its own roles and role administrators. The contract
has the line

    import "@openzeppelin/contracts/access/AccessControl.sol";

 which means that the variables in AccessControl.sol storing accounts that have been granted a certain role 
 or which roles administer these roles have are local to that contract. It also means that the functions that need
 to be called for the access control are implemented in the _DirectDemo.sol_ contract. Using the 

    modifier onlyRole(bytes32 role)

for a function uses these local roles and local functions to restrict access to the functions protected by this modifier.

The function

    function write(uint256 newValue) public onlyRole(WRITER_ROLE)

uses the above modifier to only allow accounts that have been granted the role _WRITER_ROLE_ to call this function.
When the function is called by an account that has not been granted the _WRITER_ROLE_ the transaction will be reverted.

The following line in the constructor 

     _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

assigns the _DEFAULT_ADMIN_ROLE_ to the account that deploys the contract (msg.sender). By default the administration role
for every account is set to the _DEFAULT_ADMIN_ROLE_. In our case that means that the account deploying the contract 
can grant accounts the _WRITER_ROLE_

***NOTE***: The administration role for any role can be set using the *_setRoleAdmin(role, adminRole)* function in the
constructor. Having multiple administration roles allows that administration roles for different roles can be granted
to separate accounts. 

## Delegated Demo

The contract _DelegateDemo.sol_ is an example of a contract that uses a delegate contract for access control. The
_DelegateDemo.sol_ contract has the following lines

    import "@openzeppelin/contracts/access/IAccessControl.sol";
    import "./DelegatedAccessControl.sol";

The first import is the interface declaring the modifier *onlyRole(role)* that is used in the demo contract.

The second import has the implementation for the onlyRole modifier that is used in the demo contract. This implementation
delegates the checking of the role membership to the *CentralAccessControl.sol* contract, which was set in the constructor 
of the demo contract.
This deployed *CentralAccessControl.sol* contract can be used for access control by any number of contracts in the same way it is
done by the delegated demo contract.

## CLI scripts

There are two JavaScript examples in the *scripts* directory that show how the functions to administer the access 
control can be called from the command line.


---
**IMPORTANT**


To make these sample scripts easy to use we have a default private key specified in the scripts and we allow 
private keys that are used to sign transactions to be specified on the command line. This is not good practice 
and should not be done in production environments. For information on how to protect your private keys please 
see XXXXXXXXXXXXXXXXX

---

### How to use the Demo Scripts

Please follow the instructions in the README.md file in the base directory of this repository to start the nodes 
of the demo network, as well as deploying the contracts. 

***NOTE***: All commands are to be run in the base directory of this repository

Once the network is running and the contracts have been deployed you need to 

    source contracts.env

After a fresh start of the network only the default account in the CLI scripts can be used to execute transactions
on the network. To allow a second account to make transactions you need to use the accountsRulesCLI script as follows

    node cli/account-permissioning/accountRulesCLI.js addAccount fdCE5d73aFEa75cD646694d82900e8dB7641f8B6

use the following to check whether the account is permitted to execute transactions

    node cli/account-permissioning/accountRulesCLI.js accountPermitted fdCE5d73aFEa75cD646694d82900e8dB7641f8B6

***NOTE***: In the genesis file the account *0xfdCE5d73aFEa75cD646694d82900e8dB7641f8B6* has been setup with Ether.



#### CLI for the Direct Demo 
The writer role in the *DirectDemo.sol* contract is defined as 

    bytes32 public constant WRITER_ROLE = keccak256("WRITER_ROLE");

which is *0x2b8f168f361ac1393a163ed4adfa899a87be7b7c71645167bdaddd822ae453c8* 

To check whether account fdCE5d73aFEa75cD646694d82900e8dB7641f8B6 has been granted the writer role necessary to call the write function

    node cli/OpenZeppelin/scripts/directAccessControlCLI.js hasRole 0x2b8f168f361ac1393a163ed4adfa899a87be7b7c71645167bdaddd822ae453c8 fdCE5d73aFEa75cD646694d82900e8dB7641f8B6

To find out what the admin role is for the writer role run

    node cli/OpenZeppelin/scripts/directAccessControlCLI.js getRoleAdmin 0x2b8f168f361ac1393a163ed4adfa899a87be7b7c71645167bdaddd822ae453c8

***NOTE***: In this example the admin role should be 0x00 (the _DEFAULT_ADMIN_ROLE_), as no admin role has been set

***NOTE***: To get help with the commands and arguments for the demo scripts use <demo-script> -h

To grant the role use the following command:

    node cli/OpenZeppelin/scripts/directAccessControlCLI.js grantRole 0x2b8f168f361ac1393a163ed4adfa899a87be7b7c71645167bdaddd822ae453c8 fdCE5d73aFEa75cD646694d82900e8dB7641f8B6

***NOTE***: If there is no private key specified in a call to the script the default private key specified in the CLI script is used, which is 
the key for the account that has been granted the _DEFAULT_ADMIN_ROLE_. When an admin role has not been set for a role, accounts that have been granted the
DEFAULT_ADMIN_ROLE can administer that role. A role can be granted by any account that has been
granted the admin role for that role. 

Once the writer role has been granted the account can execute the write method on the demo contract

    node cli/OpenZeppelin/scripts/directAccessControlCLI.js testWrite -p 0x10e9a39581f929f090c6a43d11f6b519974410226e7d97fb1914955d0a0f302d  0x12345abcde

The admin can revoke the role for the account

    node cli/OpenZeppelin/scripts/directAccessControlCLI.js revokeRole 0x2b8f168f361ac1393a163ed4adfa899a87be7b7c71645167bdaddd822ae453c8 fdCE5d73aFEa75cD646694d82900e8dB7641f8B6

Or alternatively, the account itself can renounce the role

    node cli/OpenZeppelin/scripts/directAccessControlCLI.js -p 0x10e9a39581f929f090c6a43d11f6b519974410226e7d97fb1914955d0a0f302d renounceRole 0x2b8f168f361ac1393a163ed4adfa899a87be7b7c71645167bdaddd822ae453c8 fdCE5d73aFEa75cD646694d82900e8dB7641f8B6

***NOTE***: In this call the private key is specified on the command line. This is the private key for account
*0xfdCE5d73aFEa75cD646694d82900e8dB7641f8B6*

#### CLI for the Delegated Demo
The script for the delegated demo can be used with the same arguments as the calls to the direct demo script above. 
The reason for having a separate script for the delegated demo is to make it very clear which contract has to be
called for the different purposes. To grant, revoke, or renounce rolls the deployed CentralAccessControl contract 
has to be called. To test whether an account can call the write function on the deployed DelegateDemo contract have 
to be called. 
Here are the calls:

    node cli/OpenZeppelin/scripts/delegatedAccessControlCLI.js hasRole 0x2b8f168f361ac1393a163ed4adfa899a87be7b7c71645167bdaddd822ae453c8 fdCE5d73aFEa75cD646694d82900e8dB7641f8B6

    node cli/OpenZeppelin/scripts/delegatedAccessControlCLI.js getRoleAdmin 0x2b8f168f361ac1393a163ed4adfa899a87be7b7c71645167bdaddd822ae453c8

    node cli/OpenZeppelin/scripts/delegatedAccessControlCLI.js grantRole 0x2b8f168f361ac1393a163ed4adfa899a87be7b7c71645167bdaddd822ae453c8 fdCE5d73aFEa75cD646694d82900e8dB7641f8B6

    node cli/OpenZeppelin/scripts/delegatedAccessControlCLI.js testWrite -p 0x10e9a39581f929f090c6a43d11f6b519974410226e7d97fb1914955d0a0f302d  0x12345abcde

    node cli/OpenZeppelin/scripts/delegatedAccessControlCLI.js revokeRole 0x2b8f168f361ac1393a163ed4adfa899a87be7b7c71645167bdaddd822ae453c8 fdCE5d73aFEa75cD646694d82900e8dB7641f8B6

    node cli/OpenZeppelin/scripts/delegatedAccessControlCLI.js -p 0x10e9a39581f929f090c6a43d11f6b519974410226e7d97fb1914955d0a0f302d renounceRole 0x2b8f168f361ac1393a163ed4adfa899a87be7b7c71645167bdaddd822ae453c8 fdCE5d73aFEa75cD646694d82900e8dB7641f8B6

