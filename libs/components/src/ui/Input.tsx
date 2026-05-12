import { forwardRef } from 'react'
import { Input as TamaguiInput, Label, YStack, Text } from 'tamagui'
import type { InputProps as TamaguiInputProps } from 'tamagui'

export interface InputProps extends Omit<TamaguiInputProps, 'size'> {
  label?: string
  error?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: '$3',
  md: '$4',
  lg: '$5',
} as const

export const Input = forwardRef<TamaguiInput, InputProps>(
  ({ label, error, size = 'md', id, ...props }, ref) => {
    return (
      <YStack gap="$1" width="100%">
        {label && (
          <Label htmlFor={id} fontSize="$3" fontWeight="500" color="$gray11">
            {label}
          </Label>
        )}
        <TamaguiInput
          ref={ref}
          id={id}
          size={sizeMap[size]}
          borderWidth={1}
          borderColor={error ? '$red8' : '$gray6'}
          borderRadius="$3"
          backgroundColor="$background"
          color="$color"
          placeholderTextColor="$gray9"
          focusStyle={{
            borderColor: error ? '$red8' : '$brandColor',
            outlineWidth: 0,
          }}
          {...props}
        />
        {error && (
          <Text fontSize="$2" color="$red10">
            {error}
          </Text>
        )}
      </YStack>
    )
  }
)
