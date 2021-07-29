const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { userInfo } = require("os");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "app.js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
        ],
        include: /\.module\.css$/,
      },

      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
        exclude: /\.module\.css$/,
      },

      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.xml$/i,
        use: ["xml-loader"],
      },
      {
        test: /\.(csv|tsv)$/i,
        use: ["csv-loader"],
      },
      {
				test: /\.woff(2)?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10000,
							name: './font/[hash].[ext]',
							mimetype: 'application/font-woff'
						}
					}
				]
			}


    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "bemr.alpha3",
      hash: true,
    }),
  ],
};
