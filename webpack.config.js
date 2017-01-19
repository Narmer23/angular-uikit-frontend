var webpack = require("webpack");
var CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    entry: "./app/app.js",
    output: {
        path: "./dist",
        filename: "bundle.js"
    },
    devtool: "cheap-module-source-map",
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|jpg|png|html|json)$/,
                loader: 'file?name=[path][name].[ext]?[hash]'
            },
            {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            }]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            'window.jQuery': "jquery"
        }),
        new CopyWebpackPlugin([
            {
                context: "./app",
                from: "**/*.html"
            },
            {
                context: "./app",
                from: "**/*.json"
            },
            {
                context: "./app",
                from: "**/*.png"
            },
            {
                context: "./app",
                from: "**/*.jpg"
            }
        ])
        ,
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            comments: false
        })
    ]
}