import { Link, Stack } from 'expo-router';
import { YStack } from 'tamagui';
import { Text } from '@libs/components';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <YStack flex={1} alignItems="center" justifyContent="center" padding="$5" gap="$4" backgroundColor="$background">
        <Text size="$8" weight="700" textAlign="center">
          404
        </Text>
        <Text size="$5" weight="600" textAlign="center">
          Diese Seite existiert nicht.
        </Text>
        <Text size="$3" muted textAlign="center">
          Die angeforderte Seite wurde nicht gefunden oder wurde verschoben.
        </Text>
        <Link href="/" asChild>
          <YStack
            marginTop="$3"
            paddingHorizontal="$5"
            paddingVertical="$3"
            borderRadius="$10"
            backgroundColor="$brandColor"
            pressStyle={{ opacity: 0.85 }}
            cursor="pointer"
          >
            <Text size="$3" weight="600" color="$textInverse">
              Zur Startseite
            </Text>
          </YStack>
        </Link>
      </YStack>
    </>
  );
}
