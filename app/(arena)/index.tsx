import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, Modal, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/layout/AppHeader';
import { PieChart } from 'react-native-gifted-charts';
import { TrendingUp, TrendingDown, ChevronDown } from 'lucide-react-native';
import api from '@/services/api';
import { useFocusEffect } from 'expo-router';
import { formatCurrency } from '@/context/functions/formatters';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { getAllAgendamentosArena } from '@/services/api/entities/agendamento';

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
  
  const [loadingPdf, setLoadingPdf] = useState(false);

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

  const gerarRelatorioPDF = async () => {
    if (loadingPdf) return;
    setLoadingPdf(true);

    try {
      const dataFim = new Date();
      let dataInicio = new Date();

      if (selectedDays === 0) {
        dataInicio = new Date(dataFim.getFullYear(), dataFim.getMonth(), 1);
      } else {
        dataInicio.setDate(dataFim.getDate() - selectedDays);
      }

      const formatApiDate = (date: Date) => date.toISOString().split('T')[0];
      const formatDisplayDate = (date: Date) => date.toLocaleDateString('pt-BR');

      const response = await getAllAgendamentosArena({
        page: 0,
        size: 1000, 
        dataInicio: formatApiDate(dataInicio),
        dataFim: formatApiDate(dataFim),
        sort: 'dataAgendamento',
        direction: 'desc'
      });

      const listaAgendamentos = response.content;

      if (listaAgendamentos.length === 0) {
        Alert.alert("Aviso", "Não há agendamentos neste período para gerar relatório.");
        setLoadingPdf(false);
        return;
      }

      const agendamentosPagos = listaAgendamentos.filter(a => a.status === 'FINALIZADO' || a.status === 'PAGO');
      const receitaTotal = agendamentosPagos.reduce((acc, curr) => acc + curr.valorTotal, 0);
      const ticketMedio = agendamentosPagos.length > 0 ? (receitaTotal / agendamentosPagos.length) : 0;
      
      const agendamentosCancelados = listaAgendamentos.filter(a => a.status === 'CANCELADO').length;
      const totalReservas = listaAgendamentos.length;

      const horariosCount: Record<string, number> = {};
      listaAgendamentos.forEach((item) => {
        const hora = item.horarioInicio?.split(':')[0] + 'h'; 
        horariosCount[hora] = (horariosCount[hora] || 0) + 1;
      });
      const topHorarios = Object.entries(horariosCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);

      const clientesCount: Record<string, {qtd: number, valor: number}> = {};
      listaAgendamentos.forEach((item: any) => {
        const nome = item.nomeAtleta || 'Cliente Externo';
        if (!clientesCount[nome]) clientesCount[nome] = { qtd: 0, valor: 0 };
        clientesCount[nome].qtd += 1;
        if (item.status === 'FINALIZADO' || item.status === 'PAGO') {
            clientesCount[nome].valor += item.valorTotal;
        }
      });
      const topClientes = Object.entries(clientesCount)
        .sort(([, a], [, b]) => b.valor - a.valor)
        .slice(0, 3);

      const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();  

      const htmlContent = `
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #1e293b; background: #fff; }
              
              /* Header */
              .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #166534; padding-bottom: 20px; margin-bottom: 30px; }
              .header-info h1 { color: #166534; margin: 0 0 5px 0; font-size: 26px; font-weight: 700; }
              .header-info p { margin: 2px 0; color: #475569; font-size: 14px; }
              
              /* Logo Box */
              .logo-box { width: 60px; height: 60px; background: #f0fdf4; border: 1px solid #dcfce7; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #166534; font-weight: bold; font-size: 24px; }
              
              /* KPIs / Cards - Uppercase removido */
              .kpi-container { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 40px; }
              .kpi-card { flex: 1; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; border-left: 5px solid #166534; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
              .kpi-label { font-size: 13px; letter-spacing: 0.3px; color: #64748b; margin-bottom: 8px; font-weight: 600; }
              .kpi-value { font-size: 24px; font-weight: 800; color: #0f172a; }
              .kpi-sub { font-size: 12px; color: #475569; margin-top: 6px; font-weight: 500; }
              
              /* Seções - Uppercase removido e Emojis retirados */
              .analytics-row { display: flex; gap: 40px; margin-bottom: 40px; }
              .analytics-col { flex: 1; }
              .section-title { font-size: 16px; font-weight: bold; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 15px; letter-spacing: 0.3px; }
              
              /* Listas */
              .simple-list { list-style: none; padding: 0; margin: 0; }
              .simple-list li { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #334155; }
              /* Rank number mantido apenas como #N, sem emoji */
              .rank-num { font-weight: 800; color: #166534; margin-right: 10px; font-size: 14px; }

              /* Tabela Principal - Uppercase removido */
              table { width: 100%; border-collapse: collapse; font-size: 12px; }
              th { text-align: left; background-color: #f8fafc; color: #475569; padding: 12px; font-weight: 700; border-bottom: 2px solid #e2e8f0; }
              td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #334155; vertical-align: middle; }
              tr:nth-child(even) { background-color: #fafafa; }
              
              /* Badges - Uppercase removido */
              .status-badge { padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.3px; }
              .status-finalizado { background: #dcfce7; color: #14532d; border: 1px solid #bbf7d0; }
              .status-pendente { background: #fef9c3; color: #713f12; border: 1px solid #fde047; }
              .status-cancelado { background: #fee2e2; color: #7f1d1d; border: 1px solid #fecaca; }

              .footer { margin-top: 60px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            </style>
          </head>
          <body>
            
            <div class="header">
              <div class="header-info">
                <h1>Relatório Gerencial</h1>
                <p><strong>${data?.nomeArena || 'Minha Arena'}</strong></p>
                <p>Período: ${formatDisplayDate(dataInicio)} a ${formatDisplayDate(dataFim)}</p>
              </div>
            </div>

            <div class="kpi-container">
              <div class="kpi-card">
                <div class="kpi-label">Faturamento Total</div>
                <div class="kpi-value">${formatCurrency(String(receitaTotal * 100))}</div>
                <div class="kpi-sub">${agendamentosPagos.length} reservas pagas</div>
              </div>
              <div class="kpi-card" style="border-left-color: #3b82f6;">
                <div class="kpi-label">Ticket Médio</div>
                <div class="kpi-value">${formatCurrency(String(ticketMedio * 100))}</div>
                <div class="kpi-sub">Por reserva</div>
              </div>
              <div class="kpi-card" style="border-left-color: #ef4444;">
                <div class="kpi-label">Taxa Cancelamento</div>
                <div class="kpi-value">${totalReservas > 0 ? ((agendamentosCancelados / totalReservas) * 100).toFixed(1) : 0}%</div>
                <div class="kpi-sub">${agendamentosCancelados} cancelados</div>
              </div>
            </div>

            <div class="analytics-row">
              <div class="analytics-col">
                <div class="section-title">Horários de Pico</div>
                <ul class="simple-list">
                  ${topHorarios.length > 0 ? topHorarios.map((h, i) => `
                    <li>
                      <span><span class="rank-num">#${i + 1}</span> ${h[0]}</span>
                      <strong>${h[1]} reservas</strong>
                    </li>
                  `).join('') : '<li style="color: #94a3b8; font-style: italic;">Sem dados suficientes</li>'}
                </ul>
              </div>

              <div class="analytics-col">
                <div class="section-title">Top Clientes (Receita)</div>
                <ul class="simple-list">
                  ${topClientes.length > 0 ? topClientes.map((c, i) => `
                    <li>
                      <span><span class="rank-num">#${i + 1}</span> ${(c[0] as string).substring(0, 20)}</span>
                      <strong>${formatCurrency(String(c[1].valor * 100))}</strong>
                    </li>
                  `).join('') : '<li style="color: #94a3b8; font-style: italic;">Sem dados suficientes</li>'}
                </ul>
              </div>
            </div>

            <div class="section-title">Extrato Detalhado</div>
            <table>
              <thead>
                <tr>
                  <th width="18%">Data</th>
                  <th width="10%">Hora</th>
                  <th width="32%">Cliente</th>
                  <th width="25%">Quadra</th>
                  <th width="15%">Valor</th>
                </tr>
              </thead>
              <tbody>
                ${listaAgendamentos.map(item => {
                  const statusClass = 
                    item.status === 'FINALIZADO' || item.status === 'PAGO' ? 'status-finalizado' :
                    item.status === 'CANCELADO' ? 'status-cancelado' : 'status-pendente';
                  
                  return `
                    <tr>
                      <td>${new Date(item.dataAgendamento + 'T' + '00:00:00').toLocaleDateString('pt-BR')}</td>
                      <td style="font-weight: bold; color: #475569;">${item.horarioInicio?.substring(0,5)}</td>
                      <td><strong>${(item as any).nomeAtleta || 'Cliente Externo'}</strong></td>
                      <td style="color: #64748b;">${item.nomeQuadra}</td>
                      <td>
                        <span style="font-weight:bold; color:#0f172a;">${formatCurrency(String(item.valorTotal * 100))}</span>
                        <div style="margin-top:4px;"><span class="status-badge ${statusClass}">${capitalize(item.status)}</span></div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>

            <div class="footer">
              Relatório confidencial • Gerado via ArenaHub App em ${new Date().toLocaleString('pt-BR')}
            </div>

          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });

    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      Alert.alert("Erro", "Não foi possível gerar o relatório. Tente novamente.");
    } finally {
      setLoadingPdf(false);
    }
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
                  
                  <View className="mt-4 self-end">
                     <TouchableOpacity 
                        onPress={gerarRelatorioPDF}
                        disabled={loadingPdf}
                        className="flex-row items-center gap-2 py-2 px-3 rounded-lg active:bg-gray-50"
                     >
                        
                        <Text className="text-green-600 font-bold text-sm underline">
                           {loadingPdf ? 'Gerando...' : 'Gerar relatório'}
                        </Text>
                     </TouchableOpacity>
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

      {/* Modal de Filtro (IGUAL AO SEU CÓDIGO) */}
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