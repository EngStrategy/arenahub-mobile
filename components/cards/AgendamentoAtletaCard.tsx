import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Calendar, Clock, DollarSign, MapPin, Star, UserPlus, XCircle, Lock, Trash2 } from 'lucide-react-native';
import { AgendamentoAtleta } from '@/services/api/entities/atletaAgendamento';

interface Props {
    data: AgendamentoAtleta;
    onAvaliar: (id: number) => void;
    onDispensarAvaliacao: (id: number) => void;
    onVerSolicitacoes: (id: number) => void;
    onCancelar: (id: number) => void;
    isHistoryView: boolean;
}

export function AgendamentoAtletaCard({ 
    data, 
    onAvaliar, 
    onDispensarAvaliacao, 
    onVerSolicitacoes, 
    onCancelar,
    isHistoryView 
}: Props) {

    const podeCancelar = useMemo(() => {
        if (isHistoryView || data.status === 'CANCELADO' || data.status === 'FINALIZADO') return false;

        const dataJogo = new Date(`${data.dataAgendamento}T${data.horarioInicio}`);
        const agora = new Date();
        
        const diferencaMs = dataJogo.getTime() - agora.getTime();
        const minutosRestantes = diferencaMs / (1000 * 60); 

        return minutosRestantes >= 30;
    }, [data.dataAgendamento, data.horarioInicio, isHistoryView, data.status]);

    const handleCancelarPress = () => {
        Alert.alert(
            "Cancelar Agendamento",
            "Deseja realmente cancelar este agendamento? Esta ação pode estar sujeita às regras de cancelamento da arena.",
            [
                { text: "Não", style: "cancel" },
                { 
                    text: "Sim, cancelar", 
                    style: 'destructive', 
                    onPress: () => onCancelar(data.id) 
                }
            ]
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAGO': return 'text-green-600 bg-green-100';
            case 'PENDENTE': return 'text-yellow-600 bg-yellow-100';
            case 'CANCELADO': return 'text-red-600 bg-red-100';
            case 'FINALIZADO': return 'text-gray-600 bg-gray-100';
            default: return 'text-blue-600 bg-blue-100';
        }
    };

    const showBotoesAvaliacao = isHistoryView && 
                          data.status === 'PAGO' && 
                          !data.avaliacao && 
                          !data.avaliacaoDispensada;

    const showEstrelas = data.avaliacao !== null;

    const renderEstrelas = (nota: number) => {
        return (
            <View className="flex-row gap-1 mt-2 justify-end">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={18}
                        color={star <= nota ? "#EAB308" : "#D1D5DB"} 
                        fill={star <= nota ? "#EAB308" : "transparent"} 
                    />
                ))}
            </View>
        );
    };

    return (
        <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 relative">
            
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

            {/* Info Principal: Imagem e Nomes */}
            <View className="flex-row items-center mb-4">
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

            {/* Detalhes: Horário e Valor */}
            <View className="flex-row justify-between items-center border-t border-gray-100 pt-3 mb-3">
                <View className="flex-row items-center">
                    <Clock size={16} color="#15A01A" />
                    <Text className="ml-2 text-gray-700 font-medium">
                        {data.horarioInicio.substring(0, 5)} - {data.horarioFim.substring(0, 5)}
                    </Text>
                </View>
                <View className="flex-row items-center">
                    <DollarSign size={16} color="#15A01A" />
                    <Text className="ml-1 text-gray-700 font-bold">
                        R$ {data.valorTotal.toFixed(2)}
                    </Text>
                </View>
            </View>

            {/* Badges: Esporte e Fixo */}
            <View className="flex-row gap-2 mb-1">
                <View className="bg-gray-100 px-2 py-1 rounded-md">
                    <Text className="text-xs text-gray-600 font-medium">
                         {data.esporte.replace('_', ' ')}
                    </Text>
                </View>
                {data.fixo && (
                    <View className="bg-purple-100 px-2 py-1 rounded-md">
                        <Text className="text-xs text-purple-700 font-bold">Fixo</Text>
                    </View>
                )}
            </View>

            {/* ================= AÇÕES (HISTÓRICO) ================= */}

            {showBotoesAvaliacao && (
                <View className="flex-row gap-2 mt-2">
                    <TouchableOpacity 
                        onPress={() => onAvaliar(data.id)}
                        className="flex-1 bg-green-600 py-2.5 rounded-lg flex-row justify-center items-center"
                    >
                        <Star size={18} color="white" fill="white" />
                        <Text className="text-white font-bold ml-2 text-sm">Avaliar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => onDispensarAvaliacao(data.id)}
                        className="w-12 bg-red-50 rounded-lg justify-center items-center"
                    >
                        <XCircle size={20} color="#E53E3E" />
                    </TouchableOpacity>
                </View>
            )}

             {showEstrelas && data.avaliacao && (
                renderEstrelas(data.avaliacao.nota)
            )}

            {/* ================= AÇÕES (ATIVOS/PENDENTES) ================= */}
            
            {!isHistoryView && (
                <View className="mt-2">
                    <View className="flex-row gap-3">
                        {/* Botão Cancelar (Aparece para Publico e Privado se dentro do prazo) */}
                        {podeCancelar && (
                            <TouchableOpacity 
                                onPress={handleCancelarPress}
                                className={`flex-1 bg-white border border-red-200 py-2.5 rounded-lg flex-row justify-center items-center shadow-sm ${!data.publico ? 'flex-1' : ''}`}
                            >
                                <Trash2 size={18} color="#DC2626" />
                                <Text className="text-red-600 font-bold ml-2 text-sm">Cancelar</Text>
                            </TouchableOpacity>
                        )}

                        {/* Botão Solicitações (Apenas Público) */}
                        {data.publico && (
                            <TouchableOpacity 
                                onPress={() => onVerSolicitacoes(data.id)}
                                className="flex-1 bg-blue-600 py-2.5 rounded-lg flex-row justify-center items-center shadow-sm"
                            >
                                <UserPlus size={18} color="white" />
                                <Text className="text-white font-bold ml-2 text-sm">Solicitações</Text>
                                {data.possuiSolicitacoes && (
                                    <View className="w-2 h-2 bg-red-500 rounded-full absolute top-2 right-4" />
                                )}
                            </TouchableOpacity>
                        )}
                    </View>

                    {!data.publico && !podeCancelar && (
                        <View className="flex-row items-center justify-center mt-2 py-2">
                            <Lock size={14} color="#9CA3AF" />
                            <Text className="text-gray-400 text-xs ml-1">Jogo Privado (Prazo de cancelamento expirado)</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}