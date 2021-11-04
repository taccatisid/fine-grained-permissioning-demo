const CentralAuthority = artifacts.require("CentralAccessControl.sol");
const DelegateDemo = artifacts.require("DelegateDemo.sol");

contract("DelegateDemo", (accounts) => {
    let admin = accounts[0];
    let internalUser = accounts[1];
    let externalUser = accounts[2];

    let writerRole = web3.utils.keccak256("WRITER_ROLE");

    let centralAuthorityContract;
    let demoContract;

    it("should deploy the central authority", async () => {
        centralAuthorityContract = await CentralAuthority.new({from: admin});
    })

    it("should deploy the contract", async () => {
        demoContract = await DelegateDemo.new(centralAuthorityContract.address, {from: externalUser});
    })

    it("should allow the internal user to be granted write permission", async() => {
        await centralAuthorityContract.grantRole(writerRole, internalUser, {from: admin});
    })

    it("should allow the internal user to write a value", async() => {
        await demoContract.write(42, {from: internalUser});
    });

    it("should not allow the external user to write a value", async() => {
        let revertReason;
        try {
            await demoContract.write(23, {from: externalUser});
            revertReason = "";
        } catch (error) {
            revertReason = error.message;
        }
        assert(revertReason.startsWith("Returned error: VM Exception while processing transaction: revert DelegatedAccessControl"));
    });

    it("should allow the external user to read a value", async() => {
        let value = await demoContract.read({from: externalUser});
        assert.equal(value, 42);
    });
});
