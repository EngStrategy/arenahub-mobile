import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Calendar, Clock, DollarSign, User, XCircle, CheckCircle, AlertCircle } from 'lucide-react-native';
import { AgendamentoArena, StatusAgendamentoArena } from '@/services/api/entities/agendamento';
import { formatTimeDisplay } from '@/utils/time';

interface Props {
  data: AgendamentoArena;
  onAction: (id: number, status: StatusAgendamentoArena) => void;
  isHistoryView: boolean;
}

export function AgendamentoArenaCard({ data, onAction, isHistoryView }: Props) {
  
  const getStatusColor = (status: StatusAgendamentoArena) => {
    switch (status) {
      case 'PAGO': return 'text-green-600 bg-green-100';
      case 'PENDENTE': return 'text-yellow-600 bg-yellow-100';
      case 'CANCELADO': return 'text-red-600 bg-red-100';
      case 'AUSENTE': return 'text-gray-600 bg-gray-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const handlePressAction = (newStatus: StatusAgendamentoArena) => {
    let title = "";
    let message = "";

    if (newStatus === 'PAGO') {
      title = "Confirmar Pagamento";
      message = "Deseja marcar este agendamento como pago?";
    } else if (newStatus === 'AUSENTE') {
      title = "Marcar Ausência";
      message = "O atleta não compareceu? Isso pode gerar penalidades.";
    } else if (newStatus === 'CANCELADO') {
      title = "Cancelar Agendamento";
      message = "Tem certeza que deseja cancelar este horário?";
    }

    Alert.alert(title, message, [
      { text: "Voltar", style: "cancel" },
      { text: "Confirmar", onPress: () => onAction(data.id, newStatus), style: newStatus === 'CANCELADO' ? 'destructive' : 'default' }
    ]);
  };

  return (
    <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      
      {/* Cabeçalho: Data e Status */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-md">
          <Calendar size={14} color="#4B5563" />
          <Text className="text-gray-600 text-xs font-medium ml-1">
            {new Date(data.dataAgendamento + 'T00:00:00').toLocaleDateString('pt-BR')}
          </Text>
        </View>
        <View className={`px-2 py-1 rounded-full ${getStatusColor(data.status).split(' ')[1]}`}>
          <Text className={`text-xs font-bold ${getStatusColor(data.status).split(' ')[0]}`}>
            {data.status}
          </Text>
        </View>
      </View>

      {/* Informações Principais */}
      <View className="flex-row items-center mb-4">
        <Image 
          source={{ uri: data.urlFotoAtleta || 'https://ui-avatars.com/api/?name=' + data.nomeAtleta }} 
          className="w-12 h-12 rounded-full bg-gray-200"
        />
        <View className="ml-3 flex-1">
          <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>{data.nomeAtleta}</Text>
          <Text className="text-sm text-gray-500">{data.nomeQuadra}</Text>
        </View>
      </View>

      {/* Detalhes: Horário e Valor */}
      <View className="flex-row justify-between items-center border-t border-gray-100 pt-3 mb-3">
        <View className="flex-row items-center">
          <Clock size={16} color="#15A01A" />
          <Text className="ml-2 text-gray-700 font-medium">
            {formatTimeDisplay(data.horarioInicio)} - {formatTimeDisplay(data.horarioFim)}
          </Text>
        </View>
        <View className="flex-row items-center">
          <DollarSign size={16} color="#15A01A" />
          <Text className="ml-1 text-gray-700 font-bold">
            R$ {data.valorTotal.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Ações (Apenas se não for visualização de histórico/finalizados) */}
      {!isHistoryView && data.status === 'PENDENTE' && (
        <View className="flex-row gap-2 mt-1">
          <TouchableOpacity 
            onPress={() => handlePressAction('PAGO')}
            className="flex-1 bg-green-500 py-2.5 rounded-lg flex-row justify-center items-center"
          >
            <CheckCircle size={18} color="white" />
            <Text className="text-white font-bold ml-2 text-sm">Pago</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => handlePressAction('AUSENTE')}
            className="flex-1 bg-orange-100 py-2.5 rounded-lg flex-row justify-center items-center"
          >
            <AlertCircle size={18} color="#C05621" />
            <Text className="text-orange-700 font-bold ml-2 text-sm">Ausente</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handlePressAction('CANCELADO')}
            className="w-12 bg-red-50 rounded-lg justify-center items-center"
          >
            <XCircle size={20} color="#E53E3E" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}