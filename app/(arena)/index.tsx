import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/layout/AppHeader';
import { PieChart } from 'react-native-gifted-charts';
import { TrendingUp, TrendingDown, ChevronDown } from 'lucide-react-native';
import api from '@/services/api';
import { useFocusEffect } from 'expo-router';
import { formatCurrency } from '@/context/functions/formatters';

const CHART_COLORS = ['#15A01A', '#06b6d4', '#2563eb', '#f59e0b', '#ef4444', '#8b5cf6'];

const FILTER_OPTIONS = [
  { label: 'Últimos 7 dias', value: 7 },
  { label: 'Últimos 15 dias', value: 15 },
  { label: 'Últimos 30 dias', value: 30 },
  { label: 'Este mês', value: 0 },
];

interface QuadraEstatistica {
  nomeQuadra: string;
  totalReservas: number;
}

interface DashboardData {
  nomeArena: string;
  receitaDoMes: number;
  percentualReceitaVsMesAnterior: number;
  agendamentosHoje: number;
  novosClientes: number;
  diferencaNovosClientesVsSemanaAnterior: number;
  reservasPorQuadra?: QuadraEstatistica[];
}

export default function DashboardScreen() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [selectedDays, setSelectedDays] = useState(30); 
  const [showFilterModal, setShowFilterModal] = useState(false);

  const fetchDashboard = async (dias: number) => {
    try {
      const response = await api.get('/arenas/dashboard', { params: { dias } });
      setData(response.data);
    } catch (error) {
      console.error("Erro ao buscar dashboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboard(selectedDays);
    }, [selectedDays]) 
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard(selectedDays);
  };

  const pieData = data?.reservasPorQuadra?.map((item, index) => ({
    value: item.totalReservas,
    color: CHART_COLORS[index % CHART_COLORS.length],
    text: `${item.totalReservas}`,
    nombre: item.nomeQuadra 
  })) || [];

  const totalReservasGrafico = pieData.reduce((acc, curr) => acc + curr.value, 0);

  const getCurrentLabel = () => FILTER_OPTIONS.find(o => o.value === selectedDays)?.label;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <AppHeader />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#15A01A']} />
        }
      >
        <View className="px-6 pt-6">
          <Text className="text-2xl font-bold text-gray-800 mb-6">
            Olá, {data?.nomeArena || 'Arena'}
          </Text>

          <View className="flex-row justify-between items-end mb-4">
            <Text className="text-lg font-semibold text-gray-700">Visão geral</Text>
            
            <TouchableOpacity 
              onPress={() => setShowFilterModal(true)}
              className="flex-row items-center" 
            >
              <Text className="text-xs text-gray-500 mr-1">
                {getCurrentLabel()}
              </Text>
              <ChevronDown size={14} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {loading && !refreshing ? (
             <View className="h-40 justify-center items-center">
                <ActivityIndicator size="large" color="#15A01A" />
             </View>
          ) : (
            <>
              <View className="flex-row gap-4 mb-8">
                <View className="flex-1 bg-green-50 p-4 rounded-2xl border border-green-100">
                  <Text className="text-gray-600 font-medium mb-2">Faturamento</Text>
                  <View className="flex-row items-baseline flex-wrap">
                    <Text className="text-lg font-bold text-gray-900 mr-2">
                      {data ? formatCurrency(String(data.receitaDoMes * 100)) : 'R$ 0,00'}
                    </Text>
                  </View>
                  
                  <View className="flex-row items-center mt-2">
                     {(data?.percentualReceitaVsMesAnterior || 0) >= 0 ? (
                        <>
                            <TrendingUp size={14} color="#15A01A" />
                            <Text className="text-xs font-bold text-green-700 ml-1">
                            +{data?.percentualReceitaVsMesAnterior?.toFixed(1)}%
                            </Text>
                        </>
                     ) : (
                        <>
                            <TrendingDown size={14} color="#dc2626" />
                            <Text className="text-xs font-bold text-red-600 ml-1">
                            {data?.percentualReceitaVsMesAnterior?.toFixed(1)}%
                            </Text>
                        </>
                     )}
                  </View>
                </View>

                <View className="flex-1 bg-green-50 p-4 rounded-2xl border border-green-100">
                  <Text className="text-gray-600 font-medium mb-2">Reservas</Text>
                  <View className="flex-row items-baseline">
                    <Text className="text-2xl font-bold text-gray-900 mr-2">
                      {totalReservasGrafico}
                    </Text>
                  </View>
                   <View className="flex-row items-center mt-2">
                    <TrendingUp size={14} color="#15A01A" />
                    <Text className="text-xs text-green-700 ml-1">
                       Confirmadas
                    </Text>
                  </View>
                </View>
              </View>

              <Text className="text-lg font-semibold text-gray-700 mb-6">Quadras</Text>

              {pieData.length > 0 ? (
                <View className="items-center bg-white rounded-xl">
                  <PieChart
                    data={pieData}
                    donut
                    radius={80}
                    innerRadius={55}
                    showText={false}
                    focusOnPress
                    sectionAutoFocus
                    centerLabelComponent={() => {
                        return (
                            <View className="items-center justify-center">
                                <Text className="text-xl font-bold text-gray-800">{totalReservasGrafico}</Text>
                                <Text className="text-xs text-gray-500">Total</Text>
                            </View>
                        );
                    }}
                  />

                  <View className="w-full mt-8 gap-4 px-2">
                    {pieData.map((item, index) => (
                      <View key={index} className="flex-row items-center justify-between w-full border-b border-gray-100 pb-2 last:border-0">
                        <View className="flex-row items-center">
                          <View 
                            style={{ backgroundColor: item.color }} 
                            className="w-3 h-3 rounded-full mr-3" 
                          />
                          <Text className="text-gray-600 font-medium text-sm">
                            {item.nombre}
                          </Text>
                        </View>
                        <Text className="text-gray-900 font-bold text-sm">
                          {item.value} reservas
                        </Text>
                      </View>
                    ))}
                  </View>
                  
                  <View className="mt-8 self-end">
                     <Text className="text-green-600 font-bold text-sm underline">Gerar relatório</Text>
                  </View>

                </View>
              ) : (
                <View className="items-center justify-center h-40 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                  <Text className="text-gray-400">Nenhuma reserva encontrada neste período</Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showFilterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableOpacity 
          className="flex-1 bg-black/30 justify-center items-center"
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <View className="bg-white w-[80%] rounded-xl p-4 shadow-lg">
            <Text className="text-lg font-bold text-gray-800 mb-4 text-center">Selecionar Período</Text>
            {FILTER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                className={`py-3 border-b border-gray-100 ${selectedDays === option.value ? 'bg-green-50' : ''}`}
                onPress={() => {
                  setSelectedDays(option.value);
                  setLoading(true);
                  setShowFilterModal(false);
                }}
              >
                <Text className={`text-center font-medium ${selectedDays === option.value ? 'text-green-600' : 'text-gray-600'}`}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}