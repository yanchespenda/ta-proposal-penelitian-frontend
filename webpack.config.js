const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const env = process.env.NODE_ENV;
const path = require('path');

module.exports = {
    // mode: "production",
    mode: "development",
    entry: {
        style: path.resolve(__dirname, 'src/style.js'),
        vendor: path.resolve(__dirname, 'src/vendor.js'),
        // commonjs: path.resolve(__dirname, 'src/commonjs.js'),
        main: path.resolve(__dirname, 'src/index.js'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'package.[name].[contenthash:8].js',
        // filename: '[name].[contenthash].js',
        // chunkFilename: '[name].[contenthash].js',
    },
    resolve: {
        alias: { 
            'angular': require.resolve(path.resolve(__dirname, 'src/resources/js/angular')),
            'angular-chart': require.resolve(path.resolve(__dirname, 'src/resources/js/angular-chart')) ,
            'chart': require.resolve(path.resolve(__dirname, 'src/resources/js/chart.bundle')) 
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: {
                            minimize: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'aset/[hash].[ext]',
                        }
                    }
                ]
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    "style-loader",
                    "css-loader",
                    // {
                    //     loader: 'css-loader',
                    //     options: { 
                    //         url: true,
                    //         // modules: true, 
                    //         localIdentName: env === 'production' 
                    //             ? '[hash:base64]' 
                    //             : '[path][name]__[local]--[hash:base64:5]' 
                    //     }
                    // },
                    "sass-loader"
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ],
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `${packageName.replace('@', '')}`;
                        // return `package`;
                    },
                },
            },
        }
    }
};