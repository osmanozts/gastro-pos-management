import { YStack, type YStackProps } from 'tamagui'

interface CardProps extends YStackProps {
  elevated?: boolean
}

export function Card({ elevated = false, ...props }: CardProps) {
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
    />
  )
}
