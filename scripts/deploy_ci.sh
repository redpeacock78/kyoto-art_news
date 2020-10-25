#! /bin/bash

echo ${CLASP_JSON} > ~/.clasprc.json
npm_config_yes=true npx @google/clasp push