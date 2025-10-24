import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PasswordStrength } from '@/components/ui/PasswordStrength';
import { resetPassword } from '@/services/api/auth';

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

  const validatePassword = (pwd: string) => {
    if (!pwd) {
      return 'Por favor, insira sua nova senha';
    }
    if (pwd.length < 8) {
      return 'A senha deve ter no mínimo 8 caracteres';
    }
    return '';
  };

  const validateConfirmPassword = (pwd: string, confirmPwd: string) => {
    if (!confirmPwd) {
      return 'Por favor, confirme sua nova senha';
    }
    if (pwd !== confirmPwd) {
      return 'As senhas não coincidem';
    }
    return '';
  };

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
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.successContent}>
          {/* Ícone de Sucesso */}
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, styles.successCircle]}>
              <Ionicons name="checkmark" size={48} color="#fff" />
            </View>
          </View>

          {/* Mensagem de Sucesso */}
          <Text style={styles.successTitle}>Senha alterada com sucesso!</Text>
          <Text style={styles.successSubtitle}>
            Lembre-se: senhas iguais em vários lugares podem ser um risco.
          </Text>
          <Text style={styles.redirectText}>
            Redirecionando em <Text style={styles.countdownText}>{countdown}</Text>{' '}
            segundos.
          </Text>

          {/* Botão para ir direto ao Login */}
          <Button
            text="Continuar para o Login"
            onPress={() => router.replace('/login')}
            style={styles.button}
          />
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Ícone */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed" size={32} color="#fff" />
          </View>
        </View>

        {/* Título */}
        <Text style={styles.title}>Redefinir Senha</Text>
        <Text style={styles.subtitle}>Escolha uma nova senha para sua conta.</Text>

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
        {password.length > 0 && <PasswordStrength password={password} />}

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
        <Button
          text="Confirmar e Salvar"
          onPress={handleResetPassword}
          loading={loading}
          style={styles.button}
        />

        {/* Link de Voltar */}
        <Button
          text="← Voltar para o login"
          onPress={() => router.replace('/login')}
          variant="outline"
          disabled={loading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  successContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
  successCircle: {
    backgroundColor: '#22c55e',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
    color: '#1f2937',
  },
  successSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  redirectText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 32,
  },
  countdownText: {
    fontWeight: '700',
    color: '#1f2937',
  },
  button: {
    width: '100%',
    marginBottom: 12,
  },
});