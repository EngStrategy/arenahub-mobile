import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Calendar, Clock, MapPin, Users, UserPlus, Phone } from 'lucide-react-native';
import { JogoAberto } from '@/services/api/entities/atletaAgendamento'

interface Props {
  jogo: JogoAberto;
  onEntrar: (agendamentoId: number) => void;
}

export function JogoAbertoCard({ jogo, onEntrar }: Props) {
  const formatarEsporte = (esporte: string) => {
    return esporte.replace(/_/g, ' ');
  };

  return (
    <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
      {/* Cabeçalho: Data e Vagas */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-md">
          <Calendar size={14} color="#4B5563" />
          <Text className="text-gray-600 text-xs font-medium ml-1">
            {new Date(jogo.data + 'T00:00:00').toLocaleDateString('pt-BR')}
          </Text>
        </View>
        <View className="flex-row items-center bg-green-50 px-2 py-1 rounded-md">
          <Users size={14} color="#15A01A" />
          <Text className="text-green-700 text-xs font-bold ml-1">
            {jogo.vagasDisponiveis} {jogo.vagasDisponiveis === 1 ? 'vaga' : 'vagas'}
          </Text>
        </View>
      </View>

      {/* Info da Arena */}
      <View className="flex-row items-center mb-3">
        <Image 
          source={{ uri: jogo.urlFotoArena }} 
          className="w-14 h-14 rounded-lg bg-gray-200"
        />
        <View className="ml-3 flex-1">
          <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>
            {jogo.nomeArena} 
          </Text>
          <View className="flex-row items-center mt-0.5">
            <MapPin size={12} color="#6B7280" />
            <Text className="text-sm text-gray-500 ml-1" numberOfLines={1}>
              {jogo.cidade}
            </Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View className="border-t border-gray-100 my-3" />

      {/* Info do Organizador */}
      <View className="flex-row items-center mb-3">
        <Image 
          source={{ uri: jogo.urlFotoAtleta }} 
          className="w-10 h-10 rounded-full bg-gray-200"
        />
        <View className="ml-3 flex-1">
          <Text className="text-sm font-semibold text-gray-700">
            {jogo.nomeAtleta}
          </Text>
          <View className="flex-row items-center mt-0.5">
            <Phone size={12} color="#6B7280" />
            <Text className="text-xs text-gray-500 ml-1">
              {jogo.telefoneAtleta}
            </Text>
          </View>
        </View>
      </View>

      {/* Detalhes: Horário e Esporte */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <Clock size={16} color="#15A01A" />
          <Text className="ml-2 text-gray-700 font-medium">
            {jogo.horarioInicio.substring(0, 5)} - {jogo.horarioFim.substring(0, 5)}
          </Text>
        </View>
        <View className="bg-gray-100 px-3 py-1 rounded-md">
          <Text className="text-xs text-gray-600 font-medium">
            {formatarEsporte(jogo.esporte)}
          </Text>
        </View>
      </View>

      {/* Botão Entrar / Solicitado */}
      <TouchableOpacity 
        onPress={() => !jogo.jaSolicitado && onEntrar(jogo.agendamentoId)}
        disabled={jogo.jaSolicitado} 
        className={`${
          jogo.jaSolicitado ? 'bg-gray-400' : 'bg-green-600'
        } py-3 rounded-lg flex-row justify-center items-center shadow-sm`}
      >
        <UserPlus size={18} color="white" />
        <Text className="text-white font-bold ml-2">
          {jogo.jaSolicitado ? 'Solicitado' : 'Solicitar Entrada'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}