import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const osName = os.type();
const dirname = path.dirname(fileURLToPath(import.meta.url));

export const devConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: path.resolve(dirname, './dist'),
    open: {
      app: {
        name:
          osName === 'Linux' ? 'google-chrome' : osName === 'Darwin' ? 'Google Chrome' : 'chrome',
      },
    },
  },
};