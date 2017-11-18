'use strict';

const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');

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
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            // Cache babel results in ./node_modules/.cache/babel-loader
            cacheDirectory: !isProd,
            compact: isProd
          }
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
                  minimize: isProd,
                  localIdentName: '[hash:base64:5]_[local]'
                }
              },
              {
                loader: 'fast-sass-loader',
                options: {
                  includePaths: [path.resolve(APP_DIR, 'sass')]
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  // Necessary for external CSS imports to work
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                      browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9' // React doesn't support IE8
                      ],
                      flexbox: 'no-2009'
                    })
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
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          isProd ? 'production' : 'development'
        ),
        'process.env.PUBLIC_URL': JSON.stringify(publicUrl)
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(APP_DIR, 'template.ejs'),
        publicUrl,
        minify: isProd
          ? {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true
            }
          : false
      }),
      new ExtractTextPlugin({
        filename: 'styles.css',
        allChunks: true
      })
    ]
  };

  if (isProd) {
    // Don't continue if there are any errors
    config.bail = true;

    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        mangle: true,
        compress: {
          warnings: false,
          comparisons: false,
          screw_ie8: true
        },
        mangle: {
          safari10: true
        },
        output: {
          comments: false,
          // Emoji and regex is not minified properly
          ascii_only: true
        },
        exclude: [
          /\.min\.js$/gi // Skip pre-minified libs
        ]
      }),
      new webpack.optimize.OccurrenceOrderPlugin()
    );
  } else {
    config.plugins.push(
      // Add module names to factory functions so they appear in the browser profiler
      new webpack.NamedModulesPlugin(),
      // Emit hot updates (currently CSS only)
      new webpack.HotModuleReplacementPlugin()
    );

    // Turn off performance hints during development because
    // we don't do code splitting or minification
    config.performance = {
      hints: false
    };
  }

  return config;
};
