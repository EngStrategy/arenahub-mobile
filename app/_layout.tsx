import { Stack } from 'expo-router';
import '../global.css';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Rotas de Autenticação */}
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />

      {/* Grupos de Navegação (Tabs) */}
      <Stack.Screen name="(atleta)" />
      <Stack.Screen name="(arena)" />
    </Stack>
  );
}