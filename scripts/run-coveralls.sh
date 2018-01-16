#! /bin/bash
node_version=$(node -v);
if [ ${node_version:1:1} = 9 ]; then
  npm install --no-save coveralls && npm run coveralls
fi
