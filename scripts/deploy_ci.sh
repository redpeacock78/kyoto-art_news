#! /bin/bash

echo ${CLASP_JSON} > ~/.clasprc.json
yarn add @google/clasp
yarn clasp push