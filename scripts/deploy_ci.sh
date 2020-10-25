#! /bin/bash

echo ${CLASP_JSON} > ~/.clasprc.json
npm i -g npm@next-7
npm_config_yes=true npx @google/clasp push