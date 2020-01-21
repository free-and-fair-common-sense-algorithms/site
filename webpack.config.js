const merge = require('webpack-merge')
const path = require('path')
const glob = require('glob-all')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const ModernizrWebpackPlugin = require('modernizr-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const pages = require('./webpack.pages')

const env = process.env.NODE_ENV || 'development'
const PATHS = { src: path.join(__dirname, 'src') }

const main = {
    entry: [
        '@babel/polyfill',
        path.resolve(__dirname, 'src', 'app.js'),
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: (env === 'development') ? '/' : '/',
        filename: (env === 'development') ? '[name].[hash].js' : '[name].[contenthash].js',
        libraryTarget: 'umd',
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                shared: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    enforce: true,
                    chunks: 'all',
                },
                styles: {
                    name: 'styles',
                    test: /\.(scss|css)$/,
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
        minimizer: [
            new OptimizeCSSAssetsPlugin({}),
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
            }),
        ],
    },
    mode: env,
    devtool: (env === 'development') ? 'cheap-module-eval-source-map' : undefined,
    devServer: {
        historyApiFallback: true,
        port: 8008,
    },
    module: {
        rules: [
            {
                test: /\.hbs$/,
                loader: 'handlebars-loader',
                options: {
                    helperDirs: [path.resolve(__dirname, 'src/helpers')],
                    precompileOptions: {
                        knownHelpersOnly: false,
                    },
                    partialDirs: [
                        path.resolve(__dirname, 'src/partials'),
                        path.resolve(__dirname, 'src/algorithm_sources'),
                        path.resolve(__dirname, 'src/algorithm_templates'),
                    ],
                    debug: true,
                },
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['eslint-loader'],
            },
            {
                test: /\.(scss|css)$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    { loader: 'postcss-loader' },
                    { loader: 'sass-loader' },
                ],
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                loader: 'file-loader',
                options: {
                  limit: 100000,
                },
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin('dist', {}),
        new ModernizrWebpackPlugin(),
        new FaviconsWebpackPlugin('./src/assets/images/fav.png'),
        new MiniCssExtractPlugin({
            filename: (env !== 'production') ? '[name].css' : '[name].[hash].css',
            chunkFilename: (env !== 'production') ? '[id].css' : '[id].[hash].css',
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'src', 'assets', 'images', 'fav.png'),
                to: './favicon.png',
            },
        ]),
        new PurgecssPlugin({
            paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
        }),
    ],
    resolve: {
        alias: {
              'handlebars': 'handlebars/runtime.js'
          }
    },
    resolve: {
        extensions: ['.js', '.css', '.scss'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    watch: true,
    stats: (env === 'development') ? 'normal' : 'verbose'
}

module.exports = merge(main, ...pages)
