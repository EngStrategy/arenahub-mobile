import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { forgotPassword } from '@/services/api/auth';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendEmail = async () => {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Por favor, insira seu email');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Atenção', 'Por favor, insira um email válido');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      Alert.alert('Sucesso', 'Código enviado para seu email!');
      
      // Navegar para tela de verificação passando o email
      router.push({
        pathname: '/forgot-password/verify-code',
        params: { email },
      });
    } catch (error: any) {
      Alert.alert('Erro', error.message);
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
        <View className="items-center mb-6">
          <View className="w-20 h-20 rounded-full bg-[#22c55e] items-center justify-center">
            <Ionicons name="lock-closed" size={32} color="#fff" />
          </View>
        </View>

        {/* Título e Subtítulo */}
        <Text className="text-2xl font-semibold text-center mb-3 text-gray-800">
          Esqueceu sua senha?
        </Text>
        <Text className="text-sm text-center text-gray-500 mb-8">
          Insira seu email abaixo para receber um código de verificação!
        </Text>

        {/* Input de Email */}
        <View className="mb-6">
          <Text className="text-sm font-medium mb-2 text-gray-700">
            Email
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 text-base bg-white"
            placeholder="Insira seu email"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
        </View>

        {/* Botão Confirmar */}
        <TouchableOpacity
          className={`bg-[#22c55e] p-4 rounded-lg items-center mb-4 ${loading ? 'opacity-60' : ''}`}
          onPress={handleSendEmail}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-base font-semibold">
              Confirmar
            </Text>
          )}
        </TouchableOpacity>

        {/* Link de Voltar */}
        <TouchableOpacity
          className="flex-row items-center justify-center gap-1"
          onPress={() => router.back()}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={16} color="#22c55e" />
          <Text className="text-[#22c55e] text-sm">
            Voltar para a página de login
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}