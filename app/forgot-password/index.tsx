import { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { forgotPassword } from '@/services/api/endpoints/auth';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { InputTexto } from '@/components/forms/formInputs/InputTexto';
import { validarEmail } from '@/utils/validators';
import { useToastNotification } from '@/components/layout/useToastNotification';

export default function ForgotPasswordScreen() {
  const { showToast } = useToastNotification();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async () => {
    setEmailError('');

    if (!email.trim()) {
      setEmailError('Por favor, insira seu email');
      return;
    }

    if (!validarEmail(email)) {
      setEmailError('Por favor, insira um email válido');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      showToast('Sucesso', 'Código enviado para seu email!', 'success');

      router.push({
        pathname: '/forgot-password/verify-code',
        params: { email },
      });
    } catch (error: any) {
      showToast('Erro', error.message, 'error');
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
          <View className="w-20 h-20 rounded-full bg-green-primary items-center justify-center">
            <Ionicons name="lock-closed" size={32} color="#fff" />
          </View>
        </View>

        {/* Cabeçalho */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-center text-gray-900 mb-2">
            Esqueceu a senha?
          </Text>
          <Text className="text-base text-center text-gray-500 px-4">
            Não se preocupe! Insira seu email e enviaremos um código para recuperação.
          </Text>
        </View>

        {/* Formulário */}
        <View className="mb-6">
          <InputTexto
            label="Email"
            placeholder="exemplo@email.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError('');
            }}
            keyboardType="email-address"
            error={emailError}
          />
        </View>

        {/* Botão Principal */}
        <Button
          size="xl"
          className="bg-green-primary rounded-3xl py-3 mb-4"
          onPress={handleSendEmail}
          disabled={loading}
        >
          {loading ? (
            <ButtonSpinner className="text-white" />
          ) : (
            <ButtonText className="text-base text-white">
              Enviar código
            </ButtonText>
          )}
        </Button>

        {/* Botão Voltar */}
        <View className="flex-row justify-center">
          <Button
            variant="link"
            size="md"
            onPress={() => router.back()}
            disabled={loading}
            className="flex-row items-center gap-2"
          >
            <Ionicons name="arrow-back" size={18} color="#22c55e" />
            <ButtonText className="text-green-primary font-medium text-base no-underline">
              Voltar ao Login
            </ButtonText>
          </Button>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}