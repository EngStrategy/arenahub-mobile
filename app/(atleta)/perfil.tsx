import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Href } from 'expo-router';
import { User, LogOut, Lock, ChevronRight, LucideProps } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { Heading } from '@/components/ui/heading';
import { AlertDialogView } from '@/components/layout/AlertDialogView';

type MenuItem = {
    id: string;
    name: string;
    icon: React.ComponentType<LucideProps>;
    route: Href | 'logout';
};

const MENU_ITEMS: MenuItem[] = [
    { id: 'personal-info-atleta', name: 'Informações pessoais', icon: User, route: "/info-pessoais-atleta" },
    { id: 'change-password-atleta', name: 'Alterar senha', icon: Lock, route: "/alterar-senha" },
];

export default function MenuPerfilAtletaScreen() {
    const router = useRouter();
    const { signOut } = useAuth();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    const handleMenuItemPress = async (route: Href | 'logout') => {
        if (route === 'logout') {
            setShowLogoutDialog(true);
        } else {
            router.push(route);
        }
    };

    const handleLogoutConfirm = async () => {
        setShowLogoutDialog(false);
        await signOut();
    };

    return (
        <SafeAreaView className="flex-1 bg-white relative" edges={['top']}>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: 100,
                    paddingHorizontal: 24,
                }}
                showsVerticalScrollIndicator={false}
            >
                <View className="pt-6 w-full flex-1 gap-2">

                    <Heading className="text-2xl mb-1">Meu Perfil</Heading>
                    <Text className="text-typography-500 mb-4">
                        Gerencie suas informações pessoais e configurações de segurança.
                    </Text>

                    {/* Lista de Opções */}
                    <View>
                        {MENU_ITEMS.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => handleMenuItemPress(item.route)}
                                className="flex-row items-center justify-between py-4 border-b border-gray-100 active:bg-gray-50"
                            >
                                <View className="flex-row items-center">
                                    <item.icon size={20} color="#4B5563" />
                                    <Text className="ml-4 text-base font-medium text-gray-700">{item.name}</Text>
                                </View>
                                <ChevronRight size={18} color="#9CA3AF" />
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            onPress={() => handleMenuItemPress('logout')}
                            className="flex-row items-center py-4"
                        >
                            <LogOut size={20} color="#EF4444" />
                            <Text className="ml-4 text-base font-medium text-red-500">Sair da conta</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>

            <AlertDialogView
                isOpen={showLogoutDialog}
                onClose={() => setShowLogoutDialog(false)}
                onConfirm={handleLogoutConfirm}
                title="Sair da conta"
                description="Tem certeza que deseja desconectar?"
                confirmText="Sair"
                cancelText="Cancelar"
                action="negative"
            />
        </SafeAreaView>
    );
}