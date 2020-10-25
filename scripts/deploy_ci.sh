#! /bin/bash

echo ${CLASP_JSON} > ~/.clasprc.json
yarn global add @google/clasp
yarn global bin
/home/circleci/.yarn/bin/clasp  push