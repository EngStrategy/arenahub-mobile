import { useState } from "react";
import { useRouter } from 'expo-router';
import { registerAthlete } from '@/services/api/endpoints/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormControl } from '@/components/ui/form-control';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { PasswordStrengthIndicator } from "@/components/general/PasswordStrengthIndicator";
import { ScrollView } from "react-native";
import { formatarTelefone } from "@/utils/formatters";
import { InputTexto } from "./formInputs/InputTexto";
import { InputNumero } from "./formInputs/InputNumero";
import { InputSenha } from "./formInputs/InputSenha";
import {
  validarNome,
  validarTelefone,
  validarConfirmPassword,
  validarEmail,
  validarPassword
} from "@/utils/validators";
import { useToastNotification } from "@/components/layout/useToastNotification";

export const RegistroAtleta = ({ className }: { className?: string }) => {
  const router = useRouter();
  const { showToast } = useToastNotification();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    nome: '',
    email: '',
    telefone: '',
    password: '',
    confirmPassword: '',
  });

  const handleRegister = async () => {
    const nomeError = validarNome(nome);
    const emailError = validarEmail(email) ? '' : 'Email inválido.';
    const passwordError = validarPassword(senha);
    const confirmPasswordError = validarConfirmPassword(senha, confirmSenha);
    const telefoneError = validarTelefone(telefone);

    setErrors(prev => ({
      ...prev,
      nome: nomeError,
      email: emailError,
      telefone: telefoneError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    }));

    setLoading(true);

    try {
      const response = await registerAthlete({ nome, email, telefone, senha });
      console.log('Resposta do backend:', response);
      await AsyncStorage.setItem('userData', JSON.stringify(response));

      router.push({
        pathname: '/register/ativar-conta',
        params: { email },
      });

    }
    catch (error: any) {
      showToast('Aviso', error.message, 'warning');
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className={`flex-1 bg-white ${className ?? ""}`}>
      <FormControl className="pt-5 rounded-lg w-full">
        <VStack className="w-full gap-4">
          <InputTexto
            label="Nome"
            placeholder="Insira seu nome"
            value={nome}
            onChangeText={setNome}
            onBlur={() => {
              const nomeError = validarNome(nome);
              setErrors(prev => ({ ...prev, nome: nomeError }));
            }}
            error={errors.nome}
          />

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

          <InputNumero
            label="Telefone"
            placeholder="(99) 99999-9999"
            value={telefone}
            onChangeText={(text) => setTelefone(formatarTelefone(text))}
            keyboardType="phone-pad"
            maxLength={15}
            onBlur={() => {
              const telefoneError = validarTelefone(telefone);
              setErrors((prev) => ({ ...prev, telefone: telefoneError }));
            }}
            error={errors.telefone}
          />

          <InputSenha
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            onBlur={() => {
              const passwordError = validarPassword(senha);
              setErrors((prev) => ({ ...prev, password: passwordError }));
            }}
            error={errors.password}
            showStrengthIndicator
            StrengthIndicatorComponent={<PasswordStrengthIndicator password={senha} />}
          />

          <InputSenha
            label="Confirme sua senha"
            placeholder="Confirme sua senha"
            value={confirmSenha}
            onChangeText={setConfirmSenha}
            onBlur={() => {
              const confirmPasswordError = validarConfirmPassword(confirmSenha, senha);
              setErrors((prev) => ({ ...prev, confirmPassword: confirmPasswordError }));
            }}
            error={errors.confirmPassword}
          />

          <Button
            size="xl"
            className="bg-green-primary rounded-3xl py-3 mt-4"
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ButtonSpinner className="text-white" />
            ) : (
              <ButtonText className="text-base text-white">
                Cadastrar atleta
              </ButtonText>
            )}
          </Button>
        </VStack>
      </FormControl>

      <Button size="xl" className="justify-start p-0"
        onPress={() => router.push('/login')}
      >
        <Text className="text-sm text-gray-500">Já possui uma conta?</Text>
        <ButtonText className="text-base text-green-primary p-0 underline"
        >
          Entrar
        </ButtonText>
      </Button>
    </ScrollView>
  );
};