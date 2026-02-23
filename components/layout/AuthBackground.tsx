import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

interface AuthBackgroundProps {
    readonly children: React.ReactNode;
}

export function AuthBackground({ children }: AuthBackgroundProps) {
    return (
        <View className="flex-1 bg-white relative overflow-hidden">
            <StatusBar style="dark" />

            {/* Background Elementos Decorativos */}
            <View className="absolute top-[-100] left-[-50] w-[300] h-[300] bg-green-50 rounded-full blur-3xl opacity-60" />
            <View className="absolute bottom-[-50] right-[-20] w-[250] h-[250] bg-gray-100 rounded-full blur-3xl opacity-60" />

            {/* Formas Adicionais */}
            <View className="absolute top-[20%] right-[-50] w-[150] h-[150] bg-green-100 rounded-full blur-2xl opacity-40" />
            <View className="absolute top-[40%] left-[-40] w-[200] h-[200] bg-orange-50 rounded-full blur-3xl opacity-30" />
            <View className="absolute bottom-[10%] left-[10%] w-[100] h-[100] bg-green-200 rounded-full blur-xl opacity-20" />

            {/* Icones Esportivos */}
            <View className="absolute top-20 right-10 opacity-10 rotate-12">
                <Ionicons name="football" size={60} color="#166534" />
            </View>
            <View className="absolute top-40 left-[-10] opacity-10 -rotate-12">
                <MaterialIcons name="sports-basketball" size={80} color="#166534" />
            </View>
            <View className="absolute bottom-80 right-2 opacity-10 rotate-45">
                <MaterialIcons name="sports-tennis" size={70} color="#166534" />
            </View>
            <View className="absolute bottom-60 left-10 opacity-10 -rotate-12">
                <FontAwesome5 name="volleyball-ball" size={50} color="#166534" />
            </View>
            <View className="absolute top-1/2 left-1/2 opacity-5 rotate-90" style={{ transform: [{ translateX: -50 }, { translateY: -50 }] }}>
                <MaterialIcons name="sports-handball" size={120} color="#166534" />
            </View>

            {/* Conteúdo */}
            <View className="flex-1">
                {children}
            </View>
        </View>
    );
}
