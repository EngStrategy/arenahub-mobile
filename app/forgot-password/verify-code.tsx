import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { verifyResetCode, forgotPassword } from '@/services/api/auth';
import { useTimer } from '@/hooks/useTimer';

import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';

export default function VerifyCodeScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const { timer, startTimer } = useTimer(45);

  useEffect(() => {
    startTimer(45);
  }, []);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus no próximo input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Verificar automaticamente quando completar 6 dígitos
    if (newCode.every((digit) => digit !== '') && !loading) {
      handleVerifyCode(newCode.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async (fullCode: string) => {
    if (fullCode.length !== 6) {
      Alert.alert('Atenção', 'Por favor, insira o código de 6 dígitos');
      return;
    }

    setLoading(true);
    try {
      await verifyResetCode({ email: email!, code: fullCode });
      Alert.alert('Sucesso', 'Código verificado!');
      
      router.push({
        pathname: '/forgot-password/reset-password',
        params: { email },
      });
    } catch (error: any) {
      Alert.alert('Erro', error.message);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await forgotPassword(email!);
      Alert.alert('Sucesso', 'Novo código enviado!');
      startTimer(45);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <ScrollView contentContainerClassName="flex-grow p-6 justify-center bg-white">
      {/* Ícone */}
      <View className="items-center mb-6">
        <View className="w-20 h-20 rounded-full bg-green-primary items-center justify-center">
          <Ionicons name="mail" size={32} color="#fff" />
        </View>
      </View>

      {/* Título e Subtítulo */}
      <Text className="text-2xl font-semibold text-center mb-3 text-gray-800">
        Confirme seu email!
      </Text>
      <Text className="text-sm text-center text-gray-500 mb-8">
        Um código foi enviado para{' '}
        <Text className="font-semibold italic text-gray-800">{email}</Text>. Insira-o abaixo:
      </Text>

      {/* OTP Inputs */}
      <View className="flex-row justify-center gap-2 mb-6">
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {inputRefs.current[index] = ref;}}
            className={`w-12 h-14 border-2 rounded-lg text-center text-2xl font-semibold bg-white ${
              digit ? 'border-[#22c55e]' : 'border-gray-300'
            }`}
            value={digit}
            onChangeText={(text) => handleCodeChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            editable={!loading}
            selectTextOnFocus
          />
        ))}
      </View>

      {/* Timer e Reenviar */}
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-xs text-gray-500">
          {timer > 0
            ? `Reenviar código em ${String(timer).padStart(2, '0')}s`
            : 'Não recebeu o código?'}
        </Text>
        <TouchableOpacity
          onPress={handleResendCode}
          disabled={timer > 0 || loading}
          activeOpacity={0.7}
        >
          <Text className={`text-sm font-medium ${
            timer > 0 || loading ? 'text-gray-400' : 'text-green-primary'
          }`}>
            Reenviar código
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botão Confirmar Atualizado */}
      <Button
        size="xl"
        className="bg-green-primary rounded-lg py-3"
        onPress={() => handleVerifyCode(code.join(''))}
        disabled={loading || code.some((digit) => !digit)}
      >
        {loading ? (
          <ButtonSpinner className="text-white" />
        ) : (
          <ButtonText className="text-base text-white">
            Confirmar código
          </ButtonText>
        )}
      </Button>

    </ScrollView>
  );
}