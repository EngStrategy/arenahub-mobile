import React, { useState, useEffect } from "react";
import { getArenaById, updateArena } from "@/services/api/edits";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from "@react-native-picker/picker";
// import {Trash2, Upload} from 'lucide-react-native';
import apiCEP from "@/services/apiCEP";
import apiCidades from "@/services/apiCidades";
import apiLatitudeLongitude from "@/services/apiLatitudeLongitude";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { estados } from "@/data/estados";
import { View, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ScrollView } from "react-native";
import { InputTexto } from "@/components/forms/formInputs/InputTexto";
import { InputNumero } from "@/components/forms/formInputs/InputNumero";
import { InputTextArea } from "@/components/forms/formInputs/InputTextArea";
import { FormControl } from '@/components/ui/form-control';
import { Button, ButtonText } from '@/components/ui/button';
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
  });

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

  const handleRemoveImage = () => {
    setUrlFoto(DEFAULT_AVATAR_URL);
    Alert.alert('Sucesso', 'Foto removida.');
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
        // O IBGE retorna uma lista de objetos [{ id, nome, microrregiao, ... }]
        setCidades(data);
      } catch (error) {
        console.error("Erro ao buscar cidades:", error);
        setCidades([]);
      }
    };

    fetchCidades();
  }, [estado]);


  const getUserId = async () => {
    const userDataString = await AsyncStorage.getItem('userData');
    if (!userDataString) throw new Error('Usuário não encontrado');
    const userData = JSON.parse(userDataString);
    return userData.id;
  };

  // useEffect(() => {
  //   const fetchArena = async () => {
  //     try {
  //       setLoading(true);
  //       const userDataString = await AsyncStorage.getItem('userData');
  //       if (!userDataString) throw new Error('Usuário não encontrado');
  //       const userData = JSON.parse(userDataString);
  //       const id = userData.id;



  //       const data = await getArenaById(`/arenas/${id}`);


  //       // setNome(data.nome);
  //       // setTelefone(data.telefone);
  //       // setCep(data.endereco.cep);
  //       // setRua(data.endereco.rua);
  //       // setBairro(data.endereco.bairro);
  //       // setNumero(data.endereco.numero);
  //       // setEstado(data.endereco.estado);
  //       // setCidade(data.endereco.cidade);
  //       // setComplemento(data.endereco.complemento || "");
  //       // setHorasCancelarAgendamento(String(data.horasCancelarAgendamento ?? ""));
  //       // setDescricao(data.descricao || "");
  //       // setUrlFoto(data.urlFoto || null);

  //     } catch (error) {
  //       console.error(error);
  //       // Alert.alert("Erro", "Não foi possível carregar os dados da arena.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchArena();
  // }, []);

  useEffect(() => {
    const fetchArena = async () => {
      try {
        setLoading(true);

        const userDataString = await AsyncStorage.getItem('userData');
        if (!userDataString) throw new Error('Usuário não encontrado');
        const userData = JSON.parse(userDataString);
        const id = userData.id;

        const data = await getArenaById(id); // agora passa só o id, sem "/arenas/" aqui
        setNome(data.nome);
        setTelefone(data.telefone);
        setCep(data.endereco.cep);
        setRua(data.endereco.rua);
        setBairro(data.endereco.bairro);
        setNumero(data.endereco.numero);
        setEstado(data.endereco.estado);
        setCidade(data.endereco.cidade);
        setComplemento(data.endereco.complemento || "");
        setHorasCancelarAgendamento(String(data.horasCancelarAgendamento ?? ""));
        setDescricao(data.descricao || "");
        setUrlFoto(data.urlFoto || null);

        // preencher os campos com os dados da arena...
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
    const nomeError = validarNomeArena(nome);
    const telefoneError = validarTelefone(telefone);
    const cepError = validarCEP(cep);
    const bairroError = validarBairro(bairro);
    const ruaError = validarRua(rua);
    const numeroError = validarNumero(numero);
    const complementoError = validarComplemento(complemento);

    setErrors(prev => ({
      ...prev,
      nome: nomeError,
      telefone: telefoneError,
      cep: cepError,
      bairro: bairroError,
      rua: ruaError,
      numero: numeroError,
      complemento: complementoError,
    }));

    setLoading(true);

    const { latitude, longitude } = await atualizarLatitudeLongitude(cep);

    try {
      const userDataString = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(userDataString!);
      const id = userData.id;

      await updateArena(id, {
        nome,
        telefone,
        endereco: {
          cep,
          estado,
          cidade,
          bairro,
          rua,
          numero,
          complemento,
          latitude,
          longitude,
        },
        descricao,
        horasCancelarAgendamento: Number(horasCancelarAgendamento),
        urlFoto: urlFoto === DEFAULT_AVATAR_URL ? "" : urlFoto || "",
      });

      Alert.alert("Sucesso", "Arena atualizada!");
      router.back();

    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", error.response?.data?.message || "Erro ao atualizar arena");
    } finally {
      setLoading(false);
    }
  };


  // // Atualizar arena, lembrar da longitude e latitude
  // const handleUpdateArena = async () => {
  //   const nomeError = validarNomeArena(nome);
  //   const telefoneError = validarTelefone(telefone);
  //   const cepError = validarCEP(cep);
  //   const bairroError = validarBairro(bairro);
  //   const ruaError = validarRua(rua);
  //   const numeroError = validarNumero(numero);
  //   const complementoError = validarComplemento(complemento);

  //   setErrors(prev => ({
  //     ...prev,
  //     nome: nomeError,
  //     telefone: telefoneError,
  //     cep: cepError,
  //     bairro: bairroError,
  //     rua: ruaError,
  //     numero: numeroError,
  //     complemento: complementoError,
  //   }));

  //   setLoading(true);

  //   const { latitude, longitude } = await atualizarLatitudeLongitude(cep);

  //   alert("Dados da arena atualizados com sucesso!");

  //   // try {
  //   //   setLoading(true);
  //   //   await updateArena(`/ arenas / ${ id }`, {
  //   //     nome,
  //   //     telefone,
  //   //     endereco: {
  //   //       cep,
  //   //       estado,
  //   //       cidade,
  //   //       bairro,
  //   //       rua,
  //   //       numero,
  //   //       complemento,
  //   //       latitude,
  //   //       longitude,
  //   //     },
  //   //     imageUrl,
  //   //     descricao,
  //   //     horasCancelarAgendamento: Number(horasCancelarAgendamento),
  //   //   });
  //   //   Alert.alert("Sucesso", "Arena atualizada!");
  //   //   router.back();
  //   // } catch (error: any) {
  //   //   console.error(error);
  //   //   Alert.alert("Erro", error.response?.data?.message || "Erro ao atualizar arena");
  //   // } finally {
  //   //   setLoading(false);
  //   // }
  // };

  // // Fetch cidades quando estado mudar

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40, paddingHorizontal: 24, paddingTop: 14 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FormControl className="pt-9 rounded-lg w-full">
          <VStack className="w-full gap-4">
            <Heading className="text-2xl">Informações da arena</Heading>
            <Text className="text-typography-500">Gerenciee suas informações pessoais e salve as alterações caso realize alguma mudança.</Text>

            {/* --- Seção de Foto da Quadra --- */}
            {/* <VStack space="sm">
              <Text className="text-sm font-medium">Foto da Quadra</Text>
              <HStack space="md" className='flex items-center'>
                <Image
                  source={{ uri: imageUrl ?? DEFAULT_AVATAR_URL }}
                  alt="Foto da Quadra"
                  className="w-16 h-16 rounded-full border border-gray-300"
                  size="md"
                />

                <VStack space="xs">
                  <Text className="text-xs text-gray-500">
                    Recomendamos uma imagem quadrada.
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
                    {imageUrl && imageUrl !== DEFAULT_AVATAR_URL && (
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
            </VStack> */}

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

            <InputNumero
              label="Política de Cancelamento"
              estilo="text-sm"
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
                className="flex-1 bg-green-primary rounded-lg py-3"
                onPress={handleUpdateArena}
                disabled={loading}
              >
                <ButtonText className="text-base text-white">
                  Salvar alterações
                </ButtonText>
              </Button>
            </View>
          </VStack>
        </FormControl>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
