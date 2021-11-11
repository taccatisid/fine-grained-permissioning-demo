A demo for account and contract permissioning with besu
=======================================================

This runs a private ethereum network of three besu nodes, one of which is a validator.
Besu is running using the flexible permissioning extension that allows to control account behavior using a smart contract.
Two trivial smart contracts are included to demonstrate how OpenZeppelin access control can be used either on a per-contract basis (`DirectContract`) or using a central authority for all contracts (`DelegateContract`).

Running the demo
----------------

Start the nodes via

    docker-compose up -d

If you want to see the besu node logs, omit the `-d` and run this command in a separate terminal.

Then compile and deploy all contracts to your network using

    ./deploy

and follow the instructions given there.

Cleaning up
-----------

Stop the besu network via

    docker-compose down

This retains the state of the blockchain. To erase all blockchain data and start from scratch run

    rm -r docker-data/node*/{DATABASE_METADATA.json,caches,database}
