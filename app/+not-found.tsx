import { Stack, useRouter } from 'expo-router';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { Ionicons } from '@expo/vector-icons';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Fora de Jogo!' }} />
      <View className="flex-1 items-center justify-center bg-white px-6">

        {/* Illustration/Icon */}
        <View className="mb-8 items-center justify-center w-40 h-40 bg-gray-100 rounded-full">
          <Ionicons name="alert-circle-outline" size={80} color="#F97316" />
        </View>

        <VStack space="md" className="items-center">
          <Text className="text-2xl font-bold text-gray-900 text-center">
            Ops! Fora de Jogo.
          </Text>

          <Text className="text-center text-gray-500 text-lg px-4">
            Parece que essa jogada não estava ensaiada. A página que você tentou acessar não existe.
          </Text>
        </VStack>

        <Button
          size="xl"
          className="mt-10 bg-primary-500 rounded-xl px-8"
          onPress={() => router.replace('/')}
        >
          <ButtonText className="font-bold text-white">Voltar para o Início</ButtonText>
        </Button>
      </View>
    </>
  );
}
