import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Text } from '@/components/ui/text';
import { InputTexto } from '@/components/forms/formInputs/InputTexto';
import { ArenaCard } from '@/components/ui/cards/arena-card';
import { getAllArenas, GetArenaResponse, ArenaQueryParams } from '@/services/api/entities/arena';
import { useDebounce } from '@/hooks/useDebounce';
import { useRouter } from 'expo-router';

const sportLabels: Record<string, string> = {
  '': 'Todos os esportes',
  FUTEBOL_SOCIETY: 'Futebol Society',
  FUTEBOL_SETE: 'Futebol 7',
  FUTEBOL_ONZE: 'Futebol 11',
  FUTSAL: 'Futsal',
  BEACHTENNIS: 'Beach Tennis',
  VOLEI: 'Vôlei',
  FUTEVOLEI: 'Futevôlei',
  BASQUETE: 'Basquete',
  HANDEBOL: 'Handebol',
};

type SportKey = keyof typeof sportLabels;

export default function ArenasScreen() {
  const router = useRouter();
  const [cidade, setCidade] = useState('');
  const [esporte, setEsporte] = useState<SportKey>('');
  const [arenas, setArenas] = useState<GetArenaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  const debouncedCidade = useDebounce(cidade, 500);

  const fetchArenas = async (pageNumber: number, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (pageNumber === 0) {
        setLoading(true);
      }

      const params: ArenaQueryParams = {
        page: pageNumber,
        size: 10,
        sort: 'nome',
        direction: 'asc',
      };

      if (debouncedCidade) {
        params.cidade = debouncedCidade;
      }

      if (esporte && esporte !== '') {
        params.esporte = esporte as ArenaQueryParams['esporte'];
      }

      const response = await getAllArenas(params);

      if (isRefresh || pageNumber === 0) {
        setArenas(response.content);
      } else {
        setArenas((prev) => [...prev, ...response.content]);
      }

      setTotalElements(response.totalElements);
      setHasMore(!response.last);
    } catch (error) {
      console.error('Erro ao buscar arenas:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setPage(0);
    fetchArenas(0);
  }, [debouncedCidade, esporte]);

  const handleRefresh = () => {
    setPage(0);
    fetchArenas(0, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchArenas(nextPage);
    }
  };

  const handleArenaPress = (arenaId: string) => {
    // router.push(`/quadras/${arenaId}`);
  };

  const renderFooter = () => {
    if (!loading || page === 0) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#10b981" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View className="flex-1 items-center justify-center py-20">
        <Text className="text-gray-500 text-center">
          Nenhuma arena encontrada.
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header com filtros */}
      <View className="bg-white px-4 pt-4 pb-3 border-b border-gray-200">
        <InputTexto
          placeholder="Buscar por cidade..."
          value={cidade}
          onChangeText={setCidade}
        />

        <View className="mt-3">
          <View className="border border-gray-300 rounded-lg h-12 justify-center">
            <Picker
              selectedValue={esporte}
              onValueChange={(value) => setEsporte(value as SportKey)}
              className="w-full"
            >
              {Object.entries(sportLabels).map(([key, label]) => (
                <Picker.Item key={key} label={label} value={key} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Contador de resultados */}
        {!loading && (
          <Text className="text-sm text-gray-600 mt-3">
            {totalElements} {totalElements === 1 ? 'arena encontrada' : 'arenas encontradas'}
          </Text>
        )}
      </View>

      {/* Lista de arenas */}
      {loading && page === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="text-gray-500 mt-3">Carregando arenas...</Text>
        </View>
      ) : (
        <FlatList
          data={arenas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="px-4">
              <ArenaCard
                arena={item}
                onPress={() => handleArenaPress(item.id)}
              />
            </View>
          )}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#10b981']}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </View>
  );
}