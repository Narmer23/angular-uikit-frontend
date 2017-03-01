var webpack = require("webpack");
var CopyWebpackPlugin = require('copy-webpack-plugin');


var config = {
    entry: "./app/app.js",
    output: {
        path: "./dist",
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['ng-annotate-loader', 'babel-loader?presets[]=es2015'],
                exclude: /node_modules/
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|jpg|png|html|json)$/,
                use: 'file-loader?name=[path][name].[ext]?[hash]'
            },
            {
                test: /\.(scss|css)$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            }]
    },
    plugins: [
        new webpack.DefinePlugin({
            env: JSON.stringify({basePath: "http://localhost:8080/idm-alstom/api"})
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            'window.jQuery': "jquery",
            Dygraph: "dygraphs/dist/dygraph.js",
            'window.Dygraph': "dygraphs/dist/dygraph.js",
            'window.JSONEditor': 'jsoneditor/dist/jsoneditor.js',
            'JSONEditor': 'jsoneditor/dist/jsoneditor.js',
            'vis': 'vis'
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
    ]
};

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            comments: false
        })
    )
} else {
    config.devtool = "cheap-module-source-map";
    config.devServer = {
        inline: true,
        contentBase: "./dist",
        port: 8100
    }
}

module.exports = config;