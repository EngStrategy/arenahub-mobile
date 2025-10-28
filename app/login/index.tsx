import { login } from '@/services/api/auth';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { FormControl } from '@/components/ui/form-control';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = React.useState(false);
  const toggleShowPassword = () => setShowPassword(prev => !prev);

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
      // 1. Chamar a API real
      // (Ajuste a resposta da API conforme o que você definiu)
      const response = await login({ email, password });

      // 2. Salvar o token e os dados do usuário no AsyncStorage
      await AsyncStorage.setItem('userToken', response.token);

      // Salve outros dados do usuário se a API retornar
      const userData = JSON.stringify(response.user);
      await AsyncStorage.setItem('userData', userData);

      // 3. Redirecionar para a área logada do app
      // router.replace('/(tabs)/'); // (Ou qualquer que seja sua rota "Home")
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
            className="w-20 h-20 rounded-full bg-green-500 items-center justify-center"
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

        {/* Input de Email */}

        <VStack space="xs">
          <Text className="text-typography-500">Email</Text>
          <Input size="xl" className="border border-gray-300 rounded-lg" >
            <InputField
              className="text-base"
              type="text"
              placeholder="Insira seu email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </Input>
        </VStack>

        {/* Input de Senha */}
        <VStack space="xs">
          <Text className="text-typography-500">Senha</Text>
          <Input size="xl" className="border border-gray-300 rounded-lg">
            <InputField
              className="text-base"
              type={showPassword ? "text" : "password"}
              placeholder="Insira sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <InputSlot className="pr-3" onPress={toggleShowPassword}>
              <InputIcon
                as={showPassword ? EyeIcon : EyeOffIcon}
                fill="none"
              />
            </InputSlot>
          </Input>
        </VStack>




        {/* Link de Esqueci Senha */}
        <TouchableOpacity
          // styles.forgotPasswordButton
          className="self-end mb-6 mt-2" // Adicionei um mt-2
          onPress={() => router.push('/forgot-password')}
          disabled={loading}
        >
          <Text
            // styles.forgotPasswordText
            className="text-sm text-green-500 font-medium"
          >
            Esqueceu sua senha?
          </Text>
        </TouchableOpacity>

        {/* Botão Entrar */}


        <Button size="xl" className="bg-green-primary rounded-lg py-3 mt-4"
          onPress={handleLogin}
          disabled={loading}
        >
          <ButtonText className="text-base text-white">
            Entrar
          </ButtonText>
        </Button>

        {/* Link de Cadastro */}
        <View
          // styles.registerContainer
          className="flex-row justify-center items-center mt-4"
        >
          <Text
            // styles.registerText
            className="text-sm text-gray-500"
          >
            Não tem uma conta?
          </Text>
          <TouchableOpacity
            // onPress={() => router.push('/register')} // Mude para sua rota de cadastro
            disabled={loading}
          >
            <Text
              // styles.registerLink
              className="text-sm text-green-500 font-semibold ml-1"
            >
              Cadastre-se
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
