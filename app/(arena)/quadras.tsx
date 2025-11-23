import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl, ScrollView } from 'react-native'; // Adicionado TouchableOpacity
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Plus } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getQuadrasByArena } from '@/services/api/entities/quadra';
import { getArenaById } from '@/services/api/entities/arena';
import { Quadra } from '@/context/types/Quadra';
import { QuadraCard } from '@/components/cards/QuadraCard';
import { Spinner } from '@/components/ui/spinner';
import { Heading } from '@/components/ui/heading';

export default function MinhasQuadras() {
    const router = useRouter();
    const [quadras, setQuadras] = useState<Quadra[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [arenaCep, setArenaCep] = useState('');

    const fetchDados = async () => {
        try {
            const userDataString = await AsyncStorage.getItem('userData');
            if (!userDataString) return;
            
            const userData = JSON.parse(userDataString);
            const arenaId = userData.id;

            const listaQuadras = await getQuadrasByArena(arenaId);
            setQuadras(listaQuadras);

            const arenaData = await getArenaById(arenaId);
            setArenaCep(arenaData.endereco.cep);

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

    const handleDelete = (id: number) => {
        console.log("Deletar quadra", id);
        Alert.alert("Aviso", "Funcionalidade de exclusão em breve.");
    };

    return (
        <SafeAreaView className="flex-1 bg-white relative" edges={['top']}> 
            {/* Adicionei 'relative' no container pai para garantir contexto de posicionamento, embora SafeAreaView já tenha comportamento flex */}

            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: 100, // AUMENTEI O PADDING BOTTOM para o conteúdo não ficar escondido atrás do botão flutuante
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
                                    arenaCep={arenaCep}
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

            {/* --- BOTÃO FLUTUANTE --- */}
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