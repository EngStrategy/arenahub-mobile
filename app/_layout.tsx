import { Stack } from 'expo-router';
import '@/global.css';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { LogBox } from 'react-native';
import { OverlayProvider } from '@gluestack-ui/core/overlay/creator';
import { AuthProvider } from '@/context/AuthContext';

// Desativar alertas visuais (Overlay de Erros/Avisos)
LogBox.ignoreAllLogs();

export {
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GluestackUIProvider mode='light'>
      <OverlayProvider>
        <AuthProvider>
          <ThemeProvider value={DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              {/* Rotas de Autenticação */}
              <Stack.Screen name="welcome" />
              <Stack.Screen name="login" />
              <Stack.Screen name="register" />
              <Stack.Screen name="forgot-password" />

              {/* Grupos de Navegação (Tabs) */}
              <Stack.Screen name="(atleta)" />
            </Stack>
          </ThemeProvider>
        </AuthProvider>
      </OverlayProvider>
    </GluestackUIProvider>
  );
}