import { useState, useEffect, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, RefreshControl, Modal, ActivityIndicator, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter, X, Calendar as CalendarIcon, Check } from 'lucide-react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ModalSolicitacoesEntrada } from '@/components/modals/ModalSolicitacoesEntrada';
import {
  getAllAgendamentosAtleta,
  getMinhasParticipacoes,
  sairJogoAberto,
  dispensarAvaliacao,
  cancelarAgendamento,
  AgendamentoAtleta,
  AgendamentoAtletaQueryParams,
  ParticipacaoJogoAberto,
  StatusAgendamento,
  TipoAgendamentoFilter,
  getSolicitacoesJogo,
  aceitarSolicitacao,
  recusarSolicitacao,
  SolicitacaoJogoAberto
} from '@/services/api/entities/atletaAgendamento';

import { AgendamentoAtletaCard } from '@/components/cards/AgendamentoAtletaCard';
import { ParticipacaoCard } from '@/components/cards/ParticipacaoCard';
import { Heading } from '@/components/ui/heading';
import { ModalAvaliarAgendamento } from '@/components/modals/ModalAvaliarAgendamento';

type ViewType = 'ativos' | 'historico' | 'participacoes';

export default function MeusAgendamentosScreen() {
  // === Estados de Controle ===
  const [viewType, setViewType] = useState<ViewType>('ativos');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // === Dados ===
  const [agendamentos, setAgendamentos] = useState<AgendamentoAtleta[]>([]);
  const [participacoes, setParticipacoes] = useState<ParticipacaoJogoAberto[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // === Filtros ===
  const [modalVisible, setModalVisible] = useState(false);
  const [tipoAgendamento, setTipoAgendamento] = useState<TipoAgendamentoFilter>('AMBOS');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    
  // === Pickers de Data ===
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  // === Modal Avaliação ===
  const [agendamentoParaAvaliarId, setAgendamentoParaAvaliarId] = useState<number | null>(null);

  // === Modal Solicitações ===
  const [modalSolicitacoesOpen, setModalSolicitacoesOpen] = useState(false);
  const [solicitacoesLoading, setSolicitacoesLoading] = useState(false);
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoJogoAberto[]>([]);
  const [vagasAtuais, setVagasAtuais] = useState(0);
  const [agendamentoAtivoId, setAgendamentoAtivoId] = useState<number | null>(null);

  const isMountedRef = useRef(true);

  // === Carregamento inicial e troca de abas ===
  useEffect(() => {
    isMountedRef.current = true;
    handleFetchData(0, true);

    return () => {
      isMountedRef.current = false;
    };
  }, [viewType, tipoAgendamento, startDate, endDate]);

const handleVerSolicitacoes = async (id: number) => {
    setAgendamentoAtivoId(id);
    setModalSolicitacoesOpen(true);
    setSolicitacoesLoading(true);
    
    const agendamentoAtual = agendamentos.find(ag => ag.id === id);
    
    try {
        const data = await getSolicitacoesJogo(id);
        setSolicitacoes(data);
        
        setVagasAtuais(agendamentoAtual?.numeroJogadoresNecessarios ?? 0); 

    } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar as solicitações.");
        setModalSolicitacoesOpen(false);
        console.error("Erro ao buscar solicitações", error);
    } finally {
        setSolicitacoesLoading(false);
    }
};

  const handleAcceptSolicitacao = async (solicitacaoId: number) => {
    if (!agendamentoAtivoId) return;
    await aceitarSolicitacao(solicitacaoId);
    setSolicitacoes(prev => prev.map(solicitacao => solicitacao.id === solicitacaoId ? { ...solicitacao, status: 'ACEITO' } : solicitacao));
    setVagasAtuais(prev => prev - 1);
  };

  const handleDeclineSolicitacao = async (solicitacaoId: number) => {
    await recusarSolicitacao(solicitacaoId);
    setSolicitacoes(prev => prev.map(solicitacao => solicitacao.id === solicitacaoId ? { ...solicitacao, status: 'RECUSADO' } : solicitacao));
  };

  const handleFetchData = async (pageNumber: number, shouldRefresh = false) => {
    if (!isMountedRef.current) return;

    if (shouldRefresh) {
      setLoading(true);
      if (viewType !== 'participacoes') setAgendamentos([]);
    } else {
      if (loadingMore) return;
      setLoadingMore(true);
    }

    try {
      if (viewType === 'participacoes') {
        // Fetch Participações
        const data = await getMinhasParticipacoes();
        if (isMountedRef.current) setParticipacoes(data);
      } 
      else {  
        // Fetch Agendamentos
        const statusParam: StatusAgendamento | undefined = 
        viewType === 'historico' ? 'FINALIZADO' : 
        viewType === 'ativos' ? 'PENDENTE' : 
        undefined;

        const params: AgendamentoAtletaQueryParams = {
          page: pageNumber,
          size: 10,
          sort: 'dataAgendamento',
          direction: viewType === 'ativos' ? 'asc' : 'desc',
          status: statusParam,
          tipoAgendamento: tipoAgendamento,
          dataInicio: startDate ? startDate.toISOString().split('T')[0] : undefined,
          dataFim: endDate ? endDate.toISOString().split('T')[0] : undefined,
        };

        const response = await getAllAgendamentosAtleta(params);

        if (!isMountedRef.current) return;

        if (shouldRefresh) {
          setAgendamentos(response.content);
        } else {
          setAgendamentos(prev => [...prev, ...response.content]);
        }

        setHasMore(response.number < response.totalPages - 1);
        setPage(response.number);
      }

    } catch (error) {
      console.error("Erro ao buscar dados", error);
      Alert.alert("Erro", "Não foi possível carregar os dados.");
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
    handleFetchData(0, true);
  };

  const handleLoadMore = () => {
    if (viewType !== 'participacoes' && hasMore && !loadingMore && !loading) {
      handleFetchData(page + 1, false);
    }
  };

  // === Ações do Usuário ===

  const handleAbrirAvaliacao = (id: number) => {
    setAgendamentoParaAvaliarId(id);
  };

  const handleFecharAvaliacao = () => {
    setAgendamentoParaAvaliarId(null);
    handleRefresh();
  };

  const handleDispensarAvaliacao = async (id: number) => {
    Alert.alert("Dispensar", "Deseja dispensar a avaliação deste jogo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Dispensar", onPress: async () => {
          try {
            await dispensarAvaliacao(id);
            setAgendamentos(prev => prev.map(ag =>
              ag.id === id ? { ...ag, avaliacaoDispensada: true } : ag
            ));
          } catch (error) {
            Alert.alert("Erro", "Falha ao dispensar.");
            console.error("Erro ao dispensar avaliação", error);
          }
        }
      }
    ])
  };

  // === Lógica de Cancelamento ===
  const handleCancelarAgendamento = async (id: number) => {
    try {
      await cancelarAgendamento(id);
      Alert.alert("Sucesso", "Agendamento cancelado com sucesso.");

      setAgendamentos(prev => prev.filter(ag => ag.id !== id));
    } catch (error: any) {
      const backendMessage = error.response?.data?.message;
      const displayMessage = backendMessage || "Não foi possível cancelar o agendamento.";

      Alert.alert("Aviso", displayMessage);
    }
  };

  const handleSairParticipacao = async (solicitacaoId: number) => {
    try {
      await sairJogoAberto(solicitacaoId);
      Alert.alert("Sucesso", "Você saiu do jogo.");
      setParticipacoes(prev => prev.filter(p => p.solicitacaoId !== solicitacaoId));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sair do jogo.");
      console.error("Erro ao sair do jogo", error);
    }
  };

  // === Renderização de Filtros ===

  const clearFilters = () => {
    setTipoAgendamento('AMBOS');
    setStartDate(undefined);
    setEndDate(undefined);
    setModalVisible(false);
  };

  const renderFilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 h-[65%]">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-gray-800">Filtrar Histórico</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <X color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Filtro de Tipo */}
          <Text className="text-gray-600 font-bold mb-3">Tipo de Jogo</Text>
          <View className="flex-row gap-2 mb-6">
            {(['AMBOS', 'NORMAL', 'FIXO'] as TipoAgendamentoFilter[]).map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setTipoAgendamento(type)}
                className={`flex-1 py-3 rounded-xl border items-center ${tipoAgendamento === type ? 'bg-green-100 border-green-600' : 'bg-white border-gray-300'
                  }`}
              >
                <Text className={`font-bold ${tipoAgendamento === type ? 'text-green-700' : 'text-gray-500'}`}>
                  {type === 'AMBOS' ? 'Todos' : type.charAt(0) + type.slice(1).toLowerCase()}
                </Text>
                {tipoAgendamento === type && <View className="absolute top-2 right-2"><Check size={12} color="#15803d" /></View>}
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
            onConfirm={(date) => { setStartDate(date); setStartDatePickerVisibility(false); }}
            onCancel={() => setStartDatePickerVisibility(false)}
          />
          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={(date) => { setEndDate(date); setEndDatePickerVisibility(false); }}
            onCancel={() => setEndDatePickerVisibility(false)}
          />

          <View className="mt-auto flex-row gap-4">
            <TouchableOpacity onPress={clearFilters} className="flex-1 py-4 bg-gray-200 rounded-xl items-center">
              <Text className="text-gray-700 font-bold">Limpar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} className="flex-1 py-4 bg-green-600 rounded-xl items-center">
              <Text className="text-white font-bold">Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // === List Header ===

  const ListHeader = () => (
    <View className="gap-4">
      <View className="flex-row justify-between items-start pt-6">
        <View className="flex-1 mr-2 gap-2">
          <Heading className="text-2xl mb-1">Meus Jogos</Heading>
          <Text className="text-typography-500 mb-2">
            Acompanhe seus agendamentos, histórico e participações em jogos.
          </Text>
        </View>

        {viewType !== 'participacoes' && (
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className={`p-2 rounded-full mt-1 ${(tipoAgendamento !== 'AMBOS' || startDate) ? 'bg-green-100' : 'bg-gray-100'
              }`}
          >
            <Filter size={24} color={(tipoAgendamento !== 'AMBOS' || startDate) ? '#15803d' : '#374151'} />
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View className="flex-row bg-gray-100 p-1 rounded-xl">
        <TouchableOpacity
          onPress={() => setViewType('ativos')}
          className={`flex-1 py-2 rounded-lg items-center ${viewType === 'ativos' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
        >
          <Text className={`font-bold ${viewType === 'ativos' ? 'text-green-700' : 'text-gray-500'}`}>Ativos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setViewType('historico')}
          className={`flex-1 py-2 rounded-lg items-center ${viewType === 'historico' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
        >
          <Text className={`font-bold ${viewType === 'historico' ? 'text-green-700' : 'text-gray-500'}`}>Histórico</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setViewType('participacoes')}
          className={`flex-1 py-2 rounded-lg items-center ${viewType === 'participacoes' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
        >
          <Text className={`font-bold  ${viewType === 'participacoes' ? 'text-green-700' : 'text-gray-500'}`}>Participações</Text>
        </TouchableOpacity>
      </View>

      {/* Feedback de Filtros Ativos */}
      {viewType !== 'participacoes' && (tipoAgendamento !== 'AMBOS' || startDate) && (
        <View className="flex-row items-center flex-wrap mb-2">
          <Text className="text-xs text-gray-500 mr-2">Filtros:</Text>
          {tipoAgendamento !== 'AMBOS' && (
            <View className="bg-green-100 px-2 py-1 rounded mr-2">
              <Text className="text-green-700 text-xs">{tipoAgendamento}</Text>
            </View>
          )}
          {(startDate || endDate) && (
            <View className="bg-green-100 px-2 py-1 rounded">
              <Text className="text-green-700 text-xs">Período</Text>
            </View>
          )}
          <TouchableOpacity onPress={clearFilters} className="ml-auto">
            <Text className="text-xs text-red-500 font-bold">Limpar</Text>
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
          {viewType === 'participacoes'
            ? "Você não está participando de nenhum jogo público."
            : "Nenhum agendamento encontrado."}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white relative" edges={['top']}>

      {/* FlatList Condicional */}
      {viewType === 'participacoes' ? (
        <FlatList
          data={loading && !refreshing ? [] : participacoes}
          keyExtractor={(item) => item.solicitacaoId.toString()}
          ListHeaderComponent={ListHeader}
          renderItem={({ item }) => (
            <ParticipacaoCard
              data={item}
              onSair={handleSairParticipacao}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, gap: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#15A01A']} />}
          ListEmptyComponent={renderEmptyComponent}
        />
      ) : (
        <FlatList
          data={loading && !refreshing ? [] : agendamentos}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={ListHeader}
          renderItem={({ item }) => (
            <AgendamentoAtletaCard
              data={item}
              onAvaliar={handleAbrirAvaliacao}
              onDispensarAvaliacao={handleDispensarAvaliacao}
              onVerSolicitacoes={handleVerSolicitacoes}
              onCancelar={handleCancelarAgendamento}
              isHistoryView={viewType === 'historico'}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, gap: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#15A01A']} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={loadingMore ? <ActivityIndicator className="py-4" color="#15A01A" /> : null}
          ListEmptyComponent={renderEmptyComponent}
        />
      )}

      {renderFilterModal()}

      {/* Modal de Avaliação */}
      {agendamentoParaAvaliarId && (
        <ModalAvaliarAgendamento
          isOpen={agendamentoParaAvaliarId !== null}
          onClose={handleFecharAvaliacao}
          agendamentoId={agendamentoParaAvaliarId ?? 0}
        />
      )}

      <ModalSolicitacoesEntrada
        isOpen={modalSolicitacoesOpen}
        loading={solicitacoesLoading}
        solicitacoes={solicitacoes}
        vagasDisponiveis={vagasAtuais}
        onClose={() => setModalSolicitacoesOpen(false)}
        onAccept={handleAcceptSolicitacao}
        onDecline={handleDeclineSolicitacao}
      />

    </SafeAreaView>
  );
}