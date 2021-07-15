const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { userInfo } = require('os')


module.exports = {
    mode : "development",
    entry:  "./src/index.js",
    output: {
        path :  path.resolve(__dirname,"dist"),
        filename : "app.js",
        clean : true,
    },
    module  : {

        rules:[
            {
                test : /\.css$/i,
                use : ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type : 'asset/resource'
            },
            {
				test:/\.xml$/i,
				use : ['xml-loader'],
			},
            {
				test:/\.(csv|tsv)$/i,
				use: ['csv-loader'],
			}
        ]
    },
    plugins:[
        new HtmlWebpackPlugin(
            {
                title : "bemr.alpha2",
                hash : true,
            }
        )
    ]
}