pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/IAccessControl.sol";

contract DelegatedAccessControl {
    IAccessControl accessControlDelegate;

    constructor(IAccessControl theAccessControlDelegate) {
        accessControlDelegate = theAccessControlDelegate;
    }

    modifier onlyRole(bytes32 role) {
        checkRole(role, msg.sender);
        _;
    }

    function checkRole(bytes32 role, address account) public view {
        if (!hasRole(role, account)) {
            revert("DelegatedAccessControl: sender is not permitted");
        }
    }

    function hasRole(bytes32 role, address account) public view returns (bool) {
        return accessControlDelegate.hasRole(role, account);
    }

}
