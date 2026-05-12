import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal(config) {
    config.resolve = {
      ...config.resolve,
      alias: {
        // Make Tamagui components render in the browser
        'react-native': 'react-native-web',
        // Resolve monorepo path aliases
        '@libs/theme': path.resolve(
          __dirname,
          '../../../libs/theme/src/index.ts',
        ),
        '@libs/components': path.resolve(
          __dirname,
          '../../../libs/components/src/index.ts',
        ),
      },
    };
    // react-native-web and some Tamagui internals reference process.env at runtime
    config.define = {
      ...config.define,
      'process.env': JSON.stringify({ NODE_ENV: 'development' }),
    };
    return config;
  },
};

export default config;
