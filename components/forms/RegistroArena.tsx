// components/RegistroAtleta.tsx
import React, { useState } from "react";
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { FormControl } from '@/components/ui/form-control';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon';
import { View, ScrollView } from "react-native";
import { formatarCPF } from "@/context/functions/formatarCPF";
import { PasswordStrengthIndicator } from "@/components/forms/passwordStrengthIndicador";
import { formatarTelefone } from "@/context/functions/formatarTelefone";
import { formatarCNPJ } from "@/context/functions/formatarCNPJ";
import { formatarCEP } from "@/context/functions/formatarCEP";
import { validarCPF } from "@/context/functions/validarCPF";
import { validatePassword } from "@/context/functions/validatePassword";
import { validateConfirmPassword } from "@/context/functions/validateConfirmPassword";

// import { createAtleta } from '@/app/api/entities/atleta';
// -> Função que provavelmente chama sua API, ainda não traduzida
// -> Função externa, você pode implementar ou comentar
// -> Hook externo ainda não traduzido


export const RegistroArena = ({ className }: { className?: string }) => {
  const [nomeArena, setNomeArena] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [cep, setCep] = useState("");
  const [bairro, setBairro] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [descricao, setDescricao] = useState("");
  const [haveCnpj, setHaveCnpj] = useState(true);
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [cpfProprietario, setCpfProprietario] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConfirmed, setShowPasswordConfirmed] = React.useState(false);
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const toggleShowPassword = () => setShowPassword(prev => !prev);
  const toggleShowPasswordConfirmed = () => setShowPasswordConfirmed(prev => !prev);

  const changeComplete = (value: boolean) => () => {
    setIsCompleted(value);
  }

  const handleRegister = async () => {
    setLoading(true);
    if (senha !== confirmSenha) {
      alert("As senhas não coincidem!");
      setLoading(false);
      return;
    }

    try {
      // TODO: Chamar sua função createAtleta(values)
      // Exemplo: await createAtleta({ cpfProprietario, email, telefone, senha });
      console.log("Registrar usuário:", { cpfProprietario, email, telefone, senha });
      alert("Conta criada com sucesso!");
    } catch (error) {
      alert("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className={`flex-1 bg-white ${className ?? ""}`}>
      <FormControl className="pt-5 rounded-lg w-full">
        {!isCompleted ? (
          <VStack className="w-full gap-4">
            <VStack space="xs">
              <Text className="text-typography-500">CPF do proprietário</Text>
              <Input size="xl" className="border border-gray-300 rounded-lg" >
                <InputField
                  className="text-base"
                  type="text"
                  placeholder="Insira seu CPF"
                  value={cpfProprietario}
                  onChangeText={(text) => setCpfProprietario(formatarCPF(text))}
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
              onPress={changeComplete(true)}
              disabled={loading}
            >
              <ButtonText className="text-base text-white">
                Avançar
              </ButtonText>
            </Button>
          </VStack>
        ) : (

          // SEGUNDA PARTE DO FORMULÁRIO AQUI
          <VStack className="w-full gap-4">
            <VStack space="xs">
              <Text className="text-typography-500">Nome da arena</Text>
              <Input size="xl" className="border border-gray-300 rounded-lg" >
                <InputField
                  className="text-base"
                  type="text"
                  placeholder="Insira o nome da arena"
                  value={nomeArena}
                  onChangeText={setNomeArena}
                />
              </Input>
            </VStack>

            <VStack space="xs">
              <Text className="text-typography-500">CNPJ</Text>
              <Input size="xl" className="border border-gray-300 rounded-lg" >
                <InputField
                  className="text-base"
                  type="text"
                  placeholder="Digite seu CNPJ"
                  value={cnpj}
                  onChangeText={(text) => setCnpj(formatarCNPJ(text))}
                  keyboardType="phone-pad"
                />
              </Input>
            </VStack>

            <VStack>
              <HStack className="justify-between items-center mt-2 mb-4 px-3 border border-gray-300 rounded-lg bg-gray-300">
                <Text size="sm">Minha arena não tem CNPJ</Text>
                <Switch
                  defaultValue={true}
                  trackColor={{ false: '#d4d4d4', true: '#525252' }}
                  thumbColor="#fafafa"
                  ios_backgroundColor="#d4d4d4"
                />
              </HStack>
              <Text className="text-center" size="sm">Utilizaremos seu CPF em vez do CNPJ caso selecione esta opção</Text>
            </VStack>



            <VStack space="xs">
              <Text className="text-typography-500">CEP</Text>
              <Input size="xl" className="border border-gray-300 rounded-lg" >
                <InputField
                  className="text-base"
                  type="text"
                  placeholder="Digite seu CEP"
                  value={cep}
                  onChangeText={(text) => setCep(formatarCEP(text))}
                  keyboardType="phone-pad"
                />
              </Input>
            </VStack>

            <VStack space="xs">
              <Text className="text-typography-500">Bairro</Text>
              <Input size="xl" className="border border-gray-300 rounded-lg" >
                <InputField
                  className="text-base"
                  type="text"
                  placeholder="Digite seu bairro"
                  value={bairro}
                  onChangeText={setBairro}
                />
              </Input>
            </VStack>

            <VStack space="xs">
              <Text className="text-typography-500">Rua</Text>
              <Input size="xl" className="border border-gray-300 rounded-lg" >
                <InputField
                  className="text-base"
                  type="text"
                  placeholder="Digite sua Rua"
                  value={rua}
                  onChangeText={setRua}
                />
              </Input>
            </VStack>

            <VStack space="xs">
              <Text className="text-typography-500">Número</Text>
              <Input size="xl" className="border border-gray-300 rounded-lg" >
                <InputField
                  className="text-base"
                  type="text"
                  placeholder="Digite seu número"
                  value={numero}
                  onChangeText={setNumero}
                  keyboardType="phone-pad"
                />
              </Input>
            </VStack>

            <VStack space="xs">
              <Text className="text-typography-500">Complemento</Text>
              <Input size="xl" className="border border-gray-300 rounded-lg" >
                <InputField
                  className="text-base"
                  type="text"
                  placeholder="Digite seu complemento"
                  value={complemento}
                  onChangeText={setComplemento}
                />
              </Input>
            </VStack>


            <View className="flex-row gap-5 justify-center items-center mt-4">
              <Button size="xl" className="w-50% flex-0.5 bg-gray-voltar rounded-lg py-3 mt-4"
                onPress={changeComplete(false)}
                disabled={loading}
              >
                <ButtonText className="text-base text-black">
                  Voltar
                </ButtonText>
              </Button>

              <Button size="xl" className="w-50% flex-0.5 bg-green-primary rounded-lg py-3 mt-4"
                onPress={handleRegister}
                disabled={loading}
              >
                <ButtonText className="text-base text-white">
                  Cadastrar arena
                </ButtonText>
              </Button>
            </View>
          </VStack>
        )}
      </FormControl>

      <Text className="text-gray-800 text-sm mt-4">
        Já possui uma conta?{" "}
        <Text className="text-green-primary underline">Entrar</Text>
        {/* No Next.js era Link, aqui você pode usar react-navigation */}
      </Text>
    </ScrollView>
  );
};
