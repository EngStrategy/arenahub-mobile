import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { verifyResetCode, forgotPassword } from '@/services/api/auth';
import { useTimer } from '@/hooks/useTimer';

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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="mail" size={32} color="#fff" />
        </View>
      </View>

      <Text style={styles.title}>Confirme seu email!</Text>
      <Text style={styles.subtitle}>
        Um código foi enviado para{' '}
        <Text style={styles.emailText}>{email}</Text>. Insira-o abaixo:
      </Text>

      {/* OTP Inputs */}
      <View style={styles.otpContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {inputRefs.current[index] = ref;}}
            style={[styles.otpInput, digit && styles.otpInputFilled]}
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
      <View style={styles.resendContainer}>
        <Text style={styles.timerText}>
          {timer > 0
            ? `Reenviar código em ${String(timer).padStart(2, '0')}s`
            : 'Não recebeu o código?'}
        </Text>
        <TouchableOpacity
          onPress={handleResendCode}
          disabled={timer > 0 || loading}
        >
          <Text
            style={[
              styles.resendButton,
              (timer > 0 || loading) && styles.resendButtonDisabled,
            ]}
          >
            Reenviar código
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botão Confirmar */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={() => handleVerifyCode(code.join(''))}
        disabled={loading || code.some((digit) => !digit)}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Confirmar código</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 32,
  },
  emailText: {
    fontWeight: '600',
    fontStyle: 'italic',
    color: '#1f2937',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    backgroundColor: '#fff',
  },
  otpInputFilled: {
    borderColor: '#22c55e',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 12,
    color: '#6b7280',
  },
  resendButton: {
    fontSize: 14,
    color: '#22c55e',
    fontWeight: '500',
  },
  resendButtonDisabled: {
    color: '#9ca3af',
  },
  button: {
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});