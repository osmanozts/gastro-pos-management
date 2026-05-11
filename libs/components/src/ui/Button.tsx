import { Button as TamaguiButton, type ButtonProps } from 'tamagui'

type Intent = 'primary' | 'secondary' | 'danger' | 'ghost'

interface AppButtonProps extends Omit<ButtonProps, 'variant'> {
  intent?: Intent
}

const intentStyles: Record<Intent, { bg: string; pressOpacity: number }> = {
  primary:   { bg: '$brandColor',      pressOpacity: 0.85 },
  secondary: { bg: '$cardBackground',  pressOpacity: 0.85 },
  danger:    { bg: '$red9',            pressOpacity: 0.85 },
  ghost:     { bg: 'transparent',      pressOpacity: 0.6  },
}

export function Button({ intent = 'primary', ...props }: AppButtonProps) {
  const { bg, pressOpacity } = intentStyles[intent]
  return (
    <TamaguiButton
      borderRadius="$10"
      backgroundColor={bg}
      pressStyle={{ opacity: pressOpacity }}
      {...props}
    />
  )
}
