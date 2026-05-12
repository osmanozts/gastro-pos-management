import type { Meta, StoryObj } from '@storybook/react'
import { Badge, XStack } from '@libs/components'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'danger', 'brand'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: { label: 'Entwurf', variant: 'default' },
}

export const Brand: Story = {
  args: { label: 'Aktiv', variant: 'brand' },
}

export const Success: Story = {
  args: { label: 'Bezahlt', variant: 'success' },
}

export const Warning: Story = {
  args: { label: 'In Bearbeitung', variant: 'warning' },
}

export const Danger: Story = {
  args: { label: 'Storniert', variant: 'danger' },
}

export const OrderStatuses: Story = {
  render: () => (
    <XStack gap="$2" flexWrap="wrap">
      <Badge label="Entwurf" variant="default" />
      <Badge label="In Küche" variant="warning" />
      <Badge label="Bereit" variant="brand" />
      <Badge label="Serviert" variant="success" />
      <Badge label="Teilw. bezahlt" variant="warning" />
      <Badge label="Bezahlt" variant="success" />
    </XStack>
  ),
}
