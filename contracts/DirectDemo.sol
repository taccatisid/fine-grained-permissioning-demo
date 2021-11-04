pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract DirectDemo is AccessControl {
    bytes32 public constant WRITER_ROLE = keccak256("WRITER_ROLE");

    uint256 value = 0;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function write(uint256 newValue) public onlyRole(WRITER_ROLE) {
        value = newValue;
    }

    function read() public view returns(uint256) {
        return value;
    }
}
