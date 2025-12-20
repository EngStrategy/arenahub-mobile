import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Edit, Trash2, Umbrella, Zap, Box } from 'lucide-react-native'; 
import { Quadra, MaterialFornecido } from '@/context/types/Quadra';
import { formatarEsporte } from '@/context/functions/formatters';

interface QuadraCardProps {
    quadra: Quadra;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

const formatarMaterial = (material: MaterialFornecido): string => {
    const mapa: Record<MaterialFornecido, string> = {
        BOLA: 'Bola',
        COLETE: 'Colete',
        LUVA: 'Luvas',
        CONE: 'Cones',
        APITO: 'Apito',
        BOMBA: 'Bomba',
        MARCADOR_PLACAR: 'Placar',
        BOTAO_GOL: 'Botão/Gol'
    };
    return mapa[material] || material;
};

export const QuadraCard = ({ quadra, onEdit, onDelete }: QuadraCardProps) => {
  
    const esportesResumo = quadra.tipoQuadra.slice(0, 2).map(formatarEsporte).join(', ');
    const maisEsportes = quadra.tipoQuadra.length > 2 ? '...' : '';

    // Formata materiais
    const materiaisTexto = quadra.materiaisFornecidos.length > 0
        ? quadra.materiaisFornecidos.map(formatarMaterial).join(', ')
        : 'Nenhum material incluso';

    return (
        <View className="w-full bg-white p-4 rounded-xl border border-gray-200 flex-row mb-4 shadow-sm">
            {/* Imagem (Esquerda) - Ajustada altura para acompanhar conteúdo */}
            <View className="w-24 h-24 bg-gray-200 rounded-lg items-center justify-center overflow-hidden mr-4 self-center">
                {quadra.urlFotoQuadra ? (
                    <Image source={{ uri: quadra.urlFotoQuadra }} className="w-full h-full" resizeMode="cover" />
                ) : (
                    <Text className="text-gray-400 text-xs text-center p-1">Sem foto</Text>
                )}
            </View>

            {/* Informações (Centro) */}
            <View className="flex-1 justify-between py-1">
                <View>
                    <Text className="text-gray-800 font-bold text-base mb-1" numberOfLines={1}>
                        {quadra.nomeQuadra}
                    </Text>
                    
                    {/* Esportes */}
                    <Text className="text-green-600 font-semibold text-xs mb-2">
                        {esportesResumo}{maisEsportes}
                    </Text>

                    {/* Materiais Inclusos */}
                    <View className="flex-row items-start mb-2 pr-2">
                        <Box size={12} color="#6B7280" style={{ marginTop: 2, marginRight: 4 }} />
                        <Text className="text-gray-500 text-xs flex-1" numberOfLines={2}>
                            {materiaisTexto}
                        </Text>
                    </View>
                </View>

                {/* Comodidades (Badges) */}
                <View className="flex-row gap-2 mt-1">
                    {quadra.cobertura && (
                        <View className="flex-row items-center bg-gray-100 px-2 py-1 rounded-md">
                            <Umbrella size={10} color="#4B5563" />
                            <Text className="text-[10px] text-gray-600 ml-1 font-medium">Coberta</Text>
                        </View>
                    )}
                    {quadra.iluminacaoNoturna && (
                        <View className="flex-row items-center bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                            <Zap size={10} color="#D97706" />
                            <Text className="text-[10px] text-yellow-700 ml-1 font-medium">Iluminação</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Ações (Direita) */}
            <View className="flex-col gap-2 ml-2 justify-center">
                <TouchableOpacity 
                    onPress={() => onEdit(quadra.id)}
                    className="bg-blue-50 p-2 rounded-lg items-center justify-center"
                >
                    <Edit size={16} color="#3B82F6" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                    onPress={() => {
                        console.log("Clicou na lixeira!"); 
                        onDelete(quadra.id);
                    }}
                    className="bg-red-50 p-2 rounded-lg items-center justify-center"
                >
                    <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>
    );
};