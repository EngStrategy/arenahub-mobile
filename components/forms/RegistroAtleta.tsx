// components/RegistroAtleta.tsx
import React, { useState } from "react";
import { useRouter } from 'expo-router';
import { registerAthlete } from '@/services/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { FormControl } from '@/components/ui/form-control';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon';
import { PasswordStrengthIndicator } from "@/components/forms/passwordStrengthIndicador";
import { View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { formatarTelefone } from "@/context/functions/formatarTelefone";
import { validatePassword } from "@/context/functions/validatePassword";
import { validateConfirmPassword } from "@/context/functions/validateConfirmPassword";


export const RegistroAtleta = ({ className }: { className?: string }) => {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConfirmed, setShowPasswordConfirmed] = React.useState(false);
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const toggleShowPassword = () => setShowPassword(prev => !prev);
  const toggleShowPasswordConfirmed = () => setShowPasswordConfirmed(prev => !prev);

  const handleRegister = async () => {
    const passwordError = validatePassword(senha);
    const confirmPasswordError = validateConfirmPassword(senha, confirmSenha);

    setErrors({
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    setLoading(true);

    try {
      const response = await registerAthlete({ nome, email, telefone, senha });

      await AsyncStorage.setItem('userData', JSON.stringify(response));

      alert("Conta criada com sucesso!");

      router.push('/(tabs)');

    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <ScrollView className={`flex-1 bg-white ${className ?? ""}`}>
      <FormControl className="pt-5 rounded-lg w-full">
        <VStack className="w-full gap-4">
          <VStack space="xs">
            <Text className="text-typography-500">Nome</Text>
            <Input size="xl" className="border border-gray-300 rounded-lg" >
              <InputField
                className="text-base"
                type="text"
                placeholder="Insira seu nome"
                value={nome}
                onChangeText={setNome}
              />
            </Input>
          </VStack>

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

          <VStack space="xs">
            <Text className="text-typography-500">Telefone</Text>
            <Input size="xl" className="border border-gray-300 rounded-lg" >
              <InputField
                className="text-base"
                type="text"
                placeholder="(99) 99999-9999"
                value={telefone}
                onChangeText={(text) => setTelefone(formatarTelefone(text))}
                keyboardType="phone-pad"
              />
            </Input>
          </VStack>

          <VStack space="xs">
            <Text className="text-typography-500">Senha</Text>
            <Input size="xl" className="border border-gray-300 rounded-lg">
              <InputField
                className="text-base"
                type={showPassword ? "text" : "password"}
                placeholder="Insira sua senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showPassword}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />
              <InputSlot className="pr-3" onPress={toggleShowPassword}>
                <InputIcon
                  as={showPassword ? EyeIcon : EyeOffIcon}
                  fill="none"
                />
              </InputSlot>
            </Input>

            {isPasswordFocused && (
              <View className="pb-4">
                <PasswordStrengthIndicator password={senha} />
              </View>
            )}
          </VStack>

          <VStack space="xs">
            <Text className="text-typography-500">Confirme sua senha</Text>
            <Input size="xl" className="border border-gray-300 rounded-lg">
              <InputField
                className="text-base"
                type={showPasswordConfirmed ? "text" : "password"}
                placeholder="Confirme sua senha"
                value={confirmSenha}
                onChangeText={setConfirmSenha}
                secureTextEntry={!showPasswordConfirmed}
              />
              <InputSlot className="pr-3" onPress={toggleShowPasswordConfirmed}>
                <InputIcon
                  as={showPasswordConfirmed ? EyeIcon : EyeOffIcon}
                  fill="none"
                />
              </InputSlot>

            </Input>
          </VStack>

          <Button size="xl" className="bg-green-primary rounded-lg py-3 mt-4"
            onPress={handleRegister}
            disabled={loading}
          >
            <ButtonText className="text-base text-white">
              Criar conta
            </ButtonText>
          </Button>
        </VStack>
      </FormControl>

      <Button size="xl" className="justify-start p-0"
        onPress={handleRegister}
        disabled={loading}
      >
        <ButtonText className="text-base text-black p-0">
          Já possui uma conta?
        </ButtonText>
        <ButtonText className="text-base text-green-primary p-0 underline">
          Entrar
        </ButtonText>
      </Button>
    </ScrollView>
  );
};