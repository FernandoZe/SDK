import * as path from 'path';
import * as webpack from 'webpack';

const SRC_DIR = `${path.resolve(__dirname, 'src')}`;
const DIST_DIR = `${path.resolve(__dirname, 'dist')}`;

const config: webpack.Configuration = {
  entry: `${SRC_DIR}/paygate.ts`,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: 'ts-loader', options: { onlyCompileBundledFiles: true }}],
        exclude: [/node_modules/, /__test__/],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: DIST_DIR,
    library: 'Paygate',
    libraryTarget: 'umd',
    filename: 'paygate.js',
    globalObject: 'this',
    umdNamedDefine: true,
  }
};

export default config;
