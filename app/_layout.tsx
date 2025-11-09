import { Stack } from 'expo-router';
import '../global.css';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="arenas" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
