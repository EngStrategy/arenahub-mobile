import { View, Image } from 'react-native';
import { Redirect, router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthBackground } from '@/components/layout/AuthBackground';

export default function WelcomeScreen() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <View className="flex-1 bg-white" />;
    }

    if (user) {
        return <Redirect href="/(atleta)" />;
    }

    return (
        <AuthBackground>



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
                        <Text className="text-2xl font-bold text-gray-900 text-center leading-tight">
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
        </AuthBackground>
    );
}
