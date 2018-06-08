const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const paths = require('./config/paths');

const env = process.env.WEBPACK_SERVE ? 'development' : process.env.NODE_ENV || 'production';
const isProd = env === 'production';
const shouldUseSourceMap = isProd;

const sassRegex = /\.(scss|sass)$/;

module.exports = {
  mode: isProd ? 'production' : 'development',
  entry: paths.appIndexJs,
  // Don't continue if there are any errors
  bail: isProd,
  devtool: shouldUseSourceMap ? 'source-map' : 'cheap-module-source-map',
  output: {
    path: paths.appBuild
  },
  optimization: isProd
    ? {
        minimizer: [
          new UglifyJsPlugin({
            uglifyOptions: {
              compress: {
                comparisons: false
              },
              mangle: {
                safari10: true
              },
              output: {
                ascii_only: true
              }
            },
            parallel: true,
            cache: true,
            sourceMap: shouldUseSourceMap
          }),
          new OptimizeCSSAssetsPlugin()
        ],
        splitChunks: {
          chunks: 'all',
          name: 'vendors',
          cacheGroups: {
            // Extract all CSS in a single file
            // https://webpack.js.org/plugins/mini-css-extract-plugin/#extracting-all-css-in-a-single-file
            styles: {
              name: 'styles',
              test: sassRegex,
              chunks: 'all',
              enforce: true
            }
          }
        },
        // Keep the runtime chunk seperated to enable long term caching
        runtimeChunk: true
      }
    : {},
  module: {
    rules: [
      {
        test: /\.js$/,
        include: paths.appSrc,
        exclude: /node_modules/,
        use: ['thread-loader', 'babel-loader']
      },
      {
        test: sassRegex,
        exclude: /node_modules/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
              minimize: isProd,
              localIdentName: `[hash:5]${isProd ? '' : '_[local]'}`
            }
          },
          {
            loader: 'fast-sass-loader',
            options: {
              includePaths: [paths.appStyles]
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: `[name]${isProd ? '.[hash:8]' : ''}.[ext]`,
            outputPath: paths.assetOutput
          }
        }
      }
    ]
  },
  plugins: [
    isProd && new webpack.optimize.ModuleConcatenationPlugin(),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      template: paths.appHtml,
      minify: isProd && {
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
    }),
    // Makes the NODE_ENV variable available to the JS code
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    isProd && new MiniCssExtractPlugin()
  ].filter(Boolean)
};
