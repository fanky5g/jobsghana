var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const sassToJs = require('sass-vars-to-js');
const fs = require('fs');
const themeVariables = sassToJs(path.join(__dirname, 'client/styles/ant-vars.scss'));

// themeVariables["@icon-url"] = "'//localhost:8080/fonts/iconfont'";
var plugins = [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
        'process.env': {
            BROWSER: JSON.stringify(true),
            IMAGESERVER: JSON.stringify('d1v1sga26wukm3.cloudfront.net'),
        },
    }),
    new webpack.ContextReplacementPlugin(
        /moment[\/\\]locale$/, /en/
    ),
    new webpack.optimize.AggressiveMergingPlugin(),
    new LodashModuleReplacementPlugin,
];

if (process.env.NODE_ENV === 'production') {
    plugins = plugins.concat([
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            output: { comments: false },
            compress: {
                unused: true,
                dead_code: true,
                warnings: false
            },
            test: [/bundle\.js?$/, /client\.js$/, /admin\.js$/]
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
                BROWSER: JSON.stringify(true),
                IMAGESERVER: JSON.stringify('https://images.xxxinafrica.com'),
            },
        }),
    ]);
};

const isProduction = () => {
    return process.env.NODE_ENV === 'production';
};

var config = [{
    target: 'web',
    stats: {
        chunks: false,
        chunkModules: false,
        colors: true
    },
    entry: {
        client: path.join(__dirname, 'client/app.js'),
        vendor: ['react', 'react-dom'],
    },
    output: {
        path: path.join(__dirname, 'server/data/static/build'),
        publicPath: "/static/build/",
        filename: 'app.[hash].js',
        chunkFilename: "[chunkhash].js"
    },
    plugins: plugins
        .concat(new ExtractTextPlugin('[name].css'))
        .concat(new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.[hash].js', Infinity))
        .concat(new HtmlWebpackPlugin({
            hash: true,
            template: './server/data/templates/react_template.html',
            filename: '../../templates/react.html',
        }))
        .concat(new HtmlWebpackPlugin({
            hash: true,
            template: './server/data/templates/mobile_template.html',
            filename: '../../templates/mobile.html',
        })),
    module: {
        loaders: [{
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css?' + JSON.stringify({
                    minify: true,
                })),
            },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!sass?' + JSON.stringify({
                minify: true,
            })) },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style', 'css!less?' + JSON.stringify({
                    modifyVars: themeVariables,
                    minify: true,
                })),
            },
            { test: /\.(png|gif)$/, loader: 'url-loader?name=[name]@[hash].[ext]&limit=5000' },
            {
                test: /\.svg/,
                loader: 'url-loader?limit=26000&mimetype=image/svg+xml',
            },
            {
                test: /\.(woff|woff2|ttf|eot)/,
                loader: 'url-loader?limit=100000',
            },
            { test: /\.json$/, loader: 'json-loader' },
            {
                test: /\.jsx?$/,
                include: path.join(__dirname, 'client'),
                loaders: ['babel'],
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.css'],
        alias: {
            '#app': path.join(__dirname, 'client'),
            '#c': path.join(__dirname, 'client/components'),
            '#css': path.join(__dirname, 'client/css'),
        }
    },
}, {
    devtool: 'eval',
    entry: {
        bundle: path.join(__dirname, 'client/index.js'),
    },
    output: {
        path: path.join(__dirname, 'server/data/static/build'),
        publicPath: "/static/build/",
        filename: '[name].js'
    },
    plugins: plugins.concat(new ExtractTextPlugin('dummy.css')),
    module: {
        loaders: [{
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css'),
            },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!sass') },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style', 'css!less?' + JSON.stringify({
                    modifyVars: themeVariables
                })),
            },
            { test: /\.(png|gif)$/, loader: 'url-loader?name=[name]@[hash].[ext]&limit=5000' },
            {
                test: /\.svg/,
                loader: 'url-loader?limit=26000&mimetype=image/svg+xml',
            },
            {
                test: /\.(woff|woff2|ttf|eot)/,
                loader: 'url-loader?limit=100000',
            },
            { test: /\.json$/, loader: 'json-loader' },
            {
                test: /\.jsx?$/,
                include: path.join(__dirname, 'client'),
                loaders: ['babel'],
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.css'],
        alias: {
            '#app': path.join(__dirname, 'client'),
            '#c': path.join(__dirname, 'client/components'),
            '#css': path.join(__dirname, 'client/css')
        }
    },
}, {
    target: 'web',
    stats: {
        chunks: false,
        chunkModules: false,
        colors: true
    },
    entry: {
        admin: path.join(__dirname, 'client/admin.js'),
        vendor: ['react', 'react-dom'],
    },
    output: {
        path: path.join(__dirname, 'server/data/static/build/admin'),
        publicPath: "/static/build/admin/",
        filename: 'app.[hash].js',
        chunkFilename: "[chunkhash].js"
    },
    plugins: plugins
        .concat(new ExtractTextPlugin('[name].css'))
        .concat(new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.[hash].js', Infinity))
        .concat(new HtmlWebpackPlugin({
            hash: true,
            template: './server/data/templates/admin_template.html',
            filename: '../../../templates/admin.html',
        })),
    module: {
        loaders: [{
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css?' + JSON.stringify({
                    minify: true,
                })),
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style', 'css!less?' + JSON.stringify({
                    modifyVars: themeVariables,
                    minify: true,
                })),
            },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!sass?' + JSON.stringify({
                minify: true,
            })) },
            { test: /\.(png|gif)$/, loader: 'url-loader?name=[name]@[hash].[ext]&limit=5000' },
            {
                test: /\.svg/,
                loader: 'url-loader?limit=26000&mimetype=image/svg+xml',
            },
            {
                test: /\.(woff|woff2|ttf|eot)/,
                loader: 'url-loader?limit=100000',
            },
            { test: /\.json$/, loader: 'json-loader' },
            {
                test: /\.jsx?$/,
                include: path.join(__dirname, 'client'),
                loaders: ['babel'],
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.css'],
        alias: {
            '#app': path.join(__dirname, 'client'),
            '#c': path.join(__dirname, 'client/components'),
            '#css': path.join(__dirname, 'client/css')
        }
    },
}, {
    devtool: 'eval',
    entry: {
        adminbundle: path.join(__dirname, 'client/adminserver.js'),
    },
    output: {
        path: path.join(__dirname, 'server/data/static/build/admin'),
        publicPath: "/static/build/admin",
        filename: '[name].js'
    },
    plugins: plugins.concat(new ExtractTextPlugin('admindummy.css')),
    module: {
        loaders: [{
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css'),
            },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!sass') },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style', 'css!less?' + JSON.stringify({
                    modifyVars: themeVariables
                })),
            },
            { test: /\.(png|gif)$/, loader: 'url-loader?name=[name]@[hash].[ext]&limit=5000' },
            {
                test: /\.svg/,
                loader: 'url-loader?limit=26000&mimetype=image/svg+xml',
            },
            {
                test: /\.(woff|woff2|ttf|eot)/,
                loader: 'url-loader?limit=100000',
            },
            { test: /\.json$/, loader: 'json-loader' },
            {
                test: /\.jsx?$/,
                include: path.join(__dirname, 'client'),
                loaders: ['babel'],
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.css'],
        alias: {
            '#app': path.join(__dirname, 'client'),
            '#c': path.join(__dirname, 'client/components'),
            '#css': path.join(__dirname, 'client/css')
        }
    },
}];

module.exports = config;
