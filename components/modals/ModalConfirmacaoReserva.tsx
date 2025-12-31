import React, { useState, useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Switch, Alert, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Quadra, HorariosDisponiveis } from '@/context/types/Quadra';
import { createAgendamento } from '@/services/api/entities/agendamento';
import { formatarEsporte } from '@/constants/Quadra';

interface Props {
  visible: boolean;
  onClose: () => void;
  quadra: Quadra;
  data: Date;
  slotsSelecionados: HorariosDisponiveis[];
  onSuccess: () => void;
}

export function ModalConfirmacaoReserva({ visible, onClose, quadra, data, slotsSelecionados, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [esporte, setEsporte] = useState(quadra.tipoQuadra[0]);
  const [isFixo, setIsFixo] = useState(false);
  const [isPublico, setIsPublico] = useState(false);
  const [periodoFixo, setPeriodoFixo] = useState<"UM_MES" | "TRES_MESES" | "SEIS_MESES">("UM_MES");
  const [faltandoGente, setFaltandoGente] = useState(1);

  const slotsOrdenados = useMemo(() => {
    return [...slotsSelecionados].sort((a, b) => 
      a.horarioInicio.localeCompare(b.horarioInicio)
    );
  }, [slotsSelecionados]);

  const horaInicioExibicao = slotsOrdenados[0]?.horarioInicio;
  const horaFimExibicao = slotsOrdenados[slotsOrdenados.length - 1]?.horarioFim;

  const total = useMemo(() => {
    const base = slotsSelecionados.reduce((acc, curr) => acc + curr.valor, 0);
    const multiplicador = isFixo ? (periodoFixo === "UM_MES" ? 4 : periodoFixo === "TRES_MESES" ? 12 : 24) : 1;
    return base * multiplicador;
  }, [slotsSelecionados, isFixo, periodoFixo]);

  const handleConfirmar = async () => {
    setLoading(true);
    try {
      const payload = {
        quadraId: quadra.id,
        dataAgendamento: format(data, 'yyyy-MM-dd'),
        slotHorarioIds: slotsOrdenados.map(s => s.id),
        esporte: esporte,
        isFixo: isFixo,
        isPublico: isPublico,
        periodoFixo: isFixo ? periodoFixo : undefined,
        numeroJogadoresNecessarios: isPublico ? faltandoGente : 0,
      };

      await createAgendamento(payload);
      Alert.alert("Sucesso", "Reserva realizada com sucesso!");
      onSuccess();
    } catch (error: any) {
      Alert.alert("Erro", error.response?.data?.message || "Não foi possível realizar a reserva.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl h-[85%]">
          <View className="flex-row justify-between items-center p-6 border-b border-gray-100">
            <Text className="text-xl font-bold text-gray-900">Confirmar Reserva</Text>
            <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 rounded-full">
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <ScrollView className="p-6">
            {/* Resumo da Quadra */}
            <View className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <Text className="font-bold text-lg text-gray-800">{quadra.nomeQuadra}</Text>
              <Text className="text-gray-600 mt-1">
                {format(data, "dd 'de' MMMM", { locale: ptBR })} • {horaInicioExibicao} às {horaFimExibicao}
              </Text>
            </View>

            {/* Seletor de Esporte */}
            <Text className="font-bold text-gray-700 mb-3">Selecione o Esporte</Text>
            <View className="flex-row flex-wrap gap-2 mb-6">
              {quadra.tipoQuadra.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setEsporte(item)}
                  className={`px-4 py-2 rounded-full border ${esporte === item ? 'bg-green-100 border-green-600' : 'bg-white border-gray-300'}`}
                >
                  <Text className={esporte === item ? 'text-green-700 font-bold' : 'text-gray-600'}>
                    {formatarEsporte(item)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Toggles */}
            <View className="space-y-4 mb-8">
              <View className="flex-row justify-between items-center bg-gray-50 p-4 rounded-xl">
                <View className="flex-1 pr-4">
                  <Text className="font-bold text-gray-800">Horário Fixo</Text>
                  <Text className="text-xs text-gray-500">Repetir semanalmente por um período</Text>
                </View>
                <Switch 
                    value={isFixo} 
                    onValueChange={(v) => { setIsFixo(v); if(v) setIsPublico(false); }}
                    trackColor={{ false: '#d1d5db', true: '#10b981' }}
                />
              </View>

              {isFixo && (
                <View className="flex-row justify-between mt-2">
                  {(['UM_MES', 'TRES_MESES', 'SEIS_MESES'] as const).map((p) => (
                    <TouchableOpacity
                      key={p}
                      onPress={() => setPeriodoFixo(p)}
                      className={`flex-1 mx-1 p-2 rounded-lg border items-center ${periodoFixo === p ? 'bg-green-600 border-green-600' : 'bg-white border-gray-300'}`}
                    >
                      <Text className={`text-xs ${periodoFixo === p ? 'text-white font-bold' : 'text-gray-600'}`}>
                        {p === 'UM_MES' ? '1 Mês' : p === 'TRES_MESES' ? '3 Meses' : '6 Meses'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <View className="flex-row justify-between items-center bg-gray-50 p-4 rounded-xl mt-4">
                <View className="flex-1 pr-4">
                  <Text className="font-bold text-gray-800">Tá faltando gente?</Text>
                  <Text className="text-xs text-gray-500">Tornar reserva pública para outros atletas</Text>
                </View>
                <Switch 
                    value={isPublico} 
                    onValueChange={(v) => { setIsPublico(v); if(v) setIsFixo(false); }}
                    trackColor={{ false: '#d1d5db', true: '#10b981' }}
                />
              </View>

              {isPublico && (
                <View className="flex-row items-center justify-between bg-white border border-gray-200 p-3 rounded-xl mt-2">
                  <Text className="text-gray-700">Quantos jogadores faltam?</Text>
                  <View className="flex-row items-center gap-4">
                    <TouchableOpacity onPress={() => setFaltandoGente(Math.max(1, faltandoGente - 1))} className="p-1 bg-gray-100 rounded">
                      <Ionicons name="remove" size={20} color="black" />
                    </TouchableOpacity>
                    <Text className="font-bold text-lg">{faltandoGente}</Text>
                    <TouchableOpacity onPress={() => setFaltandoGente(faltandoGente + 1)} className="p-1 bg-gray-100 rounded">
                      <Ionicons name="add" size={20} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Rodapé de Ação */}
          <View className="p-6 border-t border-gray-100 bg-white">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-500 font-medium">Total</Text>
              <Text className="text-2xl font-bold text-green-600">
                {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleConfirmar}
              disabled={loading}
              className="bg-green-600 py-4 rounded-2xl items-center flex-row justify-center"
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <MaterialCommunityIcons name="check-circle-outline" size={20} color="white" className="mr-2" />
                  <Text className="text-white font-bold text-lg"> Pagar na Arena</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}