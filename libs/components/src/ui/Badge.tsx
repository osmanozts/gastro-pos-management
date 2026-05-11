import { Text, XStack } from 'tamagui'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'brand'

interface BadgeProps {
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
  const styles = variantStyles[variant]
  return (
    <XStack
      backgroundColor={styles.bg}
      paddingHorizontal="$2"
      paddingVertical="$1"
      borderRadius="$10"
      alignSelf="flex-start"
    >
      <Text fontSize="$1" fontWeight="600" color={styles.color} textTransform="uppercase">
        {label}
      </Text>
    </XStack>
  )
}
