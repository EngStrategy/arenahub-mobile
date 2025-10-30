// components/RegistroAtleta.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, View, Alert } from "react-native";
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { FormControl } from '@/components/ui/form-control';
import { VStack } from '@/components/ui/vstack';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { Picker } from "@react-native-picker/picker";
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon';
import { formatarCPF } from "@/context/functions/formatarCPF";
import { PasswordStrengthIndicator } from "@/components/forms/passwordStrengthIndicador";
import { formatarTelefone } from "@/context/functions/formatarTelefone";
import { formatarCNPJ } from "@/context/functions/formatarCNPJ";
import { formatarCEP } from "@/context/functions/formatarCEP";
import { validarCPF } from "@/context/functions/validarCPF";
import { validatePassword } from "@/context/functions/validatePassword";
import { validateConfirmPassword } from "@/context/functions/validateConfirmPassword";
import { validarTelefone } from "@/context/functions/validarTelefone";
import { validarNomeArena } from "@/context/functions/validarNomeArena";
import { validarCNPJ } from "@/context/functions/validarCNPJ";
import { validarCEP } from "@/context/functions/validarCEP";
import { validarBairro } from "@/context/functions/validarBairro";
import { validarRua } from "@/context/functions/validarRua";
import { validarNumero } from "@/context/functions/validarNumero";
import { validateEmail } from "@/context/functions/validateEmail";
import { validarComplemento } from "@/context/functions/validarComplemento";
import apiCNPJ from "@/services/apiCNPJ";
import apiCEP from "@/services/apiCEP";
import apiCidades from "@/services/apiCidades";
import { estados } from "@/data/estados";

type CITYResponse = {
  id: number;
  nome: string;
};

interface CnpjValues {
  setNome: (value: string) => void;
  setEstado: (value: string) => void;
  setCidade: (value: string) => void;
  setRua: (value: string) => void;
  setBairro: (value: string) => void;
  setNumero: (value: string) => void;
  setComplemento: (value: string) => void;
  setCep: (value: string) => void;
}

interface CepValues {
  setLogradouro: (value: string) => void;
  setBairro: (value: string) => void;
  setCidade: (value: string) => void;
  setEstado: (value: string) => void;
  setComplemento: (value: string) => void;
}


// import { createAtleta } from '@/app/api/entities/atleta';
// -> Função que provavelmente chama sua API, ainda não traduzida
// -> Função externa, você pode implementar ou comentar
// -> Hook externo ainda não traduzido


