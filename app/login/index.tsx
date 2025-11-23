import { login } from '@/services/api/auth';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';

import { InputTexto } from '@/components/forms/formInputs/InputTexto';
import { InputSenha } from '@/components/forms/formInputs/InputSenha';


export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  useEffect(() => {
    const clearSession = async () => {
      try {
        // Remove o token e os dados do usuário para garantir um login limpo
        await AsyncStorage.multiRemove(['userToken', 'userData']);
        console.log('🧹 Sessão limpa automaticamente na tela de login.');
      } catch (e) {
        console.log('Erro ao limpar sessão:', e);
      }
    };
    clearSession();
  }, []);

  const handleLogin = async () => {
    setErrors({ email: '', password: '' });

    let hasError = false;
    if (!email) {
      setErrors((prev) => ({ ...prev, email: 'Email é obrigatório' }));
      hasError = true;
    }
    if (!password) {
      setErrors((prev) => ({ ...prev, password: 'Senha é obrigatória' }));
      hasError = true;
    }
    if (hasError) return;

    setLoading(true);
    try {
      const response = await login({ email, password });

      await AsyncStorage.setItem('userToken', response.accessToken);

      const userData = JSON.stringify({
        id: response.userId,
        name: response.name,
        role: response.role,
        imageUrl: response.imageUrl,
        statusAssinatura: response.statusAssinatura,
      });

      await AsyncStorage.setItem('userData', userData);

      router.push('/(tabs)');

    } catch (error: any) {
      Alert.alert('Erro no Login', error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView
      // styles.container
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        // styles.scrollContent
        // Note: para ScrollView, use 'contentContainerClassName'
        contentContainerClassName="flex-grow p-6 justify-center"
        keyboardShouldPersistTaps="handled"
      >
        {/* Ícone */}
        <View
          // styles.iconContainer
          className="items-center mb-6"
        >
          <View
            // styles.iconCircle
            className="w-20 h-20 rounded-full bg-green-primary items-center justify-center"
          >
            <Ionicons name="person" size={32} color="#fff" />
          </View>
        </View>

        {/* Título e Subtítulo */}
        <Text
          // styles.title
          className="text-2xl font-semibold text-center mb-2 text-gray-800"
        >
          Bem-vindo!
        </Text>
        <Text
          // styles.subtitle
          className="text-sm text-center text-gray-500 mb-8"
        >
          Faça login para continuar.
        </Text>

        <VStack space="md" className='mb-4'>
          <InputTexto
            label="Email"
            placeholder="Insira seu email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={errors.email}
          />
        </VStack>

        <VStack space="md">
          <InputSenha
            label="Senha"
            placeholder="Insira sua senha"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
          />
        </VStack>

        <Button
          size="xl"
          variant="link" // Usando variante 'link'
          action="primary" // Usando action 'primary' para a cor
          className="justify-end p-0"
          onPress={() => router.push('/forgot-password')}
        >
          <ButtonText
            className="text-base text-green-primary p-0"
          >
            Esqueceu sua senha?
          </ButtonText>
        </Button>

        <Button
          size="xl"
          action="positive" // Usando action="positive" para o botão primário (verde)
          className="bg-green-primary rounded-lg py-3 mt-4" // Mantendo classes customizadas
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ButtonSpinner className="text-white" /> // Spinner para o estado de carregamento
          ) : (
            <ButtonText className="text-base text-white">
              Entrar
            </ButtonText>
          )}
        </Button>

        {/* Link de Cadastro */}
        <View
          // styles.registerContainer
          className="flex-row items-center mt-4"
        >
          {/* Usando um Button com variant="link" para o link de cadastro */}
          <Button
            size="xl"
            variant="link"
            action="primary"
            className="justify-start p-0"
            onPress={() => router.push('/register')}
          >
            <Text className="text-sm text-gray-500">Não tem uma conta?</Text>
            <ButtonText className="text-base text-green-primary p-0 underline ml-1"
            >
              Cadastre-se
            </ButtonText>
          </Button>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}