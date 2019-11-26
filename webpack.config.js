const path = require('path')
const fs = require('fs')
const ImageminPlugin = require("imagemin-webpack");
const imageminGifsicle = require("imagemin-gifsicle");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');


const PATHS = {
    src: path.join(__dirname, './assets'),
    dist: path.join(__dirname, './public'),
    assets: 'assets/'
}

const PAGES = fs.readdirSync('./views/').filter(fileName => fileName.endsWith('.pug'))


module.exports = {
    watch: true,

    entry: {
        css: ['./assets/css/style.css', './assets/css/stylereg.css'],
        script: './main.js',
        regs: './assets/js/rg_vds2.js',
    },
    output: {
        filename: `js/[name].[hash:4].js`,
        path: PATHS.dist,
        publicPath: '/'
    },

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },

    module: {
        rules: [{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/',

            }, {
                test: /\.css$/,
                use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[name].[hash:4].css',
                            context: './',
                            outputPath: '/css/',
                            publicPath: '/dist'
                        }
                    },
                    {
                        loader: 'extract-loader'
                    },
                    {
                        loader: 'css-loader',
                    },

                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [{
                    loader: "file-loader" // Or `url-loader` or your other loader
                }]
            },
            {
                test: /\.pug$/,
                loader: 'pug-loader'
            }

        ],
    },

    plugins: [
        // new NodemonPlugin({
        //     script: './app.js',
        //     watch: './app.js',
        // }),
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false, }),
        new ImageminPlugin({
            bail: false, // Ignore errors on corrupted images
            cache: true,
            imageminOptions: {
                // Before using imagemin plugins make sure you have added them in `package.json` (`devDependencies`) and installed them

                // Lossless optimization with custom option
                // Feel free to experiment with options for better result for you
                plugins: [
                    ["gifsicle", { interlaced: true }],
                    ["jpegtran", { progressive: true }],
                    ["optipng", { optimizationLevel: 5 }],
                    [
                        "svgo",
                        {
                            plugins: [{
                                removeViewBox: false
                            }]
                        }
                    ]
                ]
            }
        }),
        new CopyWebpackPlugin([
            { from: `${PATHS.assets}img`, to: `${PATHS.dist}/img` },
            { from: `${PATHS.assets}favicon`, to: `${PATHS.dist}/favicon` },
            { from: `${PATHS.assets}svg`, to: `${PATHS.dist}/svg` },
            { from: `${PATHS.assets}fonts`, to: `${PATHS.dist}/fonts` },

        ])
    ]
}