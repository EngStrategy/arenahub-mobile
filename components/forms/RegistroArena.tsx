
import React, { useState, useEffect } from "react";
import { registerArena } from '@/services/api/auth';
import axios from "axios";
import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, View, Alert } from "react-native";
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormControl } from '@/components/ui/form-control';
import { VStack } from '@/components/ui/vstack';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { Picker } from "@react-native-picker/picker";
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon';
import { PasswordStrengthIndicator } from "@/components/forms/passwordStrengthIndicador";
import apiCNPJ from "@/services/apiCNPJ";
import apiCEP from "@/services/apiCEP";
import apiCidades from "@/services/apiCidades";
import apiLatitudeLongitude from "@/services/apiLatitudeLongitude";
import { estados } from "@/data/estados";
import { InputTexto } from "./formInputs/InputTexto";
import { InputTextArea } from "./formInputs/InputTextArea";
import { InputNumero } from "./formInputs/InputNumero";
import { InputSenha } from "./formInputs/InputSenha";
import { formatarCNPJ, formatarCEP, formatarCPF, formatarTelefone } from "@/context/functions/formatters";
import {
  validarBairro,
  validarCEP,
  validarCNPJ,
  validarComplemento,
  validarCPF,
  validarHorasCancelarAgendamento,
  validarNome,
  validarNomeArena,
  validarNumero,
  validarRua,
  validarTelefone,
  validarConfirmPassword,
  validarEmail,
  validarPassword
} from "@/context/functions/validators";
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
  const [horasCancelarAgendamento, setHorasCancelarAgendamento] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
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
    horasCancelarAgendamento?: string;
  }>({
    password: '',
    confirmPassword: '',
    cpfProprietario: '',
    horasCancelarAgendamento: '',
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
      setters.setCep(formatarCEP(est.cep || ""));
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

  const atualizarLatitudeLongitude = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    const { data } = await apiLatitudeLongitude.get(`${cleanCep}`);

    return {
      latitude: data.lat,
      longitude: data.lng,
    };
  };

  // LEMBRAR DE SÓ OLHAR O CNPJ SE A PESSOA TIVERCNPJ

  const handleRegister = async () => {
    const nomeArenaError = validarNomeArena(nomeArena);
    const emailError = validarEmail(email) ? '' : 'Email inválido.';
    const cpfProprietarioError = validarCPF(cpfProprietario);
    const passwordError = validarPassword(senha);
    const confirmPasswordError = validarConfirmPassword(senha, confirmSenha);
    const telefoneError = validarTelefone(telefone);
    const cnpjError = haveCnpj ? validarCNPJ(cnpj) : '';
    const cepError = validarCEP(cep);
    const bairroError = validarBairro(bairro);
    const ruaError = validarRua(rua);
    const numeroError = validarNumero(numero);
    const complementoError = validarComplemento(complemento);

    setErrors(prev => ({
      ...prev,
      cpfProprietario: cpfProprietarioError,
      nomeArena: nomeArenaError,
      email: emailError,
      telefone: telefoneError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
      cnpj: cnpjError,
      cep: cepError,
      bairro: bairroError,
      rua: ruaError,
      numero: numeroError,
      complemento: complementoError,
    }));

    setLoading(true);

    const { latitude, longitude } = await atualizarLatitudeLongitude(cep);

    try {
      const response = await registerArena({
        nome: nomeArena,
        email,
        telefone,
        senha,
        cpfProprietario,
        cnpj: haveCnpj ? cnpj : undefined,
        descricao,
        urlFoto: undefined,
        horasCancelarAgendamento: horasCancelarAgendamento ? Number(horasCancelarAgendamento) : 0,
        endereco: {
          cep,
          estado,
          cidade,
          bairro,
          rua,
          numero,
          complemento,
          latitude: latitude ? Number(latitude) : undefined,
          longitude: longitude ? Number(longitude) : undefined,
        },
      });
      console.log('Resposta do backend:', response);
      await AsyncStorage.setItem('userData', JSON.stringify(response));

      router.push({
        pathname: '/register/ativar-conta',
        params: { email },
      });
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <FormControl className="pt-5 rounded-lg w-full">
        <VStack className="w-full gap-4">
          <InputNumero
            label="CPF do proprietário"
            placeholder="000.000.000-00"
            value={cpfProprietario}
            onChangeText={(text) => setCpfProprietario(formatarCPF(text))}
            keyboardType="phone-pad"
            maxLength={14}
            onBlur={() => {
              const cpfError = validarCPF(cpfProprietario);
              setErrors((prev) => ({ ...prev, cpfProprietario: cpfError }));
            }}
            error={errors.cpfProprietario}
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

          <InputNumero
            label="CNPJ"
            placeholder="00.000.000/0000-00"
            value={cnpj}
            formatar={formatarCNPJ}
            maxLength={18}
            cleanLength={14}
            keyboardType="phone-pad"
            isDisabled={!haveCnpj}
            editable={!!haveCnpj}
            onChangeText={setCnpj}
            onMaxLengthReached={(formatted) => {
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
            }}
            onBlur={() => {
              if (!haveCnpj) return;
              const cnpjError = validarCNPJ(cnpj);
              setErrors((prev) => ({ ...prev, cnpj: cnpjError }));
            }}
            error={haveCnpj ? errors.cnpj : undefined}
          />


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

          <InputTexto
            label="Nome da arena"
            placeholder="Insira o nome da arena"
            value={nomeArena}
            onChangeText={setNomeArena}
            onBlur={() => {
              const nomeArenaError = validarNomeArena(nomeArena);
              setErrors(prev => ({ ...prev, nomeArena: nomeArenaError }));
            }}
            error={errors.nomeArena}
          />

          <InputNumero
            label="CEP"
            placeholder="00000-000"
            value={cep}
            formatar={formatarCEP}
            maxLength={9}
            cleanLength={8}
            keyboardType="phone-pad"
            onChangeText={setCep}
            onMaxLengthReached={(formatted) => {
              consultarCep(formatted, {
                setLogradouro: setRua,
                setBairro: setBairro,
                setCidade: setCidade,
                setEstado: setEstado,
                setComplemento: setComplemento,
              });
            }}
            onBlur={() => {
              const cepError = validarCEP(cep);
              setErrors((prev) => ({ ...prev, cep: cepError }));
            }}
            error={errors.cep}
          />

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

          <InputTexto
            label="Bairro"
            placeholder="Digite seu bairro"
            value={bairro}
            onChangeText={setBairro}
            onBlur={() => {
              const bairroError = validarBairro(bairro);
              setErrors(prev => ({ ...prev, bairro: bairroError }));
            }}
            error={errors.bairro}
          />

          <InputTexto
            label="Rua"
            placeholder="Digite sua rua"
            value={rua}
            onChangeText={setRua}
            onBlur={() => {
              const ruaError = validarRua(rua);
              setErrors(prev => ({ ...prev, rua: ruaError }));
            }}
            error={errors.rua}
          />

          <InputNumero
            label="Número"
            placeholder="Digite seu número"
            value={numero}
            onChangeText={setNumero}
            keyboardType="phone-pad"
            onBlur={() => {
              const numeroError = validarNumero(numero);
              setErrors((prev) => ({ ...prev, numero: numeroError }));
            }}
            error={errors.numero}
          />

          <InputTexto
            label="Complemento"
            placeholder="Digite o complemento"
            value={complemento}
            onChangeText={setComplemento}
            onBlur={() => {
              const complementoError = validarComplemento(complemento);
              setErrors(prev => ({ ...prev, complemento: complementoError }));
            }}
            error={errors.complemento}
          />

          <VStack space="xs">
            <Text className="text-typography-500">Política de Cancelamento</Text>
            <Input size="xl" className="border border-gray-300 rounded-lg" >
              <InputField
                className="text-sm"
                type="text"
                placeholder="Defina o prazo mínimo, em horas, que um atleta pode cancelar um agendamento sem custos. (Máximo 168 horas = 7 dias)"
                value={horasCancelarAgendamento}
                onChangeText={setHorasCancelarAgendamento}
                keyboardType="phone-pad"
                maxLength={3}
                onBlur={() => {
                  const horasError = validarHorasCancelarAgendamento(horasCancelarAgendamento);
                  setErrors(prev => ({ ...prev, horasCancelarAgendamento: horasError }));
                }}
              />
            </Input>
            {errors.horasCancelarAgendamento && <Text className="text-sm text-red-500">{errors.horasCancelarAgendamento}</Text>}
          </VStack>

          <InputTextArea
            label="Descrição"
            placeholder="Digite algo que descreva sua arena e ajude a atrair mais reservas"
            value={descricao}
            onChangeText={setDescricao}
            optional
          />

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
    </View>
  );
};
