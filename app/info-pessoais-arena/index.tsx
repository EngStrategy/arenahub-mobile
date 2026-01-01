import React, { useState, useEffect } from "react";
import { getArenaById, updateArena } from "@/services/api//entities/arena";
import { useRouter, Stack } from 'expo-router'; 
import { ChevronDownIcon } from '@/components/ui/icon';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectScrollView,
  SelectDragIndicatorWrapper,
  SelectItem,
} from '@/components/ui/select';
import { Trash2, Upload } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons'; 
import apiCEP from "@/services/apiCEP";
import apiCidades from "@/services/apiCidades";
import apiLatitudeLongitude from "@/services/apiLatitudeLongitude";
import { HStack } from "@/components/ui/hstack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { estados } from "@/data/estados";
import { View, Alert, ScrollView, Pressable } from "react-native"; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { InputTexto } from "@/components/forms/formInputs/InputTexto";
import { InputNumero } from "@/components/forms/formInputs/InputNumero";
import { InputTextArea } from "@/components/forms/formInputs/InputTextArea";
import { FormControl } from '@/components/ui/form-control';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { formatarCEP, formatarTelefone } from "@/context/functions/formatters";
import {
  validarBairro,
  validarCEP,
  validarNomeArena,
  validarNumero,
  validarRua,
  validarTelefone,
  validarHorasCancelarAgendamento,
  validarComplemento,
} from "@/context/functions/validators";

interface CepValues {
  setLogradouro: (value: string) => void;
  setBairro: (value: string) => void;
  setCidade: (value: string) => void;
  setEstado: (value: string) => void;
  setComplemento: (value: string) => void;
}

const DEFAULT_AVATAR_URL = "https://i.imgur.com/hepj9ZS.png";

