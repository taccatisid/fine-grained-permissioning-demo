const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const XRegExp = require("xregexp");
const Fs = require("fs");

// Use this script by calling the script (node accountRulesCLI.js)
// followed by the command and arguments (node accountRulesCLI.js addAccount xxx)
const startArgvCLI = () =>
  require("yargs")
    .env("ACCOUNTRULES")
    .command("getReadOnly", "Query the read only status")
    .command("enterReadOnly", "Enter read only mode if not in read only mode")
    .command(
      "exitReadOnly",
      "Exit read only mode if already in ready only mode"
    )
    .command(
      "accountPermitted <account>",
      "Query whether an account exists in account storage (is permitted)",
      {
        account: {
          description: "address of the account as a hexadecimal string",
          type: "string",
        },
      }
    )
    .command(
      "setCreateContractPermission <account> <canCreateContract>",
      "Set create contract permission for an account to true or false",
      {
        account: {
          description: "address of the account as a hexadecimal string",
          type: "string",
        },
        canCreateContract: {
          description:
            "whether the account is permitted to create contract as a boolean",
          type: "boolean",
        },
      }
    )
    .command(
      "getCreateContractPermission <account>",
      "Query createContract permission for account",
      {
        account: {
          description: "address of the account as a hexadecimal string",
          type: "string",
        },
      }
    )
    .command("getAccounts", "Gets all permitted accounts")
    .command("addAdmin <account>", "Add account to list of admins", {
      account: {
        description: "address of the account as a hexadecimal string",
        type: "string",
      },
    })
    .command("removeAdmin <account>", "Remove account from admin storage", {
      account: {
        description: "address of the account as a hexadecimal string",
        type: "string",
      },
    })
    .command("addAccount <account>", "Add account to account storage", {
      account: {
        description: "address of the account as a hexadecimal string",
        type: "string",
      },
    })
    .command("removeAccount <account>", "Remove account from account storage", {
      account: {
        description:
          "address of the account to be removed as a hexadecimal string",
        type: "string",
      },
    })
    .option("contractAddress", {
      alias: "ca",
      // if not set process.env.CONTRACT_ACCOUNT_RULES will be used as the default
      describe: "AccountRules contract address",
      type: "string",
    })
    .option("adminContractAddress", {
      alias: "aca",
      // if not set process.env.CONTRACT_ADMIN will be used as the default
      describe: "Admin contract address",
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
    .alias("help", "h").argv;

async function main() {
  const argv = startArgvCLI();
  // This file is generated using 'truffle compile' and found under
  // 'src/chain/abis'
  const abi = Fs.readFileSync(
    "./cli/account-permissioning/AccountRules.json",
    "utf-8"
  );
  const adminAbi = Fs.readFileSync(
    "./cli/account-permissioning/Admin.json",
    "utf-8"
  );
  const adminJson = JSON.parse(adminAbi);
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
    getHex(argv.contractAddress ? argv.contractAddress : process.env.CONTRACT_ACCOUNT_RULES, 40, false, "contractAddress")
  );
  const AdminContract = await new web3.eth.Contract(
    adminJson.abi,
    getHex(argv.adminContractAddress ? argv.adminContractAddress : process.env.CONTRACT_ADMIN, 40, false, "adminContractAddress")
  );

  let transactionReceipt;
  let transactionEvents;
  // Main handler
  try {
    switch (argv._[0]) {
      case "getReadOnly":
        console.log(
          `Getting read only mode status from contract ${argv.contractAddress}`
        );

        transactionReceipt = await AccountRulesContract.methods
          .isReadOnly()
          .call({ from: adminAccount.address });

        printEvent("getReadOnly", null, transactionReceipt);

        break;
      case "enterReadOnly":
        console.log("Atttempting to enter read only mode");

        transactionReceipt = await AccountRulesContract.methods
          .enterReadOnly()
          .send({ from: adminAccount.address });

        printEvent("enterReadOnly", null, transactionReceipt);

        break;
      case "exitReadOnly":
        console.log("Attempting to exit read only mode");

        transactionReceipt = await AccountRulesContract.methods
          .exitReadOnly()
          .send({ from: adminAccount.address });

        printEvent("exitReadOnly", null, transactionReceipt);

        break;
      case "accountPermitted":
        console.log(
          `Querying if account ${argv.account} is permitted (whether the account is in account storage)`
        );

        transactionReceipt = await AccountRulesContract.methods
          .accountPermitted(getHex(argv.account, 40, true, "account"))
          .call({ from: adminAccount.address });

        printEvent("accountPermitted", null, transactionReceipt);
        break;
      case "setCreateContractPermission":
        console.log(
          `Attempting to set ${argv.account} can create contract permission to ${argv.canCreateContract}`
        );

        transactionReceipt = await AccountRulesContract.methods
          .setCreateContractPermission(
            getHex(argv.account, 40, true, "account"),
            argv.canCreateContract
          )
          .send({ from: adminAccount.address });

        printEvent("setCreateContractPermission", null, transactionReceipt);

        break;
      case "getCreateContractPermission":
        console.log(
          `Querying can create contract permission for account ${argv.account}`
        );

        transactionReceipt = await AccountRulesContract.methods
          .getCreateContractPermission(
            getHex(argv.account, 40, true, "account")
          )
          .call({ from: adminAccount.address });

        printEvent("getCreateContractPermission", null, transactionReceipt);

        break;
      case "getAccounts":
        console.log(`Querying all permitted accounts`);

        transactionReceipt = await AccountRulesContract.methods
          .getAccounts()
          .call({ from: adminAccount.address });

        printEvent("getAccounts", null, transactionReceipt);
        break;
      case "getAdmins":
        console.log(`Querying all admin accounts`);

        transactionReceipt = await AdminContract.methods
          .getAdmins()
          .call({ from: adminAccount.address });

        printEvent("getAdmins", null, transactionReceipt);
        break;
      case "addAccount":
        console.log(
          `Sending a transaction from account ${adminAccount.address} to add account ${argv.account} to account storage`
        );

        transactionReceipt = await AccountRulesContract.methods
          .addAccount(getHex(argv.account, 40, true, "account"))
          .send({ from: adminAccount.address });

        transactionEvents = await AccountRulesContract.getPastEvents(
          "AccountAdded"
        );

        printEvent(
          "AccountAdded",
          transactionEvents.filter(
            (e) => e.transactionHash === transactionReceipt.transactionHash
          )[0],
          transactionReceipt
        );

        break;
      case "removeAccount":
        console.log(
          `Sending a transaction from account ${adminAccount.address} to remove account ${argv.account} from account storage`
        );

        transactionReceipt = await AccountRulesContract.methods
          .removeAccount(getHex(argv.account, 40, true, "account"))
          .send({ from: adminAccount.address });

        transactionEvents = await AccountRulesContract.getPastEvents(
          "AccountRemoved"
        );

        printEvent(
          "AccountRemoved",
          transactionEvents.filter(
            (e) => e.transactionHash === transactionReceipt.transactionHash
          )[0],
          transactionReceipt
        );

        break;
      case "addAdmin":
        console.log(
          `Sending a transaction from account ${adminAccount.address} to add account ${argv.account} to admin list`
        );

        transactionReceipt = await AdminContract.methods
          .addAdmin(getHex(argv.account, 40, true, "account"))
          .send({ from: adminAccount.address });

        transactionEvents = await AdminContract.getPastEvents("AdminAdded");

        printEvent(
          "AdminAdded",
          transactionEvents.filter(
            (e) => e.transactionHash === transactionReceipt.transactionHash
          )[0],
          transactionReceipt
        );

        break;
      case "removeAdmin":
        console.log(
          `Sending a transaction from account ${adminAccount.address} to remove account ${argv.account} to admin list`
        );

        transactionReceipt = await AdminContract.methods
          .removeAdmin(getHex(argv.account, 40, true, "account"))
          .send({ from: adminAccount.address });

        transactionEvents = await AdminContract.getPastEvents("AdminRemoved");

        printEvent(
          "AdminRemoved",
          transactionEvents.filter(
            (e) => e.transactionHash === transactionReceipt.transactionHash
          )[0],
          transactionReceipt
        );
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
        console.log(event);
        console.error(
          "Account not added, transaction receipt:\n" + JSON.stringify(receipt)
        );
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
    case "AdminAdded":
      if (event.returnValues?.adminAdded === true) {
        console.log(event.returnValues);
        console.log("Admin successfully added");
      } else {
        console.error("Admin not added, transaction receipt:\n" + receipt);
      }
      break;
    case "AdminRemoved":
      if (event.returnValues?.adminRemoved === true) {
        console.log(event.returnValues);
        console.log("Admin successfully removed");
      } else {
        console.error("Admin not removed, transaction receipt:\n" + receipt);
      }
      break;
    case "getReadOnly":
      console.log(
        `Permissioning contract ${receipt ? "is" : "is not"} in read only mode.`
      );
      break;
    case "accountPermitted":
      console.log(
        `Account ${
          receipt ? "is" : "is not"
        } permitted (in the account storage)`
      );
      break;
    case "getCreateContractPermission":
      console.log(
        `Account ${
          receipt ? "has" : "does not have"
        } permission to create contracts`
      );
      break;
    default:
      console.log(receipt);
  }
}

if (require.main === module) {
  main();
}
