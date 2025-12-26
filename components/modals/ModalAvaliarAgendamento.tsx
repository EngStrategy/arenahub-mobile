import React, { useState, useEffect } from "react";
import { 
    Modal, 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView, 
    ActivityIndicator, 
    Alert 
} from 'react-native';
import { X } from 'lucide-react-native';
import { StarRating } from "@/components/avaliacoes/starRating";
import { InputTextArea } from "../forms/formInputs/InputTextArea";
import { avaliarAgendamento } from "@/services/api/entities/agendamento";

interface ModalAvaliarAgendamentoProps {
    isOpen: boolean;
    onClose: () => void;
    agendamentoId: number;
}

export function ModalAvaliarAgendamento({
    isOpen,
    onClose,
    agendamentoId,
}: ModalAvaliarAgendamentoProps) {
    const [nota, setNota] = useState(0);
    const [comentario, setComentario] = useState("");
    const [loading, setLoading] = useState(false);

    // Reset do estado ao abrir/fechar
    useEffect(() => {
        if (isOpen) {
            console.log('✅ Modal de avaliação aberto - Agendamento ID:', agendamentoId);
        } else {
            // Limpar estado ao fechar
            setNota(0);
            setComentario("");
            setLoading(false);
        }
    }, [isOpen, agendamentoId]);

    const enviarAvaliacao = async () => {
        if (nota === 0) {
            Alert.alert("Atenção", "Por favor, selecione uma nota de 1 a 5 estrelas.");
            return;
        }

        setLoading(true);
        try {
            await avaliarAgendamento(agendamentoId, {
                nota,
                comentario,
            });

            Alert.alert("Sucesso", "Avaliação enviada com sucesso!");
            
            // Resetar estado antes de fechar
            setNota(0);
            setComentario("");
            
            // Fechar modal
            onClose();
        } catch (err) {
            console.error("Erro ao avaliar agendamento:", err);
            Alert.alert(
                "Erro", 
                "Não foi possível enviar a avaliação. Tente novamente."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal 
            visible={isOpen} 
            animationType="slide" 
            transparent 
            onRequestClose={onClose}
        >
            {/* Fundo escuro com Pressable para fechar */}
            <View className="flex-1 bg-black/60 justify-end">
                <TouchableOpacity 
                    style={{ flex: 1 }} 
                    activeOpacity={1} 
                    onPress={onClose} 
                />
                
                {/* Container do Modal */}
                <View className="bg-white rounded-t-3xl max-h-[85%] w-full shadow-2xl">
                    
                    {/* Header */}
                    <View className="flex-row justify-between items-center p-6 border-b border-gray-100">
                        <View className="flex-1">
                            <Text className="text-xl font-bold text-gray-900">
                                Avaliar Agendamento
                            </Text>
                            <Text className="text-sm text-gray-500 mt-1">
                                Como foi sua experiência?
                            </Text>
                        </View>
                        <TouchableOpacity 
                            onPress={onClose} 
                            className="p-2 bg-gray-100 rounded-full ml-2"
                        >
                            <X size={24} color="#374151" />
                        </TouchableOpacity>
                    </View>

                    {/* Body - ScrollView para evitar problemas em telas pequenas */}
                    <ScrollView 
                        className="px-6 py-6"
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Rating Section */}
                        <View className="mb-6">
                            <Text className="text-gray-700 font-semibold mb-3 text-base">
                                Sua nota *
                            </Text>
                            <StarRating value={nota} onChange={setNota} />
                        </View>

                        {/* Comentário Section */}
                        <View className="mb-4">
                            <InputTextArea
                                label="Comentário"
                                placeholder="Conta pra gente como foi sua experiência..."
                                value={comentario}
                                onChangeText={setComentario}
                                optional
                            />
                        </View>
                    </ScrollView>

                    {/* Footer - Fixo na parte inferior */}
                    <View className="p-6 border-t border-gray-100">
                        <TouchableOpacity
                            onPress={enviarAvaliacao}
                            disabled={nota === 0 || loading}
                            className={`py-4 rounded-xl items-center ${
                                nota === 0 || loading 
                                    ? 'bg-gray-300' 
                                    : 'bg-green-600'
                            }`}
                            activeOpacity={0.8}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <Text className={`font-bold text-base ${
                                    nota === 0 ? 'text-gray-500' : 'text-white'
                                }`}>
                                    Enviar Avaliação
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}