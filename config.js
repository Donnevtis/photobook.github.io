const path = require('path')
const fs = require('fs')
const glob = require('glob')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var ImageminPlugin = require('imagemin-webpack-plugin').default
const imageminGifsicle = require("imagemin-gifsicle");


const PATHS = {
    src: path.join(__dirname, './assets'),
    dist: path.join(__dirname, './public'),
    assets: 'assets/'
}



module.exports = {
    externals: {
        paths: PATHS
    },
    entry: {
        css: ['./assets/css/style.css', './assets/css/stylereg.css'],
        script: './main.js',
        regs: './assets/js/rg_vds2.js',
    },

    module: {
        rules: [{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/',

            },

            {
                test: /\.(jpe?g|png|gif)$/i,
                use: [{
                    loader: "file-loader", // Or `url-loader` or your other loader,
                    options: {
                        name: `[name].[ext]`,
                        outputPath: './img/'
                    }

                }]
            },
            {
                test: /\.svg$/i,
                use: [{
                    loader: "file-loader", // Or `url-loader` or your other loader,
                    options: {
                        name: `[name].[ext]`,
                        outputPath: './svg/'

                    }


                }]
            }

        ],
    },

    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false, }),
        new CopyWebpackPlugin([
            { from: `${PATHS.assets}img`, to: `${PATHS.dist}/img` },
            { from: `${PATHS.assets}favicon`, to: `${PATHS.dist}/favicon` },
            { from: `${PATHS.assets}svg`, to: `${PATHS.dist}/svg` },
            { from: `${PATHS.assets}fonts`, to: `${PATHS.dist}/fonts` },

        ]),
    ]
}