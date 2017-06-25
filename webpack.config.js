'use strict';

const webpack = require('webpack');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, 'build');
const APP_DIR = path.resolve(__dirname, 'src');

module.exports = (env = {}) => {
  const isProd = env.production === true;
  
  const publicPath = env.publicPath || '/';
  const publicUrl = publicPath.slice(0, -1);

  const config = {
    context: __dirname,
    entry: {
      app: APP_DIR + '/index.js'
    },
    output: {
      path: BUILD_DIR,
      filename: '[name].js',
      publicPath
    },
    devtool: isProd ? 'cheap-module-source-map' : 'source-map',
    stats: {
      children: false
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  modules: true,
                  localIdentName: '[hash:base64:5]_local'
                }
              },
              {
                loader: 'fast-sass-loader',
                options: {
                  includePaths: [
                    path.resolve(APP_DIR, 'sass')
                  ]
                }
              }
            ]
          })
        },
        {
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[sha512:hash:base64:7]-[name].[ext]'
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
        'process.env.PUBLIC_URL' : JSON.stringify(publicUrl)
      }),
      new HtmlWebpackPlugin({
        title: 'App Name',
        template: path.resolve(APP_DIR, 'template.ejs'),
        publicUrl
      }),
      new ExtractTextPlugin({
        filename: 'styles.css',
        allChunks: true
      })
    ]
  };

  if (isProd) {
    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        mangle: true,
        compress: {
          warnings: false,
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          screw_ie8: true
        },
        output: {
          comments: false
        },
        exclude: [
          /\.min\.js$/gi // Skip pre-minified libs
        ]
      }),
      new webpack.optimize.OccurrenceOrderPlugin()
    );
  }

  return config;
};