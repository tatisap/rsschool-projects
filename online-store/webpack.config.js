import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { merge } from 'webpack-merge';
import { devConfig } from './webpack.dev.config.js';
import { prodConfig } from './webpack.prod.config.js';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const commonConfig = {
  entry: path.resolve(dirname, './src/index.ts'),
  output: {
    filename: 'index.js',
    path: path.resolve(dirname, './dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(dirname, './src/index.html'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(dirname, './src/assets/img'),
          to: path.resolve(dirname, 'dist'),
        },
        {
          from: path.resolve(dirname, './src/assets/favicon.ico'),
          to: path.resolve(dirname, 'dist'),
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(svg|png)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};

export default ({ mode }) => {
  const isDevelopmentMode = mode === 'dev';
  const additionalConfig = isDevelopmentMode ? devConfig : prodConfig;

  return merge(commonConfig, additionalConfig);
};
