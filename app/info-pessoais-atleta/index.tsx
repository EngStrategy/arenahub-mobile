import { useState, useEffect } from "react";
import { getAtletaById, updateAtleta } from "@/services/api/endpoints/atleta";
import { useRouter, Stack } from 'expo-router';
import { Upload, Trash2 } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { HStack } from "@/components/ui/hstack";
import { View, ScrollView, Pressable } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { SafeAreaView } from 'react-native-safe-area-context';
import { InputTexto } from "@/components/forms/formInputs/InputTexto";
import { InputNumero } from "@/components/forms/formInputs/InputNumero";
import { Button, ButtonText } from '@/components/ui/button';
import { Image } from 'expo-image';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { formatarTelefone } from "@/utils/formatters";
import * as ImagePicker from 'expo-image-picker';
import { validarNome, validarTelefone } from "@/utils/validators";
import { uploadToImgur } from "@/utils/uploadToImgur";
import { ButtonCancel } from "@/components/buttons/ButtonCancel";
import { ButtonPrimary } from "@/components/buttons/ButtonPrimary";
import { useToastNotification } from "@/components/layout/useToastNotification";

const DEFAULT_AVATAR_URL = "https://i.imgur.com/hepj9ZS.png";

export default function InformacoesPessoaisAtleta() {
    const router = useRouter();
    const { showToast } = useToastNotification();
    const { user, updateUser } = useAuth();
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

    const [errors, setErrors] = useState<{ nome?: string; telefone?: string }>({});

    const hasChanges =
        nome !== initialData.nome ||
        telefone !== initialData.telefone ||
        urlFoto !== initialData.urlFoto;

    useEffect(() => {
        const fetchAtleta = async () => {
            if (!user?.id) return;
            try {
                setLoading(true);
                const data = await getAtletaById(user.id);

                const currentPhoto = data.urlFoto || user.imageUrl || DEFAULT_AVATAR_URL;
                const nomeAtleta = data.nome || user.name || "";

                setNome(nomeAtleta);
                setTelefone(data.telefone || "");
                setEmail(data.email || "");
                setUrlFoto(currentPhoto);
                setInitialData({ nome: nomeAtleta, telefone: data.telefone || "", urlFoto: currentPhoto });
            } catch (error: any) {
                showToast(undefined, error.response?.data?.message || "Não foi possível carregar os dados.", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchAtleta();
    }, [user?.id]);

    const selectImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            showToast(undefined, "Permissão para galeria é necessária.", "error");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
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
        if (!user?.id) return;

        setLoading(true);
        try {
            let finalImageUrl = urlFoto;

            if (urlFoto?.startsWith('file://')) {
                finalImageUrl = await uploadToImgur(urlFoto);
            } else if (urlFoto === DEFAULT_AVATAR_URL) {
                finalImageUrl = "";
            }

            await updateAtleta(user.id, {
                nome,
                telefone,
                urlFoto: finalImageUrl || ""
            });

            await updateUser({
                nome,
                imageUrl: finalImageUrl || null
            });

            setInitialData({ nome, telefone, urlFoto: finalImageUrl });
            showToast(undefined, "Perfil atualizado!", "success");
            router.back();
        } catch (error: any) {
            showToast(undefined, error.message || "Erro ao salvar informações.", "error");
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
                                style={{ width: 80, height: 80, borderRadius: 40, borderWidth: 1, borderColor: '#e5e7eb' }}
                                contentFit="cover"
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
                    <View className="flex-row w-full gap-5 mt-4">
                        <ButtonCancel
                            text="Cancelar"
                            loading={loading}
                            handleAction={() => router.back()}
                        />
                        <ButtonPrimary
                            text="Salvar"
                            loading={loading}
                            handleAction={handleUpdateAtleta}
                            disabled={!hasChanges}
                        />
                    </View>
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
}