const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const XRegExp = require("xregexp");
const Fs = require("fs");

// Use this script by calling the script (node accountRulesCLI.js)
// followed by the command and arguments (node accountRulesCLI.js addAccount xxx)
const startArgvCLI = () =>
  require("yargs")
    .env("ACCOUNTRULES")
    .command("addAccount <account>", "Add account to account storage", {
      account: {
        description: "address of the account as a hexadecimal string",
        type: "string",
      },
    })
    .command("removeAccount <account>", "Remove account from account storage", {
        account: {
            description: "address of the account to be removed as a hexadecimal string",
            type: "string",
        }
    })
    .option("contractAddress", {
      alias: "ca",
      default: "0xA4Ac063cFAfbe6D8411BB238C0912f898E778b2D",
      describe: "AccountRules contract address",
      type: "string",
    })
    .option("privateKey", {
      alias: "p",
      default:
        "797c13f7235c627f6bd013dc17fff4c12213ab49abcf091f77c83f16db10e90b",
      describe: "private key in hexadecimal format",
      type: "string",
    })
    .option("url", {
      alias: "u",
      demandOption: true,
      default: "http://localhost:8545",
      describe: "JSON RPC URL of the Ethereum client",
      type: "string",
    })
    .option("chainId", {
      alias: "i",
      demandOption: true,
      default: "0x7bd",
      describe: "chainId of the blockchain",
      type: "string",
    })
    .help()
    .alias("help", "h")
    .argv;

async function main() {
  const argv = startArgvCLI();
  // This file is generated using 'truffle compile' and found under
  // 'src/chain/abis'
  const abi = Fs.readFileSync("./api/AccountRules.json", "utf-8");
  const contractJson = JSON.parse(abi);

  let provider = new HDWalletProvider({
    // In a production environment this should be replaced by a better way of handling private keys
    // This is the admin private key
    privateKeys: [getHex(argv.privateKey, 64, false, "privateKey")],
    providerOrUrl: argv.url,
    chainId: Number(argv.chainId),
  });

  web3 = new Web3(provider);
  web3.eth.handleRevert = true;

  const adminAccount = web3.eth.accounts.privateKeyToAccount(
    prefix0x(true, argv.privateKey)
  );
  const AccountRulesContract = await new web3.eth.Contract(
    contractJson.abi,
    getHex(argv.contractAddress, 40, false, "contractAddress")
  );

  let transactionReceipt
  let transactionEvents
  // Main handler
  try {
    switch (argv._[0]) {
      case "addAccount":
        console.log(
          `Sending a transaction from account ${adminAccount.address} to add account ${argv.account} to account storage`
        );

        transactionReceipt = await AccountRulesContract.methods
          .addAccount(getHex(argv.account, 40, true, "account"))
          .send({ from: adminAccount.address });

        transactionEvents = await AccountRulesContract.getPastEvents(
          "AccountAdded",
          { transactionHash: transactionReceipt.transactionHash }
        );

        printEvent("AccountAdded", transactionEvents[0], transactionReceipt);

        break;
      case "removeAccount":
        console.log(
            `Sending a transaction from account ${adminAccount.address} to remove account ${argv.account} from account storage`
          );
  
          transactionReceipt = await AccountRulesContract.methods
            .removeAccount(getHex(argv.account, 40, true, "account"))
            .send({ from: adminAccount.address });
  
          transactionEvents = await AccountRulesContract.getPastEvents(
            "AccountRemoved",
            { transactionHash: transactionReceipt.transactionHash }
          );
  
          printEvent("AccountRemoved", transactionEvents[0], transactionReceipt);
  
          break;
      default:
        console.log(`Unknown command ${argv._[0]}`);
        break;
    }
  } catch (e) {
    const message = e.message;
    const lines = message.split("\n");
    if (
      lines.length > 1 &&
      lines[0] === "Execution reverted" &&
      lines[1].length > 138 &&
      lines[1].startsWith("0x")
    ) {
      console.error(
        `Execution reverted with revert reason:\n${web3.utils.hexToAscii(
          "0x" + lines[1].substr(138)
        )}`
      );
    } else {
      console.error(message);
    }
    process.exit(-1);
  }

  process.exit(0);
}

function prefix0x(need0x, str) {
  if (need0x && !str.startsWith("0x")) {
    return "0x" + str;
  } else if (!need0x && str.startsWith("0x")) {
    return str.substr(2);
  }
  return str;
}

function getHex(str, len, need0x, name) {
  var re = XRegExp(`^0x[0-9A-Fa-f]{${len}}$`);
  if (!re.test(prefix0x(true, str))) {
    console.log(`ERROR: Invalid hex string for ${name}: ${str}`);
    if (str.length !== len + 2) {
      console.log(
        `Expected length is ${len} digits, actual length is ${
          str.length - 2
        } digits`
      );
    }
    process.exit(-1);
  }
  return prefix0x(need0x, str);
}

function printEvent(eventName, event, receipt) {
  switch (eventName) {
    case "AccountAdded":
      if (event.returnValues?.accountAdded === true) {
        console.log(event.returnValues);
        console.log("Account successfully added");
      } else {
        console.error("Account not added, transaction receipt:\n" + receipt);
      }
      break;
    case "AccountRemoved":
      if (event.returnValues?.accountRemoved === true) {
        console.log(event.returnValues);
        console.log("Account successfully removed");
      } else {
        console.error("Account not removed, transaction receipt:\n" + receipt);
      }
      break;
    default:
      console.log(result);
  }
}

if (require.main === module) {
  main();
}