export default function EditarArena() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Estados do formulário
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [bairro, setBairro] = useState("");
  const [numero, setNumero] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [complemento, setComplemento] = useState("");
  const [horasCancelarAgendamento, setHorasCancelarAgendamento] = useState("");
  const [cidades, setCidades] = useState<{ id: number; nome: string }[]>([]);
  const [urlFoto, setUrlFoto] = useState<string | null>(DEFAULT_AVATAR_URL);

  // Estado para dados originais
  const [initialData, setInitialData] = useState({
    nome: "",
    telefone: "",
    cep: "",
    rua: "",
    bairro: "",
    numero: "",
    estado: "",
    cidade: "",
    descricao: "",
    complemento: "",
    horasCancelarAgendamento: "",
    urlFoto: DEFAULT_AVATAR_URL as string | null
  });

  const [errors, setErrors] = useState<{
    telefone?: string;
    cep?: string;
    nome?: string;
    email?: any
    bairro?: string;
    rua?: string;
    numero?: string;
    complemento?: string;
    descricao?: string;
    horasCancelarAgendamento?: string;
    estado?: string;
    cidade?: string;
  }>({
    telefone: '',
    cep: '',
    nome: '',
    email: '',
    bairro: '',
    rua: '',
    numero: '',
    complemento: '',
    descricao: '',
    horasCancelarAgendamento: '',
    estado: '',
    cidade: '',
  });

  // Verifica se houve alterações
  const hasChanges =
    nome !== initialData.nome ||
    telefone !== initialData.telefone ||
    cep !== initialData.cep ||
    rua !== initialData.rua ||
    bairro !== initialData.bairro ||
    numero !== initialData.numero ||
    estado !== initialData.estado ||
    cidade !== initialData.cidade ||
    descricao !== initialData.descricao ||
    complemento !== initialData.complemento ||
    horasCancelarAgendamento !== initialData.horasCancelarAgendamento ||
    urlFoto !== initialData.urlFoto;

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
    try {
      const cleanCep = cep.replace(/\D/g, "");
      const { data } = await apiLatitudeLongitude.get(`${cleanCep}`);

      if (!data || !data.lat || !data.lng) {
        throw new Error("Coordenadas não encontradas");
      }

      return {
        latitude: Number(data.lat),
        longitude: Number(data.lng),
      };
    } catch (error) {
      console.error("Erro ao buscar coordenadas:", error);
      throw new Error("Não foi possível obter as coordenadas do CEP");
    }
  };

  const handleRemoveImage = () => {
    setUrlFoto(DEFAULT_AVATAR_URL);
  };

  const selectImage = async () => {
    Alert.alert("Seleção de Imagem", "Esta funcionalidade será implementada na próxima etapa com uma biblioteca de seleção de imagens.");
  };

  useEffect(() => {
    if (!estado) return;

    const fetchCidades = async () => {
      try {
        const { data } = await apiCidades.get(
          `/estados/${estado}/municipios`
        );
        setCidades(data);
      } catch (error) {
        console.error("Erro ao buscar cidades:", error);
        setCidades([]);
      }
    };

    fetchCidades();
  }, [estado]);

  useEffect(() => {
    const fetchArena = async () => {
      try {
        setLoading(true);

        const userDataString = await AsyncStorage.getItem('userData');
        if (!userDataString) throw new Error('Usuário não encontrado');
        const userData = JSON.parse(userDataString);
        const id = userData.id;

        const data = await getArenaById(id);

        // Dados formatados
        const fetchedNome = data.nome;
        const fetchedTelefone = data.telefone;
        const fetchedCep = data.endereco.cep;
        const fetchedRua = data.endereco.rua;
        const fetchedBairro = data.endereco.bairro;
        const fetchedNumero = data.endereco.numero;
        const fetchedEstado = data.endereco.estado;
        const fetchedCidade = data.endereco.cidade;
        const fetchedComplemento = data.endereco.complemento || "";
        const fetchedHoras = String(data.horasCancelarAgendamento ?? "");
        const fetchedDescricao = data.descricao || "";
        const fetchedUrlFoto = data.urlFoto || DEFAULT_AVATAR_URL;

        // Setar estados
        setNome(fetchedNome);
        setTelefone(fetchedTelefone);
        setCep(fetchedCep);
        setRua(fetchedRua);
        setBairro(fetchedBairro);
        setNumero(fetchedNumero);
        setEstado(fetchedEstado);
        setCidade(fetchedCidade);
        setComplemento(fetchedComplemento);
        setHorasCancelarAgendamento(fetchedHoras);
        setDescricao(fetchedDescricao);
        setUrlFoto(fetchedUrlFoto);

        // Salvar initialData
        setInitialData({
          nome: fetchedNome,
          telefone: fetchedTelefone,
          cep: fetchedCep,
          rua: fetchedRua,
          bairro: fetchedBairro,
          numero: fetchedNumero,
          estado: fetchedEstado,
          cidade: fetchedCidade,
          complemento: fetchedComplemento,
          horasCancelarAgendamento: fetchedHoras,
          descricao: fetchedDescricao,
          urlFoto: fetchedUrlFoto
        });

      } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Não foi possível carregar os dados da arena.");
      } finally {
        setLoading(false);
      }
    };

    fetchArena();
  }, []);

  const handleUpdateArena = async () => {
    // 1. Validar todos os campos
    const nomeError = validarNomeArena(nome);
    const telefoneError = validarTelefone(telefone);
    const cepError = validarCEP(cep);
    const bairroError = validarBairro(bairro);
    const ruaError = validarRua(rua);
    const numeroError = validarNumero(numero);
    const complementoError = validarComplemento(complemento);
    const horasError = validarHorasCancelarAgendamento(horasCancelarAgendamento);

    // Validações adicionais para campos obrigatórios
    const estadoError = !estado ? "Estado é obrigatório" : "";
    const cidadeError = !cidade ? "Cidade é obrigatória" : "";

    setErrors({
      nome: nomeError,
      telefone: telefoneError,
      cep: cepError,
      bairro: bairroError,
      rua: ruaError,
      numero: numeroError,
      complemento: complementoError,
      horasCancelarAgendamento: horasError,
      estado: estadoError,
      cidade: cidadeError,
    });

    // 2. Verificar se há erros antes de continuar
    if (
      nomeError ||
      telefoneError ||
      cepError ||
      bairroError ||
      ruaError ||
      numeroError ||
      complementoError ||
      horasError ||
      estadoError ||
      cidadeError
    ) {
      Alert.alert("Erro de Validação", "Por favor, corrija os campos inválidos antes de continuar.");
      return;
    }

    setLoading(true);

    try {
      // 3. Garantir que latitude e longitude existam
      const { latitude, longitude } = await atualizarLatitudeLongitude(cep);

      if (!latitude || !longitude) {
        Alert.alert("Erro", "Não foi possível obter a localização. Verifique o CEP.");
        setLoading(false);
        return;
      }

      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        Alert.alert("Erro", "Usuário não encontrado. Faça login novamente.");
        setLoading(false);
        return;
      }

      const userData = JSON.parse(userDataString);
      const id = userData.id;

      const payload = {
        nome,
        telefone,
        endereco: {
          cep,
          estado,
          cidade,
          bairro,
          rua,
          numero,
          complemento: complemento || "",
          latitude,
          longitude,
        },
        descricao: descricao || "",
        horasCancelarAgendamento: Number(horasCancelarAgendamento) || 0,
        urlFoto: urlFoto === DEFAULT_AVATAR_URL ? "" : urlFoto || "",
      };

      await updateArena(id, payload);

      // Atualiza o initialData após sucesso
      setInitialData({
        nome,
        telefone,
        cep,
        rua,
        bairro,
        numero,
        estado,
        cidade,
        complemento,
        horasCancelarAgendamento,
        descricao,
        urlFoto
      });

      Alert.alert("Sucesso", "Arena atualizada com sucesso!");

    } catch (error: any) {
      console.error("❌ Erro completo:", error);
      console.error("❌ Response data:", error.response?.data);

      const errorMessage = error.response?.data?.message
        || error.response?.data?.error
        || error.message
        || "Erro ao atualizar arena";

      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>

      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-row items-center px-4 py-3 border-b border-gray-100 bg-white z-10">
        <Pressable onPress={() => router.back()} className="mr-4 p-1">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </Pressable>
        <Text className="text-lg font-bold text-gray-800 flex-1" numberOfLines={1}>
          Informações Pessoais
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 40,
          paddingHorizontal: 24,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FormControl className="pt-4 rounded-lg w-full flex-1">
          <VStack className="w-full gap-4">
            <Text className="text-typography-500">Gerencie as informações da sua arena e salve as alterações realizadas.</Text>

            <VStack space="sm">
              <Text className="text-sm font-medium text-typography-500">Foto de Perfil</Text>
              <HStack space="md" className='flex items-center'>
                <Image
                  source={{ uri: urlFoto ?? DEFAULT_AVATAR_URL }}
                  alt="Foto de Perfil"
                  className="w-16 h-16 rounded-full border border-gray-300"
                  size="md"
                />

                <VStack space="xs">
                  <Text className="text-xs text-gray-500">
                    Tamanho máximo: 5MB
                  </Text>
                  <HStack space="sm">
                    <Button
                      size="sm"
                      variant="outline"
                      action="secondary"
                      isDisabled={loading}
                      onPress={selectImage}
                    >
                      <Upload size={16} color='black' />
                      <ButtonText className="ml-2">Escolher foto</ButtonText>
                    </Button>
                    {urlFoto && urlFoto !== DEFAULT_AVATAR_URL && (
                      <Button
                        size="sm"
                        variant="outline"
                        action="negative"
                        isDisabled={loading}
                        onPress={handleRemoveImage}
                      >
                        <Trash2 size={16} color="red" />
                        <ButtonText className="ml-2">Remover</ButtonText>
                      </Button>
                    )}
                  </HStack>
                </VStack>
              </HStack>
            </VStack>

            <InputTexto
              label="Nome da arena"
              placeholder="Insira o nome da arena"
              value={nome}
              onChangeText={setNome}
              onBlur={() => {
                const nomeError = validarNomeArena(nome);
                setErrors(prev => ({ ...prev, nome: nomeError }));
              }}
              error={errors.nome}
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
              <View className="flex-1">
                <Text>Estado</Text>
                <Select
                  selectedValue={estado}
                  onValueChange={(value: string) => {
                    setEstado(value);
                    setCidade("");
                  }}
                >
                  <SelectTrigger variant="outline" size="md" className="justify-between">
                    <SelectInput placeholder="Estado" />
                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent className="max-h-80">
                      <SelectScrollView>
                        {estados.map((uf) => (
                          <SelectItem key={uf.sigla} label={uf.nome} value={uf.sigla} />
                        ))}
                      </SelectScrollView>
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </View>

              <View className="flex-1">
                <Text>Cidade</Text>
                <Select
                  selectedValue={cidade}
                  onValueChange={(value: string) => setCidade(value)}
                >
                  <SelectTrigger variant="outline" size="md" className="justify-between">
                    <SelectInput placeholder="Cidade" />
                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent className="max-h-80">
                      <SelectScrollView>
                        {cidades.length === 0 ? (
                          <SelectItem label="Nenhuma cidade" value="" isDisabled />
                        ) : (
                          cidades.map((c) => (
                            <SelectItem key={c.id} label={c.nome} value={c.nome} />
                          ))
                        )}
                      </SelectScrollView>
                    </SelectContent>
                  </SelectPortal>
                </Select>
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

            <InputNumero
              label="Política de Cancelamento"
              className="text-sm"
              placeholder="Defina o prazo mínimo, em horas, que um atleta pode cancelar um agendamento sem custos. (Máximo 168 horas = 7 dias)"
              value={horasCancelarAgendamento}
              onChangeText={setHorasCancelarAgendamento}
              keyboardType="phone-pad"
              onBlur={() => {
                const horasError = validarHorasCancelarAgendamento(horasCancelarAgendamento);
                setErrors(prev => ({ ...prev, horasCancelarAgendamento: horasError }));
              }}
              error={errors.horasCancelarAgendamento}
            />

            <InputTextArea
              label="Descrição"
              placeholder="Digite algo que descreva sua arena e ajude a atrair mais reservas"
              value={descricao}
              onChangeText={setDescricao}
              optional
            />

            <View className="flex-row w-full gap-5">
              <Button
                size="xl"
                className="flex-1 bg-gray-300 rounded-lg py-3"
                onPress={() => router.back()}
                disabled={loading}
              >
                <ButtonText className="text-base text-black">
                  Cancelar
                </ButtonText>
              </Button>
              <Button
                size="xl"
                className={`flex-1 rounded-lg py-3 bg-green-primary ${(!hasChanges || loading) ? 'opacity-50' : ''}`}
                onPress={handleUpdateArena}
                disabled={loading || !hasChanges}
              >
                {loading ? (
                  <ButtonSpinner className="text-white" />
                ) : (
                  <ButtonText className="text-base text-white">
                    Salvar alterações
                  </ButtonText>
                )}
              </Button>
            </View>
          </VStack>
        </FormControl>
      </ScrollView>
    </SafeAreaView>
  );
}