import React from 'react';
import { View, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const logo = require('@/assets/images/logo.png') as ImageSourcePropType;

export function AppHeader() {
  // Apenas para demonstração
  const haveNotification = true;

  const handleNotificationPress = () => {
    // TODO: Implementar a lógica de navegação para a tela de notificações
    console.log('Sino pressionado!');
  };

  return (
    <View className="bg-white px-4 pt-4 pb-3 flex-row border-b border-gray-200 items-center justify-between">
      <Image
        source={logo}
        style={{
          width: 128,
          height: 40,
        }}
        resizeMode="contain"
      />

      <TouchableOpacity onPress={handleNotificationPress}>
        <View>
          <Ionicons name="notifications-outline" size={26} color="gray" />

          {haveNotification && (
            <View
              className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
              style={{
                transform: [{ translateX: 2 }, { translateY: -1 }],
              }}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}