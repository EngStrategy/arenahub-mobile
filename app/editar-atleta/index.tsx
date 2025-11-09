// app/(tabs)/perfil/informacoes.tsx (ou caminho similar)
import React, { useState, useEffect } from "react";
import { getAtletaById, updateAtleta } from "@/services/api//entities/atleta"; // Assumindo que o caminho da api é similar
import { Link, useRouter } from 'expo-router';
import { Upload, Trash2, User } from 'lucide-react-native';
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, KeyboardAvoidingView, Platform, Alert, ScrollView } from "react-native";
import { InputTexto } from "@/components/forms/formInputs/InputTexto";
import { InputNumero } from "@/components/forms/formInputs/InputNumero";
import { FormControl } from '@/components/ui/form-control';
import { Button, ButtonText } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { formatarTelefone } from "@/context/functions/formatters";

import {
    validarNome, // Você precisará criar esta função
    validarTelefone
} from "@/context/functions/validators"; // Você precisará adicionar as validações

const DEFAULT_AVATAR_URL = "https://i.imgur.com/hepj9ZS.png"; // Mesmo default do seu colega

// Tipagem para o estado de erros
interface ErrorsState {
    nome?: string;
    telefone?: string;
}

export default function InformacoesPessoais() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [urlFoto, setUrlFoto] = useState<string | null>(DEFAULT_AVATAR_URL);

    const [errors, setErrors] = useState<ErrorsState>({});

    // Função para pegar o ID do usuário, igual ao do seu colega
    const getUserId = async (): Promise<string> => {
        const userDataString = await AsyncStorage.getItem('userData');
        if (!userDataString) throw new Error('Usuário não encontrado');
        const userData = JSON.parse(userDataString);
        return userData.id; // Ou userData.userId, dependendo de como está salvo
    };

    // Carregar dados do usuário
    useEffect(() => {
        const fetchAtleta = async () => {
            try {
                setLoading(true);
                const id = await getUserId();
                const data = await getAtletaById(id);

                setNome(data.nome);
                setTelefone(data.telefone);
                setEmail(data.email);
                setUrlFoto(data.urlFoto || DEFAULT_AVATAR_URL);

            } catch (error) {
                console.error(error);
                Alert.alert("Erro", "Não foi possível carregar os dados do atleta.");
            } finally {
                setLoading(false);
            }
        };

        fetchAtleta();
    }, []);

    // Lógica de upload de imagem (placeholder, como no código do seu colega)
    const selectImage = async () => {
        Alert.alert("Seleção de Imagem", "Esta funcionalidade será implementada na próxima etapa com uma biblioteca de seleção de imagens (ex: expo-image-picker).");
    };

    // Lógica para remover imagem
    const handleRemoveImage = () => {
        setUrlFoto(DEFAULT_AVATAR_URL);
        Alert.alert('Sucesso', 'Foto removida. Salve as alterações para confirmar.');
    };

    // Lógica de salvar
    const handleUpdateAtleta = async () => {
        const nomeError = validarNome(nome); // Crie essa função em validators
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

            Alert.alert("Sucesso", "Informações atualizadas!");
            router.back();

        } catch (error: any) {
            console.error(error);
            Alert.alert("Erro", error.response?.data?.message || "Erro ao atualizar informações.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !nome) {
        return <Text className="flex-1 justify-center items-center">Carregando...</Text>
    }

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
                        <Heading className="text-2xl">Informações pessoais</Heading>
                        <Text className="text-typography-500">Gerencie suas informações pessoais e salve as alterações caso realize alguma mudança.</Text>

                        {/* --- Seção de Foto de Perfil (baseado no EditarArena.js) --- */}
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
                                const nomeError = validarNome(nome); // Crie essa função
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

                        <InputTexto
                            label="Email"
                            value={email}
                            editable={false} // Campo desabilitado
                            className="bg-gray-100" // Estilo para parecer desabilitado
                        />

                        {/* <Link href="/editar-atleta/alterar-senha" asChild>
                            <Button
                                variant="outline" // Estilo de "borda"
                                action="secondary" // Cor secundária
                                className="mt-4" // Espaço acima
                            >
                                <ButtonText>Alterar Senha</ButtonText>
                            </Button>
                        </Link> */}

                        {/* --- Botões (igual ao EditarArena.js) --- */}
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
                                className="flex-1 bg-green-primary rounded-lg py-3"
                                onPress={handleUpdateAtleta}
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