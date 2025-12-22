import { login } from '@/services/api/auth';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { InputSenha } from '@/components/forms/formInputs/InputSenha';
import { InputTexto } from '@/components/forms/formInputs/InputTexto';
import { validarEmail, validarPassword } from '@/context/functions/validators';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  useEffect(() => {
    const clearSession = async () => {
      try {
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

      if (response.role === 'ARENA') {
        console.log('Redirecionando para painel da Arena...');
        router.replace('/(arena)'); 
      } else {
        console.log('Redirecionando para painel do Atleta...');
        router.replace('/(atleta)');
      }

    } catch (error: any) {
      Alert.alert('Erro no Login', error.message || 'Ocorreu um erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerClassName="flex-grow p-6 justify-center"
        keyboardShouldPersistTaps="handled"
      >
        {/* Ícone */}
        <View
          className="items-center mb-6"
        >
          <View
            className="w-20 h-20 rounded-full bg-green-primary items-center justify-center"
          >
            <Ionicons name="person" size={32} color="#fff" />
          </View>
        </View>

        {/* Título e Subtítulo */}
        <Text
          className="text-2xl font-semibold text-center mb-2 text-gray-800"
        >
          Bem-vindo!
        </Text>
        <Text
          className="text-sm text-center text-gray-500 mb-8"
        >
          Faça login para continuar.
        </Text>

        <VStack className='gap-4'>
          <InputTexto
          label="Email"
          placeholder="Insira seu email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          onBlur={() => {
            const emailError = validarEmail(email) ? '' : 'Email inválido.';
            setErrors(prev => ({ ...prev, email: emailError }));
          }}
          error={errors.email}
        />

        <InputSenha
          label="Senha"
          value={password}
          onChangeText={setPassword}
          onBlur={() => {
            const passwordError = validarPassword(password);
            setErrors((prev) => ({ ...prev, password: passwordError }));
          }}
          error={errors.password}
        />
        </VStack>

        <Button size="xl" className="justify-end p-0 bg-transparent"
          onPress={() => router.push('/forgot-password')}
        >
          <ButtonText className="text-base text-green-primary p-0">
            Esqueceu sua senha?
          </ButtonText>
        </Button>

        {/* Botão Entrar */}
        <Button
          size="xl"
          className="bg-green-primary rounded-lg py-3 mt-4"
          onPress={handleLogin}
          disabled={loading}
          android_ripple={{ color: 'transparent' }}
        >
          {loading ? (
            <ButtonSpinner className="text-white" /> 
          ) : (
            <ButtonText className="text-base text-white">
              Entrar
            </ButtonText>
          )}
        </Button>

        {/* Link de Cadastro */}
        <View
          className="flex-row items-center mt-4"
        >
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