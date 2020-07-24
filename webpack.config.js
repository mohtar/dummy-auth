const path = require('path');

const isProduction = process.env.NODE_ENV == 'production';

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env', '@babel/react'],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              [
                '@babel/plugin-transform-runtime',
                {
                  corejs: 2,
                  regenerator: true,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {extensions: ['.mjs', '.js', '.jsx']},
  devtool: isProduction ? undefined : 'cheap-module-eval-source-map',
  mode: isProduction ? 'production' : 'development',
  entry: './src/frontend/client.jsx',
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'static/js'),
    filename: '[name].js',
  },
};
