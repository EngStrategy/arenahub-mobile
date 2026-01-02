import React, { useState, useEffect } from "react";
import { getAtletaById, updateAtleta } from "@/services/api/entities/atleta";
import { useRouter, Stack } from 'expo-router'; 
import { Upload, Trash2 } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { HStack } from "@/components/ui/hstack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Alert, ScrollView, Pressable } from "react-native"; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { InputTexto } from "@/components/forms/formInputs/InputTexto";
import { InputNumero } from "@/components/forms/formInputs/InputNumero";
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { formatarTelefone } from "@/context/functions/formatters";
import * as ImagePicker from 'expo-image-picker';
import { validarNome, validarTelefone } from "@/context/functions/validators";
import { uploadToImgur } from "@/utils/uploadToImgur";

const DEFAULT_AVATAR_URL = "https://i.imgur.com/hepj9ZS.png";

export default function InformacoesPessoaisAtleta() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [urlFoto, setUrlFoto] = useState<string | null>(DEFAULT_AVATAR_URL);

    const [initialData, setInitialData] = useState({
        nome: "",
        telefone: "",
        urlFoto: DEFAULT_AVATAR_URL as string | null
    });

    const [errors, setErrors] = useState<{nome?: string; telefone?: string}>({});

    const hasChanges =
        nome !== initialData.nome ||
        telefone !== initialData.telefone ||
        urlFoto !== initialData.urlFoto;

    const getUserId = async () => {
        const userDataString = await AsyncStorage.getItem('userData');
        if (!userDataString) throw new Error('Usuário não encontrado');
        return JSON.parse(userDataString).id;
    };

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
                setInitialData({ nome: data.nome, telefone: data.telefone, urlFoto: currentPhoto });
            } catch (error) {
                Alert.alert("Erro", "Não foi possível carregar os dados.");
            } finally {
                setLoading(false);
            }
        };
        fetchAtleta();
    }, []);

    const selectImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Erro", "Permissão para galeria é necessária.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setUrlFoto(result.assets[0].uri);
        }
    };

    const handleUpdateAtleta = async () => {
        const nomeError = validarNome(nome);
        const telefoneError = validarTelefone(telefone);
        setErrors({ nome: nomeError, telefone: telefoneError });

        if (nomeError || telefoneError) return;

        setLoading(true);
        try {
            const id = await getUserId();
            let finalImageUrl = urlFoto;

            if (urlFoto && urlFoto.startsWith('file://')) {
                finalImageUrl = await uploadToImgur(urlFoto);
            } else if (urlFoto === DEFAULT_AVATAR_URL) {
                finalImageUrl = ""; 
            }

            await updateAtleta(id, {
                nome,
                telefone,
                urlFoto: finalImageUrl || ""
            });

            setInitialData({ nome, telefone, urlFoto: finalImageUrl });
            Alert.alert("Sucesso", "Perfil atualizado!");
        } catch (error: any) {
            Alert.alert("Erro", error.message || "Erro ao salvar informações.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />
            <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
                <Pressable onPress={() => router.back()} className="mr-4 p-1">
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </Pressable>
                <Text className="text-lg font-bold text-gray-800 flex-1" numberOfLines={1}>
                    Informações Pessoais
                </Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
                <VStack space="xl">

                    <Text className="text-typography-500 pt-4">Gerencie suas informações pessoais e salve as alterações caso realize alguma mudança.</Text>

                    {/* Seção Foto */}
                    <VStack space="sm">
                        <Text className="text-sm font-medium text-gray-500">Foto de Perfil</Text>
                        <HStack space="md" className="items-center">
                            <Image
                                source={{ uri: urlFoto ?? DEFAULT_AVATAR_URL }}
                                alt="Perfil"
                                className="w-20 h-20 rounded-full border border-gray-200"
                            />
                            <VStack space="xs">
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
                                    {urlFoto !== DEFAULT_AVATAR_URL && (
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            action="negative" 
                                            onPress={() => setUrlFoto(DEFAULT_AVATAR_URL)} 
                                            isDisabled={loading}
                                        >
                                            <Trash2 size={16} color="red" />
                                            <ButtonText className="ml-2">Remover</ButtonText>
                                        </Button>
                                    )}
                                </HStack>
                            </VStack>
                        </HStack>
                    </VStack>

                    <InputTexto label="Nome" value={nome} onChangeText={setNome} error={errors.nome} />
                    
                    <InputNumero 
                        label="Telefone" 
                        placeholder="(99) 99999-9999"
                        value={telefone} 
                        onChangeText={(t) => setTelefone(formatarTelefone(t))} 
                        error={errors.telefone}
                        maxLength={15}
                    />

                    <View className="flex-row gap-4 mt-4">
                        <Button className="flex-1 bg-gray-200" onPress={() => router.back()} isDisabled={loading}>
                            <ButtonText className="text-black">Cancelar</ButtonText>
                        </Button>
                        <Button 
                            className={`flex-1 bg-green-primary ${(!hasChanges || loading) ? 'opacity-50' : ''}`}
                            onPress={handleUpdateAtleta}
                            isDisabled={!hasChanges || loading}
                        >
                            {loading ? <ButtonSpinner /> : <ButtonText>Salvar</ButtonText>}
                        </Button>
                    </View>
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
}