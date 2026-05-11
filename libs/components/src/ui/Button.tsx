import type { ReactNode } from 'react'
import { Button as TamaguiButton } from 'tamagui'
import type { GestureResponderEvent } from 'react-native'

type Intent = 'primary' | 'secondary' | 'danger' | 'ghost'

export interface ButtonProps {
  intent?: Intent
  children?: ReactNode
  onPress?: (e: GestureResponderEvent) => void
  disabled?: boolean
  width?: number | string
  size?: number | string
}

const intentBg: Record<Intent, string> = {
  primary:   '$brandColor',
  secondary: '$cardBackground',
  danger:    '$red9',
  ghost:     'transparent',
}

export function Button({ intent = 'primary', children, onPress, disabled, width, size }: ButtonProps) {
  return (
    <TamaguiButton
      borderRadius="$10"
      backgroundColor={intentBg[intent]}
      pressStyle={{ opacity: 0.85 }}
      onPress={onPress}
      disabled={disabled}
      width={width}
      size={size}
    >
      {children}
    </TamaguiButton>
  )
}
