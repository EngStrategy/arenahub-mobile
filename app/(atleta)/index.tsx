import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Text } from '@/components/ui/text';
import { InputTexto } from '@/components/forms/formInputs/InputTexto';
import { ArenaCard } from '@/components/cards/ArenaCard';
import {
  getAllArenas,
  ArenaQueryParams,
} from '@/services/api/entities/arena';
import { useDebounce } from '@/hooks/useDebounce';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/layout/AppHeader';
import { VStack } from '@/components/ui/vstack';
import type { Arena } from '@/context/types/Arena';

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

const ArenasListHeader = React.memo(
  ({
    cidade,
    esporte,
    loading,
    page,
    totalElements,
    onCidadeChange,
    onEsporteChange,
  }: {
    cidade: string;
    esporte: SportKey;
    loading: boolean;
    page: number;
    totalElements: number;
    onCidadeChange: (text: string) => void;
    onEsporteChange: (value: SportKey) => void;
  }) => {
    return (
      <VStack>
        {/* 1. Header reutilizável */}
        <AppHeader />

        {/* 2. Filtros */}
        <VStack className="bg-white px-4 pb-3 border-gray-200">
          <InputTexto
            placeholder="Buscar por cidade..."
            value={cidade}
            onChangeText={onCidadeChange}
          />

          <VStack className="mt-3">
            <VStack className="border border-gray-300 rounded-lg h-12 justify-center">
              <Picker
                selectedValue={esporte}
                onValueChange={value => onEsporteChange(value as SportKey)}
                style={Platform.OS === 'ios' ? { height: 150 } : {}}
                className="w-full"
              >
                {Object.entries(sportLabels).map(([key, label]) => (
                  <Picker.Item key={key} label={label} value={key} />
                ))}
              </Picker>
            </VStack>
          </VStack>

          {/* 3. Contador de resultados */}
          {/* Mostra o total *após* o carregamento inicial */}
          {!loading && page === 0 && (
            <Text className="text-sm text-gray-600 mt-3">
              {totalElements}{' '}
              {totalElements === 1 ? 'arena encontrada' : 'arenas encontradas'}
            </Text>
          )}
        </VStack>
      </VStack>
    );
  }
);

export default function ArenasScreen() {
  const router = useRouter();
  const [cidade, setCidade] = useState('');
  const [esporte, setEsporte] = useState<SportKey>('');
  const [arenas, setArenas] = useState<Arena[]>([]);
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
        setArenas(prev => [...prev, ...response.content]);
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
    router.push(`/quadras/${arenaId}`);
  };

  const renderFooter = () => {
    // Mostra o loader de "carregar mais" apenas se não for o load inicial
    if (!loading || (loading && page === 0)) return null;
    return (
      <VStack className="py-4">
        <ActivityIndicator size="small" color="#10b981" />
      </VStack>
    );
  };

  const renderEmpty = () => {
    // Se estiver carregando (no page 0), mostre o loader
    if (loading && page === 0) {
      return (
        <VStack className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="text-gray-500 mt-3">Carregando arenas...</Text>
        </VStack>
      );
    }

    // Se não estiver carregando e não houver arenas, mostre a mensagem
    if (!loading && arenas.length === 0) {
      return (
        <VStack className="flex-1 items-center justify-center py-20">
          <Text className="text-gray-500 text-center">
            Nenhuma arena encontrada.
          </Text>
        </VStack>
      );
    }

    // Caso contrário (ex: carregando mais páginas), não mostre nada
    return null;
  };

  // Criamos o *elemento* do header aqui, uma única vez por renderização.
  // Como `setCidade` e `setEsporte` são estáveis, o `React.memo`
  // fará com que o componente só atualize as props, sem desmontar.
  const listHeaderComponent = (
    <ArenasListHeader
      cidade={cidade}
      esporte={esporte}
      loading={loading}
      page={page}
      totalElements={totalElements}
      onCidadeChange={setCidade}
      onEsporteChange={setEsporte}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <FlatList
        data={arenas}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <VStack className="px-4">
            <ArenaCard
              arena={item}
              onPress={() => handleArenaPress(item.id)}
            />
          </VStack>
        )}
        contentContainerStyle={{ paddingTop: 0, paddingBottom: 20 }}
        ListHeaderComponent={listHeaderComponent}
        ListEmptyComponent={renderEmpty}
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
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}