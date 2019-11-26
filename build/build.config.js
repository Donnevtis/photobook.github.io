const path = require('path')
const merge = require('webpack-merge')
const baseWebpackConfig = require('../config')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
var ImageminPlugin = require('imagemin-webpack-plugin').default


const buildWebpackConfig = merge(baseWebpackConfig, {
    // BUILD settings gonna be here
    mode: 'production',


    output: {
        filename: `js/[name].[hash:4].js`,
        path: baseWebpackConfig.externals.paths.dist,
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
        }, ]
    },
    plugins: [


        new ImageminPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i,
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
        })
    ]
});

// export buildWebpackConfig
module.exports = new Promise((resolve, reject) => {
    resolve(buildWebpackConfig)
})