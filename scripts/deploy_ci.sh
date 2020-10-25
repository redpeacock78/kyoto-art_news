#! /bin/bash

echo ${CLASP_JSON} > ~/.clasprc.json
yarn global add clasp
clasp push