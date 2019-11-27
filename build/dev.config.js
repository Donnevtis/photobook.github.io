const path = require('path')

const merge = require('webpack-merge')
const baseWebpackConfig = require('../config')
const NodemonPlugin = require('nodemon-webpack-plugin');

const devWebpackConfig = merge(baseWebpackConfig, {
    // DEV settings gonna be here
    mode: 'development',
    watch: true,

    output: {
        filename: `js/[name].js`,
        path: baseWebpackConfig.externals.paths.dist,
        publicPath: '/'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].css',
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
        new NodemonPlugin({
            script: './app.js',
            watch: path.resolve('./views/'),
        }),

    ]

})

// export devWebpackConfig
module.exports = new Promise((resolve, reject) => {
    resolve(devWebpackConfig)
})