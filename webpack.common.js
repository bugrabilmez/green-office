const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: [
    'babel-polyfill',
    "./client/index.jsx"
  ],
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    sourceMapFilename: 'bundle.js.map',
    filename: "./bundle.js"
  },
  resolve: {
    extensions: ['.js', '.jsx', 'json'],
    alias: {
      'public': path.resolve(__dirname, 'public')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      }
    ]
  },
  target: "node"
};
