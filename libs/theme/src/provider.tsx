import { TamaguiProvider, type TamaguiProviderProps } from '@tamagui/core'
import { tamaguiConfig } from './tamagui.config'

type AppThemeProviderProps = Omit<TamaguiProviderProps, 'config'>

export function AppThemeProvider({ children, ...props }: AppThemeProviderProps) {
  return (
    <TamaguiProvider config={tamaguiConfig} {...props}>
      {children}
    </TamaguiProvider>
  )
}
