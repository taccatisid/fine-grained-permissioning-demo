pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract DirectDemo is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant WRITER_ROLE = keccak256("WRITER_ROLE");

    uint256 value = 0;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
        _setRoleAdmin(WRITER_ROLE, ADMIN_ROLE);
    }

    function write(uint256 newValue) public onlyRole(WRITER_ROLE) {
        value = newValue;
    }

    function read() public view returns(uint256) {
        return value;
    }
}
