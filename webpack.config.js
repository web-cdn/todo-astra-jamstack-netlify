const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
require('dotenv').config();

const entry = './src/entry.jsx';
const outputPath = path.resolve('./dist');
const publicPath = process.env.PUBLIC_PATH || '/';
const resolve = {
  extensions: ['.js', '.jsx'],
};

const clientConfig = {
  entry,
  target: 'web',
  devtool: process.env.NODE_ENV === 'production' ? 'nosource-source-map' : 'source-map',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  output: {
    path: outputPath,
    chunkFilename: '[name].bundle.js',
    filename: 'index.bundle.js',
    publicPath,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve('babel-loader')
        }
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true
            }
          }
        ]
      }
    ]
  },
  resolve,
  plugins: [
    // Copy all used resources (no dir available)
    new Dotenv(),
    new CopyPlugin({
      patterns: [
        { from: "assets", to: "assets" },
        { from: "css", to: "css" },
        { from: "public" },
        { from: "index.html", to: "index.html", transform: (content) => {
            if (process.env.PUBLIC_PATH) {
              let path = process.env.PUBLIC_PATH;
              if (path.endsWith("/")) {
                path = path.substring(0, path.length - 1);
              }
              return String(content).replace(/{{CDN}}/g, path);
            } else {
              // Don`t use CDN
              return String(content).replace(/{{CDN}}\//g, "");
            }
          }
        }
      ]}),
  ]
};

module.exports = [
  clientConfig,
];
