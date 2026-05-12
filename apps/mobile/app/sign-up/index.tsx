import { useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import { YStack, XStack } from 'tamagui'
import { Button, Card, Input, Text } from '@libs/components'

type FormErrors = {
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
}

function validate(name: string, email: string, password: string, confirmPassword: string): FormErrors {
    const errors: FormErrors = {}

    if (!name.trim()) {
        errors.name = 'Name ist erforderlich'
    }

    if (!email.trim()) {
        errors.email = 'E-Mail ist erforderlich'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Ungültige E-Mail-Adresse'
    }

    if (!password) {
        errors.password = 'Passwort ist erforderlich'
    } else if (password.length < 8) {
        errors.password = 'Passwort muss mindestens 8 Zeichen haben'
    }

    if (!confirmPassword) {
        errors.confirmPassword = 'Bitte Passwort bestätigen'
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwörter stimmen nicht überein'
    }

    return errors
}

export default function SignUpScreen() {
    const router = useRouter()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState<FormErrors>({})
    const [loading, setLoading] = useState(false)
    const [touched, setTouched] = useState<Record<keyof FormErrors, boolean>>({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
    })

    const emailRef = useRef<TextInput>(null)
    const passwordRef = useRef<TextInput>(null)
    const confirmPasswordRef = useRef<TextInput>(null)

    function revalidateField<K extends keyof FormErrors>(field: K) {
        const errs = validate(name, email, password, confirmPassword)
        setErrors((e) => ({ ...e, [field]: errs[field] }))
    }

    function handleSubmit() {
        setTouched({ name: true, email: true, password: true, confirmPassword: true })
        const errs = validate(name, email, password, confirmPassword)
        setErrors(errs)
        if (Object.keys(errs).length > 0) return

        setLoading(true)
        // TODO: connect to auth API
        setTimeout(() => setLoading(false), 1500)
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
                            <Text size="$9" weight="700" color="$textInverse" textAlign="center">
                                Gastro POS
                            </Text>
                            <Text
                                size="$4"
                                color="$textInverse"
                                textAlign="center"
                                style={{ opacity: 0.8 }}
                            >
                                Konto erstellen
                            </Text>
                        </YStack>

                        {/* SignUp Card */}
                        <Card elevated>
                            <YStack gap="$5">
                                <YStack gap="$1">
                                    <Text size="$6" weight="700">
                                        Registrieren
                                    </Text>
                                    <Text size="$3" muted>
                                        Erstellen Sie Ihr Gastro POS Konto
                                    </Text>
                                </YStack>

                                <YStack gap="$4">
                                    <Input
                                        label="Name"
                                        placeholder="Max Mustermann"
                                        value={name}
                                        onChangeText={(text) => {
                                            setName(text)
                                            if (touched.name) revalidateField('name')
                                        }}
                                        error={touched.name ? errors.name : undefined}
                                        autoCapitalize="words"
                                        autoComplete="name"
                                        returnKeyType="next"
                                        onSubmitEditing={() => emailRef.current?.focus()}
                                        blurOnSubmit={false}
                                    />

                                    <Input
                                        ref={emailRef}
                                        label="E-Mail"
                                        placeholder="name@restaurant.de"
                                        value={email}
                                        onChangeText={(text) => {
                                            setEmail(text)
                                            if (touched.email) revalidateField('email')
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
                                            if (touched.password) revalidateField('password')
                                        }}
                                        error={touched.password ? errors.password : undefined}
                                        secureTextEntry
                                        autoComplete="new-password"
                                        returnKeyType="next"
                                        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                                        blurOnSubmit={false}
                                    />

                                    <Input
                                        ref={confirmPasswordRef}
                                        label="Passwort bestätigen"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChangeText={(text) => {
                                            setConfirmPassword(text)
                                            if (touched.confirmPassword) revalidateField('confirmPassword')
                                        }}
                                        error={touched.confirmPassword ? errors.confirmPassword : undefined}
                                        secureTextEntry
                                        autoComplete="new-password"
                                        returnKeyType="done"
                                        onSubmitEditing={handleSubmit}
                                    />
                                </YStack>

                                {/* Submit */}
                                <Button
                                    intent="primary"
                                    onPress={handleSubmit}
                                    disabled={loading}
                                    width="100%"
                                    size="$5"
                                >
                                    <Text weight="600" color="$textInverse">
                                        {loading ? 'Wird registriert...' : 'Konto erstellen'}
                                    </Text>
                                </Button>

                                {/* Back to Login */}
                                <XStack justifyContent="center" gap="$1">
                                    <Text size="$3" muted>
                                        Bereits ein Konto?
                                    </Text>
                                    <XStack onPress={() => router.back()} cursor="pointer">
                                        <Text size="$3" color="$brandColor" weight="500">
                                            Anmelden
                                        </Text>
                                    </XStack>
                                </XStack>
                            </YStack>
                        </Card>

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
