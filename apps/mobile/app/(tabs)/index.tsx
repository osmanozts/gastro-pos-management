import { Stack } from 'tamagui';
import { useRouter } from 'expo-router';
import { Button } from '@libs/components'
import { authApi } from '@libs/api-client';

export default function TabOneScreen() {
  const router = useRouter()
  return (
    <Stack flex={1} alignItems="center" justifyContent="center">
      <Button intent='danger' onPress={async () => {
        await authApi.signOut();
      }}>Abmelden</Button>
    </Stack>
  );
}
