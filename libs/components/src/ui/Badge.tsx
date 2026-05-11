import { Text, XStack } from 'tamagui'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'brand'

export interface BadgeProps {
  label: string
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, { bg: string; color: string }> = {
  default: { bg: '$gray4',        color: '$gray11'     },
  success: { bg: '$green4',       color: '$green11'    },
  warning: { bg: '$yellow4',      color: '$yellow11'   },
  danger:  { bg: '$red4',         color: '$red11'      },
  brand:   { bg: '$brandSubtle',  color: '$brandColor' },
}

export function Badge({ label, variant = 'default' }: BadgeProps) {
  const { bg, color } = variantStyles[variant]
  return (
    <XStack
      backgroundColor={bg}
      paddingHorizontal="$2"
      paddingVertical="$1"
      borderRadius="$10"
      alignSelf="flex-start"
    >
      <Text fontSize="$1" fontWeight="600" color={color} textTransform="uppercase">
        {label}
      </Text>
    </XStack>
  )
}
