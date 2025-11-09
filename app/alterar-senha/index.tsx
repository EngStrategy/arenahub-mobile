
import React, { useState } from "react";
import { updatePassword } from "@/services/api//entities/atleta"; // Assumindo o caminho
import { updatePasswordArena } from "@/services/api/entities/arena";
import { useRouter } from 'expo-router';
import { Heading } from "@/components/ui/heading";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, KeyboardAvoidingView, Platform, Alert, ScrollView } from "react-native";
import { InputSenha } from "@/components/forms/formInputs/InputSenha";
import { FormControl } from '@/components/ui/form-control';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

interface ErrorsState {
    senhaAtual?: string;
    novaSenha?: string;
    confirmarSenha?: string;
}

export default function AlterarSenha() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [role, setRole] = useState<string | null>(null);

    const [errors, setErrors] = useState<ErrorsState>({});

    const getUserRole = async () => {
        const userDataString = await AsyncStorage.getItem('userData');
        if (!userDataString) throw new Error('Usuário não encontrado');
        const userData = JSON.parse(userDataString);
        return userData.role;
    };

    React.useEffect(() => {
        let mounted = true;
        (async () => {
          try {
            const r = await getUserRole();
            if (mounted) setRole(r);
          } catch {
            if (mounted) setRole(null);
          }
        })();
        return () => {
          mounted = false;
        };
      }, []);

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
            if (role === 'ATLETA') {
                await updatePassword(senhaAtual, novaSenha, confirmarSenha);
            } else if (role === 'ARENA') {
                await updatePasswordArena(senhaAtual, novaSenha, confirmarSenha);
            }

            Alert.alert(
                "Sucesso",
                "Senha alterada com sucesso! Você será desconectado por segurança.",
                [
                    {
                        text: "OK", onPress: async () => {
                            await AsyncStorage.removeItem('userData'); // ou 'token'
                            router.replace('/login'); // Redireciona para o login
                        }
                    }
                ]
            );

        } catch (error: any) {
            console.error(error);
            Alert.alert("Erro", error.response?.data?.message || "Erro ao alterar a senha.");
        } finally {
            setLoading(false);
        }
    };

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
                        <Heading className="text-2xl">Alterar senha</Heading>
                        <Text className="text-typography-500">Use pelo menos 8 caracteres. Não use a senha de outro site ou algo muito óbvio.</Text>

                        <InputSenha
                            label="Senha atual"
                            placeholder="Digite sua senha atual"
                            value={senhaAtual}
                            onChangeText={setSenhaAtual}
                            error={errors.senhaAtual}
                            onBlur={() => setErrors(prev => ({ ...prev, senhaAtual: '' }))} // Limpa o erro
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
                                onPress={handleAlterarSenha}
                                disabled={loading}
                            >
                                <ButtonText className="text-base text-white">
                                    Alterar senha
                                </ButtonText>
                            </Button>
                        </View>
                    </VStack>
                </FormControl>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};