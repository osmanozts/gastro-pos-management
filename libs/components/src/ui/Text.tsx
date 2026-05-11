import type { ReactNode } from 'react'
import { H1, H2, H3, Text as TamaguiText, type TextProps as TamaguiTextProps } from 'tamagui'

type Weight = '400' | '500' | '600' | '700'
type Size = '$1' | '$2' | '$3' | '$4' | '$5' | '$6' | '$7' | '$8' | '$9' | '$10'

export interface TextProps extends TamaguiTextProps {
  size?: Size
  weight?: Weight
  muted?: boolean
  children?: ReactNode
}

export interface HeadingProps {
  children?: ReactNode
  color?: string
}

export function Text({ children, size = '$4', weight = '400', color, muted, ...props }: TextProps) {
  return (
    <TamaguiText
      fontSize={size}
      fontWeight={weight}
      color={muted ? '$textMuted' : (color ?? '$color')}
      {...props}
    >
      {children}
    </TamaguiText>
  )
}

export function Heading1({ children, color }: HeadingProps) {
  return <H1 color={color ?? '$color'}>{children}</H1>
}

export function Heading2({ children, color }: HeadingProps) {
  return <H2 color={color ?? '$color'}>{children}</H2>
}

export function Heading3({ children, color }: HeadingProps) {
  return <H3 color={color ?? '$color'}>{children}</H3>
}
