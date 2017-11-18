'use strict';

const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, 'build');
const APP_DIR = path.resolve(__dirname, 'src');

// Source maps are resource heavy and can cause out of memory issues for large files
const sourceMaps = process.env.GENERATE_SOURCEMAP !== 'false';

module.exports = ({ production, publicPath = '/' } = {}) => {
  const isProd = production === true;
  const generator = isProd ? generateProdConfig : generateDevConfig;

  const nodeEnv = isProd ? 'production' : 'development';
  const publicUrl = publicPath.slice(0, -1);

  const config = {
    context: APP_DIR,
    entry: './index.js',
    output: {
      path: BUILD_DIR,
      filename: '[name].js',
      publicPath
    },
    devtool: sourceMaps
      ? isProd ? 'cheap-module-source-map' : 'source-map'
      : false,
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
          loader: ExtractTextPlugin.extract(getCssConfig(isProd))
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
        'process.env.NODE_ENV': JSON.stringify(nodeEnv),
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
        allChunks: true,
        disable: !isProd
      })
    ]
  };

  return generator(config);
};

function generateProdConfig(config) {
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
      sourceMap: sourceMaps
    }),
    new webpack.optimize.OccurrenceOrderPlugin()
  );

  return config;
}

function generateDevConfig(config) {
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

  return config;
}

function getCssConfig(isProd) {
  const base = {
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
          includePaths: [path.resolve(APP_DIR, 'styles')]
        }
      }
    ]
  };

  if (isProd) {
    base.use.push({
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
    });
  }

  return base;
}
