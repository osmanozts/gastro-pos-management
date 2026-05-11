import type { Meta, StoryObj } from '@storybook/react'
import { Card, Text } from '@gastro-pos/components'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
}
export default meta

type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card>
      <Text>Tisch 4 — 3 Gäste</Text>
    </Card>
  ),
}

export const Elevated: Story = {
  render: () => (
    <Card elevated>
      <Text>Tisch 4 — 3 Gäste</Text>
    </Card>
  ),
}

export const WithContent: Story = {
  render: () => (
    <Card width={280}>
      <Text size="$5" weight="700">Tisch 4</Text>
      <Text muted>3 Gäste · seit 45 Min.</Text>
      <Text weight="600" color="$brandColor">Offen: 38,50 €</Text>
    </Card>
  ),
}

export const ElevatedWithContent: Story = {
  render: () => (
    <Card elevated width={280}>
      <Text size="$5" weight="700">Tisch 4</Text>
      <Text muted>3 Gäste · seit 45 Min.</Text>
      <Text weight="600" color="$brandColor">Offen: 38,50 €</Text>
    </Card>
  ),
}
