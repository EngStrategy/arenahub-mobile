import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Plus, Search, ChevronDown } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getQuadrasByArenaId } from '@/services/api/entities/quadra';
import { getArenaById } from '@/services/api/entities/arena';
import { Quadra } from '@/context/types/Quadra';
import { QuadraCard } from '@/components/cards/QuadraCard';
import { InputTexto } from '@/components/forms/formInputs/InputTexto';
import { Spinner } from '@/components/ui/spinner';

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

            const listaQuadras = await getQuadrasByArenaId(arenaId);
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
        <SafeAreaView className="flex-1 bg-white px-5 pt-4">
            {/* Cabeçalho */}
            <Text className="text-2xl font-bold text-gray-900 mb-6">Minhas quadras</Text>

            {/* Filtros (Visuais apenas por enquanto) */}
            <View className="mb-4">
                <View className="bg-gray-50 border border-gray-200 rounded-lg flex-row items-center px-3 h-12 mb-3">
                    <Search size={20} color="#9CA3AF" />
                    <Text className="ml-2 text-gray-400">Digite o nome da quadra</Text>
                </View>
                
                <View className="flex-row gap-3">
                    <TouchableOpacity className="flex-1 h-12 border border-gray-200 rounded-lg flex-row items-center justify-between px-3">
                        <Text className="text-gray-600">Filtrar por esporte</Text>
                        <ChevronDown size={20} color="#6B7280" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        onPress={() => router.push('/cadastrar-quadra')}
                        className="h-12 bg-green-600 rounded-lg flex-row items-center px-4"
                    >
                        <Plus size={20} color="white" />
                        <Text className="text-white font-bold ml-2">Adicionar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text className="text-sm text-gray-600 mb-4">
                {quadras.length} quadras(s) encontrada(s)
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
                    contentContainerStyle={{ paddingBottom: 80 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#15A01A']} />
                    }
                    ListEmptyComponent={
                        <Text className="text-center text-gray-500 mt-10">
                            Nenhuma quadra cadastrada.
                        </Text>
                    }
                />
            )}
        </SafeAreaView>
    );
}