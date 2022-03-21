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
  source accounts.env
  source contracts.env
  yarn truffle console --network demo
and once it had started load the rest of the demo using
  .load demo.js
and follow the instructions from there."
