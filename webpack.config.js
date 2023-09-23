const path = require('path');
const copyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  entry: {
    service_worker: './src/service_worker.ts',
    popover : './src/popover.tsx'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)/,
        use : {
          loader: 'ts-loader',
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {loader: MiniCssExtractPlugin.loader, options:{}},
          {loader: 'css-loader', options:{url: false}}
        ]
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  "target": "es2020",
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    chunkFormat: "module"
  },
  plugins: [
    new copyPlugin({
      patterns: [
        { from: "public"},
      ],
    }),
    new MiniCssExtractPlugin(),
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ]
  }
};
