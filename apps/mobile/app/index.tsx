import { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { Redirect } from 'expo-router'
import { YStack } from 'tamagui'
import { authApi } from '@libs/api-client'

type AuthState = 'loading' | 'authenticated' | 'unauthenticated'

export default function Index() {
  const [authState, setAuthState] = useState<AuthState>('loading')

  useEffect(() => {
    authApi.getSession()
      .then((session) => {
        setAuthState(session ? 'authenticated' : 'unauthenticated')
      })
      .catch(() => {
        setAuthState('unauthenticated')
      })
  }, [])

  if (authState === 'loading') {
    return (
      <YStack flex={1} backgroundColor="$brandColor" justifyContent="center" alignItems="center">
        <ActivityIndicator color="white" size="large" />
      </YStack>
    )
  }

  if (authState === 'authenticated') {
    return <Redirect href="/(tabs)" />
  }

  return <Redirect href="/login" />
}
