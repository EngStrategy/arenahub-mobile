import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';

import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Esqueci Senha',
          tabBarIcon: ({ color }) => <TabBarIcon name="lock" color={color} />,
          href: '/forgot-password',
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Verificar Código',
          tabBarIcon: ({ color }) => <TabBarIcon name="check" color={color} />,
          href: '/forgot-password/verify-code',
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: 'Resetar senha',
          tabBarIcon: ({ color }) => <TabBarIcon name="lock" color={color} />,
          href: '/forgot-password/reset-password'
        }}
      />
    </Tabs>
  );
}
