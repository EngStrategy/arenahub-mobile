import { View, Image } from 'react-native';
import { Redirect, router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function WelcomeScreen() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <View className="flex-1 bg-white" />;
    }

    if (user) {
        return <Redirect href="/(atleta)" />;
    }

    return (
        <View className="flex-1 bg-white relative overflow-hidden">
            <StatusBar style="dark" />

            {/* Background Decorative Elements */}
            <View className="absolute top-[-100] left-[-50] w-[300] h-[300] bg-green-50 rounded-full blur-3xl opacity-60" />
            <View className="absolute bottom-[-50] right-[-20] w-[250] h-[250] bg-gray-100 rounded-full blur-3xl opacity-60" />

            {/* Additional Shapes */}
            <View className="absolute top-[20%] right-[-50] w-[150] h-[150] bg-green-100 rounded-full blur-2xl opacity-40" />
            <View className="absolute top-[40%] left-[-40] w-[200] h-[200] bg-orange-50 rounded-full blur-3xl opacity-30" />
            <View className="absolute bottom-[10%] left-[10%] w-[100] h-[100] bg-green-200 rounded-full blur-xl opacity-20" />

            {/* Background Sports Icons */}
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


            <SafeAreaView className="flex-1 px-6 justify-between py-12">

                {/* Top Section */}
                <VStack className="items-center mt-6 space-y-6">
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={{ width: 220, height: 220 }}
                        resizeMode="contain"
                        alt="ArenaHub Logo"
                    />

                    <VStack className="items-center space-y-2">
                        <Text className="text-3xl font-bold text-gray-900 text-center leading-tight">
                            Seu esporte, seu momento.
                        </Text>
                        <Text className="text-gray-500 text-center text-lg px-4">
                            Encontre quadras, agende partidas e conecte-se com sua paixão.
                        </Text>
                    </VStack>
                </VStack>

                {/* Bottom Section */}
                <VStack space="md" className="w-full mb-4">
                    <Button
                        size="xl"
                        className="w-full bg-green-600 rounded-xl shadow-sm border-0 h-16 items-center justify-center"
                        onPress={() => router.push('/login')}
                    >
                        <ButtonText className="font-bold text-white text-lg leading-6">Entrar</ButtonText>
                    </Button>

                    <Button
                        size="xl"
                        variant="outline"
                        className="w-full border-2 border-green-600 rounded-xl h-16 items-center justify-center active:bg-green-50"
                        onPress={() => router.push('/register')}
                    >
                        <ButtonText className="font-bold text-green-700 text-lg leading-6">Criar Conta</ButtonText>
                    </Button>
                </VStack>

            </SafeAreaView>
        </View>
    );
}
