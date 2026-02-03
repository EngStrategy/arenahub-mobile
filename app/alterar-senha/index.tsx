import { useState } from "react";
import { updatePassword } from "@/services/api/endpoints/atleta";
import { useRouter, Stack } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { View, KeyboardAvoidingView, Platform, ScrollView, Pressable } from "react-native";
import { InputSenha } from "@/components/forms/formInputs/InputSenha";
import { FormControl } from '@/components/ui/form-control';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ButtonPrimary } from "@/components/buttons/ButtonPrimary";
import { ButtonCancel } from "@/components/buttons/ButtonCancel";
import { useToastNotification } from "@/components/layout/useToastNotification";

interface ErrorsState {
    senhaAtual?: string;
    novaSenha?: string;
    confirmarSenha?: string;
}

export default function AlterarSenha() {
    const router = useRouter();
    const { signOut } = useAuth();
    const { showToast } = useToastNotification();
    const [loading, setLoading] = useState(false);
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [errors, setErrors] = useState<ErrorsState>({});

    const handleAlterarSenha = async () => {
        let hasError = false;
        let localErrors: ErrorsState = {};

        if (!senhaAtual) {
            localErrors.senhaAtual = 'Senha atual é obrigatória.';
            hasError = true;
        }
        if (novaSenha.length < 8) {
            localErrors.novaSenha = 'A nova senha deve ter pelo menos 8 caracteres.';
            hasError = true;
        }
        if (novaSenha !== confirmarSenha) {
            localErrors.confirmarSenha = 'As senhas não coincidem.';
            hasError = true;
        }

        setErrors(localErrors);
        if (hasError) return;

        setLoading(true);

        try {
            await updatePassword(senhaAtual, novaSenha, confirmarSenha);

            showToast(
                "Sucesso",
                "Senha alterada com sucesso! Você será desconectado em instantes.",
                "success"
            );

            // Aguardar 2s para o usuário ler o toast antes de deslogar
            setTimeout(async () => {
                await signOut();
            }, 2000);

        } catch (error: any) {
            showToast('Aviso', error.message, 'warning');
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
                    Alterar Senha
                </Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 40, paddingHorizontal: 24 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >

                    <FormControl className="pt-4 rounded-lg w-full">
                        <VStack className="w-full gap-4">
                            <Text className="text-typography-500">Use pelo menos 8 caracteres. Não use a senha de outro site ou algo muito óbvio.</Text>

                            <InputSenha
                                label="Senha atual"
                                placeholder="Digite sua senha atual"
                                value={senhaAtual}
                                onChangeText={setSenhaAtual}
                                error={errors.senhaAtual}
                                onBlur={() => setErrors(prev => ({ ...prev, senhaAtual: '' }))}
                            />

                            <InputSenha
                                label="Nova senha"
                                placeholder="Digite a nova senha"
                                value={novaSenha}
                                onChangeText={setNovaSenha}
                                error={errors.novaSenha}
                                onBlur={() => {
                                    if (novaSenha.length > 0 && novaSenha.length < 8) {
                                        setErrors(prev => ({ ...prev, novaSenha: 'Mínimo 8 caracteres.' }));
                                    } else {
                                        setErrors(prev => ({ ...prev, novaSenha: '' }));
                                    }
                                }}
                            />

                            <InputSenha
                                label="Confirmar nova senha"
                                placeholder="Confirme a nova senha"
                                value={confirmarSenha}
                                onChangeText={setConfirmarSenha}
                                error={errors.confirmarSenha}
                                onBlur={() => {
                                    if (confirmarSenha.length > 0 && novaSenha !== confirmarSenha) {
                                        setErrors(prev => ({ ...prev, confirmarSenha: 'As senhas não coincidem.' }));
                                    } else {
                                        setErrors(prev => ({ ...prev, confirmarSenha: '' }));
                                    }
                                }}
                            />

                            <View className="flex-row w-full gap-5 mt-4">
                                <ButtonCancel
                                    text="Cancelar"
                                    loading={loading}
                                    handleAction={() => router.back()}
                                />
                                <ButtonPrimary
                                    text="Alterar senha"
                                    loading={loading}
                                    handleAction={handleAlterarSenha}
                                />
                            </View>
                        </VStack>
                    </FormControl>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};