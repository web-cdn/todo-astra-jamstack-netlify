const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

const entry = './src/entry.jsx';
const outputPath = path.resolve('./dist');
const publicPath = process.env.PUBLIC_PATH || '/';
const resolve = {
  extensions: ['.js', '.jsx'],
};

if (!process.env.ASTRA_ENDPOINT) {
  throw new Error('No ASTRA_ENDPOINT set');
}

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
    // During the build make literal replacements on client side for
    // process.env.API_URL, because there is no process.env
    new webpack.DefinePlugin({
      'process.env.ASTRA_ENDPOINT': JSON.stringify(process.env.ASTRA_ENDPOINT),
      'process.env.ASTRA_DB_USERNAME': JSON.stringify(process.env.ASTRA_DB_USERNAME),
      'process.env.ASTRA_DB_PASSWORD': JSON.stringify(process.env.ASTRA_DB_PASSWORD),
      'process.env.ASTRA_DB_KEYSPACE': JSON.stringify(process.env.ASTRA_DB_KEYSPACE)
    }),
  ],
  devServer: {
    proxy: {
      '/api': {
        target: process.env.ASTRA_ENDPOINT,
        changeOrigin: true
      }
    }
  }
};

module.exports = [
  clientConfig,
];
