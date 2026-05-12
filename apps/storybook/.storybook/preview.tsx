import type { Preview } from '@storybook/react'
import { AppThemeProvider } from '@libs/theme'

const preview: Preview = {
  decorators: [
    (Story) => (
      <AppThemeProvider defaultTheme="light">
        <Story />
      </AppThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
}

export default preview
