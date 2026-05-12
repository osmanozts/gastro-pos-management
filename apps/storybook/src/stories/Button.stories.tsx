import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@libs/components'
import { XStack } from 'tamagui'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { intent: 'primary', children: 'Bestellung aufnehmen' },
}

export const Secondary: Story = {
  args: { intent: 'secondary', children: 'Abbrechen' },
}

export const Danger: Story = {
  args: { intent: 'danger', children: 'Tisch freigeben' },
}

export const Ghost: Story = {
  args: { intent: 'ghost', children: 'Mehr anzeigen' },
}

export const AllIntents: Story = {
  render: () => (
    <XStack gap="$3" flexWrap="wrap">
      <Button intent="primary">Primary</Button>
      <Button intent="secondary">Secondary</Button>
      <Button intent="danger">Danger</Button>
      <Button intent="ghost">Ghost</Button>
    </XStack>
  ),
}
