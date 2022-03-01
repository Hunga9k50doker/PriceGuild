const path = require('path');
const webpack = require('webpack');

module.exports =  {

  mode: 'development',
  optimization: {
    minimize: true,
  },
  entry: './index.tsx',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index.tsx',
    library: '',
    libraryTarget: 'commonjs'
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/react']
        }
      },
      {
        test: /\.less$/,
        use: [{
            loader: 'style-loader',
        }, {
            loader: 'css-loader', // translates CSS into CommonJS
        }, {
            loader: 'less-loader', // compiles Less to CSS
        }],
      }
    ]
  } 
};
