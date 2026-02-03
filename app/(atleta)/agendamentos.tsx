import { useState, useEffect, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter, Calendar as CalendarIcon } from 'lucide-react-native';
import { ModalSolicitacoesEntrada } from '@/components/modals/ModalSolicitacoesEntrada';
import {
  getAllAgendamentosAtleta,
  cancelarAgendamento,
  listarAgendamentosFixosFilhos,
  cancelarAgendamentoFixo
} from '@/services/api/endpoints/atletaAgendamento';
import { AgendamentoAtletaCard } from '@/components/cards/AgendamentoAtletaCard';
import { ParticipacaoCard } from '@/components/cards/ParticipacaoCard';
import { Heading } from '@/components/ui/heading';
import { ModalAvaliarAgendamento } from '@/components/modals/ModalAvaliarAgendamento';
import { ModalGerenciarFixo } from '@/components/modals/ModalGerenciarFixo';
import { AlertDialogView } from '@/components/layout/AlertDialogView';
import { useToastNotification } from '@/components/layout/useToastNotification';
import { ModalFiltroHistorico } from '@/components/modals/ModalFiltroHistorico';
import { aceitarSolicitacao, getMinhasParticipacoes, getSolicitacoesJogo, recusarSolicitacao, sairJogoAberto } from '@/services/api/endpoints/jogoAberto';
import { AgendamentoAtleta, AgendamentoAtletaQueryParams, StatusAgendamento, TipoAgendamentoFilter } from '@/types/Agendamento';
import { ParticipacaoJogoAberto, SolicitacaoJogoAberto } from '@/types/Jogo';

type ViewType = 'ativos' | 'historico' | 'participacoes';