export const RegistroArena = ({ className }: { className?: string }) => {
  const router = useRouter();
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
  const [cidades, setCidades] = useState<{ id: number; nome: string }[]>([]);
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
  const [errors, setErrors] = useState<{
    password: string;
    confirmPassword: string;
    cpfProprietario?: string;
    telefone?: string;
    cnpj?: string;
    cep?: string;
    nomeArena?: string;
    email?: any
    bairro?: string;
    rua?: string;
    numero?: string;
    complemento?: string;
    descricao?: string;
  }>({
    password: '',
    confirmPassword: '',
    cpfProprietario: '',
    telefone: '',
    cnpj: '',
    cep: '',
    nomeArena: '',
    email: '',
    bairro: '',
    rua: '',
    numero: '',
    complemento: '',
    descricao: '',
  });

  const toggleShowPassword = () => setShowPassword(prev => !prev);
  const toggleShowPasswordConfirmed = () => setShowPasswordConfirmed(prev => !prev);
  const changeComplete = (value: boolean) => () => {
    // // const passwordError = validatePassword(senha);
    // // const confirmPasswordError = validateConfirmPassword(senha, confirmSenha);
    // // const cpfProprietarioError = validarCPF(cpfProprietario);
    // // const telefoneError = validarTelefone(telefone);
    // // const emailError = validateEmail(email) ? '' : 'Email inválido.';

    // // const newErrors = {
    // //   password: passwordError,
    // //   confirmPassword: confirmPasswordError,
    // //   cpfProprietario: cpfProprietarioError,
    // //   telefone: telefoneError,
    // //   email: emailError,
    // // };

    // // setErrors(prev => ({ ...prev, ...newErrors }));

    // // if (value) {
    // //   const hasErrors = Boolean(
    // //     newErrors.password ||
    // //     newErrors.confirmPassword ||
    // //     newErrors.cpfProprietario ||
    // //     newErrors.telefone ||
    // //     newErrors.email
    // //   );
    // //   if (hasErrors) {
    // //     Alert.alert("Verifique os erros do formulário antes de avançar.");
    //     setIsCompleted(false);
    //     // return;
    //   }
    // }

    setIsCompleted(value);
  };

  useEffect(() => {
    if (!estado) return;

    const fetchCidades = async () => {
      try {
        const { data } = await apiCidades.get(
          `/estados/${estado}/municipios`
        );
        // O IBGE retorna uma lista de objetos [{ id, nome, microrregiao, ... }]
        setCidades(data);
      } catch (error) {
        console.error("Erro ao buscar cidades:", error);
        setCidades([]);
      }
    };

    fetchCidades();
  }, [estado]);

  const consultarCnpj = async (cnpj: string, setters: CnpjValues) => {
    if (!cnpj || cnpj.length < 14) {
      Alert.alert("Erro", "Por favor, insira um CNPJ válido!");
      return;
    }

    const cnpjLimpo = cnpj.replace(/\D/g, "");

    if (cnpjLimpo.length !== 14) {
      Alert.alert("Erro", "CNPJ deve ter 14 dígitos!");
      return;
    }

    try {
      const { data } = await apiCNPJ.get(cnpjLimpo);

      if (!data || !data.estabelecimento) {
        throw new Error("CNPJ não encontrado ou inválido.");
      }

      const est = data.estabelecimento;

      setters.setNome(data.razao_social || "");
      setters.setEstado(est.estado?.sigla || "");
      setters.setCidade(est.cidade?.nome || "");
      setters.setRua(est.logradouro || "");
      setters.setBairro(est.bairro || "");
      setters.setNumero(est.numero || "");
      setters.setCep(est.cep || "");
      setters.setComplemento(est.complemento || "");

      Alert.alert("Sucesso", "CNPJ consultado com sucesso!");
    } catch (error) {
      console.error("Erro na consulta de CNPJ:", error);
      Alert.alert(
        "Erro",
        "Não foi possível consultar o CNPJ. Verifique o número e tente novamente."
      );
    }
  };

  const consultarCep = async (cep: string, setters: CepValues) => {
    if (!cep) {
      Alert.alert("Erro", "Por favor, insira um CEP!");
      return;
    }

    const cleanCep = cep.replace(/\D/g, "");

    if (cleanCep.length !== 8) {
      Alert.alert("Erro", "CEP deve ter 8 dígitos!");
      return;
    }

    try {
      const { data } = await apiCEP.get(`${cleanCep}/json/`);

      if (!data || data.erro) {
        throw new Error("CEP não encontrado.");
      }

      setters.setLogradouro(data.logradouro || "");
      setters.setBairro(data.bairro || "");
      setters.setCidade(data.localidade || "");
      setters.setEstado(data.uf || "");
      setters.setComplemento(data.complemento || "");

      Alert.alert("Sucesso", "CEP consultado com sucesso!");
    } catch (error) {
      console.error("Erro na consulta de CEP:", error);
      Alert.alert(
        "Erro",
        "Não foi possível consultar o CEP. Verifique o número e tente novamente."
      );
    }
  };

  // LEMBRAR DE SÓ OLHAR O CNPJ SE A PESSOA TIVERCNPJ

  const handleRegister = async () => {
    // setLoading(true);
    // if (senha !== confirmSenha) {
    //   alert("As senhas não coincidem!");
    //   setLoading(false);
    //   return;
    // }

    // try {
    //   // TODO: Chamar sua função createAtleta(values)
    //   // Exemplo: await createAtleta({ cpfProprietario, email, telefone, senha });
    //   console.log("Registrar usuário:", { cpfProprietario, email, telefone, senha });
    //   alert("Conta criada com sucesso!");
    // } catch (error) {
    //   alert("Erro ao criar conta");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <View>
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
                    maxLength={14}
                    keyboardType="phone-pad"
                    onBlur={() => {
                      const cpfError = validarCPF(cpfProprietario);
                      setErrors(prev => ({ ...prev, cpfProprietario: cpfError }));
                    }}
                  />
                </Input>
                {errors.cpfProprietario && <Text className="text-sm text-red-500">{errors.cpfProprietario}</Text>}
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
                    onBlur={() => {
                      const emailError = validateEmail(email) ? '' : 'Email inválido.';
                      setErrors(prev => ({ ...prev, email: emailError }));
                    }}
                  />
                </Input>
                {errors.email && <Text className="text-sm text-red-500">{errors.email}</Text>}
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
                    maxLength={15}
                    onBlur={() => {
                      const telefoneError = validarTelefone(telefone);
                      setErrors(prev => ({ ...prev, telefone: telefoneError }));
                    }}
                  />
                </Input>
                {errors.telefone && <Text className="text-sm text-red-500">{errors.telefone}</Text>}
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
                    onBlur={() => {
                      setIsPasswordFocused(false);
                      const passwordError = validatePassword(senha);
                      setErrors(prev => ({ ...prev, password: passwordError }));
                    }}
                  />
                  <InputSlot className="pr-3" onPress={toggleShowPassword}>
                    <InputIcon
                      as={showPassword ? EyeIcon : EyeOffIcon}
                      fill="none"
                    />
                  </InputSlot>
                </Input>
                {errors.password && <Text className="text-sm text-red-500">{errors.password}</Text>}

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
                    onBlur={() => {
                      const confirmPasswordError = validateConfirmPassword(confirmSenha, senha);
                      setErrors(prev => ({ ...prev, confirmPassword: confirmPasswordError }));
                    }}
                  />
                  <InputSlot className="pr-3" onPress={toggleShowPasswordConfirmed}>
                    <InputIcon
                      as={showPasswordConfirmed ? EyeIcon : EyeOffIcon}
                      fill="none"
                    />
                  </InputSlot>

                </Input>
                {errors.confirmPassword && <Text className="text-sm text-red-500">{errors.confirmPassword}</Text>}
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
                <Text className="text-typography-500">CNPJ</Text>

                <Input
                  size="xl"
                  className="border border-gray-300 rounded-lg"
                  isDisabled={!haveCnpj}
                >
                  <InputField
                    className="text-base"
                    type="text"
                    placeholder="99.999.999/9999-99"
                    value={cnpj}
                    onChangeText={(text) => {
                      if (!haveCnpj) return;

                      const formatted = formatarCNPJ(text);
                      setCnpj(formatted);

                      if (formatted.replace(/\D/g, "").length === 14) {
                        consultarCnpj(formatted, {
                          setNome: setNomeArena,
                          setEstado,
                          setCidade,
                          setRua,
                          setBairro,
                          setNumero,
                          setCep,
                          setComplemento,
                        });
                      }
                    }}
                    keyboardType="phone-pad"
                    maxLength={18}
                    editable={!!haveCnpj}
                    onBlur={() => {
                      if (!haveCnpj) return;
                      const cnpjError = validarCNPJ(cnpj);
                      setErrors((prev) => ({ ...prev, cnpj: cnpjError }));
                    }}
                  />
                </Input>

                {/* 🔹 Só mostra o erro se o usuário tiver CNPJ */}
                {haveCnpj && errors.cnpj && (
                  <Text className="text-sm text-red-500">{errors.cnpj}</Text>
                )}
              </VStack>

              <VStack>
                <HStack className="justify-between items-center mt-2 mb-1 px-3 border border-gray-300 rounded-lg bg-gray-300">
                  <Text size="sm">Minha arena não tem CNPJ</Text>
                  <Switch
                    value={!haveCnpj}
                    onValueChange={(val) => setHaveCnpj(!val)}
                    trackColor={{ false: '#525252', true: '#15A01A' }}
                    thumbColor="#fafafa"
                    ios_backgroundColor="#34D399"
                  />


                </HStack>
                <Text size="sm">Utilizaremos seu CPF em vez do CNPJ caso selecione esta opção</Text>
              </VStack>

              <VStack space="xs">
                <Text className="text-typography-500">Nome da arena</Text>
                <Input size="xl" className="border border-gray-300 rounded-lg" >
                  <InputField
                    className="text-base"
                    type="text"
                    placeholder="Insira o nome da arena"
                    value={nomeArena}
                    onChangeText={setNomeArena}
                    onBlur={() => {
                      const nomeArenaError = validarNomeArena(nomeArena);
                      setErrors(prev => ({ ...prev, nomeArena: nomeArenaError }));
                    }}
                  />
                </Input>
                {errors.nomeArena && <Text className="text-sm text-red-500">{errors.nomeArena}</Text>}
              </VStack>

              <VStack space="xs">
                <Text className="text-typography-500">CEP</Text>
                <Input size="xl" className="border border-gray-300 rounded-lg" >
                  <InputField
                    className="text-base"
                    type="text"
                    placeholder="Insira seu CEP"
                    value={cep}
                    onChangeText={(text) => {
                      const formatted = formatarCEP(text);
                      setCep(formatted);
                      if (formatted.replace(/\D/g, '').length === 8) {
                        consultarCep(formatted, {
                          setLogradouro: setRua,
                          setBairro: setBairro,
                          setCidade: setCidade,
                          setEstado: setEstado,
                          setComplemento: setComplemento,
                        });
                      }
                    }}
                    onBlur={() => {
                      const cepError = validarCEP(cep);
                      setErrors(prev => ({ ...prev, cep: cepError }));
                    }}
                    keyboardType="phone-pad"
                  />
                </Input>
                {errors.cep && <Text className="text-sm text-red-500">{errors.cep}</Text>}
              </VStack>

              <View className="flex-row w-full gap-x-4">
                {/* ESTADO */}
                <View className="flex-1">
                  <Text className="text-typography-500 mb-1">Estado</Text>
                  <View className="border border-gray-300 rounded-lg h-10 justify-center">
                    <Picker
                      selectedValue={estado}
                      onValueChange={(value) => {
                        setEstado(value);
                        setCidade("");
                      }}
                      className="w-full"
                    >
                      <Picker.Item label="Estado" value="" />
                      {estados.map((uf) => (
                        <Picker.Item key={uf.sigla} label={uf.nome} value={uf.sigla} />
                      ))}
                    </Picker>
                  </View>
                </View>

                {/* CIDADE */}
                <View className="flex-1">
                  <Text className="text-typography-500 mb-1">Cidade</Text>
                  <View className="border border-gray-300 rounded-lg h-10 justify-center">
                    <Picker
                      selectedValue={cidade}
                      enabled={!!estado && !loading}
                      onValueChange={(value) => setCidade(value)}
                      className="w-full"
                    >
                      <Picker.Item label="Cidade" value="" />
                      {cidades.map((c) => (
                        <Picker.Item key={c.id} label={c.nome} value={c.nome} />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>


              <VStack space="xs">
                <Text className="text-typography-500">Bairro</Text>
                <Input size="xl" className="border border-gray-300 rounded-lg" >
                  <InputField
                    className="text-base"
                    type="text"
                    placeholder="Digite seu bairro"
                    value={bairro}
                    onChangeText={setBairro}
                    onBlur={() => {
                      const bairroError = validarBairro(bairro);
                      setErrors(prev => ({ ...prev, bairro: bairroError }));
                    }}
                  />
                </Input>
                {errors.bairro && <Text className="text-sm text-red-500">{errors.bairro}</Text>}
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
                    onBlur={() => {
                      const ruaError = validarRua(rua);
                      setErrors(prev => ({ ...prev, rua: ruaError }));
                    }}
                  />
                </Input>
                {errors.rua && <Text className="text-sm text-red-500">{errors.rua}</Text>}
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
                    onBlur={() => {
                      const numeroError = validarNumero(numero);
                      setErrors(prev => ({ ...prev, numero: numeroError }));
                    }}
                  />
                </Input>
                {errors.numero && <Text className="text-sm text-red-500">{errors.numero}</Text>}
              </VStack>

              <VStack space="xs">
                <Text className="text-typography-500">Complemento</Text>
                <Input size="xl" className="border border-gray-300 rounded-lg" >
                  <InputField
                    className="text-base"
                    type="text"
                    placeholder="Digite o complemento"
                    value={complemento}
                    onChangeText={setComplemento}
                    onBlur={() => {
                      const complementoError = validarComplemento(complemento);
                      setErrors(prev => ({ ...prev, complemento: complementoError }));
                    }}
                  />
                </Input>
                {errors.complemento && <Text className="text-sm text-red-500">{errors.complemento}</Text>}
              </VStack>

              <VStack space="xs">
                <Text className="text-typography-500">Descrição </Text>
                <Textarea size="xl" className="border border-gray-300 rounded-lg" >
                  <TextareaInput
                    className="text-base"
                    placeholder="Digite algo que descreva sua arena e ajude a atrair mais reservas"
                    value={descricao}
                    onChangeText={setDescricao}
                  />
                </Textarea>
              </VStack>


              <View className="flex-row justify-between items-center gap-x-4 mt-4">
                <Button
                  size="xl"
                  className="flex-1 bg-gray-voltar rounded-lg py-3"
                  onPress={() => changeComplete(false)}
                  disabled={loading}
                >
                  <ButtonText className="text-base text-black">Voltar</ButtonText>
                </Button>

                <Button
                  size="xl"
                  className="flex-1 bg-green-primary rounded-lg py-3"
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

        <Button size="xl" className="justify-start p-0"
          onPress={() => router.push('/login')}
        >
          <Text className="text-sm text-gray-500">Já possui uma conta?</Text>
          <ButtonText className="text-base text-green-primary p-0 underline"
          >
            Entrar
          </ButtonText>
        </Button>
    </View>
  );
};
