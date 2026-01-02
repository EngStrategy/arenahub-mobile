import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Alert,
  Text
} from 'react-native';
import { JogoAbertoCard} from '@/components/cards/JogoAbertoCard';
import { JogoAberto } from '@/services/api/entities/atletaAgendamento'
import {
  getAllJogosAbertos,
  solicitarEntrada,
  JogosAbertosQueryParams,
} from '@/services/api/entities/atletaAgendamento';
import { useDebounce } from '@/hooks/useDebounce';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { GenericFilter, SportKey } from '@/components/filters/GenericFilter';
import { Heading } from '@/components/ui/heading';

const JogosAbertosListHeader = React.memo(
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
        {/* Header com Título e Descrição */}
        <VStack className="px-7 pt-6 bg-white gap-2">
          <Heading className="text-2xl mb-1">Jogos Abertos</Heading>
          <Text className="text-typography-500">
            Encontre jogos públicos na sua região e solicite participação.
          </Text>
        </VStack>

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
            singular: 'jogo encontrado',
            plural: 'jogos encontrados',
          }}
        />
      </VStack>
    );
  }
);

export default function JogosAbertosScreen() {
  const [cidade, setCidade] = useState('');
  const [esporte, setEsporte] = useState<SportKey>('');
  const [jogos, setJogos] = useState<JogoAberto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [solicitandoEntrada, setSolicitandoEntrada] = useState(false);

  const debouncedCidade = useDebounce(cidade, 500);

  const fetchJogos = async (pageNumber: number, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (pageNumber === 0) {
        setLoading(true);
      }

      const params: JogosAbertosQueryParams = {
        page: pageNumber,
        size: 10,
        sort: 'dataAgendamento',
        direction: 'asc',
      };

      if (debouncedCidade) {
        params.cidade = debouncedCidade;
      }

      if (esporte && esporte !== '') {
        params.esporte = esporte;
      }

      const response = await getAllJogosAbertos(params);

      if (isRefresh || pageNumber === 0) {
        setJogos(response.content);
      } else {
        setJogos(prev => [...prev, ...response.content]);
      }

      setTotalElements(response.totalElements);
      setHasMore(!response.last);
    } catch (error) {
      console.error('Erro ao buscar jogos abertos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os jogos abertos.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setPage(0);
    fetchJogos(0);
  }, [debouncedCidade, esporte]);

  const handleRefresh = () => {
    setPage(0);
    fetchJogos(0, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchJogos(nextPage);
    }
  };

  const handleSolicitarEntrada = async (agendamentoId: number) => {
    if (solicitandoEntrada) return;

    Alert.alert(
      'Solicitar Entrada',
      'Deseja solicitar entrada neste jogo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              setSolicitandoEntrada(true);
              await solicitarEntrada(agendamentoId);

              Alert.alert(
                'Sucesso!',
                'Sua solicitação foi enviada.',
                [
                  { 
                    text: 'OK', 
                    onPress: () => fetchJogos(0) 
                  }
                ]
              );
            } 
            catch (error: any) {
              Alert.alert('Aviso', error.message);
            } 
            finally {
              setSolicitandoEntrada(false);
            }
          },
        },
      ]
    );
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
          <Text className="text-gray-500 mt-3">Carregando jogos...</Text>
        </VStack>
      );
    }

    if (!loading && jogos.length === 0) {
      return (
        <VStack className="flex-1 items-center justify-center py-20 px-7">
          <Text className="text-gray-500 text-center text-base">
            Nenhum jogo aberto encontrado.
          </Text>
          <Text className="text-gray-400 text-center text-sm mt-2">
            Tente ajustar os filtros ou volte mais tarde.
          </Text>
        </VStack>
      );
    }

    return null;
  };

  const listHeaderComponent = (
    <JogosAbertosListHeader
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
        data={jogos}
        keyExtractor={item => item.agendamentoId.toString()}
        renderItem={({ item }) => (
          <VStack className="px-7">
            <JogoAbertoCard
              jogo={item}
              onEntrar={handleSolicitarEntrada}
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