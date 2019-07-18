// require('ignore-styles');
// Transpile all code following this line with babel and use 'env' (aka ES6) preset.
require('@babel/register')({
    ignore: [ "node_modules" ],
    presets: ["@babel/preset-react", [require.resolve('@babel/preset-env'), {targets: {node: 'current'}}]],
    plugins: ['@babel/plugin-proposal-class-properties']
})
require('@babel/polyfill');
// Import the rest of our application.
module.exports = require('./server.js')
