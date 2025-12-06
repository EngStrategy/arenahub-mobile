import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Href } from 'expo-router';
import { User, LogOut, Lock, ChevronRight, LucideProps } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    const handleMenuItemPress = async (route: Href | 'logout') => {
        if (route === 'logout') {
            try {
                const userDataString = await AsyncStorage.getItem('userData');
                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    console.log('Fazendo logout do usuário:', userData);
                } else {
                    console.log('Nenhum dado de usuário encontrado no AsyncStorage.');
                    Alert.alert('Aviso', 'Nenhum dado de usuário encontrado.');
                    return;
                }

                await AsyncStorage.multiRemove(['userToken', 'userData']);

                Alert.alert('Sucesso', 'Sessão encerrada com sucesso.');

                router.replace('/login');

            } catch (e) {
                console.error('Erro ao limpar o AsyncStorage durante o logout:', e);
                Alert.alert('Erro', 'Não foi possível encerrar a sessão. Tente novamente.');
            }
        } else {
            router.push(route);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1">
                <View className="w-full max-w-3xl mx-auto p-6">
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
            </ScrollView>
        </SafeAreaView>
    );
}