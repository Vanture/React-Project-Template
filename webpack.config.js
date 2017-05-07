'use strict';

const webpack = require('webpack');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const production = process.env.NODE_ENV === 'production';
const watchMode = process.argv.indexOf('--watch') !== -1;

const BUILD_DIR = path.resolve(__dirname, 'build');
const APP_DIR = path.resolve(__dirname, 'src');

const webpackConfig = {
  context: __dirname,
  entry: {
    app: APP_DIR + '/index.js'
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].js'
  },
  devtool: production ? 'source-map' : 'eval-source-map',
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
                getLocalIdent: (context, localIdentName, localName, options) => {
                  if(!options.context) {
		                options.context = context.options && typeof context.options.context === "string" ? context.options.context : context.context;
                  }

                  let request = path.relative(path.join(__dirname, "src"), context.resourcePath);

                  request = request.replace(/\.[^/.]+$/, "");
                  request = request.replace(/\/index$/, "");
                  request = request.replace(/\//g, "_");
                  request = request.replace(/[^a-z0-9-_]/gi, "");

                  // [path]_[className]
                  // i.e. components_App_container
                  return `${request}_${localName}`;
                }
              }
            },
            {
              loader: 'resolve-url-loader'
            },
            {
              loader: 'sass-loader',
              options: {
                data: '@import "_variables";',
                sourceMap: true,
                includePaths: [
                  path.resolve(__dirname, 'src/sass'),
                  APP_DIR // Used for font imports
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
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new HtmlWebpackPlugin({
      title: 'My App',
      template: 'src/template.ejs'
    }),
    new ExtractTextPlugin({
      filename: 'styles/main.css',
      allChunks: true
    })
  ]
};

if (!watchMode && production) {
  webpackConfig.plugins.push(new UglifyJSPlugin());
}

module.exports = webpackConfig;