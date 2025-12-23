import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import { X, Star, MessageSquare } from 'lucide-react-native';
import { Avaliacao } from '@/context/types/Avaliacao';
import { Quadra } from '@/context/types/Quadra';
import { getAvaliacoesPorQuadra } from '@/services/api/entities/avaliacao';
import { formatarData } from '@/context/functions/formatters';

interface ModalAvaliacoesProps {
    visible: boolean;
    onClose: () => void;
    quadras: Quadra[];
    nomeArena: string;
}

const DEFAULT_AVATAR = "https://i.imgur.com/hepj9ZS.png";

export function ModalAvaliacoes({ visible, onClose, quadras, nomeArena }: ModalAvaliacoesProps) {
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            carregarDados();
        } else {
            setAvaliacoes([]);
        }
    }, [visible, quadras]);

    const carregarDados = async () => {
        setLoading(true); 

        if (!quadras || quadras.length === 0) {
            setAvaliacoes([]);
            setLoading(false); 
            return;
        }

        try {
            const promises = quadras.map(q => getAvaliacoesPorQuadra(q.id));
            const responses = await Promise.all(promises);
            const todasAvaliacoes = responses.flatMap(r => r.content);

            todasAvaliacoes.sort((a, b) => 
                new Date(b.dataAvaliacao).getTime() - new Date(a.dataAvaliacao).getTime()
            );

            setAvaliacoes(todasAvaliacoes);
        } catch (error) {
            console.error("Erro ao carregar avaliações:", error);
            setAvaliacoes([]); 
        } finally {
            setLoading(false); 
        }
    };

    const renderItem = ({ item }: { item: Avaliacao }) => (
        <View className="mb-4 border-b border-gray-100 pb-4">
            <View className="flex-row items-center mb-2">
                <Image 
                    source={{ uri: item.urlFotoAtleta || DEFAULT_AVATAR }} 
                    className="w-10 h-10 rounded-full bg-gray-200 mr-3"
                />
                <View className="flex-1">
                    <Text className="font-bold text-gray-800 text-sm">{item.nomeAtleta}</Text>
                    <Text className="text-xs text-gray-400">{formatarData(item.dataAvaliacao)}</Text>
                </View>
                <View className="flex-row items-center bg-yellow-50 px-2 py-1 rounded-md">
                    <Star size={12} color="#EAB308" fill="#EAB308" />
                    <Text className="ml-1 font-bold text-yellow-700 text-xs">{item.nota.toFixed(1)}</Text>
                </View>
            </View>
            {item.comentario ? (
                <Text className="text-gray-600 text-sm leading-5 mt-1">{item.comentario}</Text>
            ) : (
                <Text className="text-gray-400 text-xs italic mt-1">Sem comentário.</Text>
            )}
        </View>
    );

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View className="flex-1 bg-black/60 justify-end">
                <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
                <View className="bg-white rounded-t-3xl h-[80%] w-full shadow-2xl">
                    <View className="flex-row justify-between items-center p-6 border-b border-gray-100">
                        <View>
                            <Text className="text-xl font-bold text-gray-900">Avaliações</Text>
                            <Text className="text-sm text-gray-500 font-medium">{nomeArena}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 rounded-full">
                            <X size={24} color="#374151" />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View className="flex-1 justify-center items-center">
                            <ActivityIndicator size="large" color="#15A01A" />
                            <Text className="text-gray-400 mt-4 text-sm">Buscando opiniões...</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={avaliacoes}
                            keyExtractor={(item) => String(item.id)}
                            renderItem={renderItem}
                            contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View className="items-center justify-center py-10">
                                    <MessageSquare size={48} color="#E5E7EB" />
                                    <Text className="text-gray-400 mt-4 text-center">
                                        Nenhuma avaliação encontrada{'\n'}para as quadras desta arena.
                                    </Text>
                                </View>
                            }
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
}