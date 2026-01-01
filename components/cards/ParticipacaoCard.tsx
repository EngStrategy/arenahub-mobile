import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Calendar, Clock, MapPin, LogOut, Phone } from 'lucide-react-native';
import { ParticipacaoJogoAberto } from '@/services/api/entities/atletaAgendamento';

interface Props {
    data: ParticipacaoJogoAberto;
    onSair: (id: number) => void;
}

export function ParticipacaoCard({ data, onSair }: Props) {
    
    const podeCancelarOuSair = useMemo(() => {
        const dataJogo = new Date(`${data.data}T${data.horarioInicio}`);
        const agora = new Date();

        const diferencaMs = dataJogo.getTime() - agora.getTime();
        
        const horasRestantes = diferencaMs / (1000 * 60 * 60);

        return horasRestantes >= 2;
    }, [data.data, data.horarioInicio]);

    const labelBotao = data.status === 'PENDENTE' ? 'Cancelar solicitação' : 'Sair do jogo';
    const tituloAlert = data.status === 'PENDENTE' ? 'Cancelar Solicitação' : 'Sair do Jogo';
    const msgAlert = data.status === 'PENDENTE' 
        ? "Tem certeza que deseja cancelar sua solicitação pendente?" 
        : "Tem certeza que deseja sair do jogo confirmado?";

    const handleActionPress = () => {
        Alert.alert(
            tituloAlert,
            msgAlert,
            [
                { text: "Não", style: "cancel" },
                { text: "Sim", style: 'destructive', onPress: () => onSair(data.solicitacaoId) }
            ]
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACEITO': return 'text-green-600 bg-green-100';
            case 'PENDENTE': return 'text-blue-600 bg-blue-100';
            case 'RECUSADO': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const deveExibirOpcao = (data.status === 'PENDENTE' || data.status === 'ACEITO') && podeCancelarOuSair;

    return (
        <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            {/* Cabeçalho: Data e Status */}
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-md">
                    <Calendar size={14} color="#4B5563" />
                    <Text className="text-gray-600 text-xs font-medium ml-1">
                        {new Date(data.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </Text>
                </View>
                <View className={`px-2 py-1 rounded-full ${getStatusColor(data.status).split(' ')[1]}`}>
                    <Text className={`text-xs font-bold ${getStatusColor(data.status).split(' ')[0]}`}>
                        {data.status}
                    </Text>
                </View>
            </View>

            {/* Info da Arena */}
            <View className="flex-row items-center mb-3">
                <Image 
                    source={{ uri: data.urlFotoArena }} 
                    className="w-12 h-12 rounded-lg bg-gray-200"
                />
                <View className="ml-3 flex-1">
                    <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>{data.nomeArena}</Text>
                    <View className="flex-row items-center">
                        <MapPin size={12} color="#6B7280" />
                        <Text className="text-sm text-gray-500 ml-1">{data.nomeQuadra}</Text>
                    </View>
                </View>
            </View>

            {/* DIVIDER */}
            <View className="border-t border-gray-100 my-3" />

            {/* NOVO: Info do Dono da Reserva (Organizador) */}
            <View className="flex-row items-center mb-3">
                <Image 
                    source={{ uri: data.urlFotoDono }} 
                    className="w-10 h-10 rounded-full bg-gray-200"
                />
                <View className="ml-3 flex-1">
                    <Text className="text-sm font-semibold text-gray-700">
                        {data.nomeDono} <Text className="text-xs font-normal text-gray-400">(Organizador)</Text>
                    </Text>
                    <View className="flex-row items-center mt-0.5">
                        <Phone size={12} color="#6B7280" />
                        <Text className="text-xs text-gray-500 ml-1">
                            {data.telefoneDono}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Detalhes: Horário e Esporte */}
            <View className="flex-row justify-between items-center border-t border-gray-100 pt-3">
                <View className="flex-row items-center">
                    <Clock size={16} color="#15A01A" />
                    <Text className="ml-2 text-gray-700 font-medium">
                        {data.horarioInicio.substring(0, 5)} - {data.horarioFim.substring(0, 5)}
                    </Text>
                </View>
                <View className="bg-gray-100 px-2 py-1 rounded-md">
                    <Text className="text-xs text-gray-600 font-medium">
                         {data.esporte.replace(/_/g, ' ')}
                    </Text>
                </View>
            </View>

            {/* Botão de Sair/Cancelar */}
            {deveExibirOpcao && (
                <TouchableOpacity 
                    onPress={handleActionPress}
                    className="bg-red-50 py-2 rounded-lg flex-row justify-center items-center mt-4 border border-red-100"
                >
                    <LogOut size={16} color="#DC2626" />
                    <Text className="text-red-600 font-bold ml-2">{labelBotao}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}