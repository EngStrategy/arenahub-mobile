import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Plus } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getQuadrasByArena, deleteQuadra } from '@/services/api/entities/quadra';
import { Quadra } from '@/context/types/Quadra';
import { QuadraCard } from '@/components/cards/QuadraCard';
import { Spinner } from '@/components/ui/spinner';
import { Heading } from '@/components/ui/heading';

export default function MinhasQuadras() {
    const router = useRouter();
    const [quadras, setQuadras] = useState<Quadra[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDados = async () => {
        try {
            const userDataString = await AsyncStorage.getItem('userData');
            if (!userDataString) return;
            
            const userData = JSON.parse(userDataString);
            const arenaId = userData.id;

            const listaQuadras = await getQuadrasByArena(arenaId);
            setQuadras(listaQuadras);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchDados();
        }, [])
    );

    const handleRefresh = () => {
        setRefreshing(true);
        fetchDados();
    };

    const handleEdit = (id: number) => {
        router.push(`/editar-quadra/${id}`);
    };

    const executarExclusao = async (id: number) => {
        try {
            console.log("Iniciando requisição de exclusão para ID:", id);
            setLoading(true); 
            await deleteQuadra(id);
            
            if (Platform.OS === 'web') {
                window.alert("Quadra excluída com sucesso.");
            } else {
                Alert.alert("Sucesso", "Quadra excluída com sucesso.");
            }
            
            fetchDados(); 
        } catch (error: any) {
            console.error("Erro ao excluir quadra no backend:", error);
            
            const mensagemErro = error.response?.data?.message || 
                               "Não foi possível excluir a quadra. Tente novamente.";
            
            if (Platform.OS === 'web') {
                window.alert(`Erro: ${mensagemErro}`);
            } else {
                Alert.alert("Não foi possível excluir", mensagemErro);
            }
        } finally {
            setLoading(false); 
        }
    };

    const handleDelete = (id: number) => {
        console.log("PAI: handleDelete chamado para o ID:", id);

        if (Platform.OS === 'web') {
            const confirmacao = window.confirm("Tem certeza que deseja excluir esta quadra? Esta ação é irreversível.");
            if (confirmacao) {
                executarExclusao(id);
            }
            return;
        }
        Alert.alert(
            "Excluir Quadra",
            "Tem certeza que deseja excluir esta quadra? Esta ação é irreversível.",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                    onPress: () => console.log("Exclusão cancelada pelo usuário")
                },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: () => executarExclusao(id)
                }
            ],
            { cancelable: true }
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white relative" edges={['top']}> 
            
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: 100, 
                    paddingHorizontal: 24,
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View className="pt-6 w-full flex-1 gap-4">

                    <Heading className="text-2xl mb-1">Minhas quadras</Heading>
                    <Text className="text-typography-500 mb-2">
                        Gerencie suas quadras e adicione novas para expandir sua arena.
                    </Text>
                    
                    <Text className="text-sm text-gray-600 mb-2">
                        {quadras.length} quadra(s) encontrada(s)
                    </Text>
                    
                    {/* Lista */}
                    {loading && !refreshing ? (
                        <View className="flex-1 justify-center items-center">
                            <Spinner color="green" />
                        </View>
                    ) : (
                        <FlatList
                            data={quadras}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <QuadraCard 
                                    quadra={item} 
                                    onEdit={handleEdit} 
                                    onDelete={handleDelete}
                                />
                            )}
                            contentContainerStyle={{ paddingBottom: 20, gap: 4 }}
                            refreshControl={
                                <RefreshControl 
                                    refreshing={refreshing} 
                                    onRefresh={handleRefresh} 
                                    colors={['#15A01A']} 
                                />
                            }
                            ListEmptyComponent={
                                <Text className="text-center text-typography-500 mt-10">
                                    Nenhuma quadra cadastrada.
                                </Text>
                            }
                            scrollEnabled={false}
                        />
                    )}
                </View>
            </ScrollView>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push('/cadastrar-quadra')}
                className="absolute bottom-6 right-6 flex-row items-center justify-center bg-green-primary px-4 py-4 rounded-xl shadow-lg z-50 elevation-5"
            >
                <Plus size={24} color="white" />
            </TouchableOpacity>

        </SafeAreaView>
    );
}