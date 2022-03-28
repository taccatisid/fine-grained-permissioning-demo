const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const XRegExp = require('xregexp');
const argv = require('yargs')
    .command('hasRole <role> <account>', 'make a call to check whether an account has a certain role', {
        role: {
            description: 'the role to check as a hexadecimal string with 32 bytes',
            type: 'string',
        },
        account: {
            description: 'address of the account as a hexadecimal string with 20 bytes',
            type: 'string',
        }
    })
    .command('getRoleAdmin <role>', 'make a call to retrieve the admin account for a role', {
        role: {
                description: 'the role to check as a hexadecimal string with 32 bytes',
                type: 'string',
            }
        })
    .command('grantRole <role> <account>', 'send a transaction to grant an account a role. Has to be sent by the admin for the role', {
        role: {
            description: 'the role to grant as a hexadecimal string with 32 bytes',
            type: 'string',
        },
        account: {
            description: 'address of the account as a hexadecimal string with 20 bytes',
            type: 'string',
        }
    })
    .command('revokeRole <role> <account>', 'send a transaction to revoke a role for an account. Has to be sent by the admin for the role', {
        role: {
            description: 'the role to revoke as a hexadecimal string with 32 bytes',
            type: 'string',
        },
        account: {
            description: 'address of the account as a hexadecimal string with 20 bytes',
            type: 'string',
        }
    })
    .command('renounceRole <role> <account>', 'send a transaction to renounce a role for an account. Has to be sent by the account.', {
        role: {
            description: 'the role to renounce as a hexadecimal string with 32 bytes',
            type: 'string',
        },
        account: {
            description: 'address of the account as a hexadecimal string with 20 bytes',
            type: 'string',
        }
    })
    .command('testWrite <value>', `send a transaction to test whether an account is allowed to write to the contract`, {
        value: {
            description: 'value to write as a hexadecimal string with up to 32 bytes',
            type: 'string',
        }
    })
    .option('privateKey', {
        alias: 'p',
        default: '797c13f7235c627f6bd013dc17fff4c12213ab49abcf091f77c83f16db10e90b', // This is the address of the admin
        describe: 'private key in hexadecimal format',
        type: 'string',
    })
    .option('url', {
        alias: 'u',
        demandOption: true,
        default: 'http://localhost:8545',
        describe: 'URL of the Ethereum client',
        type: 'string',
    })
    .option('chainId', {
        alias: 'i',
        demandOption: true,
        default: "0x7bd",
        describe: 'chainId of the blockchain',
        type: 'string',
    })
    .help()
    .alias('help', 'h')
    .argv;

const demoWriteContractJson = JSON.parse('[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WRITER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"read","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"newValue","type":"uint256"}],"name":"write","outputs":[],"stateMutability":"nonpayable","type":"function"}]');

let provider = new HDWalletProvider({
    privateKeys:[getHex(argv.privateKey, 64, false, "privateKey")],
    providerOrUrl:argv.url,
    chainId:Number(argv.chainId)
});

const web3 = new Web3(provider);
web3.eth.handleRevert = true;

function prefix0x(need0x, str) {
    if (need0x && !str.startsWith('0x')) {
        return "0x" + str;
    } else if (!need0x && str.startsWith("0x")) {
        return str.substr(2);
    }
    return str;
}

function getHex(str, len, need0x, name) {
    var re = XRegExp(`^0x[0-9A-Fa-f]{${len}}$`);
    if (!re.test(prefix0x(true,str))) {
        console.log(`ERROR: Invalid hex string for ${name}: ${str}`);
        if (str.length !== len+2) {
            console.log(`Expected length is ${len} digits, actual length is ${str.length-2} digits`)
        }
        process.exit(-1);
    }
    return prefix0x(need0x, str);
}

