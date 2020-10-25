#! /bin/bash

echo ${CLASP_JSON} > ~/.clasprc.json
yarn global add @google/clasp
~/.npm-global/bin/clasp  push