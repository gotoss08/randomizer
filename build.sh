echo 'building randomized app for deploying'
rm -rf build
yarn build
mv build/src/server.js build/src/public/index.js build
rm -rf build/src
cp -r src/public build
rm build/public/index.js
mv build/index.js build/public/index.js
