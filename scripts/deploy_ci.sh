#! /bin/bash

echo ${CLASP_JSON} > ~/.clasprc.json
yarn global add @google/clasp
yarn global bin
~/.npm-global/bin/clasp  push