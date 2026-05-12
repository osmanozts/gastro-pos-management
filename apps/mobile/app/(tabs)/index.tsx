import { Stack } from 'tamagui';
import { useRouter } from 'expo-router';
import { Button } from '@libs/components'

export default function TabOneScreen() {
  const router = useRouter()
  return (
    <Stack flex={1} alignItems="center" justifyContent="center">
      <Button intent='danger' onPress={() => {
        console.log("Helloo button press")
        router.push("/login")
      }}>Login Screen</Button>
    </Stack>
  );
}
