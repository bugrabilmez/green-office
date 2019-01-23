const merge = require('webpack-merge');
const common = require('./webpack.common');
const webpack = require('webpack');

const uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = merge(common, {
    devtool: 'cheap-source-map',
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new uglifyJsPlugin({
          compress: {
            warnings: false
          }
        }),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
      ]
});