const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const XRegExp = require('xregexp');
const Fs = require('fs');

async function main() {
    const argv = require('yargs')
    .env('ACCOUNTRULES')
    .command('addAccount <account>', 'Add account to account storage', {
        account: {
            description: 'address of the account as a hexadecimal string',
            type: 'string',
        }
    })
    .option('contractAddress', {
        alias: 'ca',
        default: '0xA4Ac063cFAfbe6D8411BB238C0912f898E778b2D',
        describe: 'AccountRules contract address',
        type: 'string',
    })
    .option('privateKey', {
        alias: 'p',
        default: "797c13f7235c627f6bd013dc17fff4c12213ab49abcf091f77c83f16db10e90b",
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
        default: '0x7bd',
        describe: 'chainId of the blockchain',
        type: 'string',
    })
    .help()
    .alias('help', 'h')
    .argv;

    // This file is generated using 'solc --abi ValidatorSmartContractAllowList.sol -o .'
    const abi = Fs.readFileSync('AccountRules.abi', 'utf-8');
    const contractJson = JSON.parse(abi);

    let provider = new HDWalletProvider({
        privateKeys:[getHex(argv.privateKey, 64, false, "privateKey")],
        providerOrUrl:argv.url,
        chainId:Number(argv.chainId)
    });

    web3 = new Web3(provider);
    web3.eth.handleRevert = true;

    const adminAccount = web3.eth.accounts.privateKeyToAccount(prefix0x(true, argv.privateKey));
    const accountRules = await new web3.eth.Contract(contractJson, getHex(argv.contractAddress, 40, false, "contractAddress"));

    let receipt;
    try {
        switch (argv._[0]) {
            case "addAccount":
                console.log(`Sending a transaction from account ${adminAccount.address} to add account ${argv.account} to account storage`);
                receipt = await accountRules.methods.addAccount(getHex(argv.account, 40, true, "account")).send({from:  adminAccount.address});
                console.log(receipt)
                printEvent("addAccount", receipt);
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
        if (e.message === "Cannot read property 'returnValues' of undefined") {
            console.log("No event was received.")
            return;
        }
    }
    switch (eventname) {
        case "addAccount":
            console.log("TODO: actual valdiate result");
            console.log(receipt);
            break;
        default:
            console.log(result);
    }
}

if (require.main === module) {
    main();
}
