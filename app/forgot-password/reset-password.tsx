// app/forgot-password/reset-password.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, ButtonText } from '@/components/ui/button';  
import { Input } from '@/components/ui/input';
import { resetPassword } from '@/services/api/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PasswordStrengthIndicator } from '@/components/forms/passwordStrengthIndicador';
import { validatePassword } from "@/context/functions/validatePassword";
import { validateConfirmPassword } from "@/context/functions/validateConfirmPassword";

export default function ResetPasswordScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  // Countdown para redirecionamento após sucesso
  useEffect(() => {
    if (isSuccess && countdown > 0) {
      const intervalId = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    } else if (isSuccess && countdown === 0) {
      router.replace('/login');
    }
  }, [isSuccess, countdown]);


  const handleResetPassword = async () => {
    // Validações
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(password, confirmPassword);

    setErrors({
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    if (passwordError || confirmPasswordError) {
      return;
    }

    setLoading(true);
    try {
      // Enviar email, newPassword e confirmation
      await resetPassword({
        email: email!,
        newPassword: password,
        confirmation: confirmPassword,
      });
      setIsSuccess(true);
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <View className="flex-1 bg-white">
        <ScrollView contentContainerClassName="flex-grow p-6 justify-center items-center">
          {/* Ícone de Sucesso */}
          <View className="items-center mb-6">
            <View className="w-20 h-20 rounded-full bg-[#22c55e] items-center justify-center">
              <Ionicons name="checkmark" size={48} color="#fff" />
            </View>
          </View>

          {/* Mensagem de Sucesso */}
          <Text className="text-2xl font-semibold text-center mb-3 text-gray-800">
            Senha alterada com sucesso!
          </Text>
          <Text className="text-sm text-center text-gray-500 mb-2 px-6">
            Lembre-se: senhas iguais em vários lugares podem ser um risco.
          </Text>
          <Text className="text-sm text-center text-gray-500 mb-8">
            Redirecionando em <Text className="font-bold text-gray-800">{countdown}</Text> segundos.
          </Text>

          {/* Botão para ir direto ao Login */}
          <View className="w-full mb-3">
            <Button
              text="Continuar para o Login"
              onPress={() => router.replace('/login')}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    // Substitua <KeyboardAvoidingView> e <ScrollView> por <KeyboardAwareScrollView>
    <KeyboardAwareScrollView
      className="flex-1 bg-white" // Estilo do KAV
      contentContainerClassName="flex-grow p-6 justify-center" // Estilo do ScrollView
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true} // Importante para Android
      extraScrollHeight={Platform.OS === 'ios' ? 20 : 0} // Um pequeno ajuste fino (opcional)
    >
      {/* Ícone */}
      <View className="items-center mb-6">
        <View className="w-20 h-20 rounded-full bg-[#22c55e] items-center justify-center">
          <Ionicons name="lock-closed" size={32} color="#fff" />
        </View>
      </View>

      {/* Título */}
      <Text className="text-2xl font-semibold text-center mb-2 text-gray-800">
        Redefinir Senha
      </Text>
      <Text className="text-sm text-center text-gray-500 mb-8">
        Escolha uma nova senha para sua conta.
      </Text>

      {/* Input Nova Senha */}
      <Input
        label="Nova Senha"
        placeholder="Digite a nova senha"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setErrors({ ...errors, password: '' });
        }}
        secureTextEntry
        showPasswordToggle
        error={errors.password}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Indicador de Força da Senha */}
      {password.length > 0 && <PasswordStrengthIndicator password={password} />}

      {/* Input Confirmar Senha */}
      <Input
        label="Confirmar Nova Senha"
        placeholder="Confirme a nova senha"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setErrors({ ...errors, confirmPassword: '' });
        }}
        secureTextEntry
        showPasswordToggle
        error={errors.confirmPassword}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Botão Confirmar */}
      <View className="w-full mb-3">
        <Button
          text="Confirmar"
          onPress={handleResetPassword}
          loading={loading}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}