import type { Preview } from '@storybook/react'
import React from 'react'
import { AppThemeProvider } from '@gastro-pos/theme'

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
