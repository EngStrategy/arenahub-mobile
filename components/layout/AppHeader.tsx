import React from 'react';
import { View, Image, TouchableOpacity, ImageSourcePropType, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const logo = require('@/assets/images/logo.png') as ImageSourcePropType;

export function AppHeader() {
  const router = useRouter();
  const haveNotification = true;

  const handleNotificationPress = () => {
    // TODO: Implementar a lógica de navegação para a tela de notificações
    console.log('Sino pressionado!');
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja desconectar?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            try {
              // Limpa os dados de sessão
              await AsyncStorage.multiRemove(['userToken', 'userData']);
              
              // Redireciona para a tela de login, limpando o histórico de navegação
              router.replace('/login');
            } catch (error) {
              console.log('Erro ao fazer logout:', error);
            }
          }
        }
      ]
    );
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

      <View className="flex-row items-center gap-x-4">
        
        {/* Botão de Notificação */}
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

        {/* Botão de Sair (Novo) */}
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={26} color="#ef4444" /> 
        </TouchableOpacity>
        
      </View>
    </View>
  );
}