export default function MeusAgendamentosScreen() {
  const { showToast } = useToastNotification();
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

  // === Modal Avaliação ===
  const [agendamentoParaAvaliarId, setAgendamentoParaAvaliarId] = useState<number | null>(null);

  // === Modal Solicitações ===
  const [modalSolicitacoesOpen, setModalSolicitacoesOpen] = useState(false);
  const [solicitacoesLoading, setSolicitacoesLoading] = useState(false);
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoJogoAberto[]>([]);
  const [vagasAtuais, setVagasAtuais] = useState(0);
  const [agendamentoAtivoId, setAgendamentoAtivoId] = useState<number | null>(null);

  // === Modal Gerenciar Fixo ===
  const [modalFixoOpen, setModalFixoOpen] = useState(false);
  const [filhosLoading, setFilhosLoading] = useState(false);
  const [agendamentosFilhos, setAgendamentosFilhos] = useState<AgendamentoAtleta[]>([]);
  const [selectedFixoId, setSelectedFixoId] = useState<number>(0);

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => { },
    confirmText: '',
    isLoading: false
  });

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
      showToast("Erro", "Não foi possível carregar as solicitações.", "error");
      setModalSolicitacoesOpen(false);
      console.error("Erro ao buscar solicitações: ", error);
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
      showToast("Erro", "Não foi possível carregar os dados.", "error");
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    }
  };

  // Função para abrir o modal de gerenciar agendamento fixo
  const handleGerenciarFixo = async (fixoId: number) => {
    setSelectedFixoId(fixoId);
    setModalFixoOpen(true);
    setFilhosLoading(true);
    try {
      const data = await listarAgendamentosFixosFilhos(fixoId);
      setAgendamentosFilhos(data);
    } catch (error: any) {
      showToast("Erro", error.response?.data?.message || "Falha ao carregar datas da recorrência.", "error");
      console.error("Erro ao buscar agendamentos filhos", error);
      setModalFixoOpen(false);
    } finally {
      setFilhosLoading(false);
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

  const handleApplyFilters = (tipo: TipoAgendamentoFilter, start?: Date, end?: Date) => {
    setTipoAgendamento(tipo);
    setStartDate(start);
    setEndDate(end);
    setModalVisible(false);
  };

  const handleClearFilters = () => {
    setTipoAgendamento('AMBOS');
    setStartDate(undefined);
    setEndDate(undefined);
    setModalVisible(false);
  };

  const handleDispensarAvaliacao = (id: number) => {
    setAlertConfig({
      isOpen: true,
      title: 'Dispensar Avaliação',
      description: 'Deseja realmente dispensar a avaliação deste jogo? Ela não aparecerá mais no seu histórico.',
      confirmText: 'Dispensar',
      isLoading: false,
      onConfirm: () => confirmarDispensar(id)
    });
  };

  const confirmarDispensar = async (id: number) => {
    setAlertConfig(prev => ({ ...prev, isLoading: true }));
    try {
      await handleDispensarAvaliacao(id);
      setAgendamentos(prev => prev.map(ag => ag.id === id ? { ...ag, avaliacaoDispensada: true } : ag));
      showToast("Sucesso", "Avaliação dispensada.", "success");
      setAlertConfig(prev => ({ ...prev, isOpen: false }));
    } catch (error: any) {
      showToast("Erro", error.response?.data?.message || "Não foi possível dispensar a avaliação.", "error");
    } finally {
      setAlertConfig(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleCancelarAgendamento = async (id: number) => {
    setAlertConfig({
      isOpen: true,
      title: 'Cancelar Agendamento',
      description: 'Deseja realmente cancelar este agendamento? Esta ação pode estar sujeita às regras de cancelamento da arena.',
      confirmText: 'Sim, Cancelar',
      isLoading: false,
      onConfirm: () => executarCancelamentoIndividual(id)
    });
  };

  // Cancelar Individual - Dentro do Modal Fixo
  const handleCancelarIndividualNoModal = async (id: number, dataFormatada: string) => {
    setAlertConfig({
      isOpen: true,
      title: 'Cancelar Agendamento',
      description: `Deseja cancelar o agendamento do dia ${dataFormatada}?`,
      confirmText: 'Sim, Cancelar',
      isLoading: false,
      onConfirm: () => executarCancelamentoIndividual(id)
    });
  };

  const executarCancelamentoIndividual = async (id: number) => {
    setAlertConfig(prev => ({ ...prev, isLoading: true }));
    try {
      await cancelarAgendamento(id);
      setAgendamentosFilhos(prev => prev.map(ag => ag.id === id ? { ...ag, status: 'CANCELADO' } : ag));
      setAgendamentos(prev => prev.map(ag => ag.id === id ? { ...ag, status: 'CANCELADO' } : ag));
      showToast("Sucesso", "Agendamento cancelado.");
      setAlertConfig(prev => ({ ...prev, isOpen: false }));
    } catch (error: any) {
      showToast("Erro", error.response?.data?.message || "Erro ao cancelar.", "error");
    } finally {
      setAlertConfig(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Cancelar Total - Recorrência
  const handleCancelarFixoTotal = async (fixoId: number) => {
    setAlertConfig({
      isOpen: true,
      title: 'CANCELAR RECORRÊNCIA',
      description: 'Tem certeza que deseja cancelar TODOS os agendamentos futuros desta série? Esta ação não pode ser desfeita.',
      confirmText: 'Cancelar Tudo',
      isLoading: false,
      onConfirm: () => executarCancelamentoTotal(fixoId)
    });
  };

  const executarCancelamentoTotal = async (fixoId: number) => {
    setAlertConfig(prev => ({ ...prev, isLoading: true }));
    try {
      await cancelarAgendamentoFixo(fixoId);
      setModalFixoOpen(false);
      setAgendamentos(prev => prev.filter(ag => ag.agendamentoFixoId !== fixoId));
      showToast(undefined, "Recorrência removida.", "success");
      setAlertConfig(prev => ({ ...prev, isOpen: false }));
    } catch (error: any) {
      showToast(undefined, error.response?.data?.message || "Erro ao cancelar recorrência.", "error");
    } finally {
      setAlertConfig(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleSairParticipacao = async (solicitacaoId: number) => {
    try {
      await sairJogoAberto(solicitacaoId);
      showToast("Sucesso", "Você saiu do jogo.", "success");
      setParticipacoes(prev => prev.filter(p => p.solicitacaoId !== solicitacaoId));
    } catch (error: any) {
      const backendMessage = error.response?.data?.message;
      const displayMessage = backendMessage || "Não foi possível sair do jogo.";

      showToast("Erro", displayMessage, "error");
      console.error("Erro ao sair do jogo", error);
    }
  };

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
          <TouchableOpacity onPress={handleClearFilters} className="ml-auto rounded px-2 py-1">
            <Text className="text-xs text-red-600 font-bold">Limpar</Text>
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
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 90, gap: 16 }}
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
              onGerenciarFixo={handleGerenciarFixo}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 90, gap: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#15A01A']} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={loadingMore ? <ActivityIndicator className="py-4" color="#15A01A" /> : null}
          ListEmptyComponent={renderEmptyComponent}
        />
      )}

      <ModalFiltroHistorico
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        initialTipo={tipoAgendamento}
        initialStart={startDate}
        initialEnd={endDate}
      />

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

      <ModalGerenciarFixo
        isOpen={modalFixoOpen}
        onClose={() => setModalFixoOpen(false)}
        loading={filhosLoading}
        agendamentosFilhos={agendamentosFilhos}
        onCancelIndividual={handleCancelarIndividualNoModal}
        onCancelTotal={handleCancelarFixoTotal}
        agendamentoFixoId={selectedFixoId}
      />

      <AlertDialogView
        isOpen={alertConfig.isOpen}
        onClose={() => !alertConfig.isLoading && setAlertConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={alertConfig.onConfirm}
        title={alertConfig.title}
        description={alertConfig.description}
        confirmText={alertConfig.confirmText}
        isLoading={alertConfig.isLoading}
      />

    </SafeAreaView>
  );
}