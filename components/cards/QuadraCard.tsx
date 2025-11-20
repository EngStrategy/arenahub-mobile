import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Edit, Trash2 } from 'lucide-react-native';
import { Quadra } from '@/context/types/Quadra';
import { formatarEsporte, formatarCEP } from '@/context/functions/formatters';

interface QuadraCardProps {
    quadra: Quadra;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    arenaCep?: string; 
}

export const QuadraCard = ({ quadra, onEdit, onDelete, arenaCep }: QuadraCardProps) => {
  
    const esportesResumo = quadra.tipoQuadra.slice(0, 2).map(formatarEsporte).join(', ');
    const maisEsportes = quadra.tipoQuadra.length > 2 ? '...' : '';

    return (
        <View className="w-full bg-white p-4 rounded-xl border border-gray-200 flex-row items-center mb-4 shadow-sm">
            {/* Imagem (Esquerda) */}
            <View className="w-16 h-16 bg-gray-200 rounded-full items-center justify-center overflow-hidden mr-4">
                {quadra.urlFotoQuadra ? (
                    <Image source={{ uri: quadra.urlFotoQuadra }} className="w-full h-full" />
                ) : (
                    <Text className="text-gray-400 text-xs">Sem foto</Text>
                )}
            </View>

            {/* Informações (Centro) */}
            <View className="flex-1">
                <Text className="text-gray-800 font-semibold text-base" numberOfLines={1}>
                    {quadra.nomeQuadra}
                </Text>
                {arenaCep && (
                     <Text className="text-gray-500 text-xs mt-0.5">
                        CEP {formatarCEP(arenaCep)}
                     </Text>
                )}
                <Text className="text-green-600 font-bold text-xs mt-1">
                    {esportesResumo}{maisEsportes}
                </Text>
            </View>

            {/* Ações (Direita) */}
            <View className="flex-col gap-3 ml-2">
                <TouchableOpacity 
                    onPress={() => onDelete(quadra.id)}
                    className="bg-red-100 p-2 rounded-lg items-center justify-center"
                >
                    <Trash2 size={18} color="#EF4444" />
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => onEdit(quadra.id)}
                    className="bg-blue-100 p-2 rounded-lg items-center justify-center"
                >
                    <Edit size={18} color="#3B82F6" />
                </TouchableOpacity>
            </View>
        </View>
    );
};