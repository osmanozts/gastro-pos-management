import { useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import { YStack, XStack } from 'tamagui'
import { Button, Card, Input, Text } from '@libs/components'
import { authApi, ApiError } from '@libs/api-client'

function validate(email: string, password: string) {
  const errors: { email?: string; password?: string } = {}
  if (!email.trim()) {
    errors.email = 'E-Mail ist erforderlich'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Ungültige E-Mail-Adresse'
  }
  if (!password) {
    errors.password = 'Passwort ist erforderlich'
  } else if (password.length < 6) {
    errors.password = 'Passwort muss mindestens 6 Zeichen haben'
  }
  return errors
}

export default function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({})
  const [serverError, setServerError] = useState<string | null>(null)

  const passwordRef = useRef<TextInput>(null)

  async function handleSubmit() {
    setTouched({ email: true, password: true })
    const errs = validate(email, password)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setServerError(null)
    setLoading(true)
    try {
      await authApi.signIn({ email, password })
      router.replace('/(tabs)')
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setServerError('E-Mail oder Passwort ist falsch.')
      } else {
        setServerError('Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <YStack flex={1} backgroundColor="$brandColor">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <YStack flex={1} justifyContent="center" padding="$6" gap="$8">
            {/* Header */}
            <YStack alignItems="center" gap="$2">
              <Text
                size="$9"
                weight="700"
                color="$textInverse"
                textAlign="center"
              >
                Gastro POS
              </Text>
              <Text size="$4" color="$textInverse" muted={false} style={{ opacity: 0.8 }} textAlign="center">
                Willkommen zurück
              </Text>
            </YStack>

            {/* Login Card */}
            <Card elevated>
              <YStack gap="$5">
                <YStack gap="$1">
                  <Text size="$6" weight="700">
                    Anmelden
                  </Text>
                  <Text size="$3" muted>
                    Melden Sie sich mit Ihren Zugangsdaten an
                  </Text>
                </YStack>

                <YStack gap="$4">
                  <Input
                    label="E-Mail"
                    placeholder="name@restaurant.de"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text)
                      if (touched.email) {
                        const { email: err } = validate(text, password)
                        setErrors((e) => ({ ...e, email: err }))
                      }
                    }}
                    error={touched.email ? errors.email : undefined}
                    keyboardType="email-address"
                    autoComplete="email"
                    autoCapitalize="none"
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    blurOnSubmit={false}
                  />

                  <Input
                    ref={passwordRef}
                    label="Passwort"
                    placeholder="••••••••"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text)
                      if (touched.password) {
                        const { password: err } = validate(email, text)
                        setErrors((e) => ({ ...e, password: err }))
                      }
                    }}
                    error={touched.password ? errors.password : undefined}
                    secureTextEntry
                    autoComplete="current-password"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                </YStack>

                {/* Forgot Password */}
                <XStack justifyContent="flex-end">
                  <Text size="$3" color="$brandColor" weight="500">
                    Passwort vergessen?
                  </Text>
                </XStack>

                {serverError && (
                  <Text size="$3" color="$red9" textAlign="center">
                    {serverError}
                  </Text>
                )}

                {/* Submit */}
                <Button
                  intent="primary"
                  onPress={handleSubmit}
                  disabled={loading}
                  width="100%"
                  size="$5"
                >
                  <Text weight="600" color="$textInverse">
                    {loading ? 'Wird angemeldet...' : 'Anmelden'}
                  </Text>
                </Button>
              </YStack>
            </Card>

            {/* Sign up link */}
            <XStack justifyContent="center" gap="$1">
              <Text size="$3" color="$textInverse" style={{ opacity: 0.8 }}>
                Noch kein Konto?
              </Text>
              <XStack onPress={() => router.push('/sign-up')} cursor="pointer">
                <Text size="$3" color="$textInverse" weight="700">
                  Registrieren
                </Text>
              </XStack>
            </XStack>

            {/* Footer */}
            <Text size="$2" color="$textInverse" textAlign="center" style={{ opacity: 0.6 }}>
              © 2026 Gastro POS Management
            </Text>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </YStack>
  )
}