function printEvent(eventname, receipt) {
    let result;
    try {
        result = receipt.events[eventname].returnValues;
    } catch(e) {
        if (e.message.includes("Cannot read propert")) {
            console.log("No event was received. Transaction Receipt:")
            console.log(receipt);
            return;
        }
    }
    switch (eventname) {
        case "RoleGranted":
            console.log(`Success: Account ${result.account} has been granted role ${result.role} by account ${result.sender}`);
            break;
        case "RoleRevoked":
            console.log(`Success: Role ${result.role} has been revoked for account ${result.account} by account ${result.sender}`);
            break;
        default:
            console.log(receipt);
    }
}

async function main() {

    const myAccount = web3.eth.accounts.privateKeyToAccount(prefix0x(true, argv.privateKey));

    const DirectDemoContract = await new web3.eth.Contract( demoWriteContractJson, process.env.CONTRACT_DIRECT);

    let receipt;
    try {
        switch (argv._[0]) {
            // When doing the direct demo we have to use the address of the DirectDemoContract itself, as the AccessControl contract is included there
            case "hasRole":
                console.log(`checking whether account ${argv.account} has the role ${argv.role}`);
                let result = await DirectDemoContract.methods.hasRole(getHex(argv.role, 64, true, "role"), getHex(argv.account, 40, true, "account")).call();
                let string = result ? 'DOES' : 'DOES NOT';
                console.log(`Account ${argv.account} ${string} have the role ${argv.role}`);
                break;
            case "getRoleAdmin":
                console.log(`getting the admin role for role ${argv.role}`)
                let admin = await DirectDemoContract.methods.getRoleAdmin(getHex(argv.role, 64, true, "role")).call();
                console.log(`The admin role for role ${argv.role} is ${admin}`);
                break;
            case "grantRole":
                console.log(`Sending a transaction from account ${myAccount.address} to grant role ${argv.role} to account ${argv.account}`);
                receipt = await DirectDemoContract.methods.grantRole(getHex(argv.role, 64, true, "role"), getHex(argv.account, 40, true, "account")).send({from: myAccount.address});
                printEvent("RoleGranted", receipt);
                break;
            case "revokeRole":
                console.log(`Sending a transaction from account ${myAccount.address} to revoke role ${argv.role} from account ${argv.account}`);
                receipt = await DirectDemoContract.methods.revokeRole(getHex(argv.role, 64, true, "role"), getHex(argv.account, 40, true, "account")).send({from: myAccount.address});
                printEvent("RoleRevoked", receipt);
                break;
            case "renounceRole":
                console.log(`Sending a transaction from account ${myAccount.address} to renounce role ${argv.role} from account ${argv.account}`);
                receipt = await DirectDemoContract.methods.renounceRole(getHex(argv.role, 64, true, "role"), getHex(argv.account, 40, true, "account")).send({from: myAccount.address});
                printEvent("RoleRevoked", receipt);
                break;
            case "testWrite":
                console.log(`Sending a transaction from account ${myAccount.address} to check if it is allowed to write to the test contract`);
                receipt = await DirectDemoContract.methods.write(prefix0x(true, argv.value)).send({from: myAccount.address});
                console.log(`The transaction receipt:`);
                console.log(receipt);
                console.log(`Calling the demo contract to retrieve the value`);
                let hexValue = Number(await DirectDemoContract.methods.read().call()).toString(16);
                console.log(`The value is set to 0x${hexValue}`);
                break;
            default:
                console.log(`Unknown command ${argv._[0]}`);
                break;
        }
    } catch (e) {
        const message = e.message;
        const lines = message.split('\n');
        if (lines.length > 1 && lines[0] === "Execution reverted" && lines[1].length > 138 && lines[1].startsWith("0x")) {
            console.error(`Execution reverted with revert reason:\n${web3.utils.hexToAscii("0x" + lines[1].substr(138))}`);
        } else {
            console.error(message);
        }
        process.exit(-1);
    }
    process.exit(0);
}

if (require.main === module) {
    main();
}
