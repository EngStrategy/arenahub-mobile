// components/RegistroAtleta.tsx
import React, { useState } from "react";
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { FormControl } from '@/components/ui/form-control';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon';
import { View, TextInput, TouchableOpacity, ScrollView } from "react-native";
// import { createAtleta } from '@/app/api/entities/atleta';
// -> Função que provavelmente chama sua API, ainda não traduzida

const PasswordStrengthIndicator = ({ password = "" }: { password?: string }) => {
  const evaluatePassword = () => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/\d/.test(password)) score += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    return score;
  };

  const score = evaluatePassword();
  let color = 'red';
  let text = 'Fraca';
  if (score >= 75) { color = 'green'; text = 'Forte'; }
  else if (score >= 50) { color = 'orange'; text = 'Média'; }

  return (
    <View className="w-full mb-2">
      <Text className="font-medium mb-1">Força da senha: {text}</Text>
      <View className="h-2 w-full rounded bg-gray-300">
        <View style={{ width: `${score}%`, backgroundColor: color, height: '100%', borderRadius: 4 }} />
      </View>
      <View className="mt-2">
        <Text className={password.length >= 8 ? "text-green-600" : ""}>• Pelo menos 8 caracteres</Text>
        <Text className={/\d/.test(password) ? "text-green-600" : ""}>• Pelo menos um número</Text>
        <Text className={/[a-z]/.test(password) && /[A-Z]/.test(password) ? "text-green-600" : ""}>• Letras maiúsculas e minúsculas</Text>
        <Text className={/[^A-Za-z0-9]/.test(password) ? "text-green-600" : ""}>• Pelo menos um caractere especial</Text>
      </View>
    </View>
  );
};

export const RegistroAtleta = ({ className }: { className?: string }) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConfirmed, setShowPasswordConfirmed] = React.useState(false);

  const toggleShowPassword = () => setShowPassword(prev => !prev);
  const toggleShowPasswordConfirmed = () => setShowPasswordConfirmed(prev => !prev);

  const handleRegister = async () => {
    setLoading(true);
    if (senha !== confirmSenha) {
      alert("As senhas não coincidem!");
      setLoading(false);
      return;
    }

    try {
      // TODO: Chamar sua função createAtleta(values)
      // Exemplo: await createAtleta({ nome, email, telefone, senha });
      console.log("Registrar usuário:", { nome, email, telefone, senha });
      alert("Conta criada com sucesso!");
    } catch (error) {
      alert("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  const formatarTelefone = (value: string) => {
    return value.replace(/\D/g, "").replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
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