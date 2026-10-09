import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
