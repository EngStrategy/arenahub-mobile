
import React, { useState } from "react";
import { updatePassword } from "@/services/api//entities/atleta"; // Assumindo o caminho
import { useRouter } from 'expo-router';
import { Heading } from "@/components/ui/heading";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, KeyboardAvoidingView, Platform, Alert, ScrollView } from "react-native";
import { InputTexto } from "@/components/forms/formInputs/InputTexto";
import { FormControl } from '@/components/ui/form-control';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';


// Tipagem para o estado de erros
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

    const [errors, setErrors] = useState<ErrorsState>({});

    const handleAlterarSenha = async () => {
        // Validação simples (pode ser melhorada com funções de /validators)
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

                        <InputTexto
                            label="Senha atual"
                            placeholder="Digite sua senha atual"
                            value={senhaAtual}
                            onChangeText={setSenhaAtual}
                            secureTextEntry={true}
                            error={errors.senhaAtual}
                            onBlur={() => setErrors(prev => ({ ...prev, senhaAtual: '' }))} // Limpa o erro
                        />

                        <InputTexto
                            label="Nova senha"
                            placeholder="Digite a nova senha"
                            value={novaSenha}
                            onChangeText={setNovaSenha}
                            secureTextEntry={true}
                            error={errors.novaSenha}
                            onBlur={() => {
                                if (novaSenha.length > 0 && novaSenha.length < 8) {
                                    setErrors(prev => ({ ...prev, novaSenha: 'Mínimo 8 caracteres.' }));
                                } else {
                                    setErrors(prev => ({ ...prev, novaSenha: '' }));
                                }
                            }}
                        />

                        <InputTexto
                            label="Confirmar nova senha"
                            placeholder="Confirme a nova senha"
                            value={confirmarSenha}
                            onChangeText={setConfirmarSenha}
                            secureTextEntry={true}
                            error={errors.confirmarSenha}
                            onBlur={() => {
                                if (confirmarSenha.length > 0 && novaSenha !== confirmarSenha) {
                                    setErrors(prev => ({ ...prev, confirmarSenha: 'As senhas não coincidem.' }));
                                } else {
                                    setErrors(prev => ({ ...prev, confirmarSenha: '' }));
                                }
                            }}
                        />

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