import React, { useState, useEffect } from "react";
import { getAtletaById, updateAtleta } from "@/services/api//entities/atleta";
import { useRouter, Stack } from 'expo-router'; 
import { Upload, Trash2 } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { HStack } from "@/components/ui/hstack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Alert, ScrollView, Pressable } from "react-native"; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { InputTexto } from "@/components/forms/formInputs/InputTexto";
import { InputNumero } from "@/components/forms/formInputs/InputNumero";
import { FormControl } from '@/components/ui/form-control';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { formatarTelefone } from "@/context/functions/formatters";

import {
    validarNome,
    validarTelefone
} from "@/context/functions/validators";

const DEFAULT_AVATAR_URL = "https://i.imgur.com/hepj9ZS.png";

interface ErrorsState {
    nome?: string;
    telefone?: string;
}

export default function InformacoesPessoaisAtleta() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Estados do formulário
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [urlFoto, setUrlFoto] = useState<string | null>(DEFAULT_AVATAR_URL);

    // Estado para guardar os dados originais vindos do Backend
    const [initialData, setInitialData] = useState({
        nome: "",
        telefone: "",
        urlFoto: DEFAULT_AVATAR_URL as string | null
    });

    const [errors, setErrors] = useState<ErrorsState>({});

    // Verifica se houve alguma alteração comparando o estado atual com o inicial
    const hasChanges =
        nome !== initialData.nome ||
        telefone !== initialData.telefone ||
        urlFoto !== initialData.urlFoto;

    const getUserId = async (): Promise<string> => {
        const userDataString = await AsyncStorage.getItem('userData');
        if (!userDataString) throw new Error('Usuário não encontrado');
        const userData = JSON.parse(userDataString);
        return userData.id;
    };

    // Carregar dados do usuário
    useEffect(() => {
        const fetchAtleta = async () => {
            try {
                setLoading(true);
                const id = await getUserId();
                const data = await getAtletaById(id);

                const currentPhoto = data.urlFoto || DEFAULT_AVATAR_URL;

                setNome(data.nome);
                setTelefone(data.telefone);
                setEmail(data.email);
                setUrlFoto(currentPhoto);

                setInitialData({
                    nome: data.nome,
                    telefone: data.telefone,
                    urlFoto: currentPhoto
                });

            } catch (error) {
                console.error(error);
                Alert.alert("Erro", "Não foi possível carregar os dados do atleta.");
            } finally {
                setLoading(false);
            }
        };

        fetchAtleta();
    }, []);

    const selectImage = async () => {
        Alert.alert("Seleção de Imagem", "Esta funcionalidade será implementada na próxima etapa com uma biblioteca de seleção de imagens (ex: expo-image-picker).");
    };

    const handleRemoveImage = () => {
        setUrlFoto(DEFAULT_AVATAR_URL);
    };

    const handleUpdateAtleta = async () => {
        const nomeError = validarNome(nome);
        const telefoneError = validarTelefone(telefone);

        setErrors({ nome: nomeError, telefone: telefoneError });

        if (nomeError || telefoneError) {
            Alert.alert("Erro", "Verifique os campos com erro.");
            return;
        }

        setLoading(true);
        try {
            const id = await getUserId();

            await updateAtleta(id, {
                nome,
                telefone,
                urlFoto: urlFoto === DEFAULT_AVATAR_URL ? "" : urlFoto || "",
            });

            // Atualiza o initialData com os novos dados salvos
            setInitialData({
                nome,
                telefone,
                urlFoto
            });

            Alert.alert("Sucesso", "Informações atualizadas!");

        } catch (error: any) {
            console.error(error);
            Alert.alert("Erro", error.response?.data?.message || "Erro ao atualizar informações.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !nome) {
        return <Text className="flex-1 justify-center items-center text-center mt-10">Carregando...</Text>
    }

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
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 40, paddingHorizontal: 24, }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <FormControl className="pt-4 rounded-lg w-full">
                    <VStack className="w-full gap-4">

                        <Text className="text-typography-500">Gerencie suas informações pessoais e salve as alterações caso realize alguma mudança.</Text>

                        {/* --- Seção de Foto de Perfil --- */}
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
                            label="Nome"
                            placeholder="Seu nome completo"
                            value={nome}
                            onChangeText={setNome}
                            onBlur={() => {
                                const nomeError = validarNome(nome);
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

                        {/* --- Botões --- */}
                        <View className="flex-row w-full gap-5 mt-4">
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
                                onPress={handleUpdateAtleta}
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
};