#! /bin/bash
node_version=$(node -v);
if [ ${node_version:1:1} = 9 ]; then
  eval $1
fi
