import type { ReactNode } from 'react'
import { XStack as TamaguiXStack, YStack as TamaguiYStack, type XStackProps, type YStackProps } from 'tamagui'

export interface StackProps extends YStackProps {
  children?: ReactNode
}

export function XStack({ children, ...props }: XStackProps & { children?: ReactNode }) {
  return <TamaguiXStack {...props}>{children}</TamaguiXStack>
}

export function YStack({ children, ...props }: StackProps) {
  return <TamaguiYStack {...props}>{children}</TamaguiYStack>
}
