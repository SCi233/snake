const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const SERVE_ENV = process.env.SERVE_ENV;

const BASE_CONF = {
  entry: './src/index.js',
  template: path.resolve(__dirname, './public/index.html'),
};

const ASTAR_CONF = {
  entry: './src/testAstar.js',
  template: path.resolve(__dirname, './public/testAstar.html'),
};

const config = SERVE_ENV === 'astar' ? ASTAR_CONF : BASE_CONF;

module.exports = {
  mode: 'development',
  entry: config.entry,
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.[hash].js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'source-map-loader',
        }
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: config.template,
      inject: 'body',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public/favicon.ico",
          to: "favicon.ico",
        },
      ],
      options: {
        concurrency: 100,
      },
    }),
  ]
};
