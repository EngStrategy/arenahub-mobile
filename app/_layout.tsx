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

      {/* Rotas modais ou telas soltas que servem para ambos ou específicos */}
      <Stack.Screen name="cadastrar-quadra" options={{ presentation: 'modal' }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}