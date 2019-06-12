const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const env = process.env.NODE_ENV;

module.exports = {
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
                    'file-loader'
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
                    //         modules: true, 
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
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ]
};