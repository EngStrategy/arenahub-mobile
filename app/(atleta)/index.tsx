import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Text } from '@/components/ui/text';
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
import { GenericFilter, SportKey } from '@/components/filters/GenericFilter';
import type { Arena } from '@/context/types/Arena';

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
        {/* Header reutilizável */}
        <AppHeader />

        {/* Filtros */}
        <GenericFilter
          cidade={cidade}
          esporte={esporte}
          loading={loading}
          totalElements={totalElements}
          showResults={!loading && page === 0}
          onCidadeChange={onCidadeChange}
          onEsporteChange={onEsporteChange}
          cidadePlaceholder="Buscar por cidade..."
          resultsLabel={{
            singular: 'arena encontrada',
            plural: 'arenas encontradas',
          }}
        />
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
    if (!loading || (loading && page === 0)) return null;
    return (
      <VStack className="py-4">
        <ActivityIndicator size="small" color="#10b981" />
      </VStack>
    );
  };

  const renderEmpty = () => {
    if (loading && page === 0) {
      return (
        <VStack className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="text-gray-500 mt-3">Carregando arenas...</Text>
        </VStack>
      );
    }

    if (!loading && arenas.length === 0) {
      return (
        <VStack className="flex-1 items-center justify-center py-20">
          <Text className="text-gray-500 text-center">
            Nenhuma arena encontrada.
          </Text>
        </VStack>
      );
    }

    return null;
  };

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
          <VStack className="px-7">
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