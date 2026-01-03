import React, { useState } from "react";
import { updatePassword } from "@/services/api/entities/atleta"; 
import { updatePasswordArena } from "@/services/api/entities/arena";
import { useRouter, Stack } from 'expo-router'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, KeyboardAvoidingView, Platform, Alert, ScrollView, Pressable } from "react-native"; // Adicionado Pressable
import { InputSenha } from "@/components/forms/formInputs/InputSenha";
import { FormControl } from '@/components/ui/form-control';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { Ionicons } from '@expo/vector-icons'; 

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
                            await AsyncStorage.removeItem('userData'); 
                            router.replace('/login'); 
                        }
                    }
                ]
            );

        } catch (error: any) {
                Alert.alert('Aviso', error.message);
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
        </SafeAreaView>
    );
};