import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, RefreshControl, Modal, ActivityIndicator, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter, X, Calendar as CalendarIcon } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker"; 

import { 
  getAllAgendamentosArena, 
  updateStatusAgendamentoArena, 
  AgendamentoArena, 
  AgendamentoArenaQueryParams,
  StatusAgendamentoArena
} from '@/services/api/entities/agendamento';
import { getQuadrasByArena } from '@/services/api/entities/quadra'; 
import type { Quadra } from '@/context/types/Quadra';
import { AgendamentoArenaCard } from '@/components/cards/AgendamentoArenaCard';
import { Heading } from '@/components/ui/heading'; 

type ViewType = 'ativos' | 'historico';

export default function AgendamentosScreen() {
  // Estados de Controle
  const [viewType, setViewType] = useState<ViewType>('ativos');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Dados
  const [agendamentos, setAgendamentos] = useState<AgendamentoArena[]>([]);
  const [quadras, setQuadras] = useState<Quadra[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Filtros
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuadraId, setSelectedQuadraId] = useState<number | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // Pickers de Data
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  // Ref para evitar chamadas duplicadas
  const isMountedRef = useRef(true);

  // Carregamento inicial
  useEffect(() => {
    isMountedRef.current = true;
    fetchQuadras();
    fetchAgendamentos(0, true);

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Recarrega quando viewType muda
  useEffect(() => {
    if (isMountedRef.current) {
      setPage(0);
      setAgendamentos([]); 
      fetchAgendamentos(0, true);
    }
  }, [viewType]);

  // Recarrega quando filtros mudam
  useEffect(() => {
    if (isMountedRef.current) {
      setPage(0);
      setAgendamentos([]); 
      fetchAgendamentos(0, true);
    }
  }, [selectedQuadraId, startDate, endDate]);

  const fetchQuadras = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        const arenaId = userData.id;
        const data = await getQuadrasByArena(arenaId);
        if (isMountedRef.current) {
          setQuadras(data);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar quadras", error);
    }
  };

  const fetchAgendamentos = async (pageNumber: number, shouldRefresh = false) => {
    if (!isMountedRef.current) return;
    
    if (shouldRefresh) {
      setLoading(true);
    } else {
      if (loadingMore) return;
      setLoadingMore(true);
    }

    try {
      const statusParam: StatusAgendamentoArena | undefined = viewType === 'historico' 
        ? 'FINALIZADO' 
        : 'PENDENTE'; 

      const params: AgendamentoArenaQueryParams = {
        page: pageNumber,
        size: 10,
        sort: 'dataAgendamento',
        direction: viewType === 'ativos' ? 'asc' : 'desc',
        status: statusParam,
        quadraId: selectedQuadraId,
        dataInicio: startDate ? startDate.toISOString().split('T')[0] : undefined,
        dataFim: endDate ? endDate.toISOString().split('T')[0] : undefined,
      };

      const response = await getAllAgendamentosArena(params);

      if (!isMountedRef.current) return;

      if (shouldRefresh) {
        setAgendamentos(response.content);
      } else {
        setAgendamentos(prev => [...prev, ...response.content]);
      }

      setHasMore(response.number < response.totalPages - 1);
      setPage(response.number);

    } catch (error) {
      console.error("Erro ao buscar agendamentos", error);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(0);
    fetchAgendamentos(0, true);
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore && !loading) {
      fetchAgendamentos(page + 1, false);
    }
  };

  const applyFilters = () => {
    setModalVisible(false);
  };

  const clearFilters = () => {
    setSelectedQuadraId(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
    setModalVisible(false);
  };

  const handleStatusAction = async (id: number, newStatus: StatusAgendamentoArena) => {
    try {
      await updateStatusAgendamentoArena(id, newStatus);
      Alert.alert("Sucesso", "Status atualizado!");
      setAgendamentos(prev => prev.filter(ag => ag.id !== id));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o status.");
    }
  };

  const renderFilterModal = () => (
    <Modal 
      animationType="slide" 
      transparent={true} 
      visible={modalVisible} 
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 h-[75%]">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-gray-800">Filtrar Agendamentos</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <X color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Filtro de Quadra */}
          <Text className="text-gray-600 font-bold mb-3">Quadra</Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            <TouchableOpacity 
              onPress={() => setSelectedQuadraId(undefined)}
              className={`px-4 py-2 rounded-full border ${
                !selectedQuadraId 
                  ? 'bg-green-100 border-green-600' 
                  : 'bg-white border-gray-300'
              }`}
            >
              <Text className={`${!selectedQuadraId ? 'text-green-700 font-bold' : 'text-gray-600 font-normal'}`}>
                Todas
              </Text>
            </TouchableOpacity>
            {quadras.map(q => (
              <TouchableOpacity 
                key={q.id} 
                onPress={() => setSelectedQuadraId(q.id)}
                className={`px-4 py-2 rounded-full border ${
                  selectedQuadraId === q.id 
                    ? 'bg-green-100 border-green-600' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <Text className={`${selectedQuadraId === q.id ? 'text-green-700 font-bold' : 'text-gray-600 font-normal'}`}>
                  {q.nomeQuadra}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Filtro de Período */}
          <Text className="text-gray-600 font-bold mb-3">Período</Text>
          <View className="flex-row gap-4 mb-8">
            <TouchableOpacity 
              onPress={() => setStartDatePickerVisibility(true)} 
              className="flex-1 p-3 border border-gray-300 rounded-lg flex-row items-center justify-between"
            >
              <Text className="text-gray-600">
                {startDate ? startDate.toLocaleDateString('pt-BR') : 'Data Início'}
              </Text>
              <CalendarIcon size={18} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setEndDatePickerVisibility(true)} 
              className="flex-1 p-3 border border-gray-300 rounded-lg flex-row items-center justify-between"
            >
              <Text className="text-gray-600">
                {endDate ? endDate.toLocaleDateString('pt-BR') : 'Data Fim'}
              </Text>
              <CalendarIcon size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            onConfirm={(date) => { 
              setStartDate(date); 
              setStartDatePickerVisibility(false); 
            }}
            onCancel={() => setStartDatePickerVisibility(false)}
          />
          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={(date) => { 
              setEndDate(date); 
              setEndDatePickerVisibility(false); 
            }}
            onCancel={() => setEndDatePickerVisibility(false)}
          />

          <View className="mt-auto flex-row gap-4">
            <TouchableOpacity 
              onPress={clearFilters} 
              className="flex-1 py-4 bg-gray-200 rounded-xl items-center"
            >
              <Text className="text-gray-700 font-bold">Limpar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={applyFilters} 
              className="flex-1 py-4 bg-green-600 rounded-xl items-center"
            >
              <Text className="text-white font-bold">Aplicar Filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const ListHeader = () => (
    <View className="gap-4">
      {/* Header e Subtítulo */}
      <View className="flex-row justify-between items-start pt-6">
        <View className="flex-1 mr-2 gap-2">
            <Heading className="text-2xl mb-1">Agenda</Heading>
            <Text className="text-typography-500 mb-2">
                Gerencie sua agenda e consulte o histórico de reservas da sua arena.
            </Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => setModalVisible(true)}
          className={`p-2 rounded-full mt-1 ${
            (selectedQuadraId || startDate) ? 'bg-green-100' : 'bg-gray-100'
          }`}
        >
          <Filter size={24} color={(selectedQuadraId || startDate) ? '#15803d' : '#374151'} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View className="flex-row bg-gray-100 p-1 rounded-xl">
        <TouchableOpacity 
          onPress={() => setViewType('ativos')}
          className={`flex-1 py-2 rounded-lg items-center ${
            viewType === 'ativos' ? 'bg-white shadow-sm' : 'bg-transparent'
          }`}
        >
          <Text className={`font-bold ${
            viewType === 'ativos' ? 'text-green-700' : 'text-gray-500'
          }`}>
            Ativos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setViewType('historico')}
          className={`flex-1 py-2 rounded-lg items-center ${
            viewType === 'historico' ? 'bg-white shadow-sm' : 'bg-transparent'
          }`}
        >
          <Text className={`font-bold ${
            viewType === 'historico' ? 'text-green-700' : 'text-gray-500'
          }`}>
            Histórico
          </Text>
        </TouchableOpacity>
      </View>

      {/* Feedback de Filtros Ativos */}
      {(selectedQuadraId || startDate) && (
         <View className="flex-row items-center flex-wrap mb-2">
           <Text className="text-xs text-gray-500 mr-2">Filtros:</Text>
           {selectedQuadraId && (
             <View className="bg-green-100 px-2 py-1 rounded mr-2">
               <Text className="text-green-700 text-xs">Quadra Específica</Text>
             </View>
           )}
           {(startDate || endDate) && (
             <View className="bg-green-100 px-2 py-1 rounded">
               <Text className="text-green-700 text-xs">Período</Text>
             </View>
           )}
           <TouchableOpacity onPress={clearFilters} className="ml-auto">
             <Text className="text-xs text-red-500 font-bold">
               Limpar
             </Text>
           </TouchableOpacity>
         </View>
      )}
    </View>
  );

  const renderEmptyComponent = () => {
    if (loading && !refreshing) {
      return (
        <View className="flex-1 justify-center items-center py-20">
          <ActivityIndicator size="large" color="#15A01A" />
        </View>
      );
    }
    
    return (
      <View className="items-center justify-center mt-10 opacity-50">
        <CalendarIcon size={48} color="gray" />
        <Text className="text-gray-500 mt-4 text-center px-4">
          Nenhum agendamento encontrado.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white relative" edges={['top']}>
      <FlatList
        data={loading && !refreshing ? [] : agendamentos} 
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={ListHeader}
        renderItem={({ item }) => (
          <AgendamentoArenaCard 
            data={item} 
            onAction={handleStatusAction}
            isHistoryView={viewType === 'historico'}
          />
        )}
        contentContainerStyle={{
            paddingHorizontal: 24, 
            paddingBottom: 24,
            gap: 16 
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#15A01A']} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={loadingMore ? <ActivityIndicator className="py-4" color="#15A01A" /> : null}
        ListEmptyComponent={renderEmptyComponent}
      />

      {renderFilterModal()}
    </SafeAreaView>
  );
}