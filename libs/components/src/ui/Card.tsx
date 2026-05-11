import type { ReactNode } from 'react'
import { YStack, type YStackProps } from 'tamagui'

export interface CardProps extends YStackProps {
  elevated?: boolean
  children?: ReactNode
}

export function Card({ elevated = false, children, ...props }: CardProps) {
  return (
    <YStack
      backgroundColor="$cardBackground"
      borderRadius="$4"
      padding="$6"
      borderWidth={elevated ? 0 : 1}
      borderColor="$borderColor"
      shadowColor={elevated ? '$shadowColor' : 'transparent'}
      shadowOffset={elevated ? { width: 0, height: 4 } : { width: 0, height: 0 }}
      shadowOpacity={elevated ? 1 : 0}
      shadowRadius={elevated ? 16 : 0}
      {...props}
    >
      {children}
    </YStack>
  )
}
