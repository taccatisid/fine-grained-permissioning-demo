#!/bin/bash -e

source accounts.env

set -x

yarn install
(cd account-permissioning-contracts && yarn install)
(cd account-permissioning-contracts && yarn truffle migrate --network demo)
yarn truffle migrate --network demo

set +x
echo "
All contracts have been deployed.

Now run
  source contracts.env
to make the contract addresses available to the scripts."
