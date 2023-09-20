const path = require('path');
const copyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    service_worker: './src/service_worker.ts'
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
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
  ],
};
